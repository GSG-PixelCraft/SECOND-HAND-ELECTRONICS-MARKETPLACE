import "../src/style/index.css";
import "../src/lib/i18n";

import type { Preview } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { QueryProvider } from "../src/providers";

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(
        QueryProvider,
        null,
        React.createElement(MemoryRouter, null, React.createElement(Story))
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
