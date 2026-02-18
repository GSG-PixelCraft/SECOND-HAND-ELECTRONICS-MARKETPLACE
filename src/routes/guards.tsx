// // Route guards
// import type { ReactNode } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { ROUTES } from "@/constants/routes";
// import { useAuthStore } from "@/stores/useAuthStore";
// import type { User } from "@/types";

// interface AuthGuardProps {
//   children: ReactNode;
// }

// interface RoleGuardProps {
//   children: ReactNode;
//   allowedRoles: User["role"][];
// }

// export const AuthGuard = ({ children }: AuthGuardProps) => {
//   const location = useLocation();
//   const isDemoMode = new URLSearchParams(location.search).get("demo") === "1";
//   const { user, token } = useAuthStore();
//   const isAuthenticated = Boolean(user && token);
//   return isAuthenticated || isDemoMode ? (
//     children
//   ) : (
//     <Navigate to={ROUTES.SIGN_IN} />
//   );
// };

// export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
//   const location = useLocation();
//   const isDemoMode = new URLSearchParams(location.search).get("demo") === "1";
//   const { user } = useAuthStore();
//   return allowedRoles.includes(user?.role ?? "user") || isDemoMode ? (
//     children
//   ) : (
//     <Navigate to={ROUTES.ACCESS_DENIED} />
//   );
// };
