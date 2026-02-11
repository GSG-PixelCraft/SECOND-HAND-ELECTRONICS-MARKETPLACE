import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabValue } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/feedback/emptyState/EmptyState";
import { ListingsTableFilters, ShowPagination } from "@/components/admin";
import { ListingsTable } from "./ListingsTable";
import { useAdminListings } from "@/services/admin-listings.service";
import type { ListingFilterParams, ListingStatus } from "@/types/admin";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

// Map TabValue to ListingStatus
const tabToStatus: Record<TabValue, ListingStatus | "all"> = {
  all: "all",
  pending: "pending",
  active: "active",
  rejected: "rejected",
  sold: "sold",
  archived: "hidden", // Map archived to hidden
  drafts: "removed", // Map drafts to removed
};

export default function AdminListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL or defaults
  const initialTab = (searchParams.get("status") as TabValue) || "all";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSearch = searchParams.get("search") || "";

  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
  const [filters, setFilters] = useState<ListingFilterParams>({
    status: tabToStatus[initialTab],
    page: initialPage,
    limit: 10,
    search: initialSearch,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch listings
  const { data, isLoading, error } = useAdminListings(filters);

  // Update URL when tab changes
  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
    const newStatus = tabToStatus[tab];
    setFilters((prev) => ({ ...prev, status: newStatus, page: 1 }));
    setSearchParams({
      status: tab,
      page: "1",
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: page.toString(),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setFilters((prev) => ({ ...prev, limit: itemsPerPage, page: 1 }));
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: "1",
    });
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: ListingFilterParams) => {
    setFilters(newFilters);
    if (newFilters.search !== undefined) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        search: newFilters.search,
      });
    }
  };

  const handleClearFilters = () => {
    setFilters({
      status: filters.status,
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSearchParams({
      status: activeTab,
      page: "1",
    });
  };

  // Mock counts for tabs
  const tabCounts = {
    all: data?.total || 0,
    pending: 0,
    active: 0,
    rejected: 0,
    sold: 0,
    archived: 0,
    drafts: 0,
  };

  return (
    <div className="p-6">
      {/* Main Content Card */}
      <div className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
        {/* Tabs Navigation */}
        <div className="border-b border-[#e4e4e4]">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            counts={tabCounts}
          />
        </div>

        {/* Search & Date Filter */}
        <div className="flex items-center justify-between gap-4">
          <ListingsTableFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Table */}
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <Text variant="body" className="text-neutral-50 mt-4 font-medium">
                Loading listings...
              </Text>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-error/10 bg-error/5 p-8 text-center">
              <Text variant="bodyLg" className="font-semibold text-error">
                Failed to load listings
              </Text>
              <Text variant="caption" className="mt-2 block text-error/70">
                {error.message ||
                  "An unexpected error occurred while fetching listings."}
              </Text>
              <Button
                intent="outline"
                size="sm"
                className="mt-6"
                onClick={() => window.location.reload()}
              >
                Retry Connection
              </Button>
            </div>
          ) : data && data.items.length === 0 ? (
            <div className="flex justify-center py-20">
              <EmptyState
                title="No listings found"
                description="We couldn't find any listings matching your current filter criteria."
              />
            </div>
          ) : (
            <>
              <ListingsTable listings={data?.items || []} />

              {/* Pagination */}
              <ShowPagination
                currentPage={data?.page || 1}
                totalPages={data?.totalPages || 1}
                totalItems={data?.total || 0}
                pageSize={data?.limit || 10}
                onPageChange={handlePageChange}
                onPageSizeChange={handleItemsPerPageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
