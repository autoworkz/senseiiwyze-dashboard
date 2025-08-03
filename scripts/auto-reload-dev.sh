#!/usr/bin/env bash

# Auto-reload pnpm dev when build artifacts change
# This script watches for Next.js build completion and automatically restarts the dev server

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCKFILE="/tmp/senseiiwyze-dev-server.lock"
PIDFILE="/tmp/senseiiwyze-dev-server.pid"
LOGFILE="/tmp/senseiiwyze-dev-server.log"

cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
  echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1" | tee -a "$LOGFILE"
}

warn() {
  echo -e "${YELLOW}[$(date '+%H:%M:%S')] WARN:${NC} $1" | tee -a "$LOGFILE"
}

error() {
  echo -e "${RED}[$(date '+%H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOGFILE"
}

success() {
  echo -e "${GREEN}[$(date '+%H:%M:%S')] SUCCESS:${NC} $1" | tee -a "$LOGFILE"
}

# Cleanup function
cleanup() {
  log "Cleaning up auto-reload script..."
  if [[ -f "$PIDFILE" ]]; then
    local pid=$(cat "$PIDFILE")
    if kill -0 "$pid" 2>/dev/null; then
      log "Stopping dev server (PID: $pid)..."
      kill "$pid" 2>/dev/null || true
      sleep 2
      # Force kill if still running
      kill -9 "$pid" 2>/dev/null || true
    fi
    rm -f "$PIDFILE"
  fi
  rm -f "$LOCKFILE"
  # Clean up any stray Next.js processes
  pkill -f "next dev" || true
  pkill -f "pnpm dev" || true
  success "Cleanup completed"
}

# Set up signal handlers
trap cleanup EXIT INT TERM

# Check if already running
if [[ -f "$LOCKFILE" ]]; then
  local existing_pid=$(cat "$LOCKFILE" 2>/dev/null || echo "")
  if [[ -n "$existing_pid" ]] && kill -0 "$existing_pid" 2>/dev/null; then
    error "Auto-reload script is already running (PID: $existing_pid)"
    exit 1
  else
    log "Removing stale lockfile"
    rm -f "$LOCKFILE"
  fi
fi

# Create lockfile
echo $$ > "$LOCKFILE"

log "Starting auto-reload dev server system..."
log "Project root: $PROJECT_ROOT"
log "Lockfile: $LOCKFILE"
log "PID file: $PIDFILE"
log "Log file: $LOGFILE"

# Function to start dev server
start_dev_server() {
  log "Starting pnpm dev server..."
  
  # Kill any existing dev servers
  pkill -f "next dev" || true
  pkill -f "pnpm dev" || true
  sleep 1
  
  # Start new dev server in background
  cd "$PROJECT_ROOT"
  pnpm dev > "$LOGFILE.dev" 2>&1 &
  local dev_pid=$!
  echo "$dev_pid" > "$PIDFILE"
  
  # Wait a moment to see if it started successfully
  sleep 3
  if kill -0 "$dev_pid" 2>/dev/null; then
    success "Dev server started successfully (PID: $dev_pid)"
    return 0
  else
    error "Failed to start dev server"
    return 1
  fi
}

# Function to check if build is in progress
is_building() {
  # Check for common build indicators
  if pgrep -f "next build" > /dev/null 2>&1; then
    return 0
  fi
  if [[ -f ".next/trace" ]]; then
    local trace_age=$(stat -f "%m" ".next/trace" 2>/dev/null || echo "0")
    local current_time=$(date +%s)
    local age_diff=$((current_time - trace_age))
    # If trace file is newer than 30 seconds, consider build in progress
    if [[ $age_diff -lt 30 ]]; then
      return 0
    fi
  fi
  return 1
}

# Start initial dev server
start_dev_server

log "Setting up file watchers..."

# Create a more sophisticated watcher using watchexec
watchexec \
  --restart \
  --watch .next/BUILD_ID \
  --watch .next/trace \
  --watch .next/build-manifest.json \
  --watch .next/static \
  --debounce 2000 \
  --print-events \
  --on-busy-update restart \
  -- bash -c "
    # Check if we're actually rebuilding
    if pgrep -f 'next build' > /dev/null 2>&1; then
      echo '🔨 Build in progress, waiting for completion...'
      # Wait for build to complete
      while pgrep -f 'next build' > /dev/null 2>&1; do
        sleep 1
      done
      sleep 3  # Give it a moment to finish writing files
    fi
    
    echo '🔄 Build artifacts changed, restarting dev server...'
    
    # Kill existing dev server
    if [[ -f '$PIDFILE' ]]; then
      pid=\$(cat '$PIDFILE')
      if kill -0 \"\$pid\" 2>/dev/null; then
        echo \"Stopping dev server (PID: \$pid)...\"
        kill \"\$pid\" 2>/dev/null || true
        sleep 2
        kill -9 \"\$pid\" 2>/dev/null || true
      fi
    fi
    
    # Clean up any remaining processes
    pkill -f 'next dev' || true
    pkill -f 'pnpm dev' || true
    sleep 1
    
    # Start new dev server
    cd '$PROJECT_ROOT'
    echo '🚀 Starting new dev server...'
    pnpm dev > '$LOGFILE.dev' 2>&1 &
    new_pid=\$!
    echo \"\$new_pid\" > '$PIDFILE'
    
    # Verify it started
    sleep 3
    if kill -0 \"\$new_pid\" 2>/dev/null; then
      echo \"✅ Dev server restarted successfully (PID: \$new_pid)\"
    else
      echo \"❌ Failed to restart dev server\"
    fi
  " &

WATCHER_PID=$!

log "File watcher started (PID: $WATCHER_PID)"
log "Auto-reload system is now active. The dev server will automatically restart when builds complete."
log "Press Ctrl+C to stop the auto-reload system."

# Keep the script running
wait $WATCHER_PID