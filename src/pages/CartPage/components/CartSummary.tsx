import { Span } from "@/components/ui/span";

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  onCheckout: () => void;
}

const CartSummary = ({
  subtotal,
  tax,
  shipping,
  total,
  onCheckout,
}: CartSummaryProps) => {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900">Order Summary</h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Span className="text-slate-600">Subtotal</Span>
          <Span className="font-medium">${subtotal.toFixed(2)}</Span>
        </div>
        <div className="flex justify-between text-sm">
          <Span className="text-slate-600">Tax</Span>
          <Span className="font-medium">${tax.toFixed(2)}</Span>
        </div>
        <div className="flex justify-between text-sm">
          <Span className="text-slate-600">Shipping</Span>
          <Span className="font-medium">${shipping.toFixed(2)}</Span>
        </div>
        <div className="border-t border-slate-200 pt-2">
          <div className="flex justify-between">
            <Span className="font-semibold text-slate-900">Total</Span>
            <Span className="text-lg font-semibold text-slate-900">
              ${total.toFixed(2)}
            </Span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition-colors hover:bg-slate-800"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
