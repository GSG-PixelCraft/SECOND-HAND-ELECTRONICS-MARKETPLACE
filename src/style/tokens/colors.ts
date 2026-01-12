// src/style/tokens/colors.ts
export const colors = {
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  // Neutral / Grays
  neutral: "hsl(var(--neutral))",
  "neutral-5": "hsl(var(--neutral)/0.05)",
  "neutral-10": "hsl(var(--neutral)/0.1)",
  "neutral-20": "hsl(var(--neutral)/0.2)",
  "neutral-foreground": "hsl(var(--neutral-foreground))",

  // Primary
  primary: "hsl(var(--primary))",
  "primary-5": "hsl(var(--primary)/0.05)",
  "primary-10": "hsl(var(--primary)/0.1)",
  "primary-20": "hsl(var(--primary)/0.2)",
  "primary-40": "hsl(var(--primary)/0.4)",
  "primary-foreground": "hsl(var(--primary-foreground))",

  // Secondary
  secondary: "hsl(var(--secondary))",
  "secondary-5": "hsl(var(--secondary)/0.05)",
  "secondary-10": "hsl(var(--secondary)/0.1)",
  "secondary-20": "hsl(var(--secondary)/0.2)",
  "secondary-40": "hsl(var(--secondary)/0.4)",
  "secondary-foreground": "hsl(var(--secondary-foreground))",

  // Muted
  muted: "hsl(var(--muted))",
  "muted-5": "hsl(var(--muted)/0.05)",
  "muted-10": "hsl(var(--muted)/0.1)",
  "muted-20": "hsl(var(--muted)/0.2)",
  "muted-foreground": "hsl(var(--muted-foreground))",

  // Success
  success: "hsl(var(--success))",
  "success-10": "hsl(var(--success)/0.1)",
  "success-20": "hsl(var(--success)/0.2)",
  "success-foreground": "hsl(var(--success-foreground))",

  // Warning
  warning: "hsl(var(--warning))",
  "warning-10": "hsl(var(--warning)/0.1)",
  "warning-20": "hsl(var(--warning)/0.2)",
  "warning-foreground": "hsl(var(--warning-foreground))",

  // Error
  error: "hsl(var(--error))",
  "error-10": "hsl(var(--error)/0.1)",
  "error-20": "hsl(var(--error)/0.2)",
  "error-foreground": "hsl(var(--error-foreground))",
} as const;

export type Colors = typeof colors;
