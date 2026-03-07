// Landing page
import { useAuthStore } from "@/stores/useAuthStore";
import { GuestHomeContent } from "./GuestHomeContent";
import { AuthenticatedHomeContent } from "./AuthenticatedHomeContent";

const HomePage = () => {
  const { user, token } = useAuthStore();
  const isAuthenticated = Boolean(user && token);

  return isAuthenticated ? <AuthenticatedHomeContent /> : <GuestHomeContent />;
};

export default HomePage;
