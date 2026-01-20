import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";
import { useThemeContext } from "@/providers";
import { useAuthStore } from "@/stores/useAuthStore";

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, token, setUser, setToken, logout } = useAuthStore();
  const isAuthenticated = Boolean(user && token);
  const { toggleTheme } = useThemeContext();

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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <NavLink
          to={ROUTES.HOME}
          className="text-lg font-semibold text-slate-900"
        >
          {t("nav.brand")}
        </NavLink>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to={ROUTES.HOME} className={linkClassName}>
            {t("nav.home")}
          </NavLink>
          <NavLink to={ROUTES.PRODUCTS} className={linkClassName}>
            {t("nav.products")}
          </NavLink>
          <NavLink to={ROUTES.CART} className={linkClassName}>
            {t("nav.cart")}
          </NavLink>
          <NavLink to={ROUTES.DASHBOARD} className={linkClassName}>
            {t("nav.dashboard")}
          </NavLink>
          <NavLink to="/admin" className={linkClassName}>
            {t("nav.admin")}
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            onClick={toggleTheme}
            type="button"
          >
            {t("nav.theme")}
          </button>
          {isAuthenticated ? (
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={logout}
              type="button"
            >
              {t("nav.logout")}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to={ROUTES.LOGIN} className={linkClassName}>
                {t("nav.login")}
              </NavLink>
              <button
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                onClick={handleDemoLogin}
                type="button"
              >
                {t("auth.demoCta")}
              </button>
            </div>
          )}
          {user ? (
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 md:inline-flex">
              {user.name}
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
};
