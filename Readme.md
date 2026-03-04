# Second-Hand Electronics Marketplace — Frontend

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [Project Structure](#project-structure)
8. [Architecture Overview](#architecture-overview)
9. [Contributing](#contributing)
10. [License](#license)

---

## Project Overview

This repository contains the frontend application for the Second-Hand Electronics Marketplace platform. The application allows users to list, browse, buy, and sell pre-owned electronic devices. It supports real-time messaging between buyers and sellers, location-based product discovery, secure authentication with role-based access control, and an administrative dashboard for platform management.

The frontend is built with React 19 and TypeScript, bundled with Vite, and deployed as a single-page application.

---

## Technology Stack

### Core

| Technology | Version | Purpose                                   |
| ---------- | ------- | ----------------------------------------- |
| React      | 19.2.0+ | UI framework (functional components only) |
| TypeScript | 5.9.3+  | Static typing with strict mode            |
| Vite       | 7.2.4+  | Build tool and development server         |

### State Management

| Technology           | Version  | Purpose                                        |
| -------------------- | -------- | ---------------------------------------------- |
| Zustand              | 5.0.9+   | Global client state (auth, cart, UI)           |
| TanStack React Query | 5.90.16+ | Server state management, caching, mutations    |

### Styling

| Technology               | Version | Purpose                        |
| ------------------------ | ------- | ------------------------------ |
| Tailwind CSS             | 3.4.17+ | Utility-first CSS framework    |
| class-variance-authority | 0.7.1+  | Component variant definitions  |
| clsx / tailwind-merge    | Latest  | Conditional class name merging |

### Forms and Validation

| Technology          | Version | Purpose                              |
| ------------------- | ------- | ------------------------------------ |
| React Hook Form     | 7.70.0+ | Form state management                |
| Zod                 | 4.3.5+  | Schema validation and type inference |
| @hookform/resolvers | 5.2.2+  | React Hook Form and Zod integration  |

### Routing

| Technology       | Version | Purpose                                     |
| ---------------- | ------- | ------------------------------------------- |
| React Router DOM | 7.11.0+ | Client-side routing with lazy-loaded routes |

### Networking and Real-Time

| Technology       | Version | Purpose                               |
| ---------------- | ------- | ------------------------------------- |
| Axios            | 1.13.2+ | HTTP client with request interceptors |
| Socket.io Client | 4.8.3+  | Real-time WebSocket communication     |

### Additional Libraries

| Technology              | Version           | Purpose                             |
| ----------------------- | ----------------- | ----------------------------------- |
| i18next / react-i18next | 25.8.4+ / 15.7.1+ | Internationalization                |
| Leaflet / React Leaflet | 1.9.4+ / 5.0.0+   | Map rendering and location services |
| Recharts                | 3.6.0+            | Data visualization and charts       |
| react-hot-toast         | 2.6.0+            | Toast notifications                 |
| react-dropzone          | 14.3.8+           | File upload with drag-and-drop      |
| wavesurfer.js           | 7.12.1+           | Audio waveform rendering            |
| js-cookie               | 3.0.5+            | Cookie management                   |
| jwt-decode              | 4.0.0+            | JWT token parsing                   |
| Lucide React            | 0.563.0+          | Icon library                        |

### Development and Testing

| Technology      | Version  | Purpose                                       |
| --------------- | -------- | --------------------------------------------- |
| Vitest          | 4.0.16+  | Unit and integration test runner              |
| Testing Library | 16.3.1+  | React component testing utilities             |
| MSW             | 2.12.10+ | API mocking for tests                         |
| Storybook       | 10.1.11+ | Component development and documentation       |
| ESLint          | 9.39.2+  | Static code analysis (zero warnings enforced) |
| Prettier        | 3.7.4+   | Code formatting                               |
| Husky           | 9.1.7+   | Git hooks                                     |
| lint-staged     | 16.1.0+  | Lint and format staged files on commit        |

---

## Prerequisites

- Node.js >= 20.19.0
- npm (bundled with Node.js)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/GSG-PixelCraft/SECOND-HAND-ELECTRONICS-MARKETPLACE.git
   cd SECOND-HAND-ELECTRONICS-MARKETPLACE
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and configure the required environment variables (see [Environment Variables](#environment-variables)).

4. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` by default.

---

## Environment Variables

Create a `.env` file at the project root. All variables must be prefixed with `VITE_` to be exposed to the client bundle.

| Variable       | Required | Description                      |
| -------------- | -------- | -------------------------------- |
| `VITE_API_URL` | Yes      | Base URL of the backend REST API |

Environment variables are accessed through `src/lib/env.ts`, which centralises validation and exports typed references for use throughout the application.

---

## Available Scripts

| Command                   | Description                                                            |
| ------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`             | Start the Vite development server with hot module replacement          |
| `npm run build`           | Compile TypeScript and produce an optimised production bundle          |
| `npm run preview`         | Serve the production build locally for verification                    |
| `npm run type-check`      | Run the TypeScript compiler in check-only mode                         |
| `npm run lint`            | Run ESLint across all TypeScript source files (zero warnings enforced) |
| `npm run lint:fix`        | Run ESLint with automatic fix applied                                  |
| `npm run format`          | Format all files with Prettier                                         |
| `npm run check-format`    | Verify that all files conform to Prettier formatting rules             |
| `npm run test`            | Run the Vitest test suite in watch mode                                |
| `npm run test:run`        | Run the Vitest test suite once (CI mode)                               |
| `npm run validate`        | Run format check, lint, type check, tests, and build in sequence       |
| `npm run storybook`       | Start the Storybook development server on port 6006                    |
| `npm run build-storybook` | Build a static Storybook export                                        |

---

## Project Structure

```
src/
├── api/                 # Auto-generated API client code
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── ui/              # Base primitives (Button, Input, Dialog, etc.)
│   ├── layout/          # Application layout components (header, footer, sidebar)
│   ├── forms/           # Form components and Zod schemas
│   └── feedback/        # Loading spinners, empty states, error states
├── config/              # Application configuration (API base URL, app settings)
├── constants/           # Shared constants (routes, endpoints, storage keys, messages)
├── containers/          # Smart components that compose UI with data-fetching logic
├── dto/                 # Data transfer object types for API request and response shapes
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions (formatting, storage, i18n setup, env access)
├── locales/             # i18n translation files
├── pages/               # Page-level components, one directory per route
├── providers/           # React context and query providers
├── routes/              # Route definitions, authentication guards, and access control
├── services/            # API service layer (Axios calls and React Query hooks)
├── stores/              # Zustand global state stores
├── style/               # Global CSS, design tokens, animations, and custom fonts
├── test/                # Test setup, utilities, and MSW mock handlers
└── types/               # Shared TypeScript type and interface definitions
```

---

## Architecture Overview

### Routing and Access Control

Routes are defined in `src/routes/routes.tsx` using React Router DOM with lazy loading applied to all page components to reduce the initial bundle size. Route guards in `src/routes/guards.tsx` protect authenticated and role-restricted routes. Access control logic is centralised in `src/routes/access-control.tsx`.

### State Management

Client-side state (authenticated user, shopping cart, UI toggles such as modals and sidebars) is managed with Zustand stores located in `src/stores/`. Server-side state, including data fetching, caching, background refetching, and mutations, is handled exclusively by TanStack React Query through service hooks defined in `src/services/`.

### API Layer

All HTTP communication with the backend is performed through an Axios instance configured in `src/services/client.ts`, which attaches authentication tokens via request interceptors and handles token refresh on 401 responses. Each domain area has a dedicated service file that exports both the raw Axios calls and the corresponding React Query hooks.

### Internationalisation

The application uses i18next with English as the default locale. Translation keys are maintained in `src/locales/en.json`. The i18next instance is initialised in `src/lib/i18n.ts`.

---

## Contributing

1. Branch from `dev` for all feature and fix work.
2. Ensure zero ESLint warnings are present before submitting a pull request.
3. Run `npm run validate` to confirm that formatting, linting, type checking, tests, and the production build all pass successfully.
4. Keep pull requests focused on a single concern to simplify review.

---

## License

This project is private. All rights reserved by GSG-PixelCraft.
