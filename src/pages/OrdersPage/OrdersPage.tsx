import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Text } from "@/components/ui/text";

const OrdersPage = () => {
  const demoOrders = ["o-1001", "o-1002"];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">My Orders</h1>
        <Text className="text-sm text-slate-600">
          Track your purchase history
        </Text>
      </header>

      <div className="space-y-4">
        {demoOrders.map((orderId) => (
          <div
            key={orderId}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">Order #{orderId}</h3>
                <Text className="text-sm text-slate-600">Status: Shipped</Text>
              </div>
              <Link
                to={`${ROUTES.HOME}/${orderId}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
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

export default OrdersPage;
