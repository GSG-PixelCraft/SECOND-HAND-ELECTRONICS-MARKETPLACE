import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Heart, Filter } from "lucide-react";

export default function FavoritesPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  // TODO: Fetch user's favorite products from API

  return (
    <PageLayout title="Favorites" maxWidth="6xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-h2 font-semibold">My Favorites</h1>
            <p className="text-body text-muted-foreground">
              Products you've saved for later
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-bodySmall mb-2 flex items-center gap-2 font-medium">
            <Filter className="h-4 w-4" />
            Filter by Category
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`whitespace-nowrap rounded-md px-4 py-2 ${
                categoryFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border border-neutral-20 bg-white hover:bg-neutral-5"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCategoryFilter("phones")}
              className={`whitespace-nowrap rounded-md px-4 py-2 ${
                categoryFilter === "phones"
                  ? "bg-primary text-primary-foreground"
                  : "border border-neutral-20 bg-white hover:bg-neutral-5"
              }`}
            >
              Phones
            </button>
            <button
              onClick={() => setCategoryFilter("laptops")}
              className={`whitespace-nowrap rounded-md px-4 py-2 ${
                categoryFilter === "laptops"
                  ? "bg-primary text-primary-foreground"
                  : "border border-neutral-20 bg-white hover:bg-neutral-5"
              }`}
            >
              Laptops
            </button>
            <button
              onClick={() => setCategoryFilter("tablets")}
              className={`whitespace-nowrap rounded-md px-4 py-2 ${
                categoryFilter === "tablets"
                  ? "bg-primary text-primary-foreground"
                  : "border border-neutral-20 bg-white hover:bg-neutral-5"
              }`}
            >
              Tablets
            </button>
            <button
              onClick={() => setCategoryFilter("accessories")}
              className={`whitespace-nowrap rounded-md px-4 py-2 ${
                categoryFilter === "accessories"
                  ? "bg-primary text-primary-foreground"
                  : "border border-neutral-20 bg-white hover:bg-neutral-5"
              }`}
            >
              Accessories
            </button>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* TODO: Add product cards */}
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              You haven't saved any favorites yet.
            </p>
            <p className="text-bodySmall mt-1 text-muted-foreground">
              Tap the heart icon on products to save them here.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
