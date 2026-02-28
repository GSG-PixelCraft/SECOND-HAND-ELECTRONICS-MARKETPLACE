import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/Button/button";
import { PageTitle } from "@/components/layout/PageTitle/PageTitle";
import { Text } from "@/components/ui/Text/text";
import { useAdminDashboard } from "@/services/admin.service";

const DashboardPage = () => {
  const { data: stats, isLoading } = useAdminDashboard();

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <PageTitle subtitle="Manage your account and listings">
        Dashboard
      </PageTitle>

      {/* Stats */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-4">
            <p className="text-sm text-slate-500">Users</p>
            <p className="text-xl font-semibold">{stats.totalUsers}</p>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <p className="text-sm text-slate-500">Products</p>
            <p className="text-xl font-semibold">{stats.totalProducts}</p>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <p className="text-sm text-slate-500">Orders</p>
            <p className="text-xl font-semibold">{stats.totalOrders}</p>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <p className="text-sm text-slate-500">Revenue</p>
            <p className="text-xl font-semibold">${stats.totalRevenue}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">My Listings</h2>
          <Text className="mt-2 text-sm text-slate-600">
            Manage your product listings
          </Text>
          <Link to={ROUTES.MY_LISTINGS}>
            <Button intent="primary" size="md" className="mt-4">
              View Listings
            </Button>
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
          <Text className="mt-2 text-sm text-slate-600">
            Track your purchase orders
          </Text>
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
