// Environment variables validation
export const env = {
  API_URL: import.meta.env.VITE_API_URL,
  ENV: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
