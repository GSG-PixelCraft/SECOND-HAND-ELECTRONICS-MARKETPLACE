import { useNavigate } from "react-router-dom";
import { useAdminDashboard } from "@/services/admin.service";
import { Text } from "@/components/ui/Text/text";
import { Button } from "@/components/ui/Button/button";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { getAdminListingDetailRoute } from "@/constants/routes";
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

const AdminOverviewPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return <FullScreenLoading message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl border border-error/10 bg-error/5 p-8 text-center">
          <Text variant="bodyLg" className="font-semibold text-error">
            Error loading dashboard
          </Text>
          <Text variant="caption" className="mt-2 text-error/70">
            {error.message}
          </Text>
          <Button
            intent="outline"
            size="sm"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
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

  const pendingListings = [
    {
      id: "1",
      title: "iPhone 14 Pro Max",
      image: "https://picsum.photos/200/200?random=1",
      seller: "Eleanor Vance",
      verified: true,
      category: "Phone",
      date: "20-10-2025",
      status: "Pending",
    },
    {
      id: "2",
      title: "Nintendo Switch",
      image: "https://picsum.photos/200/200?random=2",
      seller: "Salma Ahmad",
      verified: true,
      category: "Gaming",
      date: "20-10-2025",
      status: "Pending",
    },
    {
      id: "3",
      title: "Samsung Galaxy S21",
      image: "https://picsum.photos/200/200?random=3",
      seller: "Yosef Emad",
      verified: false,
      category: "Phone",
      date: "20-10-2025",
      status: "Pending",
    },
  ];

  const recentActivities = [
    {
      icon: <User className="size-6 text-[#14B8A6]" />,
      title: "User submitted ID for verification",
      submittedBy: "Mohammed Ali",
      time: "Just Now",
      bgColor: "bg-[rgba(20,184,166,0.1)]",
    },
    {
      icon: <FileText className="size-6 text-[#2563EB]" />,
      title: "Listing submitted for approval",
      submittedBy: "Khaled Yaseen",
      time: "49 min ago",
      bgColor: "bg-[rgba(37,99,235,0.1)]",
    },
    {
      icon: <MessageSquare className="size-6 text-[#2563EB]" />,
      title: "User sent a message to customer support",
      submittedBy: "Eman Ismail",
      time: "2 hours ago",
      bgColor: "bg-[rgba(37,99,235,0.1)]",
    },
  ];

  const customerServiceRequests = [
    {
      id: "cs-1",
      name: "Sara Khaled",
      message: "Voice message",
      time: "22 min ago",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: "cs-2",
      name: "Lina Ahmad",
      message: "I have a question about pricing",
      time: "49 min ago",
      avatar: "https://i.pravatar.cc/100?img=32",
    },
    {
      id: "cs-3",
      name: "Yazan Omar",
      message: "How do I verify my account?",
      time: "2 hours ago",
      avatar: "https://i.pravatar.cc/100?img=56",
    },
  ];

  const recentReports = [
    {
      id: "rr-1",
      title: "iPhone 14 Pro Max",
      reporter: "Mohammed Ali",
      time: "13 min ago",
      icon: <FileText className="size-5 text-[#2563EB]" />,
      bgColor: "bg-[rgba(37,99,235,0.1)]",
    },
    {
      id: "rr-2",
      title: "User Khaled Omar",
      reporter: "Liam Johnson",
      time: "25 min ago",
      icon: <User className="size-5 text-[#14B8A6]" />,
      bgColor: "bg-[rgba(20,184,166,0.1)]",
    },
    {
      id: "rr-3",
      title: "Conversation with Ahmed Saleh",
      reporter: "Emma Brown",
      time: "57 min ago",
      icon: <MessageSquare className="size-5 text-[#2563EB]" />,
      bgColor: "bg-[rgba(37,99,235,0.1)]",
    },
  ];

  return (
    <div className="flex flex-col gap-8 bg-[#fcfcfc] p-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="font-['Poppins'] text-[24px] font-medium leading-normal text-[#101010]">
          Welcome, <span className="text-[#2563eb]">Ahmed</span> 👋
        </h1>
        <p className="font-['Poppins'] text-[16px] font-normal leading-normal text-[#828282]">
          Here's a quick look at your project today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Listings */}
        <div className="flex items-start rounded-[12px] bg-white p-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex size-[40px] items-center justify-center rounded-[30px] bg-[rgba(37,99,235,0.1)]">
              <FileText className="size-6 text-[#2563EB]" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#3d3d3d]">
                Active Listings
              </p>
              <p className="font-['Poppins'] text-[24px] font-medium leading-normal text-[#212121]">
                1154
              </p>
            </div>
          </div>
        </div>

        {/* Pending Listings */}
        <div className="flex items-start rounded-[12px] bg-white p-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex size-[40px] items-center justify-center rounded-[30px] bg-[rgba(37,99,235,0.1)]">
              <PackageIcon className="size-6 text-[#2563EB]" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#3d3d3d]">
                Pending Listings
              </p>
              <p className="font-['Poppins'] text-[24px] font-medium leading-normal text-[#212121]">
                43
              </p>
            </div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="flex items-start rounded-[12px] bg-white p-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex size-[40px] items-center justify-center rounded-[30px] bg-[rgba(37,99,235,0.1)]">
              <CheckCircle className="size-6 text-[#2563EB]" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#3d3d3d]">
                Pending Verifications
              </p>
              <p className="font-['Poppins'] text-[24px] font-medium leading-normal text-[#212121]">
                16
              </p>
            </div>
          </div>
        </div>

        {/* Reported Items */}
        <div className="flex items-start rounded-[12px] bg-white p-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex size-[40px] items-center justify-center rounded-[30px] bg-[rgba(37,99,235,0.1)]">
              <Flag className="size-6 text-[#2563EB]" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#3d3d3d]">
                Reported Items
              </p>
              <p className="font-['Poppins'] text-[24px] font-medium leading-normal text-[#212121]">
                23
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Traffic by Location */}
        <div className="flex flex-col gap-4 rounded-[12px] bg-white p-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          <h2 className="font-['Poppins'] text-[20px] font-medium leading-normal text-[#212121]">
            Traffic by Location
          </h2>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative size-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex w-full flex-1 flex-col gap-4">
              {locationData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-1 rounded-lg py-0.5 pl-1 pr-2">
                    <div
                      className="size-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="font-['Poppins'] text-[16px] font-normal leading-normal text-[#3d3d3d]">
                      {item.name}
                    </p>
                  </div>
                  <p className="font-['Poppins'] text-[16px] font-normal leading-normal text-[#3d3d3d]">
                    {item.value}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col gap-4 rounded-[12px] bg-white p-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-['Poppins'] text-[20px] font-medium leading-normal text-[#212121]">
              Recent Activity
            </h2>
            <button className="font-['Poppins'] text-[16px] font-normal leading-normal text-[#828282] transition-colors hover:text-[#2563eb]">
              See all
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`${activity.bgColor} flex items-center justify-center rounded-[50px] p-2`}
                >
                  {activity.icon}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex-1 truncate font-['Poppins'] text-[18px] font-normal leading-normal text-[#3d3d3d]">
                      {activity.title}
                    </p>
                    <p className="whitespace-nowrap font-['Poppins'] text-[12px] font-normal leading-normal text-[#828282]">
                      {activity.time}
                    </p>
                  </div>
                  <p className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#828282]">
                    {activity.title.toLowerCase().includes("submitted")
                      ? "Submitted by "
                      : "Sent by "}
                    <span className="text-[#2563eb]">
                      {activity.submittedBy}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Customer Service */}
        <div className="flex flex-col gap-4 rounded-[12px] bg-white p-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-['Poppins'] text-[20px] font-medium leading-normal text-[#212121]">
              Customer Service
            </h2>
            <button className="font-['Poppins'] text-[16px] font-normal leading-normal text-[#828282] transition-colors hover:text-[#2563eb]">
              See all
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {customerServiceRequests.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="size-10 rounded-full object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate font-['Poppins'] text-[16px] font-medium leading-normal text-[#3d3d3d]">
                    {item.name}
                  </p>
                  <p className="truncate font-['Poppins'] text-[14px] font-normal leading-normal text-[#828282]">
                    {item.message}
                  </p>
                </div>
                <p className="whitespace-nowrap font-['Poppins'] text-[12px] font-normal leading-normal text-[#828282]">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="flex flex-col gap-4 rounded-[12px] bg-white p-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-['Poppins'] text-[20px] font-medium leading-normal text-[#212121]">
              Recent Reports
            </h2>
            <button className="font-['Poppins'] text-[16px] font-normal leading-normal text-[#828282] transition-colors hover:text-[#2563eb]">
              See all
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center gap-3">
                <div
                  className={`${report.bgColor} flex size-10 items-center justify-center rounded-full`}
                >
                  {report.icon}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate font-['Poppins'] text-[16px] font-medium leading-normal text-[#3d3d3d]">
                    {report.title}
                  </p>
                  <p className="truncate font-['Poppins'] text-[14px] font-normal leading-normal text-[#828282]">
                    Reported by{" "}
                    <span className="text-[#2563eb]">{report.reporter}</span>
                  </p>
                </div>
                <p className="whitespace-nowrap font-['Poppins'] text-[12px] font-normal leading-normal text-[#828282]">
                  {report.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Listings Table Section */}
      <div className="overflow-hidden rounded-[12px] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-2 p-4">
          <h2 className="font-['Poppins'] text-[20px] font-medium leading-normal text-[#212121]">
            Pending Listings
          </h2>
          <button className="font-['Poppins'] text-[16px] font-normal leading-normal text-[#828282] transition-colors hover:text-[#2563eb]">
            See all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[rgba(37,99,235,0.1)]">
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-1">
                    <p className="font-['Poppins'] text-[14px] font-medium leading-normal text-[#212121]">
                      Listing Title
                    </p>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-1">
                    <p className="font-['Poppins'] text-[14px] font-medium leading-normal text-[#212121]">
                      Seller
                    </p>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-1">
                    <p className="font-['Poppins'] text-[14px] font-medium leading-normal text-[#212121]">
                      Category
                    </p>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-1">
                    <p className="font-['Poppins'] text-[14px] font-medium leading-normal text-[#212121]">
                      Submission date
                    </p>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-1">
                    <p className="font-['Poppins'] text-[14px] font-medium leading-normal text-[#212121]">
                      Status
                    </p>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-1">
                    <p className="font-['Poppins'] text-[14px] font-medium leading-normal text-[#212121]">
                      Actions
                    </p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingListings.map((listing, index) => (
                <tr
                  key={listing.id}
                  className={`cursor-pointer border-b border-[#e4e4e4] transition-colors hover:bg-[#fcfcfc] ${
                    index === pendingListings.length - 1 ? "border-b-0" : ""
                  }`}
                  onClick={() =>
                    navigate(getAdminListingDetailRoute(listing.id))
                  }
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="size-8 rounded object-cover"
                      />
                      <p className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#3d3d3d]">
                        {listing.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#3d3d3d]">
                        {listing.seller}
                      </p>
                      {listing.verified && (
                        <div className="size-3 rounded-full bg-[#22C55E]" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#3d3d3d]">
                      {listing.category}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#3d3d3d]">
                      {listing.date}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-[rgba(250,204,21,0.2)] px-3 py-1">
                      <p className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#FACC15]">
                        {listing.status}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg p-2 transition-colors hover:bg-[rgba(37,99,235,0.1)]">
                      <Eye className="size-5 text-[#2563EB]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
