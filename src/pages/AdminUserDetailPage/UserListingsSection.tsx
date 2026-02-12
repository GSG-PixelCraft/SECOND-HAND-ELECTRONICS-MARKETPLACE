import { forwardRef, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, type TabValue } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/input";
import { Span } from "@/components/ui/span";
import { Text } from "@/components/ui/text";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/feedback/emptyState/EmptyState";
import { ShowPagination } from "@/components/admin";
import { useUserListings } from "@/services/admin-users.service";

export interface UserListingsSectionProps {
  userId: string;
}

export const UserListingsSection = forwardRef<
  HTMLDivElement,
  UserListingsSectionProps
>(({ userId }, ref) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState("7");

  const statusMap: Record<string, string> = {
    all: "all",
    active: "active",
    pending: "pending",
    rejected: "rejected",
    sold: "sold",
    archived: "archived",
    reported: "reported",
  };

  const { data, isLoading } = useUserListings(userId, {
    status: statusMap[activeTab],
    search,
    page,
    limit: 10,
  });

  const tabCounts = {
    all: data?.pagination.total || 0,
    active: 0,
    pending: 0,
    rejected: 0,
    sold: 0,
    archived: 0,
    reported: 0,
    "activity log": 0,
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

  return (
    <div
      ref={ref}
      className="rounded-xl bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]"
    >
      {/* Tabs */}
      <div className="border-b border-[#e4e4e4]">
        <Tabs value={activeTab} onChange={setActiveTab} counts={tabCounts} />
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
              placeholder="Search listings by title, category, status..."
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
      {isLoading ? (
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
            </div>
            <div className="flex w-[150px] items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Category
              </Span>
            </div>
            <div className="flex w-[180px] items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Submission date
              </Span>
            </div>
            <div className="flex w-[120px] items-center gap-1 px-4">
              <Span className="text-neutral-90 text-sm font-medium">
                Status
              </Span>
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
      )}
    </div>
  );
});

UserListingsSection.displayName = "UserListingsSection";
