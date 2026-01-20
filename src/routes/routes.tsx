import { createBrowserRouter, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { AppLoading } from "@/components/feedback/loading/app-loading";
import { AppLayout } from "@/components/layout/app-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import { AuthGuard, RoleGuard } from "./guards";
import UnexpectedErrorPage from "@/pages/unexpected";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    errorElement: <UnexpectedErrorPage />,
    hydrateFallbackElement: <AppLoading />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: HomePage } = await import("@/pages/HomePage");
          return { Component: HomePage };
        },
      },
      {
        path: ROUTES.LOGIN,
        lazy: async () => {
          const { default: LoginPage } = await import("@/pages/LoginPage");
          return { Component: LoginPage };
        },
      },
      {
        path: ROUTES.REGISTER,
        lazy: async () => {
          const { default: RegisterPage } =
            await import("@/pages/RegisterPage");
          return { Component: RegisterPage };
        },
      },
      {
        path: ROUTES.PRODUCTS,
        lazy: async () => {
          const { default: ProductsPage } =
            await import("@/pages/ProductsPage");
          return { Component: ProductsPage };
        },
      },
      {
        path: ROUTES.PRODUCT_DETAIL,
        lazy: async () => {
          const { default: ProductDetailPage } =
            await import("@/pages/ProductDetailPage");
          return { Component: ProductDetailPage };
        },
      },
      {
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          {
            path: ROUTES.DASHBOARD,
            lazy: async () => {
              const { default: DashboardPage } =
                await import("@/pages/DashboardPage");
              return { Component: DashboardPage };
            },
          },
          {
            path: ROUTES.CART,
            lazy: async () => {
              const { default: CartPage } = await import("@/pages/CartPage");
              return { Component: CartPage };
            },
          },
          {
            path: ROUTES.CHECKOUT,
            lazy: async () => {
              const { default: CheckoutPage } =
                await import("@/pages/CheckoutPage");
              return { Component: CheckoutPage };
            },
          },
          {
            path: ROUTES.PROFILE,
            lazy: async () => {
              const { default: ProfilePage } =
                await import("@/pages/ProfilePage");
              return { Component: ProfilePage };
            },
          },
          {
            path: ROUTES.SETTINGS,
            lazy: async () => {
              const { default: SettingsPage } =
                await import("@/pages/SettingsPage");
              return { Component: SettingsPage };
            },
          },
          {
            path: ROUTES.ORDERS,
            lazy: async () => {
              const { default: OrdersPage } =
                await import("@/pages/OrdersPage");
              return { Component: OrdersPage };
            },
          },
          {
            path: ROUTES.ORDER_DETAIL,
            lazy: async () => {
              const { default: OrderDetailPage } =
                await import("@/pages/OrderDetailPage");
              return { Component: OrderDetailPage };
            },
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleGuard>
          </AuthGuard>
        ),
        hydrateFallbackElement: <AppLoading />,
        children: [
          {
            index: true,
            lazy: async () => {
              const { default: AdminOverviewPage } =
                await import("@/pages/AdminOverviewPage");
              return { Component: AdminOverviewPage };
            },
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    lazy: async () => {
      const { default: NotFoundPage } = await import("@/pages/not-found");
      return { Component: NotFoundPage };
    },
  },
  {
    path: ROUTES.ACCESS_DENIED,
    lazy: async () => {
      const { default: AccessDeniedPage } =
        await import("@/pages/access-denied");
      return { Component: AccessDeniedPage };
    },
  },
  {
    path: "*",
    lazy: async () => {
      const { default: NotFoundPage } = await import("@/pages/not-found");
      return { Component: NotFoundPage };
    },
  },
]);
