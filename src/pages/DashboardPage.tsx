// User dashboard
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("dashboard.title")}
        </h1>
        <p className="text-sm text-slate-600">{t("dashboard.subtitle")}</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {t("dashboard.cardTitle")}
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Link
            className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            to={ROUTES.PRODUCTS}
          >
            {t("dashboard.actionSell")}
          </Link>
          <Link
            className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            to={ROUTES.ORDERS}
          >
            {t("dashboard.actionOrders")}
          </Link>
          <Link
            className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            to={ROUTES.PROFILE}
          >
            {t("dashboard.actionProfile")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
