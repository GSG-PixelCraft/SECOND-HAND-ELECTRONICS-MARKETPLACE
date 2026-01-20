import { useTranslation } from "react-i18next";

const AdminOverviewPage = () => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {t("admin.statsTitle")}
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">42</p>
        <p className="text-sm text-slate-600">{t("admin.metrics.listings")}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {t("admin.statsTitle")}
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">18</p>
        <p className="text-sm text-slate-600">{t("admin.metrics.reviews")}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {t("admin.statsTitle")}
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">7</p>
        <p className="text-sm text-slate-600">{t("admin.metrics.reports")}</p>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
