import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      msw: fileURLToPath(new URL("./src/test/mocks/msw.ts", import.meta.url)),
      "msw/node": fileURLToPath(
        new URL("./src/test/mocks/msw-node.ts", import.meta.url),
      ),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://gsg-project-group-6.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  test: {
    environment: "jsdom",
  },
});
