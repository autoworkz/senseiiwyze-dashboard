#!/usr/bin/env bash
trap 'echo "$(date) ⏹️ Shutting down watch-config"; exit 0' INT TERM
echo "$(date) 🚀 Starting watch-config"
exec docker compose watch \
    --exclude "**/node_modules/**" \
    --exclude "**/.next/**" \
    --watch-interval 2000 \
    --watch "**/next.config.ts" \
    --watch "**/tailwind.config.js" \
    --watch "**/package.json" \
    --watch "**/drizzle.config.ts" \
    app
