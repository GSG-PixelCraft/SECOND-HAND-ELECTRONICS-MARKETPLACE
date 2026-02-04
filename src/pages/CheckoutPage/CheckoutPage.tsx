import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/PageTitle";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";

const CheckoutPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
      <PageTitle subtitle="Complete your purchase">Checkout</PageTitle>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Shipping Information
          </h2>
          <div className="space-y-3">
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-2"
              placeholder="Full Name"
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-2"
              placeholder="Address"
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-2"
              placeholder="City"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Payment Method
          </h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" />
              <Span className="text-sm text-slate-600">Credit Card</Span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" />
              <Span className="text-sm text-slate-600">PayPal</Span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <div>
            <Text className="text-sm text-slate-600">Total</Text>
            <Text className="text-2xl font-semibold text-slate-900">
              $99.99
            </Text>
          </div>
          <Link to={ROUTES.HOME}>
            <Button intent="primary" size="md">
              Complete Purchase
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
