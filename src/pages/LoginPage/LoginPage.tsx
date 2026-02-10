import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import Card from "@/components/ui/Card";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/PageTitle";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleDemoLogin = () => {
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
      <Card>
        <PageTitle subtitle="Sign in to your account">Login</PageTitle>
        <Button
          intent="primary"
          size="md"
          onClick={handleDemoLogin}
          type="button"
        >
          Demo Login
        </Button>
      </Card>
    </Container>
  );
};

export default LoginPage;
