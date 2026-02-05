import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActivityCard, ActivityIcon } from "@/components/ui/ActivityCard";
import type { Column } from "@/components/ui/DataTable";
import { useAdminDashboard } from "@/services/admin.service";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Flag,
  CheckCircle,
  MessageSquare,
  Package as PackageIcon,
  User,
  Eye,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface PendingListing {
  title: string;
  seller: string;
  verified: boolean;
  category: string;
  date: string;
  status: string;
}

const AdminOverviewPage = () => {
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <Text className="text-[#828282]">Loading dashboard...</Text>
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
          <Text className="mt-2 text-sm text-[#828282]">{error.message}</Text>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Traffic by Location Data
  const locationData = [
    { name: "Palestine", value: 52.1, color: "#2563EB" },
    { name: "Jordan", value: 22.8, color: "#14B8A6" },
    { name: "USA", value: 13.9, color: "#22C55E" },
    { name: "Other", value: 11.2, color: "#FACC15" },
  ];

  // Pending Listings Table Columns
  const listingColumns: Column<PendingListing>[] = [
    {
      key: "title",
      header: "Listing Title",
      sortable: true,
      render: (item: PendingListing) => (
        <div className="flex items-center gap-2">
          <div className="size-8 flex-shrink-0 rounded bg-muted" />
          <Span className="text-sm text-[#3D3D3D]">{item.title}</Span>
        </div>
      ),
    },
    {
      key: "seller",
      header: "Seller",
      sortable: true,
      render: (item: PendingListing) => (
        <div className="flex items-center gap-2">
          <Span className="text-sm text-[#3D3D3D]">{item.seller}</Span>
          {item.verified && <CheckCircle className="size-3.5 text-success" />}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item: PendingListing) => (
        <StatusBadge variant="neutral">{item.category}</StatusBadge>
      ),
    },
    {
      key: "date",
      header: "Submission date",
      sortable: true,
      render: (item: PendingListing) => (
        <Span className="text-sm text-[#3D3D3D]">{item.date}</Span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item: PendingListing) => (
        <StatusBadge
          variant={
            item.status.toLowerCase() as
              | "pending"
              | "active"
              | "completed"
              | "neutral"
              | "rejected"
              | "processing"
          }
        >
          {item.status}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <Button className="text-[#828282] transition-colors hover:text-primary">
          <Eye className="size-5" />
        </Button>
      ),
    },
  ];

  // Mock data for pending listings
  const pendingListings = [
    {
      title: "iPhone 14 Pro Max",
      seller: "Eleanor Vance",
      verified: true,
      category: "Phone",
      date: "20-10-2025",
      status: "Pending",
    },
    {
      title: "Nintendo Switch",
      seller: "Salma Ahmad",
      verified: true,
      category: "Gaming",
      date: "20-10-2025",
      status: "Pending",
    },
    {
      title: "Samsung Galaxy S21",
      seller: "Yosef Emad",
      verified: false,
      category: "Phone",
      date: "20-10-2025",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <Text className="text-foreground text-2xl font-medium">
          Welcome, Ahmed 👋
        </Text>
        <Text className="text-sm text-[#828282]">
          Here's a quick look at your project today.
        </Text>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Active Listings"
          value="1154"
          icon={<FileText className="size-6" />}
          iconColor="primary"
        />
        <StatCard
          title="Pending Listings"
          value="43"
          icon={<FileText className="size-6" />}
          iconColor="primary"
        />
        <StatCard
          title="Pending Verifications"
          value="16"
          icon={<CheckCircle className="size-6" />}
          iconColor="primary"
        />
        <StatCard
          title="Reported Items"
          value="23"
          icon={<Flag className="size-6" />}
          iconColor="warning"
        />
      </div>

      {/* Row 1: Traffic by Location + Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Traffic by Location */}
        <div className="rounded-xl bg-white p-4 shadow-[0_1px_4px_0_rgba(0,0,0,0.1)]">
          <Text className="text-foreground mb-4 text-xl font-medium">
            Traffic by Location
          </Text>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={184} height={184}>
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {locationData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="size-5 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <Span className="text-sm text-[#3D3D3D]">{item.name}</Span>
                  </div>
                  <Span className="text-foreground text-sm font-medium">
                    {item.value}%
                  </Span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl bg-white p-4 shadow-[0_1px_4px_0_rgba(0,0,0,0.1)]">
          <div className="mb-4 flex items-center justify-between">
            <Text className="text-foreground text-xl font-medium">
              Recent Activity
            </Text>
            <Button className="text-sm text-primary hover:underline">
              See all
            </Button>
          </div>
          <div className="space-y-4">
            <ActivityCard
              icon={
                <ActivityIcon variant="primary">
                  <User className="size-6 text-primary" />
                </ActivityIcon>
              }
              title="User submitted ID for verification"
              subtitle="Submitted by Mohammed Ali"
              timestamp="Just Now"
            />
            <ActivityCard
              icon={
                <ActivityIcon variant="primary">
                  <PackageIcon className="size-6 text-primary" />
                </ActivityIcon>
              }
              title="Listing submitted for approval"
              subtitle="Submitted by Khaled Yaseen"
              timestamp="48 min ago"
            />
            <ActivityCard
              icon={
                <ActivityIcon variant="primary">
                  <MessageSquare className="size-6 text-primary" />
                </ActivityIcon>
              }
              title="User sent a message to customer support"
              subtitle="Sent by Emaan Ismail"
              timestamp="2 hours ago"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Customer Service + Recent Reports */}
      <div className="grid grid-cols-2 gap-6">
        {/* Customer Service */}
        <div className="rounded-xl bg-white p-4 shadow-[0_1px_4px_0_rgba(0,0,0,0.1)]">
          <div className="mb-4 flex items-center justify-between">
            <Text className="text-foreground text-xl font-medium">
              Customer Service
            </Text>
            <Button className="text-sm text-primary hover:underline">
              See all
            </Button>
          </div>
          <div className="space-y-4">
            <ActivityCard
              icon={
                <div className="size-12 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary" />
              }
              title="Sara Khaled"
              subtitle="Voice message"
              timestamp="22 min ago"
            />
            <ActivityCard
              icon={
                <div className="size-12 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary" />
              }
              title="Lina Ahmad"
              subtitle="I have a question about pricing"
              timestamp="45 min ago"
            />
            <ActivityCard
              icon={
                <div className="size-12 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary" />
              }
              title="Yazan Omar"
              subtitle="How do I verify my account?"
              timestamp="2 hours ago"
            />
          </div>
        </div>

        {/* Recent Reports */}
        <div className="rounded-xl bg-white p-4 shadow-[0_1px_4px_0_rgba(0,0,0,0.1)]">
          <div className="mb-4 flex items-center justify-between">
            <Text className="text-foreground text-xl font-medium">
              Recent Reports
            </Text>
            <Button className="text-sm text-primary hover:underline">
              See all
            </Button>
          </div>
          <div className="space-y-4">
            <ActivityCard
              icon={
                <ActivityIcon variant="primary">
                  <PackageIcon className="size-6 text-primary" />
                </ActivityIcon>
              }
              title="iPhone 14 Pro Max"
              subtitle="Reported by Mohammed Ali"
              timestamp="15 min ago"
            />
            <ActivityCard
              icon={
                <ActivityIcon variant="secondary">
                  <User className="size-6 text-secondary" />
                </ActivityIcon>
              }
              title="User Khaled Omar"
              subtitle="Reported by Liam Johnson"
              timestamp="25 min ago"
            />
            <ActivityCard
              icon={
                <ActivityIcon variant="primary">
                  <MessageSquare className="size-6 text-primary" />
                </ActivityIcon>
              }
              title="Conversation with Ahmed Saleh"
              subtitle="Reported by Emma Brown"
              timestamp="1hr min ago"
            />
          </div>
        </div>
      </div>

      {/* Pending Listings Table */}
      <DataTable
        title="Pending Listings"
        data={pendingListings}
        columns={listingColumns}
        showSeeAll
      />
    </div>
  );
};

export default AdminOverviewPage;
