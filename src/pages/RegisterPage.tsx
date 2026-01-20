import { useAuth } from "@/hooks/queries";
import { RegisterView } from "@/components/auth";

export const RegisterPage = () => {
  const { register, isLoading, error } = useAuth();

  return (
    <RegisterView onSubmit={register} isLoading={isLoading} error={error} />
  );
};
