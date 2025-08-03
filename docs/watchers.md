# Watcher Services

The project now includes enhanced watcher services with logging and graceful shutdown capabilities.

## Features

- **Colored Timestamps**: Each watcher service logs startup and shutdown messages with timestamps
- **Graceful Shutdown**: Services respond to SIGINT and SIGTERM signals for clean exit
- **Individual Scripts**: Each watcher service has its own shell script wrapper

## Watcher Services

### watch-config
Monitors configuration files:
- `**/next.config.ts`
- `**/tailwind.config.js` 
- `**/package.json`
- `**/drizzle.config.ts`

### watch-frontend
Monitors frontend code:
- `src/**/*.{js,jsx,ts,tsx,css,scss}`
- `pages/**/*.{js,jsx,ts,tsx}`
- `components/**/*.{js,jsx,ts,tsx}`

### watch-backend
Monitors backend code:
- `pages/api/**/*.ts`
- `lib/server/**/*.ts`
- `middleware/**/*.ts`

### watch-db
Monitors database schema:
- `db/schema/**/*.{ts,sql}`
- `drizzle.config.ts`

### watch-env
Monitors environment files:
- `.env`
- `.env.*`

## Usage

Start individual watcher services:
```bash
docker compose up watch-config
docker compose up watch-frontend
docker compose up watch-backend
docker compose up watch-db
docker compose up watch-env
```

Start all watchers:
```bash
docker compose up
```

Stop with graceful shutdown (Ctrl+C or SIGTERM):
```bash
docker compose down
```

## Logs

Each service will show timestamped startup and shutdown messages:
```
Sat Aug  3 07:25:00 UTC 2024 🚀 Starting watch-config
Sat Aug  3 07:30:00 UTC 2024 ⏹️ Shutting down watch-config
```

## Script Location

All watcher scripts are located in `scripts/` directory:
- `scripts/watch-config.sh`
- `scripts/watch-frontend.sh`
- `scripts/watch-backend.sh`
- `scripts/watch-db.sh`
- `scripts/watch-env.sh`
