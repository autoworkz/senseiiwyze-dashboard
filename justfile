# Default recipe to display help
default:
  @just --list

# === Development Commands ===

# Start development server
dev:
  pnpm dev

# === Build Commands ===

# Build the project
build:
  pnpm build

# Clean build artifacts
clean:
  pnpm clean

# === Testing Commands ===

# Run all tests
test:
  pnpm test

# Run tests in watch mode
test-watch:
  pnpm test:watch

# === Linting & Formatting ===

# Run linting
lint:
  pnpm lint

# Type check the project
typecheck:
  pnpm typecheck

# === Database Commands ===

# Generate database migrations
db-generate:
  pnpm db:generate

# Run database migrations
db-migrate:
  pnpm db:migrate

# Push database schema
db-push:
  pnpm db:push

# Open database studio
db-studio:
  pnpm db:studio

# === Authentication Commands ===

# Generate Better Auth files
auth-generate:
  pnpm auth:generate

# === Utility Commands ===

# Install dependencies
install:
  pnpm install

# Start the production server
start:
  pnpm start

# Deploy to production
deploy:
  pnpm deploy