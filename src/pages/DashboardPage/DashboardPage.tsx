// User dashboard
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const DashboardPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Manage your account and listings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">My Listings</h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage your product listings
          </p>
          <Link
            to={ROUTES.MY_LISTINGS}
            className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Listings
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track your purchase orders
          </p>
          <Link
            to={ROUTES.HOME}
            className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
