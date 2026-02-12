export * from "./verification";
export * from "./product";
export * from "./cart";
export * from "./order";
export * from "./admin";
export * from "./user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  identityVerified?: boolean;
}
