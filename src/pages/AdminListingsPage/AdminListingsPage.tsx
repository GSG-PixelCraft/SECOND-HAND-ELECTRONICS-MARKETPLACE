import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/feedback/emptyState/EmptyState";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { ListingsTableFilters, ShowPagination } from "@/components/admin";
import {
  resolveDateRangeValue,
  toDateRangeQueryParams,
} from "@/components/admin/ui/date-filter/admin-date-range.utils";
import { ListingsTable } from "./components/tables/ListingsTable";
import { useAdminListings } from "@/services/admin-listings.service";
import type { ListingFilterParams, ListingStatus } from "@/types/admin";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

type ListingTabValue =
  | "all"
  | "pending"
  | "active"
  | "rejected"
  | "sold"
  | "archived"
  | "drafts";

// Map TabValue to ListingStatus
const tabToStatus: Record<ListingTabValue, ListingStatus | "all"> = {
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
  const initialTab = (searchParams.get("status") as ListingTabValue) || "all";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSearch = searchParams.get("search") || "";
  const initialDateValue = resolveDateRangeValue({
    datePreset: searchParams.get("datePreset"),
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
    dateRange: searchParams.get("dateRange"),
  });

  const [activeTab, setActiveTab] = useState<ListingTabValue>(initialTab);
  const [filters, setFilters] = useState<ListingFilterParams>({
    status: tabToStatus[initialTab],
    page: initialPage,
    limit: 10,
    search: initialSearch,
    datePreset: initialDateValue.preset,
    startDate: initialDateValue.startDate,
    endDate: initialDateValue.endDate,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch listings
  const { data, isLoading, error } = useAdminListings(filters);

  const buildParams = (
    overrides?: Partial<ListingFilterParams> & { statusTab?: ListingTabValue },
  ) => {
    const merged = {
      statusTab: overrides?.statusTab ?? activeTab,
      search: overrides?.search ?? filters.search ?? "",
      page: overrides?.page ?? filters.page ?? 1,
      datePreset: overrides?.datePreset ?? filters.datePreset,
      startDate: overrides?.startDate ?? filters.startDate,
      endDate: overrides?.endDate ?? filters.endDate,
    };

    const normalizedDateValue = resolveDateRangeValue({
      datePreset: merged.datePreset || null,
      startDate: merged.startDate || null,
      endDate: merged.endDate || null,
    });

    const params: Record<string, string> = {
      status: merged.statusTab,
      page: String(merged.page),
      ...toDateRangeQueryParams(normalizedDateValue),
    };

    if (merged.search) {
      params.search = merged.search;
    }

    return params;
  };

  // Update URL when tab changes
  const handleTabChange = (tab: ListingTabValue) => {
    setActiveTab(tab);
    const newStatus = tabToStatus[tab];
    setFilters((prev) => ({ ...prev, status: newStatus, page: 1 }));
    setSearchParams(buildParams({ statusTab: tab, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setSearchParams(buildParams({ page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setFilters((prev) => ({ ...prev, limit: itemsPerPage, page: 1 }));
    setSearchParams(buildParams({ page: 1 }));
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: ListingFilterParams) => {
    setFilters(newFilters);
    setSearchParams(buildParams(newFilters));
  };

  const handleClearFilters = () => {
    const defaultDateValue = resolveDateRangeValue({});

    setFilters({
      status: filters.status,
      page: 1,
      limit: 10,
      search: "",
      datePreset: defaultDateValue.preset,
      startDate: defaultDateValue.startDate,
      endDate: defaultDateValue.endDate,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSearchParams(
      buildParams({
        statusTab: activeTab,
        search: "",
        page: 1,
        datePreset: defaultDateValue.preset,
        startDate: defaultDateValue.startDate,
        endDate: defaultDateValue.endDate,
      }),
    );
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

  if (isLoading) {
    return <FullScreenLoading message="Loading listings..." />;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-[22px] font-semibold text-[#101010]">
          Listings Management
        </h1>

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
            {error ? (
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
    </div>
  );
}
