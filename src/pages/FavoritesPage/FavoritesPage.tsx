import { useMemo, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Heart, Filter } from "lucide-react";
import { FavoritesEmptyState } from "@/components/feedback/emptyState";
import { useTranslation } from "react-i18next";

export default function FavoritesPage() {
  const { t } = useTranslation();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const favorites: unknown[] = [];

  const filterOptions = useMemo(
    () => [
      { value: "all", label: t("favorites.filters.all") },
      { value: "phones", label: t("favorites.filters.phones") },
      { value: "laptops", label: t("favorites.filters.laptops") },
      { value: "tablets", label: t("favorites.filters.tablets") },
      { value: "accessories", label: t("favorites.filters.accessories") },
    ],
    [t],
  );

  // TODO: Fetch user's favorite products from API

  return (
    <PageLayout title={t("favorites.pageTitle")} maxWidth="6xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-h2 font-semibold">{t("favorites.heading")}</h1>
            <p className="text-body text-muted-foreground">
              {t("favorites.subtitle")}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-bodySmall mb-2 flex items-center gap-2 font-medium">
            <Filter className="h-4 w-4" />
            {t("favorites.filterLabel")}
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setCategoryFilter(option.value)}
                className={`whitespace-nowrap rounded-md px-4 py-2 ${
                  categoryFilter === option.value
                    ? "bg-primary text-primary-foreground"
                    : "border border-neutral-20 bg-white hover:bg-neutral-5"
                }`}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <FavoritesEmptyState
              title={t("favorites.empty.title")}
              description={t("favorites.empty.body")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* TODO: Add product cards */}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
