export const typography = {
  fontFamily: {
    base: ["AG", "sans-serif"] as const,
  },

  fontSize: {
    h1: ["4rem", { lineHeight: "4.8125rem", fontWeight: "700" }] as const,
    h2: ["3rem", { lineHeight: "3.625rem", fontWeight: "600" }] as const,
    h3: ["2.25rem", { lineHeight: "2.6875rem", fontWeight: "500" }] as const,
    h4: ["1.75rem", { lineHeight: "2.125rem", fontWeight: "500" }] as const,
    h5: ["1.25rem", { lineHeight: "1.625rem", fontWeight: "500" }] as const,

    bodyLg: ["1.125rem", { lineHeight: "1.6875rem", fontWeight: "400" }] as const,
    body: ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }] as const,
    caption: ["0.875rem", { lineHeight: "1.3125rem", fontWeight: "400" }] as const,
    label: ["0.75rem", { lineHeight: "1.125rem", fontWeight: "400" }] as const,
  },
} as const;

export type Typography = typeof typography;

export default typography;
