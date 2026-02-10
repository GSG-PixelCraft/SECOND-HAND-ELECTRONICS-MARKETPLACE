import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Text } from "@/components/ui/text";

const OrderDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">
        Order Details #{id}
      </h1>
      <Text className="text-sm text-slate-600">
        Track your order status and shipping information
      </Text>
      <Link
        className="text-sm font-semibold text-slate-500 hover:text-slate-700"
        to={ROUTES.HOME}
      >
        Back to Orders
      </Link>
    </div>
  );
};

export default OrderDetailPage;
