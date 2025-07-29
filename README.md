# SenseiiWyze Dashboard

A Next.js 15 dashboard application with multi-step authentication flow and shadcn/ui components.

https://senseii-web-app-tsaw.vercel.app/dashboard/program-readiness-dashboard
https://senseii-web-app-tsaw.vercel.app/dashboard/executive-dashboard
https://senseii-web-app-tsaw.vercel.app/dashboard/user-dashboard


## Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 9.0.0 (required - this project enforces pnpm usage)

## Installation

1. **Install pnpm** (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd senseiiwyze-dashboard
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Development

### Development Server

This project offers two development modes:

#### Simple Mode (Default)
```bash
# Start development server with Turbo
pnpm dev

# Or use the watch script for automatic restarts
pnpm dev:watch-simple
```

The simple mode uses `watchexec` to monitor file changes and automatically restart the Next.js development server when needed.

#### Robust Mode (Advanced)
```bash
pnpm dev:watch-robust
```

The robust mode uses Node.js with `chokidar` and `execa` to provide more granular control:
- Hot-reload for source files (src/**, pages/**, components/**)
- Full restart for dependency changes (node_modules/**, package.json, .next/**)
- Better process management and error handling

**Note**: The robust mode will fall back to simple mode if `scripts/robust-watcher.sh` is not found. To use the robust watcher, run:
```bash
node scripts/watch.js
```

### Build & Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run tests
pnpm test
```

### Development Dependencies

The development watch scripts require the following dependencies:
- **watchexec-cli**: For the simple watch mode (must be installed globally or via system package manager)
- **chokidar**: File system watcher (Node.js package, included in devDependencies)
- **execa**: Process execution utility (Node.js package, included in devDependencies)

## Package Management

This project **requires** pnpm as the package manager. The following configurations enforce this:

- `packageManager` field in package.json
- `engines` field specifying pnpm version
- `.npmrc` and `.pnpmrc` configuration files
- Scripts that explicitly use pnpm

**Do not use npm or yarn** - the project will fail to work correctly with other package managers.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate test coverage
- `pnpm deploy` - Deploy to Cloudflare Workers

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── hooks/         # Custom React hooks
├── lib/           # Core utilities and store
├── services/      # API services
└── utils/         # Utility functions
```

## Technologies

- **Framework**: Next.js 15 with App Router
- **Package Manager**: pnpm (enforced)
- **UI**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **Validation**: Zod
- **Testing**: Jest + React Testing Library

## Troubleshooting

### Development Server Issues

#### Port Already in Use
If you encounter "Port 3000 is already in use" errors:

1. **Verify `lsof` is available** (macOS/Linux):
   ```bash
   which lsof
   ```
   If not available, install it via your system package manager.

2. **Manual port cleanup**:
   ```bash
   # macOS/Linux
   lsof -i tcp:3000 | awk 'NR>1 {print $2}' | xargs kill -9
   
   # Alternative using npx
   npx kill-port 3000
   ```

3. **Port-kill behavior on macOS**: The dev script uses `lsof` to find and kill processes on port 3000. On macOS, this requires no special permissions, but ensure no critical services are using this port.

#### Watch Mode Not Working

1. **For simple mode**: Ensure `watchexec` is installed:
   ```bash
   # macOS
   brew install watchexec
   
   # Linux
   # Check your distribution's package manager
   ```

2. **For robust mode**: The required Node.js dependencies (`chokidar` and `execa`) are already included in devDependencies.

#### .next Directory Issues

The dev script checks for the `.next` directory and runs an initial build if missing. If you experience issues:

1. **Clear the build cache**:
   ```bash
   pnpm clean
   ```

2. **Ensure `.next` is in sync**:
   ```bash
   rm -rf .next
   pnpm build
   ```

### Script Permissions

Ensure the dev script is executable:
```bash
chmod +x scripts/dev.sh
```
