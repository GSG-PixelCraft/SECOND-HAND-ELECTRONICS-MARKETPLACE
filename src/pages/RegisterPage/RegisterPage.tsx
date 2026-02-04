import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/PageTitle";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleDemoRegister = () => {
    setUser({
      id: "demo-user",
      name: "Demo User",
      email: "demo@marketplace.dev",
      role: "user",
    });
    setToken("demo-token");
    navigate(ROUTES.PROFILE);
  };

  return (
    <Container maxWidth="lg" className="flex flex-col gap-6">
      <PageTitle subtitle="Create your account">Register</PageTitle>
      <Button
        intent="primary"
        size="md"
        onClick={handleDemoRegister}
        type="button"
      >
        Demo Register
      </Button>
    </Container>
  );
};

export default RegisterPage;
