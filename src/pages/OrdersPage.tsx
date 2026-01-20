import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getOrderRoute } from "@/constants/routes";

const OrdersPage = () => {
  const { t } = useTranslation();
  const demoOrders = ["o-1001", "o-1002"];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("orders.title")}
        </h1>
        <p className="text-sm text-slate-600">{t("orders.subtitle")}</p>
      </header>
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <ul className="space-y-3 text-sm text-slate-600">
          {demoOrders.map((orderId) => (
            <li
              key={orderId}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
            >
              <span>{orderId}</span>
              <Link
                className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                to={getOrderRoute(orderId)}
              >
                {t("orders.viewDetail")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersPage;
