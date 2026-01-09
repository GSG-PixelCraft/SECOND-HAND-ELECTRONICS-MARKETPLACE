import colors from "./src/style/tokens/colors";
import { typography } from "./src/style/tokens/typography";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        "muted-foreground": colors.muted.foreground, 
      },
      fontFamily: {
        base: typography.fontFamily.base,
      },
      fontSize: {
        h1: [typography.fontSize.h1.size, { lineHeight: typography.fontSize.h1.lineHeight, fontWeight: typography.fontSize.h1.fontWeight }],
        h2: [typography.fontSize.h2.size, { lineHeight: typography.fontSize.h2.lineHeight, fontWeight: typography.fontSize.h2.fontWeight }],
        h3: [typography.fontSize.h3.size, { lineHeight: typography.fontSize.h3.lineHeight, fontWeight: typography.fontSize.h3.fontWeight }],
        h4: [typography.fontSize.h4.size, { lineHeight: typography.fontSize.h4.lineHeight, fontWeight: typography.fontSize.h4.fontWeight }],
        h5: [typography.fontSize.h5.size, { lineHeight: typography.fontSize.h5.lineHeight, fontWeight: typography.fontSize.h5.fontWeight }],
        bodyLg: [typography.fontSize.bodyLg.size, { lineHeight: typography.fontSize.bodyLg.lineHeight, fontWeight: typography.fontSize.bodyLg.fontWeight }],
        body: [typography.fontSize.body.size, { lineHeight: typography.fontSize.body.lineHeight, fontWeight: typography.fontSize.body.fontWeight }],
        caption: [typography.fontSize.caption.size, { lineHeight: typography.fontSize.caption.lineHeight, fontWeight: typography.fontSize.caption.fontWeight }],
        label: [typography.fontSize.label.size, { lineHeight: typography.fontSize.label.lineHeight, fontWeight: typography.fontSize.label.fontWeight }],
      },
    },
  },
};
