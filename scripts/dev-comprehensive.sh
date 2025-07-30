#!/bin/bash

# Comprehensive Next.js Development Script
# This script handles all major aspects of Next.js development with defensive measures

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Function to kill processes by name pattern
kill_next_processes() {
    print_status "Killing existing Next.js processes..."
    
    # Kill processes containing 'next' in command line
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "next build" 2>/dev/null || true
    pkill -f "next start" 2>/dev/null || true
    
    # Kill Node processes on common Next.js ports
    for port in 3000 3001 3002 3003; do
        if command -v lsof >/dev/null 2>&1; then
            PIDS=$(lsof -ti tcp:$port 2>/dev/null || true)
            if [ ! -z "$PIDS" ]; then
                print_status "Killing process on port $port (PIDs: $PIDS)"
                echo $PIDS | xargs kill -9 2>/dev/null || true
            fi
        else
            fuser -k $port/tcp 2>/dev/null || true
        fi
    done
    
    sleep 2
    print_status "Process cleanup completed"
}

# Function to check and update dependencies
check_dependencies() {
    print_header "Checking Dependencies"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found!"
        exit 1
    fi
    
    # Check if pnpm is available
    if ! command -v pnpm >/dev/null 2>&1; then
        print_error "pnpm not found! Please install pnpm."
        exit 1
    fi
    
    # Check if node_modules needs update
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ] || [ "pnpm-lock.yaml" -nt "node_modules" ]; then
        print_status "Dependencies need updating..."
        pnpm install
    else
        print_status "Dependencies are up to date"
    fi
}

# Function to clean and prepare environment
clean_environment() {
    print_header "Cleaning Environment"
    
    # Clean Next.js cache
    if [ -d ".next" ]; then
        print_status "Removing .next directory..."
        rm -rf .next
    fi
    
    # Clean build artifacts
    if [ -d "dist" ]; then
        print_status "Removing dist directory..."
        rm -rf dist
    fi
    
    # Clean test coverage
    if [ -d "coverage" ]; then
        print_status "Removing coverage directory..."
        rm -rf coverage
    fi
    
    # Clean turbo cache
    if [ -d ".turbo" ]; then
        print_status "Removing .turbo cache..."
        rm -rf .turbo
    fi
}

# Function to check environment variables
check_env_vars() {
    print_header "Checking Environment Variables"
    
    # Check for required env files
    if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
        print_warning "No environment files found (.env or .env.local)"
        print_status "Creating .env.local template..."
        cat > .env.local << EOF
# Database
DATABASE_URL="your-database-url"

# Authentication
AUTH_SECRET="your-auth-secret"

# Sentry (Optional)
SENTRY_DSN="your-sentry-dsn"

# Next.js
NODE_ENV=development
EOF
        print_status "Please configure .env.local with your actual values"
    else
        print_status "Environment files found"
    fi
}

# Function to run database migrations if needed
check_database() {
    print_header "Checking Database"
    
    # Check if drizzle-kit is available and migrations exist
    if [ -d "lib/db" ] && command -v drizzle-kit >/dev/null 2>&1; then
        print_status "Running database migrations..."
        pnpm db:push 2>/dev/null || print_warning "Database migration failed or not configured"
    else
        print_status "No database migrations to run"
    fi
}

# Function to run linting
run_lint() {
    print_header "Running Linting"
    
    # Run ESLint if available
    if [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
        print_status "Running ESLint..."
        pnpm lint --fix 2>/dev/null || print_warning "Linting completed with warnings"
    else
        print_status "No ESLint configuration found"
    fi
}

# Function to start development server
start_dev_server() {
    print_header "Starting Development Server"
    
    # Choose the best development command
    if grep -q "dev.*--turbo" package.json; then
        print_status "Starting Next.js with Turbopack..."
        pnpm dev
    elif grep -q "\"dev\":" package.json; then
        print_status "Starting Next.js development server..."
        pnpm dev
    else
        print_error "No dev script found in package.json"
        exit 1
    fi
}

# Function to handle script arguments
handle_arguments() {
    case "${1:-}" in
        "clean")
            print_header "Clean Mode - Full Environment Reset"
            kill_next_processes
            clean_environment
            check_dependencies
            check_env_vars
            check_database
            run_lint
            start_dev_server
            ;;
        "fast")
            print_header "Fast Mode - Minimal Checks"
            kill_next_processes
            start_dev_server
            ;;
        "lint")
            print_header "Lint Mode - Focus on Code Quality"
            kill_next_processes
            check_dependencies
            run_lint
            start_dev_server
            ;;
        *)
            print_header "Standard Mode - Full Development Setup"
            kill_next_processes
            check_dependencies
            check_env_vars
            check_database
            start_dev_server
            ;;
    esac
}

# Main execution
main() {
    print_header "🚀 Next.js Comprehensive Development Script"
    print_status "Mode: ${1:-standard}"
    
    # Check if we're in a Next.js project
    if [ ! -f "next.config.ts" ] && [ ! -f "next.config.js" ] && [ ! -f "next.config.mjs" ]; then
        print_error "Not a Next.js project! (no next.config.* found)"
        exit 1
    fi
    
    handle_arguments "$1"
}

# Trap to cleanup on exit
trap 'print_status "Development script interrupted"' INT TERM

# Run main function with all arguments
main "$@"
