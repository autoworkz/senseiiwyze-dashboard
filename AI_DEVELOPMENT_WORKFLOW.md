# AI Development Workflow

This project is set up for AI-assisted development with automatic dev server reloading when builds complete.

## Quick Start

1. **First time setup:**
   ```bash
   just setup
   ```

2. **Start AI development session:**
   ```bash
   just ai-dev
   ```
   This starts the dev server with automatic restart detection.

3. **In separate terminal/tab (for AI):**
   ```bash
   just build           # AI runs this to build
   just check           # AI runs this to verify code
   just fix             # AI runs this to fix linting issues
   ```

## How the Auto-Reload Works

When you run `just ai-dev` (or `just dev`), it starts a smart development server that:

1. **Watches for build artifacts** in `.next/` directory
2. **Detects when builds complete** by monitoring:
   - `.next/BUILD_ID` changes
   - `.next/build-manifest.json` updates
   - `.next/static/` changes
   - `.next/trace` file modifications
3. **Automatically restarts** the dev server after a build completes

This solves the problem where Next.js builds destroy CSS locations and JavaScript returns, requiring a dev server restart.

## Available Commands

### Development
- `just dev` - Smart dev server with auto-reload
- `just dev-standard` - Standard dev server (no auto-reload)
- `just dev-webpack` - Dev server with webpack (no turbopack)
- `just kill-dev` - Stop all development processes

### AI Workflow
- `just ai-dev` - Start main development session
- `just ai-build-reload` - Complete build + reload workflow
- `just build` - Build project (safe for AI to run)

### Code Quality
- `just check` - Run all checks (lint, format, typecheck, build)
- `just fix` - Fix all linting and formatting issues
- `just lint` - Run linting only
- `just format` - Format code only
- `just typecheck` - Type checking only

### Utilities
- `just clean` - Clean build artifacts
- `just install` - Install dependencies
- `just start` - Quick start (install if needed + dev)
- `just reset` - Full reset and start

## Troubleshooting

### If auto-reload isn't working:
1. Make sure `watchexec` is installed: `brew install watchexec`
2. Check if dev server is running: `ps aux | grep "next dev"`
3. Kill all processes and restart: `just kill-dev && just ai-dev`

### If builds are slow:
- Use `just build-turbo` for faster builds with Turbopack
- Clean build artifacts: `just clean`

### For development without auto-reload:
- Use `just dev-standard` for traditional development

## Example AI Development Session

**Terminal 1 (Main development):**
```bash
just ai-dev
# Starts dev server at http://localhost:3000
# Watches for build changes automatically
```

**Terminal 2 (AI commands):**
```bash
# AI makes code changes, then:
just build              # Triggers auto-reload in Terminal 1
just check              # Verifies everything works
just fix                # Fixes any linting issues
```

The dev server in Terminal 1 will automatically restart whenever Terminal 2 completes a build, ensuring fresh CSS and JavaScript.

## Scripts

The system uses these scripts:
- `scripts/smart-dev.sh` - Main auto-reload script using watchexec
- `scripts/auto-reload-dev.sh` - More comprehensive monitoring script
- `justfile` - All command definitions

## Configuration

- File watching is configured via `watchexec` in the smart-dev script
- Debounce time is set to 3 seconds to avoid rapid restarts
- Only Next.js build artifacts trigger restarts, not source code changes