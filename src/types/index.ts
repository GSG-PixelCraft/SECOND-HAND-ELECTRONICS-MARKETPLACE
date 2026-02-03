export * from "./verification";

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
