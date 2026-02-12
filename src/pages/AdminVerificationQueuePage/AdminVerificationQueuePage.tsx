import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/Tabs";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/emptyState/EmptyState";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { ShowPagination } from "@/components/admin";
import {
  resolveDateRangeValue,
  toDateRangeQueryParams,
} from "@/components/admin/ui/date-filter/admin-date-range.utils";
import { VerificationsTable } from "./components/tables/VerificationsTable";
import { VerificationsTableFilters } from "./components/tables/VerificationsTableFilters";
import { useAdminVerifications } from "@/services/admin-verification.service";
import type {
  VerificationFilterParams,
  AdminVerificationStatus,
} from "@/types/admin";

type VerificationTabValue = "all" | "pending" | "active" | "rejected";

// Map TabValue to AdminVerificationStatus
const tabToStatus: Record<
  VerificationTabValue,
  AdminVerificationStatus | "all"
> = {
  all: "all",
  pending: "pending",
  active: "approved", // Map active to approved
  rejected: "rejected",
};

export default function AdminVerificationQueuePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL or defaults
  const initialTab =
    (searchParams.get("status") as VerificationTabValue) || "all";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSearch = searchParams.get("search") || "";
  const initialDateValue = resolveDateRangeValue({
    datePreset: searchParams.get("datePreset"),
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
    dateRange: searchParams.get("dateRange"),
  });

  const [activeTab, setActiveTab] = useState<VerificationTabValue>(initialTab);
  const [filters, setFilters] = useState<VerificationFilterParams>({
    status: tabToStatus[initialTab],
    page: initialPage,
    limit: 10,
    search: initialSearch,
    datePreset: initialDateValue.preset,
    startDate: initialDateValue.startDate,
    endDate: initialDateValue.endDate,
    sortBy: "submittedDate",
    sortOrder: "desc",
  });

  // Fetch verifications
  const { data, isLoading, error } = useAdminVerifications(filters);

  const buildParams = useCallback(
    (
      overrides?: Partial<VerificationFilterParams> & {
        statusTab?: VerificationTabValue;
      },
    ) => {
      const merged = {
        statusTab: overrides?.statusTab ?? activeTab,
        page: overrides?.page ?? filters.page ?? 1,
        search: overrides?.search ?? filters.search ?? "",
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
    },
    [activeTab, filters],
  );

  // Update URL when tab changes
  const handleTabChange = (tab: VerificationTabValue) => {
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
  const handleFiltersChange = useCallback(
    (newFilters: VerificationFilterParams) => {
      setFilters(newFilters);
      setSearchParams(buildParams(newFilters));
    },
    [buildParams, setSearchParams],
  );

  // Handle clear filters
  const handleClearFilters = () => {
    const defaultDateValue = resolveDateRangeValue({});

    setFilters((prev) => ({
      ...prev,
      search: "",
      datePreset: defaultDateValue.preset,
      startDate: defaultDateValue.startDate,
      endDate: defaultDateValue.endDate,
      page: 1,
    }));
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

  // Verification-specific tabs (only 4 tabs as per Figma)
  const verificationTabs: { label: string; value: VerificationTabValue }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Active", value: "active" },
    { label: "Rejected", value: "rejected" },
  ];

  // Tab counts from data
  const tabCounts = {
    all: data?.statusCounts.all || 0,
    pending: data?.statusCounts.pending || 0,
    active: data?.statusCounts.approved || 0,
    rejected: data?.statusCounts.rejected || 0,
  };

  if (isLoading) {
    return <FullScreenLoading message="Loading verifications..." />;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-[22px] font-semibold text-[#101010]">
          Verification Management
        </h1>

        <div className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          {/* Tabs Navigation */}
          <div className="border-b border-[#e4e4e4]">
            <Tabs<VerificationTabValue>
              value={activeTab}
              onChange={handleTabChange}
              counts={tabCounts}
              tabs={verificationTabs}
            />
          </div>

          {/* Search & Date Filter */}
          <div className="flex items-center justify-between gap-4">
            <VerificationsTableFilters
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
                  Failed to load verifications
                </Text>
                <Text variant="caption" className="mt-2 block text-error/70">
                  {error.message ||
                    "An unexpected error occurred while fetching verifications."}
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
                  title="No verifications found"
                  description="We couldn't find any verifications matching your current filter criteria."
                />
              </div>
            ) : (
              <>
                <VerificationsTable verifications={data?.items || []} />

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
