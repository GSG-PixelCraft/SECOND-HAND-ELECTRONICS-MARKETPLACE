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
  VERIFY: "/verify",
  PRODUCT_DETAIL: "/products/:id",
  CHAT: "/chat",
  BLOCKED_USERS: "/blocked-users",
  MY_LISTINGS: "/my-listings",
  MY_LISTINGS_CATEGORY: "/my-listings/category/:category",
  ADD_LISTING: "/listings/new",
  FAVORITES: "/favorites",
  NOTIFICATIONS: "/notifications",
  ADMIN_DASHBOARD: "/admin",
  NOT_FOUND: "/404",
  ACCESS_DENIED: "/403",
} as const;

// Helper functions for dynamic routes
export const getProductRoute = (id: string) => `/products/${id}`;
export const getPublicProfileRoute = (id: string) => `/profile/${id}`;
export const getMyListingsCategoryRoute = (category: string) =>
  `/my-listings/category/${category}`;
