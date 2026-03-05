export * from "./verification";
export * from "./product";
export * from "./category";
export * from "./cart";
export * from "./order";
export * from "./user";

export interface User {
  id: string;
  role: "buyer" | "seller" | "admin" | "user";
  name?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  identityVerified?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isIdentityVerified?: boolean;
}
