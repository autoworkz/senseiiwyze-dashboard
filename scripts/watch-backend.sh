#!/usr/bin/env bash
trap 'echo "$(date) ⏹️ Shutting down watch-backend"; exit 0' INT TERM
echo "$(date) 🚀 Starting watch-backend"
exec docker compose watch \
    --exclude "**/node_modules/**" \
    --exclude "**/.next/**" \
    --watch-interval 2000 \
    --watch "pages/api/**/*.ts" \
    --watch "lib/server/**/*.ts" \
    --watch "middleware/**/*.ts" \
    app
