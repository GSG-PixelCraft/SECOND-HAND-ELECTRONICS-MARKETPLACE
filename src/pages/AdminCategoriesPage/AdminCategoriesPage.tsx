import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ShowPagination } from "@/components/admin";
import {
  useAdminCategories,
  useDeleteAdminCategory,
  useToggleAdminCategoryStatus,
} from "@/services/admin-categories.service";
import type { AdminCategory, CategoryFilterParams } from "@/types/admin";
import { CategoriesTableFilters } from "./CategoriesTableFilters";
import { CategoriesTable } from "./CategoriesTable";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { DeleteCategorySuccessDialog } from "./DeleteCategorySuccessDialog";
import { FullScreenLoadingOverlay } from "./FullScreenLoadingOverlay";
import { NoCategoriesState } from "./NoCategoriesState";

export default function AdminCategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const timerRef = useRef<number | null>(null);

  const initialFilters = useMemo<CategoryFilterParams>(() => {
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const search = searchParams.get("search") || "";
    return { page, limit, search };
  }, [searchParams]);

  const [filters, setFilters] = useState<CategoryFilterParams>(initialFilters);
  const [categoryToDelete, setCategoryToDelete] =
    useState<AdminCategory | null>(null);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const [loadingOverlayOpen, setLoadingOverlayOpen] = useState(false);

  const { data, isLoading, error } = useAdminCategories(filters);
  const toggleStatusMutation = useToggleAdminCategoryStatus();
  const deleteCategoryMutation = useDeleteAdminCategory();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const buildParams = (nextFilters: CategoryFilterParams) => {
    const nextPage = nextFilters.page || 1;
    const nextLimit = nextFilters.limit || 10;
    const params: Record<string, string> = {
      page: String(nextPage),
      limit: String(nextLimit),
    };

    if (nextFilters.search?.trim()) {
      params.search = nextFilters.search.trim();
    }

    return params;
  };

  const applyFilters = (nextFilters: CategoryFilterParams) => {
    setFilters(nextFilters);
    setSearchParams(buildParams(nextFilters));
  };

  const handleAddCategory = () => {
    console.log("Add Category clicked");
  };

  const handleEditCategory = (category: AdminCategory) => {
    console.log("Edit Category clicked", category.id);
  };

  const handleToggleStatus = async (
    category: AdminCategory,
    nextStatus: boolean,
  ) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: category.id,
        isActive: nextStatus,
      });
    } catch (mutationError) {
      console.error("Failed to update category status", mutationError);
    }
  };

  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return;
    const currentDelete = categoryToDelete;
    setCategoryToDelete(null);
    setLoadingOverlayOpen(true);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(async () => {
      try {
        await deleteCategoryMutation.mutateAsync(currentDelete.id);

        const nextTotal = Math.max((data?.total || 1) - 1, 0);
        const nextLimit = filters.limit || 10;
        const nextTotalPages = Math.max(1, Math.ceil(nextTotal / nextLimit));
        const currentPage = filters.page || 1;

        if (currentPage > nextTotalPages) {
          applyFilters({ ...filters, page: nextTotalPages });
        }

        setDeleteSuccessOpen(true);
      } catch (mutationError) {
        console.error("Failed to delete category", mutationError);
      } finally {
        setLoadingOverlayOpen(false);
      }
    }, 800);
  };

  const hasNoCategories = Boolean(
    data && data.total === 0 && !(filters.search && filters.search.trim()),
  );

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-semibold text-[#101010]">
            Categories Management
          </h1>
          <Button
            onClick={handleAddCategory}
            className="h-11 rounded-xl border-none bg-primary px-6 text-base font-medium text-white hover:bg-primary/90"
          >
            Add Category
          </Button>
        </div>

        <div className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          {isLoading && !data ? (
            <div className="flex min-h-[70vh] flex-col items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <Text variant="body" className="text-neutral-50 mt-4 font-medium">
                Loading categories...
              </Text>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-error/10 bg-error/5 p-8 text-center">
              <Text variant="bodyLg" className="font-semibold text-error">
                Failed to load categories
              </Text>
              <Text variant="caption" className="mt-2 block text-error/70">
                {error.message ||
                  "An unexpected error occurred while fetching categories."}
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
          ) : hasNoCategories ? (
            <NoCategoriesState onAddCategory={handleAddCategory} />
          ) : (
            <div className="flex flex-col gap-6">
              <CategoriesTableFilters
                filters={filters}
                onFiltersChange={(nextFilters) => applyFilters(nextFilters)}
              />

              <div className="flex flex-col gap-2">
                {(data?.items.length || 0) > 0 ? (
                  <>
                    <CategoriesTable
                      categories={data?.items || []}
                      onToggleStatus={handleToggleStatus}
                      onEdit={handleEditCategory}
                      onDelete={setCategoryToDelete}
                      statusUpdating={toggleStatusMutation.isPending}
                    />
                    <ShowPagination
                      currentPage={data?.page || 1}
                      totalPages={data?.totalPages || 1}
                      totalItems={data?.total || 0}
                      pageSize={data?.limit || 10}
                      onPageChange={(page) =>
                        applyFilters({ ...filters, page })
                      }
                      onPageSizeChange={(limit) =>
                        applyFilters({ ...filters, page: 1, limit })
                      }
                    />
                  </>
                ) : (
                  <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-neutral-20">
                    <Text
                      variant="body"
                      className="text-neutral-50 font-medium"
                    >
                      No categories match your search.
                    </Text>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DeleteCategoryDialog
          open={Boolean(categoryToDelete)}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
        <DeleteCategorySuccessDialog
          open={deleteSuccessOpen}
          onClose={() => setDeleteSuccessOpen(false)}
        />
        <FullScreenLoadingOverlay open={loadingOverlayOpen} />
      </div>
    </div>
  );
}
