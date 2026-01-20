import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const AdminLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          {t("nav.admin")}
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          {t("admin.title")}
        </h2>
        <p className="text-sm text-slate-600">{t("admin.subtitle")}</p>
      </div>
      <Outlet />
    </div>
  );
};
