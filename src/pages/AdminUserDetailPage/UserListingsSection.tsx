import { forwardRef, useState } from "react";
import { ArrowUpDown, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/input";
import { Span } from "@/components/ui/span";
import { Text } from "@/components/ui/text";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/feedback/emptyState/EmptyState";
import { ShowPagination } from "@/components/admin";
import { useUserListings } from "@/services/admin-users.service";

type UserProfileTab =
  | "all"
  | "active"
  | "pending"
  | "rejected"
  | "sold"
  | "archived"
  | "reported"
  | "activity";

type ReportStatus = "Open" | "Resolved" | "Under Review";

type ReportedItem = {
  id: string;
  listingId: string;
  title: string;
  image: string;
  reportCount: number;
  reporter: string;
  reporterVerified: boolean;
  date: string;
  status: ReportStatus;
};

type ActivityLogItem = {
  id: string;
  dateTime: string;
  description: string;
  performedBy: "User" | "Admin";
};

const USER_PROFILE_TABS: { label: string; value: UserProfileTab }[] = [
  { label: "All Listings", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Sold", value: "sold" },
  { label: "Archived", value: "archived" },
  { label: "Reported", value: "reported" },
  { label: "Activity Log", value: "activity" },
];

const REPORTED_ITEMS: ReportedItem[] = [
  {
    id: "report-1",
    listingId: "listing-iphone-14",
    title: "iPhone 14 Pro Max",
    image: "https://picsum.photos/seed/report-iphone/60/60",
    reportCount: 21,
    reporter: "Leen Omar",
    reporterVerified: true,
    date: "20-10-2025",
    status: "Open",
  },
  {
    id: "report-2",
    listingId: "listing-dell-15",
    title: "Dell Inspiron 15",
    image: "https://picsum.photos/seed/report-dell/60/60",
    reportCount: 5,
    reporter: "Rawan Samer",
    reporterVerified: false,
    date: "17-10-2025",
    status: "Resolved",
  },
  {
    id: "report-3",
    listingId: "listing-headphones",
    title: "Headphones",
    image: "https://picsum.photos/seed/report-headphones/60/60",
    reportCount: 3,
    reporter: "Maher ali",
    reporterVerified: false,
    date: "15-10-2025",
    status: "Under Review",
  },
];

const ACTIVITY_LOG_ITEMS: ActivityLogItem[] = [
  {
    id: "activity-1",
    dateTime: "18-10-2026 10:42 AM",
    description: 'Listing "iPhone 11" submitted',
    performedBy: "User",
  },
  {
    id: "activity-2",
    dateTime: "17-10-2026 11:05 AM",
    description: 'Listing "iPhone 11" rejected (Missing photos)',
    performedBy: "Admin",
  },
  {
    id: "activity-3",
    dateTime: "16-10-2026 9:30 AM",
    description: 'Marked "Dell Laptop" as sold',
    performedBy: "User",
  },
];

export interface UserListingsSectionProps {
  userId: string;
}

export const UserListingsSection = forwardRef<
  HTMLDivElement,
  UserListingsSectionProps
>(({ userId }, ref) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<UserProfileTab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState("7");

  const statusMap: Partial<Record<UserProfileTab, string>> = {
    all: "all",
    active: "active",
    pending: "pending",
    rejected: "rejected",
    sold: "sold",
    archived: "archived",
    reported: "reported",
  };

  const isReportedTab = activeTab === "reported";
  const isActivityTab = activeTab === "activity";
  const isListingsTab = !isReportedTab && !isActivityTab;

  const { data, isLoading } = useUserListings(userId, {
    status: statusMap[activeTab],
    search: isListingsTab ? search : "",
    page,
    limit: 10,
  });

  const tabCounts: Partial<Record<UserProfileTab, number>> = {
    reported: REPORTED_ITEMS.length,
  };

  const handleViewListing = (listingId: string) => {
    navigate(`/admin/listings/${listingId}`);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "completed";
      case "pending":
        return "pending";
      case "rejected":
        return "rejected";
      case "sold":
        return "neutral";
      case "archived":
        return "neutral";
      case "reported":
        return "processing";
      default:
        return "neutral";
    }
  };

  const getReportStatusVariant = (status: ReportStatus) => {
    switch (status) {
      case "Open":
        return "rejected";
      case "Resolved":
        return "completed";
      case "Under Review":
        return "pending";
      default:
        return "neutral";
    }
  };

  const searchPlaceholder = isActivityTab
    ? "Search by action type, product name, or keyword..."
    : "Search listings by title, category, status...";

  return (
    <div
      ref={ref}
      className="rounded-xl bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]"
    >
      {/* Tabs */}
      <div className="border-b border-[#e4e4e4]">
        <Tabs<UserProfileTab>
          value={activeTab}
          onChange={setActiveTab}
          counts={tabCounts}
          tabs={USER_PROFILE_TABS}
        />
      </div>

      {/* Search and Filters */}
      <div className="my-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-50"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border-[#e4e4e4] bg-white pl-12 pr-4 text-[#3d3d3d] placeholder:text-[#c7c7c7]"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="relative flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-50"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-12 min-w-[140px] cursor-pointer appearance-none rounded-xl border border-[#e4e4e4] bg-white px-4 pr-10 text-sm text-[#3d3d3d]"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
          <div className="pointer-events-none absolute right-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-50"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      {isListingsTab ? (
        isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <Text variant="body" className="text-neutral-50 mt-4 font-medium">
              Loading listings...
            </Text>
          </div>
        ) : data && data.listings.length === 0 ? (
          <div className="flex justify-center py-20">
            <EmptyState
              title="No listings found"
              description="This user has no listings matching your criteria."
            />
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="mb-2 flex h-12 items-center overflow-hidden rounded-xl bg-primary/10">
              <div className="flex flex-1 items-center gap-1 px-4">
                <Span className="text-neutral-90 text-sm font-medium">
                  Listing Title
                </Span>
                <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
              </div>
              <div className="flex w-[150px] items-center gap-1 px-4">
                <Span className="text-neutral-90 text-sm font-medium">
                  Category
                </Span>
                <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
              </div>
              <div className="flex w-[180px] items-center gap-1 px-4">
                <Span className="text-neutral-90 text-sm font-medium">
                  Submission date
                </Span>
                <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
              </div>
              <div className="flex w-[120px] items-center gap-1 px-4">
                <Span className="text-neutral-90 text-sm font-medium">
                  Status
                </Span>
                <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
              </div>
              <div className="flex w-[100px] items-center gap-1 px-4">
                <Span className="text-neutral-90 text-sm font-medium">
                  Actions
                </Span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col gap-3">
              {data?.listings.map((listing, index) => (
                <div key={listing.id}>
                  <div className="flex h-12 items-center bg-white">
                    {/* Title with Image */}
                    <div className="flex flex-1 items-center gap-2 px-4">
                      {listing.image && (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="h-8 w-8 rounded object-cover"
                        />
                      )}
                      <Span className="text-neutral-60 truncate text-sm">
                        {listing.title}
                      </Span>
                    </div>

                    {/* Category */}
                    <div className="flex w-[150px] items-center px-4">
                      <div className="inline-flex items-center rounded-lg bg-neutral-10 px-3 py-1">
                        <Span className="text-neutral-50 text-xs">
                          {listing.category}
                        </Span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex w-[180px] items-center px-4">
                      <Span className="text-neutral-60 text-sm">
                        {new Date(listing.submissionDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </Span>
                    </div>

                    {/* Status */}
                    <div className="flex w-[120px] items-center px-4">
                      <StatusBadge variant={getStatusVariant(listing.status)}>
                        {listing.status}
                      </StatusBadge>
                    </div>

                    {/* Actions */}
                    <div className="flex w-[100px] items-center justify-center">
                      <button
                        onClick={() => handleViewListing(listing.id)}
                        className="text-neutral-50 flex h-6 w-6 items-center justify-center transition-colors hover:text-primary"
                        aria-label="View details"
                      >
                        <Eye className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  {index < data.listings.length - 1 && (
                    <div className="h-px bg-neutral-20" />
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-4">
              <ShowPagination
                currentPage={data?.pagination.page || 1}
                totalPages={data?.pagination.totalPages || 1}
                totalItems={data?.pagination.total || 0}
                pageSize={data?.pagination.limit || 10}
                onPageChange={setPage}
                onPageSizeChange={() => {}}
              />
            </div>
          </>
        )
      ) : isReportedTab ? (
        <>
          {/* Reported Header */}
          <div className="mb-2 flex h-12 items-center overflow-hidden rounded-xl bg-primary/10">
            <div className="flex flex-1 items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Listing Title
              </Span>
              <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
            </div>
            <div className="flex w-[140px] items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Reports count
              </Span>
              <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
            </div>
            <div className="flex w-[170px] items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Reporter
              </Span>
              <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
            </div>
            <div className="flex w-[140px] items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">Date</Span>
              <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
            </div>
            <div className="flex w-[130px] items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Status
              </Span>
              <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
            </div>
            <div className="flex w-[100px] items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Actions
              </Span>
            </div>
          </div>

          {/* Reported Rows */}
          <div className="flex flex-col gap-3">
            {REPORTED_ITEMS.map((item, index) => (
              <div key={item.id}>
                <div className="flex h-12 items-center bg-white">
                  <div className="flex flex-1 items-center gap-2 px-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-8 w-8 rounded object-cover"
                    />
                    <Span className="text-neutral-60 truncate text-sm">
                      {item.title}
                    </Span>
                  </div>
                  <div className="flex w-[140px] items-center px-4">
                    <Span className="text-neutral-60 rounded-full bg-neutral-10 px-3 py-1 text-xs">
                      {item.reportCount}
                    </Span>
                  </div>
                  <div className="flex w-[170px] items-center gap-2 px-4">
                    <Span className="text-neutral-60 text-sm">
                      {item.reporter}
                    </Span>
                    {item.reporterVerified && (
                      <span
                        className="h-2.5 w-2.5 rounded-full bg-success"
                        aria-label="Verified reporter"
                      />
                    )}
                  </div>
                  <div className="flex w-[140px] items-center px-4">
                    <Span className="text-neutral-60 text-sm">{item.date}</Span>
                  </div>
                  <div className="flex w-[130px] items-center px-4">
                    <StatusBadge variant={getReportStatusVariant(item.status)}>
                      {item.status}
                    </StatusBadge>
                  </div>
                  <div className="flex w-[100px] items-center justify-center">
                    <button
                      onClick={() => handleViewListing(item.listingId)}
                      className="text-neutral-50 flex h-6 w-6 items-center justify-center transition-colors hover:text-primary"
                      aria-label="View listing"
                    >
                      <Eye className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                {index < REPORTED_ITEMS.length - 1 && (
                  <div className="h-px bg-neutral-20" />
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Activity Log Header */}
          <div className="mb-2 flex h-12 items-center overflow-hidden rounded-xl bg-primary/10">
            <div className="flex w-[220px] items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Date & Time
              </Span>
              <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
            </div>
            <div className="flex flex-1 items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Activity Description
              </Span>
              <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
            </div>
            <div className="flex w-[160px] items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Performed By
              </Span>
              <ArrowUpDown className="text-neutral-50 h-3.5 w-3.5" />
            </div>
          </div>

          {/* Activity Log Rows */}
          <div className="flex flex-col gap-3">
            {ACTIVITY_LOG_ITEMS.map((item, index) => (
              <div key={item.id}>
                <div className="flex h-12 items-center bg-white">
                  <div className="flex w-[220px] items-center px-4">
                    <Span className="text-neutral-60 text-sm">
                      {item.dateTime}
                    </Span>
                  </div>
                  <div className="flex flex-1 items-center px-4">
                    <Span className="text-neutral-60 text-sm">
                      {item.description}
                    </Span>
                  </div>
                  <div className="flex w-[160px] items-center px-4">
                    <Span className="text-neutral-60 text-sm">
                      {item.performedBy}
                    </Span>
                  </div>
                </div>
                {index < ACTIVITY_LOG_ITEMS.length - 1 && (
                  <div className="h-px bg-neutral-20" />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

UserListingsSection.displayName = "UserListingsSection";
