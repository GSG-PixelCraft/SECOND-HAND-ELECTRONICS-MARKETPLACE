import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/feedback/emptyState/EmptyState";
import { ShowPagination } from "@/components/admin";
import { ReportsTableFilters } from "./ReportsTableFilters";
import { ListingReportsTable } from "./ListingReportsTable";
import { UserReportsTable } from "./UserReportsTable";
import { ChatReportsTable } from "./ChatReportsTable";
import { useAdminReports } from "@/services/admin-reports.service";
import type {
  ChatReport,
  ListingReport,
  ReportFilterParams,
  ReportType,
  UserReport,
} from "@/types/admin";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

const reportTabs: { label: string; value: ReportType }[] = [
  { label: "Listing Reports", value: "listing" },
  { label: "User Reports", value: "user" },
  { label: "Chat Reports", value: "chat" },
];

const searchPlaceholders: Record<ReportType, string> = {
  listing: "Search listings by title or user",
  user: "Search users by name or ID",
  chat: "Search users by name or ID",
};

const emptyStateCopy: Record<
  ReportType,
  { title: string; description: string }
> = {
  listing: {
    title: "No listing reports found",
    description: "There are no listing reports matching your filters.",
  },
  user: {
    title: "No user reports found",
    description: "There are no user reports matching your filters.",
  },
  chat: {
    title: "No chat reports found",
    description: "There are no chat reports matching your filters.",
  },
};

export default function AdminReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialType = (searchParams.get("type") as ReportType) || "listing";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSearch = searchParams.get("search") || "";
  const initialDateRange =
    (searchParams.get("dateRange") as ReportFilterParams["dateRange"]) || "7";
  const initialLimit = parseInt(searchParams.get("limit") || "10", 10);

  const [activeTab, setActiveTab] = useState<ReportType>(initialType);
  const [filters, setFilters] = useState<ReportFilterParams>({
    search: initialSearch,
    dateRange: initialDateRange,
    page: initialPage,
    limit: initialLimit,
  });

  const { data, isLoading, error } = useAdminReports(activeTab, filters);

  const buildParams = (
    overrides?: Partial<ReportFilterParams> & { type?: ReportType },
  ) => {
    const merged = {
      type: overrides?.type ?? activeTab,
      page: overrides?.page ?? filters.page ?? 1,
      search: overrides?.search ?? filters.search,
      dateRange: overrides?.dateRange ?? filters.dateRange ?? "7",
      limit: overrides?.limit ?? filters.limit ?? 10,
    };

    const params: Record<string, string> = {
      type: merged.type,
      page: String(merged.page),
    };

    if (merged.search) params.search = merged.search;
    if (merged.dateRange) params.dateRange = merged.dateRange;
    if (merged.limit) params.limit = String(merged.limit);

    return params;
  };

  const handleTabChange = (tab: ReportType) => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, page: 1 }));
    setSearchParams(buildParams({ type: tab, page: 1 }));
  };

  const handleFiltersChange = (newFilters: ReportFilterParams) => {
    setFilters(newFilters);
    setSearchParams(buildParams(newFilters));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setSearchParams(buildParams({ page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setFilters((prev) => ({ ...prev, limit: itemsPerPage, page: 1 }));
    setSearchParams(buildParams({ limit: itemsPerPage, page: 1 }));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-[22px] font-semibold text-[#101010]">
          Report Management
        </h1>

        <div className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="border-b border-[#e4e4e4]">
            <Tabs<ReportType>
              value={activeTab}
              onChange={handleTabChange}
              tabs={reportTabs}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <ReportsTableFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              searchPlaceholder={searchPlaceholders[activeTab]}
            />
          </div>

          <div className="flex flex-col gap-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <Text
                  variant="body"
                  className="text-neutral-50 mt-4 font-medium"
                >
                  Loading reports...
                </Text>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-error/10 bg-error/5 p-8 text-center">
                <Text variant="bodyLg" className="font-semibold text-error">
                  Failed to load reports
                </Text>
                <Text variant="caption" className="mt-2 block text-error/70">
                  {error.message ||
                    "An unexpected error occurred while fetching reports."}
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
                  title={emptyStateCopy[activeTab].title}
                  description={emptyStateCopy[activeTab].description}
                />
              </div>
            ) : (
              <>
                {activeTab === "listing" && (
                  <ListingReportsTable
                    reports={(data?.items || []) as ListingReport[]}
                  />
                )}
                {activeTab === "user" && (
                  <UserReportsTable
                    reports={(data?.items || []) as UserReport[]}
                  />
                )}
                {activeTab === "chat" && (
                  <ChatReportsTable
                    reports={(data?.items || []) as ChatReport[]}
                  />
                )}

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
