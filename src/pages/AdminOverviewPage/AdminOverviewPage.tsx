import { StatCard } from "@/components/ui/StatCard";
import { LineChart, BarChart, PieChart } from "@/components/ui/Charts";
import { DataTable, Column } from "@/components/ui/DataTable";
import { useAdminDashboard } from "@/services/admin.service";
import { RecentUser, RecentProduct, RecentOrder } from "@/types/admin";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { Text } from "@/components/ui/text";

const AdminOverviewPage = () => {
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <Text className="text-muted-foreground">Loading dashboard...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Text className="text-lg font-semibold text-error">
            Error loading dashboard
          </Text>
          <Text className="mt-2 text-sm text-muted-foreground">
            {error.message}
          </Text>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Column definitions for tables
  const userColumns: Column<RecentUser>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (user) => (
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (user) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            user.status === "active"
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }`}
        >
          {user.status}
        </span>
      ),
    },
    {
      key: "joinedAt",
      header: "Joined",
      sortable: true,
      render: (user) => new Date(user.joinedAt).toLocaleDateString(),
    },
  ];

  const productColumns: Column<RecentProduct>[] = [
    {
      key: "name",
      header: "Product",
      sortable: true,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (product) => `$${product.price.toLocaleString()}`,
    },
    {
      key: "condition",
      header: "Condition",
      sortable: true,
      render: (product) => (
        <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
          {product.condition}
        </span>
      ),
    },
    {
      key: "seller",
      header: "Seller",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (product) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            product.status === "active"
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }`}
        >
          {product.status}
        </span>
      ),
    },
  ];

  const orderColumns: Column<RecentOrder>[] = [
    {
      key: "id",
      header: "Order ID",
      sortable: true,
      render: (order) => `#${order.id}`,
    },
    {
      key: "customer",
      header: "Customer",
      sortable: true,
    },
    {
      key: "product",
      header: "Product",
      sortable: true,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (order) => `$${order.amount.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (order) => {
        const statusColors = {
          completed: "bg-success/10 text-success",
          processing: "bg-primary/10 text-primary",
          pending: "bg-warning/10 text-warning",
          cancelled: "bg-error/10 text-error",
        };
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}
          >
            {order.status}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (order) => new Date(order.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={data.stats.totalUsers.toLocaleString()}
          icon={<Users className="h-6 w-6" />}
          change={data.stats.userGrowth}
          changeLabel="from last month"
        />
        <StatCard
          title="Total Products"
          value={data.stats.totalProducts.toLocaleString()}
          icon={<Package className="h-6 w-6" />}
          change={data.stats.productGrowth}
          changeLabel="from last month"
        />
        <StatCard
          title="Total Orders"
          value={data.stats.totalOrders.toLocaleString()}
          icon={<ShoppingCart className="h-6 w-6" />}
          change={data.stats.orderGrowth}
          changeLabel="from last month"
        />
        <StatCard
          title="Total Revenue"
          value={`$${data.stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
          change={data.stats.revenueGrowth}
          changeLabel="from last month"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <LineChart
          title="Revenue & Orders Trend"
          data={data.revenueChart}
          xAxisKey="date"
          lines={[
            { dataKey: "revenue", name: "Revenue ($)", stroke: "hsl(var(--primary))" },
            { dataKey: "orders", name: "Orders", stroke: "hsl(var(--success))" },
          ]}
          height={300}
        />
        <BarChart
          title="User Activity"
          data={data.userActivityChart}
          xAxisKey="date"
          bars={[
            { dataKey: "newUsers", name: "New Users", fill: "hsl(var(--primary))" },
            { dataKey: "activeUsers", name: "Active Users", fill: "hsl(var(--secondary))" },
          ]}
          height={300}
        />
      </div>

      {/* Chart Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PieChart
            title="Products by Category"
            data={data.categoryChart}
            dataKey="value"
            nameKey="name"
            height={300}
          />
        </div>
        <div className="lg:col-span-2">
          <DataTable
            title="Recent Orders"
            data={data.recentOrders}
            columns={orderColumns}
          />
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        <DataTable
          title="Recent Users"
          data={data.recentUsers}
          columns={userColumns}
        />
        <DataTable
          title="Recent Products"
          data={data.recentProducts}
          columns={productColumns}
        />
      </div>
    </div>
  );
};

export default AdminOverviewPage;
