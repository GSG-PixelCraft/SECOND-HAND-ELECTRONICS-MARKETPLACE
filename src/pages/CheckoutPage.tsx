import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";

const CheckoutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">
        {t("checkout.title")}
      </h1>
      <p className="text-sm text-slate-600">{t("checkout.subtitle")}</p>
      <Link
        className="text-sm font-semibold text-slate-600 hover:text-slate-900"
        to={ROUTES.FAVORITES}
      >
        {t("checkout.back")}
      </Link>
    </div>
  );
};

export default CheckoutPage;
