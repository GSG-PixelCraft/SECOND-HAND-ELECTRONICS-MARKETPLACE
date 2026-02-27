import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import { EmptyState } from "@/components/feedback/emptyState/EmptyState";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { ShowPagination } from "@/components/admin";
import {
  resolveDateRangeValue,
  toDateRangeQueryParams,
} from "@/components/admin/ui/date-filter/admin-date-range.utils";
import { UsersTable } from "./components/tables/UsersTable";
import { UsersTableFilters } from "./components/tables/UsersTableFilters";
import { useAdminUsers } from "@/services/admin-users.service";
import type { UserFilterParams, UserStatus } from "@/types/user";
import { Text } from "@/components/ui/Text/text";
import { Button } from "@/components/ui/Button/button";

// Define custom tab values for user management
type UserTabValue = "all" | "verified" | "active" | "suspended" | "banned";

// Custom tabs for user management
const USER_TABS: { label: string; value: UserTabValue }[] = [
  { label: "All", value: "all" },
  { label: "Verified", value: "verified" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Banned", value: "banned" },
];

// Map TabValue to UserStatus or filter type
const tabToStatus: Record<UserTabValue, UserStatus | "all" | "verified"> = {
  all: "all",
  verified: "verified", // This filters by verification status, not user status
  active: "active",
  suspended: "suspended",
  banned: "banned",
};

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL or defaults
  const initialTab = (searchParams.get("status") as UserTabValue) || "all";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSearch = searchParams.get("search") || "";
  const initialDateValue = resolveDateRangeValue({
    datePreset: searchParams.get("datePreset"),
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
    dateRange: searchParams.get("dateRange"),
  });

  const [activeTab, setActiveTab] = useState<UserTabValue>(initialTab);
  const [filters, setFilters] = useState<UserFilterParams>({
    status: tabToStatus[initialTab],
    page: initialPage,
    limit: 10,
    search: initialSearch,
    datePreset: initialDateValue.preset,
    startDate: initialDateValue.startDate,
    endDate: initialDateValue.endDate,
  });

  // Fetch users
  const { data, isLoading, error } = useAdminUsers(filters);

  const buildParams = useCallback(
    (overrides?: Partial<UserFilterParams> & { statusTab?: UserTabValue }) => {
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
    },
    [activeTab, filters],
  );

  // Update URL when tab changes
  const handleTabChange = (tab: UserTabValue) => {
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
    (newFilters: UserFilterParams) => {
      setFilters(newFilters);
      setSearchParams(buildParams(newFilters));
    },
    [buildParams, setSearchParams],
  );

  // Get counts from API response
  const tabCounts: Partial<Record<UserTabValue, number>> = {
    all: data?.stats.total || 0,
    verified: data?.stats.verified || 0,
    active: data?.stats.active || 0,
    suspended: data?.stats.suspended || 0,
    banned: data?.stats.banned || 0,
  };

  if (isLoading) {
    return <FullScreenLoading message="Loading users..." />;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-[22px] font-semibold text-[#101010]">
          Users Management
        </h1>

        <div className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          {/* Tabs Navigation */}
          <div className="border-b border-[#e4e4e4]">
            <Tabs<UserTabValue>
              value={activeTab}
              onChange={handleTabChange}
              counts={tabCounts}
              tabs={USER_TABS}
            />
          </div>

          {/* Search & Date Filter */}
          <div className="flex items-center justify-between gap-4">
            <UsersTableFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Table */}
          <div className="flex flex-col gap-2">
            {error ? (
              <div className="rounded-xl border border-error/10 bg-error/5 p-8 text-center">
                <Text variant="bodyLg" className="font-semibold text-error">
                  Failed to load users
                </Text>
                <Text variant="caption" className="mt-2 block text-error/70">
                  {error.message ||
                    "An unexpected error occurred while fetching users."}
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
            ) : data && data.users.length === 0 ? (
              <div className="flex justify-center py-20">
                <EmptyState
                  title="No users found"
                  description="We couldn't find any users matching your current filter criteria."
                />
              </div>
            ) : (
              <>
                <UsersTable users={data?.users || []} />

                {/* Pagination */}
                <ShowPagination
                  currentPage={data?.pagination.page || 1}
                  totalPages={data?.pagination.totalPages || 1}
                  totalItems={data?.pagination.total || 0}
                  pageSize={data?.pagination.limit || 10}
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
