# Default recipe to display help
default:
  @just --list

# Environment setup
export NODE_ENV := env_var_or_default("NODE_ENV", "development")
export BETTER_AUTH_URL := env_var_or_default("BETTER_AUTH_URL", "http://localhost:3000")

# === Development Commands ===

# Start development server with auto-reload on build detection
dev:
  ./scripts/smart-dev.sh

# Start development server (webpack mode)
dev-webpack:
  pnpm dev:webpack

# Start development server without auto-reload (standard)
dev-standard:
  pnpm dev

# Alternative auto-reload using the comprehensive script
dev-auto:
  ./scripts/auto-reload-dev.sh

# === Build Commands ===

# Build the project
build:
  pnpm build

# Build with webpack analyzer
build-analyze:
  pnpm build:analyze-webpack

# Build with turbopack
build-turbo:
  pnpm build:turbopack

# Clean build artifacts
clean:
  rm -rf .next dist node_modules/.cache coverage .turbo analyze
  echo "✨ Build artifacts cleaned"

# === Testing Commands ===

# Run all tests
test:
  pnpm test

# Run tests in watch mode
test-watch:
  pnpm test:watch

# Run tests with coverage
test-coverage:
  pnpm test:coverage

# Run specific test file
test-file file:
  pnpm test {{file}}

# === Linting & Formatting ===

# Run Biome check (lint + format check)
lint:
  pnpm biome check

# Fix all linting and formatting issues
fix:
  pnpm biome check --write

# Format all files
format:
  pnpm biome format --write

# Type check the project
typecheck:
  pnpm typecheck

# Run all checks (lint, format, typecheck, build)
check: lint typecheck build
  echo "✅ All checks passed!"

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

# Setup demo users
db-demo:
  pnpm db:demo-users

# === Authentication Commands ===

# Generate Better Auth files
auth-generate:
  pnpm auth:generate

# Test authentication flows
auth-test:
  pnpm test:auth-flows

# Test OAuth providers
oauth-test:
  pnpm test:oauth

# === Utility Commands ===

# Install dependencies
install:
  pnpm install

# Update dependencies
update:
  pnpm update

# Add a dependency
add package:
  pnpm add {{package}}

# Add a dev dependency
add-dev package:
  pnpm add -D {{package}}

# Remove a dependency
remove package:
  pnpm remove {{package}}

# === Advanced Development ===

# Watch for config changes and restart
dev-config-watch:
  watchexec -r \
    -w "*.config.js" \
    -w "*.config.ts" \
    -w "tailwind.config.*" \
    -w "next.config.*" \
    -w "biome.json" \
    --on-busy-update restart \
    -- pnpm dev

# Kill all development processes
kill-dev:
  #!/usr/bin/env bash
  echo "🛑 Stopping all development processes..."
  pkill -f "next dev" || true
  pkill -f "pnpm dev" || true
  pkill -f "watchexec" || true
  rm -f /tmp/senseiiwyze-dev-server.* || true
  echo "✅ All development processes stopped"

# === Quick Commands ===

# Quick start (install deps if needed, then dev)
start:
  #!/usr/bin/env bash
  if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
  fi
  just dev

# Full reset and start
reset: clean
  pnpm install
  just dev

# Production preview
preview: build
  pnpm start

# === Git Commands ===

# Create a new branch
branch name:
  git checkout -b {{name}}

# Quick commit with message
commit message:
  git add -A
  git commit -m "{{message}}"

# Push current branch
push:
  git push -u origin $(git branch --show-current)

# === Deployment ===

# Deploy to production
deploy: check
  pnpm deploy

# === System Info ===

# Show system and project info
info:
  @echo "📊 System Information:"
  @echo "Node: $(node --version)"
  @echo "pnpm: $(pnpm --version)"
  @echo "OS: $(uname -s)"
  @echo ""
  @echo "📁 Project Information:"
  @echo "Name: $(jq -r .name package.json)"
  @echo "Version: $(jq -r .version package.json 2>/dev/null || echo 'N/A')"
  @echo "Dependencies: $(jq '.dependencies | length' package.json) production, $(jq '.devDependencies | length' package.json) dev"

# === Setup & Dependencies ===

# Install required tools (run once)
setup:
  #!/usr/bin/env bash
  echo "🔧 Setting up development environment..."
  
  # Check if watchexec is installed
  if ! command -v watchexec &> /dev/null; then
    echo "📦 Installing watchexec..."
    if command -v brew &> /dev/null; then
      brew install watchexec
    else
      echo "❌ Please install watchexec manually: https://github.com/watchexec/watchexec"
      exit 1
    fi
  fi
  
  # Install project dependencies
  if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    pnpm install
  fi
  
  echo "✅ Setup complete!"

# === AI Development Workflow ===

# Start AI-friendly development session
ai-dev:
  #!/usr/bin/env bash
  echo "🤖 Starting AI development session..."
  echo "This will start the dev server with automatic restarts when builds complete."
  echo "Perfect for AI coding in background tabs/windows."
  echo ""
  echo "Available in separate terminals:"
  echo "  - just build     (AI can run this to build)"
  echo "  - just check     (AI can run this to verify code)"
  echo "  - just fix       (AI can run this to fix issues)"
  echo ""
  just dev

# Complete AI workflow (build + reload dev)
ai-build-reload:
  #!/usr/bin/env bash
  echo "🔨 Running AI build + reload workflow..."
  just build
  echo "✅ Build complete! Dev server should auto-reload if running."

# === Help & Documentation ===

# Show detailed help
help:
  @echo "🚀 SenseiiWyze Dashboard - Just Commands"
  @echo ""
  @echo "🤖 AI Development Workflow:"
  @echo "  just ai-dev             - Start dev with auto-reload (main session)"
  @echo "  just ai-build-reload    - Build + trigger reload (AI/background)"
  @echo "  just build              - Build only (AI safe)"
  @echo ""
  @echo "🚀 Common workflows:"
  @echo "  just setup      - Install tools and dependencies"
  @echo "  just start      - Quick start development"
  @echo "  just dev        - Smart dev server with auto-reload"
  @echo "  just dev-standard - Standard dev server (no auto-reload)"
  @echo "  just check      - Run all checks"
  @echo "  just fix        - Fix all issues"
  @echo "  just kill-dev   - Stop all dev processes"
  @echo ""
  @echo "📚 More commands:"
  @echo "  just --list     - Show all available commands"