import { createBrowserRouter } from "react-router-dom";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { AppLayout } from "@/components/layout/app-layout";
import UnexpectedErrorPage from "@/pages/UnexpectedPage/UnexpectedPage";

const routeHydrateFallback = <FullScreenLoading />;

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
      const { default: PublicProfilePage } =
        await import("@/pages/PublicProfilePage/PublicProfilePage");
      return { Component: PublicProfilePage };
    },
  },
  {
    path: "/verify",
    lazy: async () => {
      const { default: VerifyPage } =
        await import("@/pages/VerifyPage/VerifyPage");
      return { Component: VerifyPage };
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
    path: "/settings",
    lazy: async () => {
      const { default: SettingsPage } =
        await import("@/pages/SettingsPage/SettingsPage");
      return { Component: SettingsPage };
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

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      children: [...publicRoutes, ...publicSimpleRoutes, ...protectedRoutes],
    },
    {
      path: "/admin",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [{ default: AdminOverviewPage }, { AdminDashboardLayout }] =
          await Promise.all([
            import("@/pages/AdminOverviewPage/AdminOverviewPage"),
            import("@/components/layout/AdminDashboardLayout"),
          ]);
        return {
          Component: () => (
            <AdminDashboardLayout>
              <AdminOverviewPage />
            </AdminDashboardLayout>
          ),
        };
      },
    },
    {
      path: "/admin/listings",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: AdminListingsPage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminListingsPage/AdminListingsPage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <AdminListingsPage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/admin/listings/:id",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: AdminListingDetailPage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminListingsPage/components/detail/AdminListingDetailPage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <AdminListingDetailPage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/admin/reports",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: AdminReportsPage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminReportsPage/AdminReportsPage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <AdminReportsPage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/admin/reports/:type/:id",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: AdminReportDetailPage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminReportsPage/components/detail/AdminReportDetailPage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <AdminReportDetailPage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/admin/categories",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: AdminCategoriesPage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminCategoriesPage/AdminCategoriesPage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <AdminCategoriesPage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/admin/categories/add",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: AddCategoryPage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminCategoriesPage/AddCategoryPage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <AddCategoryPage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/admin/categories/:id/edit",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: EditCategoryPage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminCategoriesPage/EditCategoryPage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <EditCategoryPage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/admin/verifications",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: AdminVerificationQueuePage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminVerificationQueuePage/AdminVerificationQueuePage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <AdminVerificationQueuePage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/admin/verifications/:id",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: AdminVerificationReviewPage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminVerificationQueuePage/components/review/AdminVerificationReviewPage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <AdminVerificationReviewPage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/admin/users",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: AdminUsersPage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminUsersPage/AdminUsersPage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <AdminUsersPage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/admin/users/:id",
      errorElement: <UnexpectedErrorPage />,
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const [
          { default: AdminUserDetailPage },
          { AdminDashboardLayout },
          { AdminGuard },
        ] = await Promise.all([
          import("@/pages/AdminUsersPage/components/detail/AdminUserDetailPage"),
          import("@/components/layout/AdminDashboardLayout"),
          import("@/routes/access-control"),
        ]);
        return {
          Component: () => (
            <AdminGuard>
              <AdminDashboardLayout>
                <AdminUserDetailPage />
              </AdminDashboardLayout>
            </AdminGuard>
          ),
        };
      },
    },
    {
      path: "/403",
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const { default: AccessDeniedPage } =
          await import("@/pages/AccessDeniedPage/AccessDeniedPage");
        return { Component: AccessDeniedPage };
      },
    },
    {
      path: "*",
      hydrateFallbackElement: routeHydrateFallback,
      lazy: async () => {
        const { default: NotFoundPage } =
          await import("@/pages/NotFoundPage/NotFoundPage");
        return { Component: NotFoundPage };
      },
    },
  ],
  {
    future: {
      v7_partialHydration: true,
    },
  },
);
