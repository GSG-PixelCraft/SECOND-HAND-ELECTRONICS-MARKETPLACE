export const radius = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
} as const;

export type Radius = typeof radius;

export default radius;
