import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import Container from "@/components/layout/Container";

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
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Register</h1>
        <p className="text-sm text-slate-600">Create your account</p>
      </div>
      <button
        className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        onClick={handleDemoRegister}
        type="button"
      >
        Demo Register
      </button>
    </Container>
  );
};

export default RegisterPage;
