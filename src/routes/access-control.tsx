import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/useAuthStore";
import { ROUTES } from "@/constants/routes";

// Admin role guard hook
export const useAdminGuard = () => {
  const user = useAuthStore((state) => state.user);

  // TODO: Remove this temporary bypass when auth is fully implemented
  // For now, allow access for testing the admin UI
  const isAdmin = true; // Temporarily disabled: user?.role === "admin"
  const isLoading = false; // In a real app, this might check auth status

  return {
    isAdmin,
    isLoading,
    user,
  };
};

// Admin guard component
export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAdminGuard();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-neutral">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.ACCESS_DENIED} replace />;
  }

  return <>{children}</>;
};

// Legacy commented out code preserved below for reference
// ============================================================================

// ! Do not use it

// Permissions and roles
// export const ROLES = {
//   USER: 'user',
//   ADMIN: 'admin',
//   SELLER: 'seller',
// } as const

// export const PERMISSIONS = {
//   CREATE_PRODUCT: 'create:product',
//   DELETE_PRODUCT: 'delete:product',
//   MANAGE_USERS: 'manage:users',
// } as const

// export const rolePermissions = {
//   [ROLES.USER]: [],
//   [ROLES.SELLER]: [PERMISSIONS.CREATE_PRODUCT],
//   [ROLES.ADMIN]: [PERMISSIONS.CREATE_PRODUCT, PERMISSIONS.MANAGE_USERS],
// }
