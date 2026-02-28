import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Some environments inject a dead local proxy (127.0.0.1:9) that breaks Vite's backend proxy.
if (process.env.HTTPS_PROXY?.includes("127.0.0.1:9")) {
  delete process.env.HTTPS_PROXY;
  delete process.env.https_proxy;
}
if (process.env.HTTP_PROXY?.includes("127.0.0.1:9")) {
  delete process.env.HTTP_PROXY;
  delete process.env.http_proxy;
}

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
        // Backend endpoints are rooted at '/'; remove '/api' prefix in dev
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
