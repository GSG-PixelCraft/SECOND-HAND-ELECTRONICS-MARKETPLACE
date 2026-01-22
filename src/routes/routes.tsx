import { createBrowserRouter, Outlet } from "react-router-dom";
import { AppLoading } from "@/components/feedback/loading/app-loading";
import { AppLayout } from "@/components/layout/app-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import { AuthGuard, RoleGuard } from "./guards";
import PageLayout from "@/components/layout/PageLayout";
import UnexpectedErrorPage from "@/pages/UnexpectedPage/UnexpectedPage";

// Route configuration arrays
const publicRoutes = [
  {
    index: true,
    lazy: async () => {
      const { default: HomePage } = await import("@/pages/HomePage/HomePage");
      return { Component: HomePage };
    },
  },
  {
    path: "/signin",
    lazy: async () => {
      const { default: LoginPage } =
        await import("@/pages/LoginPage/LoginPage");
      return { Component: LoginPage };
    },
  },
  {
    path: "/signup",
    lazy: async () => {
      const { default: RegisterPage } =
        await import("@/pages/RegisterPage/RegisterPage");
      return { Component: RegisterPage };
    },
  },
  {
    path: "/products/:id",
    lazy: async () => {
      const { default: ProductDetailPage } =
        await import("@/pages/ProductDetailPage/ProductDetailPage");
      return { Component: ProductDetailPage };
    },
  },
];

const simpleScreenRoutes = [
  {
    path: "/forgot-password/email",
    title: "Forgot password (email)",
  },
  {
    path: "/forgot-password/phone",
    title: "Forgot password (phone)",
  },
  {
    path: "/otp/email",
    title: "OTP (email)",
  },
  {
    path: "/otp/phone",
    title: "OTP (phone)",
  },
  {
    path: "/search",
    title: "Search",
  },
  {
    path: "/recent-listings",
    title: "Recent listings",
  },
  {
    path: "/profile/:id",
    title: "Public profile",
  },
  {
    path: "/verify",
    title: "Verify",
  },
];

const protectedRoutes = [
  {
    path: "/profile",
    lazy: async () => {
      const { default: ProfilePage } =
        await import("@/pages/ProfilePage/ProfilePage");
      return { Component: ProfilePage };
    },
  },
  {
    path: "/change-password",
    title: "Change password",
  },
  {
    path: "/chat",
    title: "Chat",
  },
  {
    path: "/blocked-users",
    title: "Blocked users",
  },
  {
    path: "/my-listings",
    title: "All my listings",
  },
  {
    path: "/my-listings/category/:category",
    title: "Listings by category",
  },
  {
    path: "/listings/new",
    title: "Add listing",
  },
  {
    path: "/favorites",
    title: "Favorites",
  },
  {
    path: "/notifications",
    title: "Notifications",
  },
];

const adminRoutes = [
  {
    index: true,
    lazy: async () => {
      const { default: AdminOverviewPage } =
        await import("@/pages/AdminOverviewPage/AdminOverviewPage");
      return { Component: AdminOverviewPage };
    },
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <UnexpectedErrorPage />,
    hydrateFallbackElement: <AppLoading />,
    children: [
      ...publicRoutes,
      ...simpleScreenRoutes.map(({ path, title }) => ({
        path,
        element: (
          <PageLayout title={title} maxWidth="4xl" showPlaceholder={true}>
            {/* Placeholder content */}
          </PageLayout>
        ),
      })),
      {
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          ...protectedRoutes.map((route) => {
            if (route.lazy) {
              return route;
            }
            return {
              path: route.path,
              element: (
                <PageLayout
                  title={route.title}
                  maxWidth="3xl"
                  showPlaceholder={true}
                >
                  {/* Placeholder content */}
                </PageLayout>
              ),
            };
          }),
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
            children: adminRoutes,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    lazy: async () => {
      const { default: NotFoundPage } =
        await import("@/pages/NotFoundPage/NotFoundPage");
      return { Component: NotFoundPage };
    },
  },
]);
