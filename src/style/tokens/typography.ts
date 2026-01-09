export const typography = {
  fontFamily: {
    base: ["AG", "sans-serif"] as const,
  },

  fontSize: {
    h1: ["64px", { lineHeight: "64px", fontWeight: "700" }] as const,
    h2: ["48px", { lineHeight: "48px", fontWeight: "600" }] as const,
    h3: ["36px", { lineHeight: "36px", fontWeight: "500" }] as const,
    h4: ["28px", { lineHeight: "28px", fontWeight: "500" }] as const,
    h5: ["20px", { lineHeight: "20px", fontWeight: "500" }] as const,

    bodyLg: ["18px", { lineHeight: "18px", fontWeight: "400" }] as const,
    body: ["16px", { lineHeight: "16px", fontWeight: "400" }] as const,
    caption: ["14px", { lineHeight: "14px", fontWeight: "400" }] as const,
    label: ["12px", { lineHeight: "12px", fontWeight: "400" }] as const,
  },
} as const;

export type Typography = typeof typography;

export default typography;
