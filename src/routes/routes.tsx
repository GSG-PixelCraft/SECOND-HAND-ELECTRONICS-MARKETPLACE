import type { ReactElement } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppLoading } from "@/components/feedback/loading/app-loading";
import { AppLayout } from "@/components/layout/app-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import { AuthGuard, RoleGuard } from "./guards";
import UnexpectedErrorPage from "@/pages/unexpected";

interface SimpleScreenProps {
  titleKey: string;
  defaultTitle: string;
}

const SimpleScreen = ({
  titleKey,
  defaultTitle,
}: SimpleScreenProps): ReactElement => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <section className="rounded-3xl bg-white px-8 py-10 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          {t(titleKey, { defaultValue: defaultTitle })}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t("screens.placeholderSubtitle", {
            defaultValue: "Screen setup placeholder.",
          })}
        </p>
      </section>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
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
        path: "/signin",
        lazy: async () => {
          const { default: LoginPage } = await import("@/pages/LoginPage");
          return { Component: LoginPage };
        },
      },
      {
        path: "/signup",
        lazy: async () => {
          const { default: RegisterPage } =
            await import("@/pages/RegisterPage");
          return { Component: RegisterPage };
        },
      },
      {
        path: "/forgot-password/email",
        element: (
          <SimpleScreen
            titleKey="screens.forgotPasswordEmail"
            defaultTitle="Forgot password (email)"
          />
        ),
      },
      {
        path: "/forgot-password/phone",
        element: (
          <SimpleScreen
            titleKey="screens.forgotPasswordPhone"
            defaultTitle="Forgot password (phone)"
          />
        ),
      },
      {
        path: "/otp/email",
        element: (
          <SimpleScreen
            titleKey="screens.otpEmail"
            defaultTitle="OTP (email)"
          />
        ),
      },
      {
        path: "/otp/phone",
        element: (
          <SimpleScreen
            titleKey="screens.otpPhone"
            defaultTitle="OTP (phone)"
          />
        ),
      },
      {
        path: "/search",
        element: (
          <SimpleScreen titleKey="screens.search" defaultTitle="Search" />
        ),
      },
      {
        path: "/recent-listings",
        element: (
          <SimpleScreen
            titleKey="screens.recentListings"
            defaultTitle="Recent listings"
          />
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <SimpleScreen
            titleKey="screens.publicProfile"
            defaultTitle="Public profile"
          />
        ),
      },
      {
        path: "/verify",
        element: (
          <SimpleScreen titleKey="screens.verify" defaultTitle="Verify" />
        ),
      },
      {
        path: "/products/:id",
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
            path: "/profile",
            lazy: async () => {
              const { default: ProfilePage } =
                await import("@/pages/ProfilePage");
              return { Component: ProfilePage };
            },
          },
          {
            path: "/change-password",
            element: (
              <SimpleScreen
                titleKey="screens.changePassword"
                defaultTitle="Change password"
              />
            ),
          },
          {
            path: "/chat",
            element: (
              <SimpleScreen titleKey="screens.chat" defaultTitle="Chat" />
            ),
          },
          {
            path: "/blocked-users",
            element: (
              <SimpleScreen
                titleKey="screens.blockedUsers"
                defaultTitle="Blocked users"
              />
            ),
          },
          {
            path: "/my-listings",
            element: (
              <SimpleScreen
                titleKey="screens.myListings"
                defaultTitle="All my listings"
              />
            ),
          },
          {
            path: "/my-listings/category/:category",
            element: (
              <SimpleScreen
                titleKey="screens.myListingsCategory"
                defaultTitle="Listings by category"
              />
            ),
          },
          {
            path: "/listings/new",
            element: (
              <SimpleScreen
                titleKey="screens.addListing"
                defaultTitle="Add listing"
              />
            ),
          },
          {
            path: "/favorites",
            element: (
              <SimpleScreen
                titleKey="screens.favorites"
                defaultTitle="Favorites"
              />
            ),
          },
          {
            path: "/notifications",
            element: (
              <SimpleScreen
                titleKey="screens.notifications"
                defaultTitle="Notifications"
              />
            ),
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
    path: "*",
    lazy: async () => {
      const { default: NotFoundPage } = await import("@/pages/not-found");
      return { Component: NotFoundPage };
    },
  },
]);
