# SenseiiWyze Dashboard

A Next.js 15 dashboard application with multi-step authentication flow and shadcn/ui components.

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

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Run tests
pnpm test
```

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