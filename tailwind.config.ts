export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        transparent: "transparent",
        neutral: "hsl(var(--neutral))",
        "neutral-5": "hsl(var(--neutral)/0.05)",
        "neutral-10": "hsl(var(--neutral)/0.1)",
        "neutral-20": "hsl(var(--neutral)/0.2)",
        "neutral-foreground": "hsl(var(--neutral-foreground))",
        primary: "hsl(var(--primary))",
        "primary-5": "hsl(var(--primary)/0.05)",
        "primary-10": "hsl(var(--primary)/0.1)",
        "primary-20": "hsl(var(--primary)/0.2)",
        "primary-40": "hsl(var(--primary)/0.4)",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-5": "hsl(var(--secondary)/0.05)",
        "secondary-10": "hsl(var(--secondary)/0.1)",
        "secondary-20": "hsl(var(--secondary)/0.2)",
        "secondary-40": "hsl(var(--secondary)/0.4)",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-5": "hsl(var(--muted)/0.05)",
        "muted-10": "hsl(var(--muted)/0.1)",
        "muted-20": "hsl(var(--muted)/0.2)",
        "muted-foreground": "hsl(var(--muted-foreground))",
        success: "hsl(var(--success))",
        "success-5": "hsl(var(--success)/0.05)",
        "success-10": "hsl(var(--success)/0.1)",
        "success-20": "hsl(var(--success)/0.2)",
        "success-foreground": "hsl(var(--success-foreground))",
        warning: "hsl(var(--warning))",
        "warning-5": "hsl(var(--warning)/0.05)",
        "warning-10": "hsl(var(--warning)/0.1)",
        "warning-20": "hsl(var(--warning)/0.2)",
        "warning-foreground": "hsl(var(--warning-foreground))",
        error: "hsl(var(--error))",
        "error-5": "hsl(var(--error)/0.05)",
        "error-10": "hsl(var(--error)/0.1)",
        "error-20": "hsl(var(--error)/0.2)",
        "error-foreground": "hsl(var(--error-foreground))",
      },
      fontFamily: {
        base: ["var(--font-family-base)", "sans-serif"],
      },
      fontSize: {
        h1: [
          "var(--font-size-h1)",
          {
            lineHeight: "var(--font-line-height-h1)",
            fontWeight: "var(--font-weight-h1)",
          },
        ],
        h2: [
          "var(--font-size-h2)",
          {
            lineHeight: "var(--font-line-height-h2)",
            fontWeight: "var(--font-weight-h2)",
          },
        ],
        h3: [
          "var(--font-size-h3)",
          {
            lineHeight: "var(--font-line-height-h3)",
            fontWeight: "var(--font-weight-h3)",
          },
        ],
        h4: [
          "var(--font-size-h4)",
          {
            lineHeight: "var(--font-line-height-h4)",
            fontWeight: "var(--font-weight-h4)",
          },
        ],
        h5: [
          "var(--font-size-h5)",
          {
            lineHeight: "var(--font-line-height-h5)",
            fontWeight: "var(--font-weight-h5)",
          },
        ],
        bodyLg: [
          "var(--font-size-body-lg)",
          {
            lineHeight: "var(--font-line-height-body-lg)",
            fontWeight: "var(--font-weight-body-lg)",
          },
        ],
        body: [
          "var(--font-size-body)",
          {
            lineHeight: "var(--font-line-height-body)",
            fontWeight: "var(--font-weight-body)",
          },
        ],
        caption: [
          "var(--font-size-caption)",
          {
            lineHeight: "var(--font-line-height-caption)",
            fontWeight: "var(--font-weight-caption)",
          },
        ],
        label: [
          "var(--font-size-label)",
          {
            lineHeight: "var(--font-line-height-label)",
            fontWeight: "var(--font-weight-label)",
          },
        ],
      },
    },
  },
};
