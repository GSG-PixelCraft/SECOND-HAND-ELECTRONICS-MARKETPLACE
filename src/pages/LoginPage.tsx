import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthContext } from "@/providers";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthContext();

  const handleDemoLogin = () => {
    setUser({
      id: "demo-user",
      name: t("demo.userName"),
      email: "demo@marketplace.dev",
      role: "user",
    });
    setToken("demo-token");
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("auth.loginTitle")}
        </h1>
        <p className="text-sm text-slate-600">{t("auth.loginSubtitle")}</p>
      </div>
      <button
        className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        onClick={handleDemoLogin}
        type="button"
      >
        {t("auth.demoCta")}
      </button>
    </div>
  );
};

export default LoginPage;
