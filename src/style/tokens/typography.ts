export const typography = {
  fontFamily: {
    base: ["AG", "sans-serif"] as const,
  },

  fontSize: {
    h1: ["64px", { lineHeight: "77px", fontWeight: "700" }] as const,
    h2: ["48px", { lineHeight: "58px", fontWeight: "600" }] as const,
    h3: ["36px", { lineHeight: "43px", fontWeight: "500" }] as const,
    h4: ["28px", { lineHeight: "34px", fontWeight: "500" }] as const,
    h5: ["20px", { lineHeight: "26px", fontWeight: "500" }] as const,

    bodyLg: ["18px", { lineHeight: "27px", fontWeight: "400" }] as const,
    body: ["16px", { lineHeight: "24px", fontWeight: "400" }] as const,
    caption: ["14px", { lineHeight: "21px", fontWeight: "400" }] as const,
    label: ["12px", { lineHeight: "18px", fontWeight: "400" }] as const,
  },
} as const;

export type Typography = typeof typography;

export default typography;
