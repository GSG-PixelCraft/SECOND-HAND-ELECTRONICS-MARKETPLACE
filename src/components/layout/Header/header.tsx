import { useAuthStore } from "@/stores/useAuthStore";
import { AuthenticatedHeader } from "./AuthenticatedHeader";
import { GuestHeader } from "./GuestHeader";

export const Header = () => {
  const { user, token } = useAuthStore();
  const isAuthenticated = Boolean(user && token);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      {isAuthenticated ? <AuthenticatedHeader /> : <GuestHeader />}
    </header>
  );
};
