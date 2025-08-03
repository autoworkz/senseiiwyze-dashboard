#!/usr/bin/env bash

# Smart development server that auto-restarts when build artifacts change
# Uses watchexec for efficient file watching

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
  echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

success() {
  echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[$(date '+%H:%M:%S')]${NC} $1"
}

cleanup() {
  log "Cleaning up processes..."
  pkill -f "next dev" || true
  pkill -f "pnpm dev" || true
}

trap cleanup EXIT INT TERM

log "🚀 Starting smart development server..."
log "📁 Project: $PROJECT_ROOT"
log "👀 Watching for build changes..."

# Use watchexec to watch for source code changes and restart dev server
exec watchexec \
  --restart \
  --debounce 2000 \
  --watch src/ \
  --watch app/ \
  --watch components/ \
  --watch lib/ \
  --watch utils/ \
  --watch hooks/ \
  --watch services/ \
  --watch package.json \
  --watch next.config.js \
  --watch tailwind.config.js \
  --watch tsconfig.json \
  --ignore "**/*.log" \
  --ignore "**/node_modules/**" \
  --ignore "**/.next/**" \
  --print-events \
  --shell bash \
  -- 'echo "🔄 Source change detected, restarting dev server..."; sleep 1; pnpm dev'