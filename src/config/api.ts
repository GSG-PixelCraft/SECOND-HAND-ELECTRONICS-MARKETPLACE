// API configuration
export const apiConfig = {
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "/api" : "https://gsg-project-group-6.onrender.com"),
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 60000),
  headers: {
    "Content-Type": "application/json",
  },
  retries: 3,
};
