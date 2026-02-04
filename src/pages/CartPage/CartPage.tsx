import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/PageTitle";
import { EmptyState } from "@/components/feedback/emptyState/EmptyState";

const CartPage = () => {
  const { items, clearCart, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <EmptyState
          title="Your cart is empty"
          description="Start adding some items to your cart"
          action={
            <Link to={ROUTES.RECENT_LISTINGS}>
              <Button intent="primary" size="md">
                Browse Products
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
      <PageTitle
        subtitle={`You have ${items.length} ${items.length === 1 ? "item" : "items"} in your cart`}
      >
        Shopping Cart
      </PageTitle>

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
          <Button intent="outline" size="md" onClick={clearCart} type="button">
            Clear Cart
          </Button>
          <Button intent="primary" size="md" type="button">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
