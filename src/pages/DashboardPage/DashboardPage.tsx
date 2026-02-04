// User dashboard
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/PageTitle";

const DashboardPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <PageTitle subtitle="Manage your account and listings">
        Dashboard
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">My Listings</h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage your product listings
          </p>
          <Link to={ROUTES.MY_LISTINGS}>
            <Button intent="primary" size="md" className="mt-4">
              View Listings
            </Button>
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track your purchase orders
          </p>
          <Link to={ROUTES.HOME}>
            <Button intent="primary" size="md" className="mt-4">
              View Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
