const colors = {
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  neutral: {
    DEFAULT: "hsl(var(--neutral))",
    20: "hsl(var(--neutral) / 0.2)",
    10: "hsl(var(--neutral) / 0.1)",
    5:  "hsl(var(--neutral) / 0.05)",
  },

  primary: {
    DEFAULT: "hsl(var(--primary))",
    40: "hsl(var(--primary) / 0.4)",
    20: "hsl(var(--primary) / 0.2)",
    10: "hsl(var(--primary) / 0.1)",
    5:  "hsl(var(--primary) / 0.05)",
    foreground: "hsl(var(--primary-foreground))",
  },

  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    40: "hsl(var(--secondary) / 0.4)",
    20: "hsl(var(--secondary) / 0.2)",
    10: "hsl(var(--secondary) / 0.1)",
    5:  "hsl(var(--secondary) / 0.05)",
    foreground: "hsl(var(--secondary-foreground))",
  },

  muted: {
    DEFAULT: "hsl(var(--muted))",
    20: "hsl(var(--muted) / 0.2)",
    10: "hsl(var(--muted) / 0.1)",
    5:  "hsl(var(--muted) / 0.05)",
    foreground: "hsl(var(--muted-foreground))",
  },

  success: {
    DEFAULT: "hsl(var(--success))",
    20: "hsl(var(--success) / 0.2)",
    10: "hsl(var(--success) / 0.1)",
    foreground: "hsl(var(--success-foreground))",
  },

  warning: {
    DEFAULT: "hsl(var(--warning))",
    20: "hsl(var(--warning) / 0.2)",
    10: "hsl(var(--warning) / 0.1)",
    foreground: "hsl(var(--warning-foreground))",
  },

  error: {
    DEFAULT: "hsl(var(--error))",
    20: "hsl(var(--error) / 0.2)",
    10: "hsl(var(--error) / 0.1)",
    foreground: "hsl(var(--error-foreground))",
  },
};

export default colors;
