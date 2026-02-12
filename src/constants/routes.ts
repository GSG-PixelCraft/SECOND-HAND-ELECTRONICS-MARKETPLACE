export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  FORGOT_PASSWORD_EMAIL: "/forgot-password/email",
  FORGOT_PASSWORD_PHONE: "/forgot-password/phone",
  OTP_EMAIL: "/otp/email",
  OTP_PHONE: "/otp/phone",
  CHANGE_PASSWORD: "/change-password",
  SEARCH: "/search",
  RECENT_LISTINGS: "/recent-listings",
  PUBLIC_PROFILE: "/profile/:id",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  VERIFY: "/verify",
  VERIFY_IDENTITY: "/verify/identity",
  VERIFY_IDENTITY_UPLOAD: "/verify/identity/upload",
  VERIFY_IDENTITY_STATUS: "/verify/identity/status",
  VERIFY_PHONE: "/verify/phone",
  VERIFY_PHONE_OTP: "/verify/phone/otp",
  VERIFY_PHONE_CHANGE: "/verify/phone/change",
  VERIFY_PHONE_CHANGE_OTP: "/verify/phone/change/otp",
  VERIFY_EMAIL: "/verify/email",
  VERIFY_EMAIL_OTP: "/verify/email/otp",
  PRODUCT_DETAIL: "/products/:id",
  CHAT: "/chat",
  BLOCKED_USERS: "/blocked-users",
  MY_LISTINGS: "/my-listings",
  MY_LISTINGS_CATEGORY: "/my-listings/category/:category",
  ADD_LISTING: "/listings/new",
  FAVORITES: "/favorites",
  NOTIFICATIONS: "/notifications",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_VERIFICATIONS: "/admin/verifications",
  ADMIN_VERIFICATION_REVIEW: "/admin/verifications/:id",
  ADMIN_USERS: "/admin/users",
  ADMIN_USER_DETAIL: "/admin/users/:id",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_REPORT_DETAIL: "/admin/reports/:type/:id",
  ADMIN_CATEGORIES: "/admin/categories",
  NOT_FOUND: "/404",
  ACCESS_DENIED: "/403",
} as const;

// Helper functions for dynamic routes
export const getProductRoute = (id: string) => `/products/${id}`;
export const getPublicProfileRoute = (id: string) => `/profile/${id}`;
export const getMyListingsCategoryRoute = (category: string) =>
  `/my-listings/category/${category}`;
export const getAdminVerificationReviewRoute = (id: string) =>
  `/admin/verifications/${id}`;
export const getAdminUserDetailRoute = (id: string) => `/admin/users/${id}`;
export const getAdminReportDetailRoute = (type: string, id: string) =>
  `/admin/reports/${type}/${id}`;
