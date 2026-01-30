# Copilot Instructions for Second-Hand Electronics Marketplace Frontend

> **Last Updated:** January 2026  
> **Version:** 2.0.0

---

## 📋 Project Overview

A modern React 19 + TypeScript + Vite 7 frontend application for a **second-hand electronics marketplace**. The platform enables users to buy, sell, and trade pre-owned electronics with features like real-time chat, location-based listings, and secure authentication.

---

## 🛠️ Technology Stack

### Core Framework

| Technology | Version | Purpose                                   |
| ---------- | ------- | ----------------------------------------- |
| React      | 19.2.0+ | UI framework (functional components only) |
| TypeScript | 5.9.3+  | Type safety with strict mode              |
| Vite       | 7.2.4+  | Build tool & dev server                   |

### State Management

| Technology           | Version  | Purpose                              |
| -------------------- | -------- | ------------------------------------ |
| Zustand              | 5.0.9+   | Global client state (auth, UI, cart) |
| TanStack React Query | 5.90.16+ | Server state, caching, mutations     |

### UI & Styling

| Technology               | Version  | Purpose                     |
| ------------------------ | -------- | --------------------------- |
| Tailwind CSS             | 3.4.17+  | Utility-first CSS framework |
| class-variance-authority | 0.7.1+   | Component variants (CVA)    |
| clsx + tailwind-merge    | Latest   | Conditional class merging   |
| Lucide React             | 0.563.0+ | Icon library                |

### Forms & Validation

| Technology          | Version | Purpose                            |
| ------------------- | ------- | ---------------------------------- |
| React Hook Form     | 7.70.0+ | Form state management              |
| Zod                 | 4.3.5+  | Schema validation & type inference |
| @hookform/resolvers | 5.2.2+  | RHF-Zod integration                |

### Routing & Navigation

| Technology       | Version | Purpose                               |
| ---------------- | ------- | ------------------------------------- |
| React Router DOM | 7.11.0+ | Client-side routing with lazy loading |

### Additional Features

| Technology              | Version         | Purpose                           |
| ----------------------- | --------------- | --------------------------------- |
| Axios                   | 1.13.2+         | HTTP client with interceptors     |
| Socket.io Client        | 4.8.3+          | Real-time WebSocket communication |
| i18next                 | 23.16.0+        | Internationalization              |
| Leaflet + React Leaflet | 1.9.4+ / 5.0.0+ | Maps & location services          |
| Recharts                | 3.6.0+          | Data visualization & charts       |
| react-hot-toast         | 2.6.0+          | Toast notifications               |
| react-dropzone          | 14.3.8+         | File uploads with drag-and-drop   |
| js-cookie               | 3.0.5+          | Cookie management                 |
| jwt-decode              | 4.0.0+          | JWT token parsing                 |

### Development & Testing

| Technology          | Version  | Purpose                         |
| ------------------- | -------- | ------------------------------- |
| Vitest              | 4.0.16+  | Test runner (jsdom environment) |
| Testing Library     | 16.3.1+  | Component testing utilities     |
| Storybook           | 10.1.11+ | Component documentation         |
| ESLint              | 9.39.2+  | Code linting (zero warnings)    |
| Prettier            | 3.7.4+   | Code formatting                 |
| Husky + lint-staged | Latest   | Git hooks & staged file linting |

---

## 📁 Project Architecture

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI primitives (Button, Input, Dialog, etc.)
│   ├── layout/          # Layout components (AppLayout, Header, Footer, Sidebar)
│   ├── forms/           # Form components and Zod schemas
│   ├── feedback/        # Loading, empty states, error states
│   │   ├── loading/     # Spinners, skeletons, page loaders
│   │   ├── emptyState/  # Empty state components
│   │   └── errorState/  # Error state components
│   └── chats/           # Chat-related components
├── pages/               # Route page components (one folder per page)
│   ├── HomePage/
│   ├── LoginPage/
│   ├── RegisterPage/
│   ├── ProductDetailPage/
│   ├── ProfilePage/
│   ├── ChatPage/
│   ├── CartPage/
│   ├── OrdersPage/
│   ├── AdminOverviewPage/
│   └── ...
├── services/            # API service layer
│   ├── client.ts        # Axios instance with interceptors
│   ├── auth.service.ts  # Auth API + React Query hooks
│   ├── product.service.ts
│   ├── cart.service.ts
│   └── order.service.ts
├── stores/              # Zustand state stores
│   ├── useAuthStore.ts  # Authentication state
│   ├── useCartStore.ts  # Shopping cart state
│   └── useUiStore.ts    # UI state (modals, sidebars)
├── routes/              # Routing configuration
│   ├── routes.tsx       # Route definitions with lazy loading
│   ├── guards.tsx       # AuthGuard, RoleGuard components
│   └── access-control.tsx
├── config/              # App configuration
│   ├── api.ts           # API configuration (baseURL, timeout)
│   └── app.ts           # App-wide settings
├── constants/           # Application constants
│   ├── api-endpoints.ts # API endpoint definitions
│   ├── routes.ts        # Route path constants
│   ├── storage-keys.ts  # localStorage/sessionStorage keys
│   ├── messages.ts      # UI messages
│   └── status.ts        # Status codes/enums
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
│   ├── utils.ts         # cn(), formatPrice(), formatDate()
│   ├── storage.ts       # Token/user storage utilities
│   ├── i18n.ts          # i18next configuration
│   └── env.ts           # Environment variable helpers
├── types/               # Shared TypeScript types
├── providers/           # React context providers
│   └── query-provider.tsx
├── containers/          # Container components (smart components)
├── locales/             # i18n translation files
│   └── en.json
├── style/               # Global styles
│   ├── tokens.css       # Design tokens (CSS variables)
│   ├── globals.css      # Global styles
│   ├── animations.css   # Animation definitions
│   └── fonts/           # Custom fonts
└── test/                # Test utilities and mocks
    ├── setup.ts         # Test environment setup
    ├── utils.tsx        # Test utilities
    └── mocks/           # MSW handlers and mock data
```

---

## 🎨 Code Style & Conventions

### TypeScript Rules

```typescript
// ✅ DO: Use explicit types and interfaces
interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "seller";
}

// ✅ DO: Use type for unions and intersections
type AuthState = "loading" | "authenticated" | "unauthenticated";
type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

// ✅ DO: Explicit return types for functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// ❌ DON'T: Never use `any` type
// ❌ DON'T: Avoid implicit any in function parameters
```

### React Component Patterns

```tsx
// ✅ DO: Use named exports for components
export const ProductCard = ({ product }: ProductCardProps) => {
  return <div>...</div>;
};

// ✅ DO: Use forwardRef for components that accept refs
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, intent, size, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ intent, size }), className)}
        {...props}
      />
    );
  },
);

// ✅ DO: Destructure props with TypeScript interface
interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
}

// ❌ DON'T: No class components allowed
// ❌ DON'T: Avoid prop drilling - use Zustand
```

### Styling with Tailwind + CVA

```tsx
// ✅ DO: Use CVA for component variants
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md font-medium",
    "transition-colors focus:outline-none focus:ring-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  {
    variants: {
      intent: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border border-neutral-20 bg-white hover:bg-neutral-5",
        danger: "bg-error text-error-foreground hover:bg-error/90",
      },
      size: {
        sm: "px-3 py-1.5 text-caption",
        md: "px-4 py-2 text-body",
        lg: "px-5 py-2.5 text-bodyLg",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  },
);

// ✅ DO: Use cn() for conditional class merging
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />;

// ✅ DO: Use design tokens from tokens.css
// Colors: primary, secondary, muted, neutral, success, warning, error
// Typography: text-h1, text-h2, text-body, text-caption
// Spacing: Use Tailwind spacing utilities
```

### State Management Patterns

```typescript
// ✅ DO: Zustand store pattern
import { create } from "zustand";

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

// ✅ DO: React Query for server state
export const PRODUCTS_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCTS_KEYS.all, "list"] as const,
  list: (params?: ProductsParams) =>
    [...PRODUCTS_KEYS.lists(), params] as const,
  detail: (id: string) => [...PRODUCTS_KEYS.all, "detail", id] as const,
};

export const useProducts = (params?: ProductsParams) => {
  return useQuery({
    queryKey: PRODUCTS_KEYS.list(params),
    queryFn: () => productService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### API Service Pattern

```typescript
// ✅ DO: Follow the established service pattern
// src/services/example.service.ts

// 1. Types Section
export interface Entity {
  id: string;
  // ...
}

// 2. API Functions Section
export const entityService = {
  getAll: (params?: Params): Promise<Response> =>
    api.get<Response>(API_ENDPOINTS.ENTITY.LIST, { params }),

  getById: (id: string): Promise<Entity> =>
    api.get<Entity>(API_ENDPOINTS.ENTITY.BY_ID(id)),

  create: (data: CreateData): Promise<Entity> =>
    api.post<Entity>(API_ENDPOINTS.ENTITY.CREATE, data),

  update: (id: string, data: UpdateData): Promise<Entity> =>
    api.put<Entity>(API_ENDPOINTS.ENTITY.UPDATE(id), data),

  delete: (id: string): Promise<void> =>
    api.delete<void>(API_ENDPOINTS.ENTITY.DELETE(id)),
};

// 3. Query Keys Section
export const ENTITY_KEYS = {
  all: ["entity"] as const,
  lists: () => [...ENTITY_KEYS.all, "list"] as const,
  // ...
};

// 4. React Query Hooks Section
export const useEntity = (id: string) => {
  return useQuery({
    queryKey: ENTITY_KEYS.detail(id),
    queryFn: () => entityService.getById(id),
  });
};
```

### Form Handling with React Hook Form + Zod

```tsx
// ✅ DO: Define Zod schemas with proper validation
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("email")} error={errors.email?.message} />
      <Input
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Button type="submit">Sign In</Button>
    </form>
  );
};
```

### Routing & Route Guards

```tsx
// ✅ DO: Use lazy loading for route components
const publicRoutes = [
  {
    index: true,
    lazy: async () => {
      const { default: HomePage } = await import("@/pages/HomePage/HomePage");
      return { Component: HomePage };
    },
  },
];

// ✅ DO: Use AuthGuard and RoleGuard for protected routes
<AuthGuard>
  <RoleGuard allowedRoles={["admin", "seller"]}>
    <AdminDashboard />
  </RoleGuard>
</AuthGuard>;
```

---

## 📝 Naming Conventions

| Type             | Convention                       | Example                                   |
| ---------------- | -------------------------------- | ----------------------------------------- |
| Components       | PascalCase                       | `ProductCard.tsx`                         |
| Pages            | PascalCase + Page suffix         | `HomePage.tsx`, `LoginPage.tsx`           |
| Hooks            | camelCase with `use` prefix      | `useAuth.ts`, `useProducts.ts`            |
| Zustand Stores   | camelCase with `use...Store`     | `useAuthStore.ts`, `useCartStore.ts`      |
| Services         | kebab-case with `.service`       | `auth.service.ts`, `product.service.ts`   |
| Utilities        | camelCase                        | `formatPrice.ts`, `cn.ts`                 |
| Constants        | SCREAMING_SNAKE_CASE             | `API_ENDPOINTS`, `STORAGE_KEYS`, `ROUTES` |
| Types/Interfaces | PascalCase                       | `User`, `Product`, `AuthState`            |
| CSS Variables    | kebab-case with `--` prefix      | `--primary`, `--font-size-body`           |
| Test Files       | Same name with `.test` suffix    | `Button.test.tsx`                         |
| Story Files      | Same name with `.stories` suffix | `Button.stories.tsx`                      |

---

## 🔌 Import Order & Path Aliases

```typescript
// ✅ DO: Use absolute imports with @ alias
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { cn } from "@/lib/utils";

// ✅ DO: Follow this import order
// 1. React and React-related
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 3. Local components
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";

// 4. Hooks, services, stores
import { useProducts } from "@/services/product.service";
import { useAuthStore } from "@/stores/useAuthStore";

// 5. Utils, constants, types
import { cn, formatPrice } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import type { Product, User } from "@/types";

// 6. Styles (if needed)
import "@/style/custom.css";
```

---

## ✅ Pre-Commit Checklist

Before committing, ensure all checks pass:

```powershell
# Format code
npm run format

# Check formatting
npm run check-format

# Run linting (zero warnings allowed)
npm run lint

# Type check
npm run type-check

# Run tests
npm run test:run

# Full validation (combines all above)
npm run validate
```

---

## 🧪 Testing Guidelines

```tsx
// ✅ DO: Use Testing Library with user-centric approach
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

---

## 📖 Storybook Documentation

```tsx
// ✅ DO: Document all component variants
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: "select",
      options: ["primary", "secondary", "outline", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    intent: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    intent: "secondary",
    children: "Secondary Button",
  },
};
```

---

## 🌐 Internationalization (i18n)

```tsx
// ✅ DO: Use translation keys for all user-facing strings
import { useTranslation } from 'react-i18next';

export const ChatHeader = () => {
  const { t } = useTranslation();

  return (
    <header>
      <h1>{t('chats.title')}</h1>
      <input placeholder={t('chats.searchPlaceholder')} />
    </header>
  );
};

// ✅ DO: Organize translations by feature in JSON files
// src/locales/en.json
{
  "chats": {
    "title": "Chats",
    "searchPlaceholder": "Search ...",
    "tabs": {
      "all": "All",
      "unread": "Unread"
    }
  }
}
```

---

## 🎨 Design Tokens Reference

Use these CSS custom properties defined in `src/style/tokens.css`:

### Colors

- `--primary` / `--primary-foreground` - Brand primary color
- `--secondary` / `--secondary-foreground` - Secondary accent
- `--muted` / `--muted-foreground` - Subdued elements
- `--neutral` / `--neutral-foreground` - Neutral tones
- `--success` / `--warning` / `--error` - Semantic colors

### Typography

- `--font-family-base` - Base font family
- `--font-size-h1` through `--font-size-label` - Font sizes
- Use Tailwind classes: `text-h1`, `text-body`, `text-caption`

### Spacing & Radius

- `--spacing-xs` through `--spacing-xl`
- `--radius-sm` through `--radius-xl`

---

## 💻 Terminal Commands (PowerShell)

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run Storybook
npm run storybook

# Navigate to a directory
Set-Location -Path "path/to/directory"

# Run full validation
npm run validate
```

---

## ⚠️ Important Rules

1. **No `any` types** - Always use proper TypeScript types
2. **No class components** - Functional components with hooks only
3. **No inline styles** - Use Tailwind CSS utilities only
4. **No default exports** - Except for page components (lazy loading requirement)
5. **Zero ESLint warnings** - All linting must pass with `--max-warnings=0`
6. **Use design tokens** - Reference CSS variables for consistency
7. **Handle all states** - Loading, error, empty states for async operations
8. **Use path aliases** - Always use `@/` for imports from `src/`
9. **Co-locate related files** - Keep tests and stories with components
10. **Follow query key patterns** - Use established patterns for React Query keys