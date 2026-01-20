import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES, getProductRoute } from "@/constants/routes";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/lib/utils";

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);

  const product = useMemo(
    () => ({
      id: id ?? "p-101",
      name: 'MacBook Pro 14" M2',
      price: 1650,
      condition: "like-new",
      sellerRating: 4.9,
    }),
    [id],
  );

  const handleAddToCart = () => {
    addItem({ productId: product.id, quantity: 1, price: product.price });
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <header className="space-y-2">
        <Link
          className="text-sm font-semibold text-slate-500 hover:text-slate-700"
          to={ROUTES.PRODUCTS}
        >
          {t("product.backToProducts")}
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("product.detailTitle")}
        </h1>
        <p className="text-sm text-slate-600">{t("product.detailSubtitle")}</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {product.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {t("product.condition.likeNew")}
            </span>
            <span>
              {t("demo.seller")}: {product.sellerRating}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-slate-900">
              {formatPrice(product.price)}
            </span>
            <button
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={handleAddToCart}
              type="button"
            >
              {t("product.addToCart")}
            </button>
          </div>
        </div>
      </section>

      <Link
        className="text-sm font-semibold text-slate-500 hover:text-slate-700"
        to={getProductRoute(product.id)}
      >
        {t("products.viewDetails")}
      </Link>
    </div>
  );
};

export default ProductDetailPage;
