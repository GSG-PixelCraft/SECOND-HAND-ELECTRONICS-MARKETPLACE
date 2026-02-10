import { createBrowserRouter, Outlet } from "react-router-dom";
import { AppLoading } from "@/components/feedback/loading/app-loading";
import { AppLayout } from "@/components/layout/app-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import { AuthGuard, RoleGuard } from "./guards";
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

const publicSimpleRoutes = [
  {
    path: "/test-identity-verification",
    lazy: async () => {
      const { default: IdentityVerificationSelectPage } =
        await import("@/pages/IdentityVerificationPage/IdentityVerificationSelectPage");
      return { Component: IdentityVerificationSelectPage };
    },
  },
  {
    path: "/forgot-password/email",
    lazy: async () => {
      const { default: ForgotPasswordEmailPage } =
        await import("@/pages/ForgotPasswordEmailPage/ForgotPasswordEmailPage");
      return { Component: ForgotPasswordEmailPage };
    },
  },
  {
    path: "/forgot-password/phone",
    lazy: async () => {
      const { default: ForgotPasswordPhonePage } =
        await import("@/pages/ForgotPasswordPhonePage/ForgotPasswordPhonePage");
      return { Component: ForgotPasswordPhonePage };
    },
  },
  {
    path: "/otp/email",
    lazy: async () => {
      const { default: OtpEmailPage } =
        await import("@/pages/OtpEmailPage/OtpEmailPage");
      return { Component: OtpEmailPage };
    },
  },
  {
    path: "/otp/phone",
    lazy: async () => {
      const { default: OtpPhonePage } =
        await import("@/pages/OtpPhonePage/OtpPhonePage");
      return { Component: OtpPhonePage };
    },
  },
  {
    path: "/change-password",
    lazy: async () => {
      const { default: ChangePasswordPage } =
        await import("@/pages/ChangePasswordPage/ChangePasswordPage");
      return { Component: ChangePasswordPage };
    },
  },
  {
    path: "/search",
    lazy: async () => {
      const { default: SearchPage } =
        await import("@/pages/SearchPage/SearchPage");
      return { Component: SearchPage };
    },
  },
  {
    path: "/recent-listings",
    lazy: async () => {
      const { default: RecentListingsPage } =
        await import("@/pages/RecentListingsPage/RecentListingsPage");
      return { Component: RecentListingsPage };
    },
  },

  {
    path: "/profile/:id",
    lazy: async () => {
      const { PublicProfilePage } =
        await import("@/pages/PublicProfilePage/PublicProfilePage");
      return { Component: PublicProfilePage };
    },
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
    path: "/verify/identity",
    lazy: async () => {
      const { default: IdentityVerificationSelectPage } =
        await import("@/pages/IdentityVerificationPage/IdentityVerificationSelectPage");
      return { Component: IdentityVerificationSelectPage };
    },
  },

  {
    path: "/chat",
    lazy: async () => {
      const { default: ChatPage } = await import("@/pages/ChatPage/ChatPage");
      return { Component: ChatPage };
    },
  },
  {
    path: "/blocked-users",
    lazy: async () => {
      const { default: BlockedUsersPage } =
        await import("@/pages/BlockedUsersPage/BlockedUsersPage");
      return { Component: BlockedUsersPage };
    },
  },
  {
    path: "/my-listings",
    lazy: async () => {
      const { default: MyListingsPage } =
        await import("@/pages/MyListingsPage/MyListingsPage");
      return { Component: MyListingsPage };
    },
  },
  {
    path: "/my-listings/category/:category",
    lazy: async () => {
      const { default: MyListingsPage } =
        await import("@/pages/MyListingsPage/MyListingsPage");
      return { Component: MyListingsPage };
    },
  },
  {
    path: "/listings/new",
    lazy: async () => {
      const { default: AddListingPage } =
        await import("@/pages/AddListingPage/AddListingPage");
      return { Component: AddListingPage };
    },
  },
  {
    path: "/favorites",
    lazy: async () => {
      const { default: FavoritesPage } =
        await import("@/pages/FavoritesPage/FavoritesPage");
      return { Component: FavoritesPage };
    },
  },
  {
    path: "/notifications",
    lazy: async () => {
      const { NotificationsPage } =
        await import("@/pages/NotificationsPage/NotificationPage");
      return { Component: NotificationsPage };
    },
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
      ...publicSimpleRoutes,
      {
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          ...protectedRoutes,
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
