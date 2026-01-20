export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  NOT_FOUND: '/404',
  ACCESS_DENIED: '/403',
} as const;

// Helper functions for dynamic routes
export const getProductRoute = (id: string) => `/products/${id}`;
export const getOrderRoute = (id: string) => `/orders/${id}`;