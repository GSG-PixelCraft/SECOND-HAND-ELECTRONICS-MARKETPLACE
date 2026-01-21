// User-facing messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: "Successfully logged in",
    PRODUCT_CREATED: "Product created successfully",
    ORDER_PLACED: "Order placed successfully",
  },
  ERROR: {
    GENERIC: "Something went wrong",
    NETWORK: "Network error. Please try again",
    UNAUTHORIZED: "You must be logged in",
  },
} as const;
