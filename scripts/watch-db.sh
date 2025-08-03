#!/usr/bin/env bash
trap 'echo "$(date) ⏹️ Shutting down watch-db"; exit 0' INT TERM
echo "$(date) 🚀 Starting watch-db"
exec sh -c "docker compose exec app pnpm db:migrate \u0026\u0026 docker compose restart app \u0026\u0026 docker compose watch --exclude '**/node_modules/**' --exclude '**/.next/**' --watch-interval 2000 --watch 'db/schema/**/*.{ts,sql}' --watch 'drizzle.config.ts' nothing"
