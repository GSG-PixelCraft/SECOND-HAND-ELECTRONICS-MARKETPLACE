# Admin Dashboard Components - Usage Guide

## StatCard

Display key metrics with optional trend indicators.

```tsx
import { StatCard } from "@/components/ui/StatCard";
import { Users } from "lucide-react";

<StatCard
  title="Total Users"
  value={1284}
  icon={<Users className="h-6 w-6" />}
  change={12.5}
  changeLabel="from last month"
  variant="default" // default | success | warning | error
/>
```

## LineChart

Display trends over time with multiple data series.

```tsx
import { LineChart } from "@/components/ui/Charts";

<LineChart
  title="Revenue & Orders"
  data={[
    { date: "2024-01-01", revenue: 12000, orders: 45 },
    { date: "2024-01-02", revenue: 15000, orders: 52 },
  ]}
  xAxisKey="date"
  lines={[
    { dataKey: "revenue", name: "Revenue ($)", stroke: "hsl(var(--primary))" },
    { dataKey: "orders", name: "Orders", stroke: "hsl(var(--success))" },
  ]}
  height={300}
/>
```

## BarChart

Compare categories or time periods.

```tsx
import { BarChart } from "@/components/ui/Charts";

<BarChart
  title="User Activity"
  data={userActivityData}
  xAxisKey="date"
  bars={[
    { dataKey: "newUsers", name: "New Users" },
    { dataKey: "activeUsers", name: "Active Users" },
  ]}
  height={300}
/>
```

## PieChart

Show distribution or composition.

```tsx
import { PieChart } from "@/components/ui/Charts";

<PieChart
  title="Products by Category"
  data={[
    { name: "Smartphones", value: 450, percentage: 35 },
    { name: "Laptops", value: 320, percentage: 25 },
  ]}
  dataKey="value"
  nameKey="name"
  height={300}
/>
```

## DataTable

Display tabular data with sorting and custom rendering.

```tsx
import { DataTable, Column } from "@/components/ui/DataTable";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending";
}

const columns: Column<User>[] = [
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
    key: "status",
    header: "Status",
    sortable: true,
    render: (user) => (
      <span className={`badge ${user.status === "active" ? "badge-success" : "badge-warning"}`}>
        {user.status}
      </span>
    ),
  },
];

<DataTable
  title="Recent Users"
  data={users}
  columns={columns}
  onRowClick={(user) => console.log("Clicked:", user)}
  emptyMessage="No users found"
/>
```

## Admin Service Hooks

Fetch admin dashboard data with React Query.

```tsx
import {
  useAdminDashboard,
  useAdminStats,
  useRecentUsers,
} from "@/services/admin.service";

function MyComponent() {
  // Fetch all dashboard data at once
  const { data, isLoading, error } = useAdminDashboard();
  
  // Or fetch individual pieces
  const { data: stats } = useAdminStats();
  const { data: users } = useRecentUsers();
  
  // Handle states
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <DashboardView data={data} />;
}
```

## Color Theming

Charts use CSS custom properties from `src/style/tokens.css`:

```tsx
// Available colors
"hsl(var(--primary))"     // Blue
"hsl(var(--secondary))"   // Teal
"hsl(var(--success))"     // Green
"hsl(var(--warning))"     // Yellow
"hsl(var(--error))"       // Red
```

## Responsive Layouts

Use Tailwind's responsive classes:

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* Stats cards */}
</div>

<div className="grid gap-4 lg:grid-cols-2">
  {/* Charts */}
</div>
```

## Custom Cell Renderers

Format data in tables:

```tsx
// Price formatting
{
  key: "price",
  header: "Price",
  render: (item) => `$${item.price.toLocaleString()}`,
}

// Date formatting
{
  key: "createdAt",
  header: "Created",
  render: (item) => new Date(item.createdAt).toLocaleDateString(),
}

// Status badges
{
  key: "status",
  header: "Status",
  render: (item) => (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
      item.status === "active"
        ? "bg-success/10 text-success"
        : "bg-warning/10 text-warning"
    }`}>
      {item.status}
    </span>
  ),
}
```

## Loading States

Show loading UI while fetching:

```tsx
if (isLoading) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}
```

## Error Handling

Display errors gracefully:

```tsx
if (error) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold text-error">
          Error loading dashboard
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message}
        </p>
      </div>
    </div>
  );
}
```
