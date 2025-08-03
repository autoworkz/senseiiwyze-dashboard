#!/usr/bin/env bash
trap 'echo "$(date) ⏹️ Shutting down watch-env"; exit 0' INT TERM
echo "$(date) 🚀 Starting watch-env"
exec docker compose watch \
    --exclude "**/node_modules/**" \
    --exclude "**/.next/**" \
    --watch-interval 2000 \
    --watch ".env" \
    --watch ".env.*" \
    app
