import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/Tabs";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/emptyState/EmptyState";
import { ShowPagination } from "@/components/admin";
import { VerificationsTable } from "./VerificationsTable";
import { VerificationsTableFilters } from "./VerificationsTableFilters";
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

  const [activeTab, setActiveTab] = useState<VerificationTabValue>(initialTab);
  const [filters, setFilters] = useState<VerificationFilterParams>({
    status: tabToStatus[initialTab],
    page: initialPage,
    limit: 10,
    search: initialSearch,
    sortBy: "submittedDate",
    sortOrder: "desc",
  });

  // Fetch verifications
  const { data, isLoading, error } = useAdminVerifications(filters);

  // Update URL when tab changes
  const handleTabChange = (tab: VerificationTabValue) => {
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
  const handleFiltersChange = (newFilters: VerificationFilterParams) => {
    setFilters(newFilters);
    setSearchParams({
      ...Object.fromEntries(searchParams),
      ...(newFilters.search && { search: newFilters.search }),
      ...(newFilters.startDate && { startDate: newFilters.startDate }),
      ...(newFilters.endDate && { endDate: newFilters.endDate }),
      page: (newFilters.page || 1).toString(),
    });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      startDate: undefined,
      endDate: undefined,
      page: 1,
    }));
    setSearchParams({
      status: activeTab,
      page: "1",
    });
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

  return (
    <div className="p-6">
      {/* Main Content Card */}
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <Text variant="body" className="text-neutral-50 mt-4 font-medium">
                Loading verifications...
              </Text>
            </div>
          ) : error ? (
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
  );
}
