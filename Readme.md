# Second-Hand Electronics Marketplace — Frontend

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Environment Variables](#environment-variables)
7. [Available Scripts](#available-scripts)
8. [Project Structure](#project-structure)
9. [Architecture Overview](#architecture-overview)
10. [Development Team](#development-team)
11. [Contributing](#contributing)
12. [License](#license)

---

## Project Overview

This repository contains the frontend application for the **Second-Hand Electronics Marketplace** platform — a fully featured, production-grade web application that enables users to list, browse, purchase, and sell pre-owned electronic devices.

The platform is designed around three distinct user roles:

- **Buyers** — Browse listings, save favourites, manage a shopping cart, place orders, and communicate directly with sellers via real-time chat.
- **Sellers** — Create and manage product listings with images, descriptions, pricing, and location data. Track orders and respond to buyer inquiries.
- **Administrators** — Access a dedicated dashboard to manage users, product listings, categories, reports, and the identity verification queue.

Additional platform capabilities include location-based product discovery using interactive maps, audio message support in chat, identity verification workflows, push-style toast notifications, and full internationalisation support.

The frontend is built with **React 19** and **TypeScript**, bundled with **Vite**, and deployed as a single-page application (SPA) with client-side routing and lazy-loaded routes for optimal performance.

---

## Key Features

- **User Authentication** — JWT-based registration, login, email and phone OTP verification, password reset via email or SMS, and persistent sessions using secure cookie storage.
- **Product Listings** — Create, edit, and manage listings with multi-image upload, rich descriptions, category selection, pricing, and geographic location pinning via an interactive Leaflet map.
- **Search and Discovery** — Full-text search, category and condition filters, location-based sorting, and paginated browsing across all available listings.
- **Real-Time Chat** — WebSocket-powered messaging between buyers and sellers, with support for text messages, image attachments, and audio messages rendered via waveform visualisation.
- **Shopping Cart and Checkout** — Persistent cart management, order placement, and order history tracking for buyers.
- **Wishlist / Favourites** — Save and manage product listings for later review.
- **Admin Dashboard** — Comprehensive management interface covering users, listings, categories, countries, abuse reports, and identity verification queues. Includes data visualisation charts for platform analytics.
- **Identity Verification** — Structured workflow for submitting and reviewing identity documents, with approval and rejection flows for administrators.
- **Notifications** — In-app notification centre for platform events and activity updates.
- **Internationalisation** — Full i18n support via i18next with English as the default locale, structured for easy addition of further languages.
- **Role-Based Access Control** — Granular route guards and access control ensuring buyers, sellers, and administrators each access only the functionality appropriate to their role.

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

- **Node.js** >= 20.19.0 (LTS recommended)
- **npm** (bundled with Node.js; no separate installation required)
- Access to a running instance of the backend REST API

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

> **Note:** Ensure the backend API is running and the `VITE_API_URL` environment variable points to the correct base URL before starting the application.

---

## Environment Variables

Create a `.env` file at the project root. All variables must be prefixed with `VITE_` to be exposed to the client bundle.

| Variable            | Required | Description                                                  |
| ------------------- | -------- | ------------------------------------------------------------ |
| `VITE_API_URL`      | Yes      | Base URL of the backend REST API (e.g. `http://localhost:3000`) |
| `VITE_SOCKET_URL`   | No       | WebSocket server URL if different from the REST API base URL |

Environment variables are accessed through [src/lib/env.ts](src/lib/env.ts), which centralises validation and exports typed references for use throughout the application. Never access `import.meta.env` directly in application code — always import from `src/lib/env.ts`.

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
├── api/                 # Auto-generated API client code (OpenAPI / Swagger)
├── assets/              # Static assets (images, icons, fonts)
├── components/          # Reusable UI components
│   ├── ui/              # Base primitives (Button, Input, Dialog, Badge, etc.)
│   ├── layout/          # Application layout components (header, footer, sidebar, navigation)
│   ├── forms/           # Shared form components and field-level Zod schemas
│   ├── feedback/        # Loading spinners, skeleton screens, empty states, error states
│   ├── admin/           # Admin-specific reusable components
│   └── profile/         # Profile-specific reusable components
├── config/              # Application configuration (API base URL, app-level settings)
├── constants/           # Shared constants (routes, API endpoints, storage keys, status codes, messages)
├── dto/                 # Data transfer object types for API request and response shapes
├── hooks/               # Custom React hooks shared across features
├── lib/                 # Utility functions and library setup (formatting, storage, i18n, env access)
├── locales/             # i18n translation files (en.json and any future locales)
├── pages/               # Page-level components, one directory per route
├── providers/           # React context providers and TanStack Query client configuration
├── routes/              # Route definitions, authentication guards, and access control logic
├── services/            # API service layer — Axios call functions and React Query hooks per domain
├── stores/              # Zustand global state stores (auth, cart, UI toggles)
├── style/               # Global CSS, design tokens, animations, and custom font declarations
├── test/                # Test setup files, shared utilities, and MSW mock handlers
└── types/               # Shared TypeScript type and interface definitions
```

---

## Architecture Overview

### Routing and Access Control

Routes are defined in [src/routes/routes.tsx](src/routes/routes.tsx) using React Router DOM with lazy loading applied to all page components to reduce the initial bundle size. Route guards in [src/routes/guards.tsx](src/routes/guards.tsx) protect authenticated and role-restricted routes. Access control logic is centralised in [src/routes/access-control.tsx](src/routes/access-control.tsx), ensuring that buyer, seller, and admin routes are enforced consistently and independently of individual page components.

### State Management

Client-side state — including the authenticated user session, shopping cart contents, and UI toggles such as modals and sidebars — is managed with Zustand stores located in `src/stores/`. Server-side state, including data fetching, caching, background refetching, pagination, and mutations, is handled exclusively by TanStack React Query through service hooks defined in `src/services/`. This separation keeps client and server state concerns cleanly isolated.

### API Layer

All HTTP communication with the backend is performed through an Axios instance configured in `src/services/client.ts`. This instance attaches authentication tokens to outgoing requests via request interceptors and handles silent token refresh on 401 responses. Each domain area has a dedicated service file that exports both the raw Axios call functions and the corresponding React Query hooks (`useQuery` / `useMutation` wrappers), so components never call Axios directly.

### Real-Time Communication

WebSocket communication is implemented using Socket.io Client. The socket connection is established after successful authentication and is used to deliver real-time chat messages, typing indicators, and notification events without polling.

### Forms and Validation

All forms are built with React Hook Form and validated using Zod schemas. Schemas are co-located with the relevant form component or service domain. The `@hookform/resolvers` package connects Zod schemas to React Hook Form, providing fully typed, declarative validation with minimal boilerplate.

### Internationalisation

The application uses i18next with English as the default locale. All user-facing strings are externalised to `src/locales/en.json`. The i18next instance is initialised in [src/lib/i18n.ts](src/lib/i18n.ts). Adding a new locale requires adding the corresponding JSON file and registering it in the i18n configuration.

### Testing Strategy

Unit and integration tests are written with Vitest and Testing Library, targeting components, hooks, and utility functions. MSW (Mock Service Worker) is used to intercept and mock API requests during tests, allowing full component trees to be tested against realistic network behaviour without a running backend. Test files are co-located with the code they test, with shared utilities and handlers in `src/test/`.

---

## Development Team

This project was designed and built by the following team members from **GSG-PixelCraft**:

| Name            | Role                         |
| --------------- | ---------------------------- |
| Shadi Sbaih     | Frontend Developer           |
| Raghad Sami     | Frontend Developer           |
| Riham Katout    | Frontend Developer           |
| Mahmoud Hamo    | Frontend Developer           |
| Anas Abuhamed   | Frontend Developer           |

---

## Contributing

1. Branch from `dev` for all feature and fix work. Use a descriptive branch name that reflects the scope of the change (e.g. `feature/chat-audio-messages`, `fix/cart-quantity-update`).
2. Ensure zero ESLint warnings are present before submitting a pull request. The CI pipeline enforces this.
3. Run `npm run validate` to confirm that formatting, linting, type checking, tests, and the production build all pass successfully before opening a pull request.
4. Keep pull requests focused on a single concern to simplify review and reduce the risk of unintended side effects.
5. Follow the existing naming conventions, file structure, and code patterns documented in `.github/instructions/copilot-instructions.md`.

---

## License

This project is private. All rights reserved by GSG-PixelCraft.
