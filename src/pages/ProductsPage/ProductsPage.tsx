import { Link } from "react-router-dom";
import { useMemo } from "react";
import { getProductRoute } from "@/constants/routes";
import { formatPrice } from "@/lib/utils";

interface DemoProduct {
  id: string;
  name: string;
  price: number;
  condition: "new" | "like-new" | "good" | "fair";
  category: string;
}

const ProductsPage = () => {
  const products = useMemo<DemoProduct[]>(
    () => [
      {
        id: "p-101",
        name: 'MacBook Pro 14" M2',
        price: 1650,
        condition: "like-new",
        category: "Laptops",
      },
      {
        id: "p-102",
        name: "PlayStation 5 Digital Edition",
        price: 360,
        condition: "good",
        category: "Gaming",
      },
      {
        id: "p-103",
        name: "Samsung Galaxy S23 Ultra",
        price: 820,
        condition: "fair",
        category: "Phones",
      },
    ],
    [],
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <p className="text-sm text-slate-600">
          Browse our selection of second-hand electronics
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {product.category}
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                {product.name}
              </h2>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Condition</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {product.condition === "like-new"
                  ? "Like New"
                  : product.condition.charAt(0).toUpperCase() +
                    product.condition.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-slate-900">
                {formatPrice(product.price)}
              </span>
              <Link
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                to={getProductRoute(product.id)}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
