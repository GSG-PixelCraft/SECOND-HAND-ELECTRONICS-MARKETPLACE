// Route guards
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types";

interface AuthGuardProps {
  children: ReactNode;
}

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: User["role"][];
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = Boolean(token);
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate
      to={ROUTES.SIGN_IN}
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
};

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user } = useAuthStore();
  return allowedRoles.includes(user?.role ?? "user") ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.ACCESS_DENIED} replace />
  );
};
