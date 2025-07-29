#!/bin/bash

# Kill any process listening on port 3000
echo "Checking for processes on port 3000..."
if command -v lsof >/dev/null 2>&1; then
    # Use lsof if available (works on macOS and most Linux distros)
    lsof -i tcp:3000 | awk 'NR>1 {print $2}' | xargs -r kill -9 2>/dev/null || true
else
    # Fallback for systems without lsof
    fuser -k 3000/tcp 2>/dev/null || true
fi
echo "Port 3000 cleared"

# Check for .next directory
if [ ! -d ".next" ]; then
    echo ".next directory not found. Running initial build..."
    pnpm next build
    if [ $? -ne 0 ]; then
        echo "Build failed. Exiting."
        exit 1
    fi
    echo "Initial build completed"
fi

# Check if robust watcher exists
if [ -f "scripts/robust-watcher.sh" ] && [ -x "scripts/robust-watcher.sh" ]; then
    echo "Starting robust watcher..."
    exec ./scripts/robust-watcher.sh
else
    echo "Starting simple watchexec..."
    # Simple watchexec command as fallback
    exec watchexec -r -e ts,tsx,js,jsx,json,css,scss,md --ignore node_modules --ignore .next -- pnpm next dev
fi
