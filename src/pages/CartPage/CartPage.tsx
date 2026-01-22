import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/lib/utils";

const CartPage = () => {
  const { items, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Your cart is empty
        </h1>
        <p className="text-sm text-slate-600">
          Start adding some items to your cart
        </p>
        <Link
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          to={ROUTES.RECENT_LISTINGS}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Shopping Cart</h1>
        <p className="text-sm text-slate-600">
          You have {items.length} {items.length === 1 ? "item" : "items"} in
          your cart
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
          >
            <div className="h-16 w-16 rounded-lg bg-slate-100" />
            <div className="flex-1">
              <h3 className="font-medium text-slate-900">{item.name}</h3>
              <p className="text-sm text-slate-600">
                {formatPrice(item.price)}
              </p>
            </div>
            <div className="text-sm text-slate-600">x{item.quantity}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <div>
          <p className="text-sm text-slate-600">Total</p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatPrice(totalPrice)}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            onClick={clearCart}
            type="button"
          >
            Clear Cart
          </button>
          <button
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            type="button"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
