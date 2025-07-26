# Technical Stack

> Last Updated: 2025-07-26
> Version: 1.0.0

## Core Technologies

### Application Framework
- **Framework:** Next.js 15.0.0
- **Architecture:** App Router with React Server Components
- **Language:** TypeScript 5.x

### Database System
- **Development:** SQLite (via Better Auth)
- **Production:** PostgreSQL (planned)
- **ORM:** Drizzle ORM

### JavaScript Framework
- **UI Library:** React 18.3.1
- **State Management:** Zustand with localStorage persistence
- **Import Strategy:** Node modules with TypeScript paths

### Styling & UI

#### CSS Framework
- **Primary:** Tailwind CSS 3.4.1
- **Design System:** Semantic color system with theme variables

#### UI Component Library
- **Components:** shadcn/ui (Radix UI primitives)
- **Styling:** CVA (class-variance-authority)
- **Utils:** cn() helper for class merging

#### Typography & Icons
- **Fonts Provider:** Google Fonts (Inter)
- **Icon Library:** Lucide React

## Authentication & Services

### Authentication
- **Framework:** Better Auth
- **Providers:** Email (magic links), GitHub, Google, Discord
- **Plugins:** Two-factor authentication, passkeys support
- **Session:** JWT-based with secure cookies

### Email Service
- **Provider:** Resend API
- **Templates:** React Email components
- **Types:** Magic links, verification, password reset

## Infrastructure

### Application Hosting
- **Platform:** Cloudflare Workers
- **Runtime:** Edge runtime optimized
- **Region:** Global edge network

### Database Hosting
- **Development:** Local SQLite file
- **Production:** Supabase PostgreSQL (planned)

### Asset Hosting
- **Static Assets:** Cloudflare CDN
- **Images:** Next.js Image Optimization API
- **User Uploads:** Cloudflare R2 (planned)

### Deployment Solution
- **CI/CD:** GitHub Actions
- **Preview:** Cloudflare Pages preview deployments
- **Production:** Cloudflare Workers via wrangler

## Development Tools

### Code Repository
- **URL:** https://github.com/senseiwyze/dashboard
- **Version Control:** Git with conventional commits
- **Branch Strategy:** GitHub Flow (main + feature branches)

### Package Manager
- **Tool:** pnpm >= 9.0.0
- **Lock File:** pnpm-lock.yaml
- **Workspaces:** Monorepo support ready

### Testing & Quality
- **Test Framework:** Jest with React Testing Library
- **Linting:** ESLint with Next.js config
- **Formatting:** Prettier (planned)
- **Type Checking:** TypeScript strict mode

### Development Environment
- **IDE Support:** VS Code, Cursor AI configurations
- **Hot Reload:** Next.js Fast Refresh
- **Environment:** .env.local for secrets

## AI/ML Infrastructure (Planned)

### Readiness Index Engine
- **Framework:** TensorFlow.js for client-side predictions
- **Training:** Python backend with scikit-learn
- **API:** FastAPI for model serving

### NLP & Coaching
- **LLM Provider:** OpenAI GPT-4 API
- **Embeddings:** OpenAI text-embedding-3
- **Vector DB:** Pinecone for knowledge retrieval

### Analytics Pipeline
- **Events:** Segment for tracking
- **Data Warehouse:** BigQuery
- **ML Platform:** Google Vertex AI