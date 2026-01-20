import { useAuth } from "@/hooks/queries";
import { LoginView } from "@/components/auth";

export const LoginPage = () => {
  const { login, isLoading, error } = useAuth();

  return <LoginView onSubmit={login} isLoading={isLoading} error={error} />;
};
