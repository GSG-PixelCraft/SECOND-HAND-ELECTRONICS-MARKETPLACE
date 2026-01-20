import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/lib/utils";

const CartPage = () => {
  const { t } = useTranslation();
  const { items, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("cart.emptyTitle")}
        </h1>
        <p className="text-sm text-slate-600">{t("cart.emptySubtitle")}</p>
        <Link
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          to={ROUTES.RECENT_LISTINGS}
        >
          {t("home.ctaPrimary")}
        </Link>
      </div>
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("cart.title")}
        </h1>
      </header>
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <ul className="space-y-3 text-sm text-slate-700">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
            >
              <span>{item.productId}</span>
              <span>{formatPrice(item.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between text-sm font-semibold text-slate-900">
          <span>{t("demo.price")}</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            onClick={clearCart}
            type="button"
          >
            {t("cart.clear")}
          </button>
          <button
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            type="button"
          >
            {t("cart.checkout")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
