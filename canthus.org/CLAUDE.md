# Canthus.org - Project Context

## Overview

Canthus is a B2B SaaS company providing accessibility tooling for vertical SaaS platforms. The project is a monorepo containing both the marketing website and application infrastructure, hosted at canthus.org.

## Company & Product

**Company**: Canthus
**Website**: https://canthus.org
**Mission**: One-Click Clarity for Everyone - accessibility solutions built for the platforms your team already uses

**Core Value Proposition**:
- Accessibility tooling for vertical SaaS platforms
- Compliance standards and improved customer experience
- Integrates with existing platforms without disrupting workflows
- High conversion landing page targeting ICPs (Ideal Customer Profiles)

## Technology Stack

### Frontend (client/)
- **Framework**: React + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **TypeScript**: Full type safety
- **Deployment**: Cloudflare Pages

### Backend (server/)
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Bun (JavaScript runtime)
- **Authentication**: WorkOS (enterprise auth)
- **Database**: PostgreSQL via Neon (cloud-hosted)
- **Deployment**: Cloudflare Workers

### Shared (shared/)
- Shared TypeScript definitions between client and server
- Type safety across the full stack

### Development Tools
- **Package Manager**: Bun
- **Monorepo**: Turbo (build orchestration and caching)
- **Linting/Formatting**: Biome
- **Testing**: Vitest + Testing Library (preferred)

## Project Structure

```
canthus.org/
├── client/                 # React frontend (marketing site + app)
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/    # Marketing landing page sections
│   │   │   ├── app/        # Application components (post-login)
│   │   │   ├── auth/       # Authentication context
│   │   │   ├── logos/      # Partner platform logos (Socotra, Clio)
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── routes/         # TanStack Router routes
│   │   └── lib/            # Utilities and API client
│   └── package.json
├── server/                 # Hono backend API
│   ├── src/
│   │   ├── auth.ts         # WorkOS authentication
│   │   ├── index.ts        # Main Hono app
│   │   └── types/          # Server-side types
│   └── package.json
├── shared/                 # Shared TypeScript definitions
│   └── src/types/
├── scripts/                # Deployment and utility scripts
└── docs/                   # Project documentation
```

## Key Features

### Landing Page
- Hero section with value proposition
- Impact & Success Stories section with market insights
- Platform integrations showcase (Socotra, Clio)
- Pricing section with FAQ
- Case studies and social proof

### Target Platforms
- **Socotra**: Insurance vertical platform (integration live)
- **Clio**: Legal practice management software (coming soon)

### Application Flow
1. Marketing landing page (public)
2. User authentication via WorkOS
3. Dashboard showing usage analytics and tool access
4. Platform-specific integrations and tools

## Development Guidelines

### Constraints
- **No new runtime dependencies** without approval
- **Prefer**: Standard library, Bun built-ins, existing utilities
- **Create**: Utility functions when needed
- **Linting**: Use Biome for all code formatting and linting

### Preferred Technologies
- **Testing**: Vitest + Testing Library
- **Date handling**: Temporal (with polyfill)
- **Component Libraries**:
  - shadcn/ui (primary)
  - Additional resources in docs/COMPONENTS.md

### Environment Management
- **Development**: `bun run dev` (all workspaces)
- **Build**: `bun run build` (all workspaces)
- **Type checking**: `bun run type-check`
- **Deployment**: `python3 scripts/deploy.py`

## Current Implementation Status

### Completed
- ✅ Marketing landing page with hero, impact, and integrations sections
- ✅ Basic Hono backend with WorkOS authentication
- ✅ Shared TypeScript types
- ✅ shadcn/ui component library integration
- ✅ Partner platform logos (Socotra, Clio) replacing emojis

### In Progress
- 🔄 Mobile menu styling improvements (client/TODO.md)
- 🔄 Application dashboard components
- 🔄 Platform-specific integration implementations

### Known Issues
- Server TypeScript compilation error related to WorkOS imports (non-blocking for frontend development)

## API Endpoints

### Public
- `GET /` - Health check
- `GET /hello` - Greeting endpoint with cookie tracking
- `GET /auth/*` - WorkOS authentication routes

### Protected
- `GET /protected` - Authenticated route example

## Deployment Architecture

### Frontend
- **Production**: Cloudflare Pages (canthus.org)
- **Staging**: canthus-org.pages.dev
- **Local**: Vite dev server

### Backend
- **Production**: Cloudflare Workers
- **Local**: Bun development server

### Database
- **Production/Development**: Neon PostgreSQL

## Component Architecture

### Landing Page Components
- `hero/` - Main hero section with CTA
- `impact/` - Market insights and statistics
- `features/` - Platform integrations and features
- `pricing/` - Pricing plans and FAQ
- `nav/` - Navigation components

### UI Components
- Based on shadcn/ui design system
- Dark/light theme support via theme-provider
- Responsive design with Tailwind CSS
- Custom components (StarsBackground, etc.)

## Key Files to Understand

### Configuration
- `package.json` - Root monorepo configuration
- `turbo.json` - Build orchestration
- `cursor.json` - Project metadata and goals
- `biome.json` - Linting and formatting rules

### Core Implementation
- `client/src/routes/index.tsx` - Main landing page
- `server/src/index.ts` - Hono application setup
- `shared/src/types/` - Shared type definitions

### Documentation
- `README.md` - Development setup and usage
- `docs/CONTEXT.md` - Additional context for LLMs
- `docs/COMPONENTS.md` - UI component resources
- `scripts/README.md` - Deployment documentation

## Development Workflow

1. **Local Development**: `bun run dev` starts both client and server
2. **Component Development**: Use shadcn/ui components as base, customize as needed
3. **Type Safety**: Shared types ensure consistency between frontend and backend
4. **Testing**: Component testing with Vitest, E2E testing framework to be determined
5. **Deployment**: Automated deployment via Python scripts with environment validation

## Business Context

### Target Customers
- Vertical SaaS companies (Insurance, Legal, Healthcare, etc.)
- Platform teams needing accessibility compliance
- Businesses looking to improve customer experience for users with disabilities

### Value Propositions
- **Compliance**: Meet accessibility standards (ADA, WCAG)
- **Customer Experience**: Better service for diverse user needs
- **Integration**: Seamless workflow integration with existing platforms
- **Simplicity**: "One-Click" implementation and management

### Platform Strategy
- Start with insurance (Socotra) and legal (Clio) verticals
- Expand to additional vertical SaaS platforms
- Build network effects through platform integrations