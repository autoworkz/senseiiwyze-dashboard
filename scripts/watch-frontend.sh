#!/usr/bin/env bash
trap 'echo "$(date) ⏹️ Shutting down watch-frontend"; exit 0' INT TERM
echo "$(date) 🚀 Starting watch-frontend"
exec docker compose watch \
    --exclude "**/node_modules/**" \
    --exclude "**/.next/**" \
    --watch-interval 2000 \
    --watch "src/**/*.{js,jsx,ts,tsx,css,scss}" \
    --watch "pages/**/*.{js,jsx,ts,tsx}" \
    --watch "components/**/*.{js,jsx,ts,tsx}" \
    app
