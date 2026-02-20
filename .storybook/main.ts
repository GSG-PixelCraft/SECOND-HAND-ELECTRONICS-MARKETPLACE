import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/pages/ProfilePage/**/*.stories.@(ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@": path.resolve(__dirname, "../src"),
        },
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        exclude: ["msw", "@vitest/mocker"],
      },
    };
  },
};

export default config;
// C:\SECOND-HAND-ELECTRONICS-MARKETPLACE\src\pages\ProfilePage\ProfilePage.stories.tsx
