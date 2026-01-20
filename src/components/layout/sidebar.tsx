import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";

const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <aside className="hidden w-64 flex-col gap-6 border-r border-slate-200 bg-white px-5 py-8 lg:flex">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {t("nav.home")}
        </p>
        <nav className="flex flex-col gap-2">
          <NavLink to={ROUTES.HOME} className={sidebarLinkClass}>
            {t("nav.home")}
          </NavLink>
          <NavLink to={ROUTES.RECENT_LISTINGS} className={sidebarLinkClass}>
            {t("nav.products")}
          </NavLink>
          <NavLink to={ROUTES.FAVORITES} className={sidebarLinkClass}>
            {t("nav.cart")}
          </NavLink>
          <NavLink to={ROUTES.MY_LISTINGS} className={sidebarLinkClass}>
            {t("nav.dashboard")}
          </NavLink>
        </nav>
      </div>
      <div className="rounded-3xl bg-slate-900 px-5 py-6 text-white">
        <p className="text-sm font-semibold">{t("home.highlightsTitle")}</p>
        <ul className="mt-3 space-y-2 text-xs text-slate-200">
          <li>{t("home.highlights.trusted")}</li>
          <li>{t("home.highlights.shipping")}</li>
          <li>{t("home.highlights.support")}</li>
        </ul>
      </div>
    </aside>
  );
};
