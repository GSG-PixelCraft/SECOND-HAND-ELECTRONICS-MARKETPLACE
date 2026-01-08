# Copilot Instructions for Second-Hand Electronics Marketplace Frontend

## Project Overview

This is a React 19 + TypeScript + Vite frontend application for a second-hand electronics marketplace.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 3.4 with `class-variance-authority` and `clsx`
- **State Management:** Zustand
- **Server State:** TanStack React Query
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router DOM v7
- **i18n:** i18next + react-i18next
- **Maps:** Leaflet + React Leaflet
- **Real-time:** Socket.io Client
- **Charts:** Recharts
- **Testing:** Vitest + Testing Library
- **Documentation:** Storybook

## Code Style & Conventions

### TypeScript

- Use strict TypeScript - avoid `any` type
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use explicit return types for functions
- Leverage Zod schemas for runtime validation and type inference

### React Components

- Use functional components with hooks only
- Use named exports for components
- Co-locate component files: `ComponentName.tsx`, `ComponentName.test.tsx`, `ComponentName.stories.tsx`
- Prefer composition over prop drilling

### Styling

- Use Tailwind CSS utility classes exclusively
- Use `clsx` for conditional class merging
- Use `class-variance-authority` (cva) for component variants
- Follow Prettier plugin order for Tailwind classes

### State Management

- Use Zustand stores for global client state
- Use React Query for server state (fetching, caching, mutations)
- Keep component state local when possible

### Forms

- Use React Hook Form with Zod resolvers
- Define Zod schemas alongside form components
- Use `@hookform/resolvers` for validation integration

### File Structure

src/
├── assets/ # Static assets (images, fonts)
├── components/ # Reusable UI components
├── features/ # Feature-based modules
├── hooks/ # Custom React hooks
├── lib/ # Utilities and configurations
├── pages/ # Route page components
├── services/ # API service functions
├── stores/ # Zustand stores
├── types/ # Shared TypeScript types
└── test/ # Test utilities and setup

### Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Types/Interfaces: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Zustand stores: `useSomethingStore.ts`

### Testing

- Write tests using Vitest and Testing Library
- Test files: `*.test.tsx` or `*.test.ts`
- Focus on user behavior, not implementation details
- Use `jsdom` environment (configured in Vite)

### Storybook

- Write stories for reusable components
- Story files: `*.stories.tsx`
- Document component variants and states

## Code Quality Rules

### Before Generating Code

1. Always use TypeScript with proper typing
2. Follow ESLint rules (no warnings allowed)
3. Use Prettier formatting (single quotes, semicolons, trailing commas)
4. Ensure React hooks follow rules-of-hooks

### Pre-commit Requirements

Run these commands before committing:

```bash
npm run format
npm run check-format
npm run lint
npm run type-check
```

## Import Preferences

- Use absolute imports when path aliases are configured
- Group imports: React → third-party → local modules → - types → styles
- Avoid default exports except for pages/routes

## API & Data Fetching

- Use React Query for all API calls
- Define query keys consistently
- Handle loading, error, and empty states
- Use mutations for POST/PUT/DELETE operations

## Internationalization

- All user-facing strings must use i18next t() function
- Store translations in locale JSON files
- Support RTL languages if applicable

## Authentication

- Use js-cookie for token storage
- Use jwt-decode for token parsing
- Handle auth state in Zustand store

## Real-time Features

- Use Socket.io client for WebSocket connections
- Manage connection lifecycle in custom hooks
- Handle reconnection and error states

## PowerShell

- Use `npm run dev` to start the development server
- Prefer Using Set-Location -Path for files navigation in PowerShell
