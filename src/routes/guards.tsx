// Route guards
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthContext } from "@/providers";
import type { User } from "@/types";

interface AuthGuardProps {
  children: ReactNode;
}

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: User["role"][];
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} />;
};

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user } = useAuthContext();
  return allowedRoles.includes(user?.role ?? "user") ? (
    children
  ) : (
    <Navigate to={ROUTES.ACCESS_DENIED} />
  );
};
