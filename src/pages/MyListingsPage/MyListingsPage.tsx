import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus, Package, Filter } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const categories = [
  "All",
  "Phones",
  "Laptops",
  "Tablets",
  "Accessories",
  "Audio",
  "Cameras",
];

export default function MyListingsPage() {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const [selectedCategory, setSelectedCategory] = useState(category || "All");
  const [statusFilter, setStatusFilter] = useState("all");

  // TODO: Fetch user's listings from API

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    if (newCategory === "All") {
      navigate(ROUTES.MY_LISTINGS);
    } else {
      navigate(`/my-listings/category/${newCategory.toLowerCase()}`);
    }
  };

  return (
    <PageLayout title="My Listings" maxWidth="6xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-h2 font-semibold">My Listings</h1>
              <p className="text-body text-muted-foreground">
                Manage your product listings
              </p>
            </div>
          </div>
          <Button intent="primary" onClick={() => navigate(ROUTES.ADD_LISTING)}>
            <Plus className="mr-2 h-5 w-5" />
            Add Listing
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label className="text-bodySmall mb-2 flex items-center gap-2 font-medium">
              <Filter className="h-4 w-4" />
              Filter by Category
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`whitespace-nowrap rounded-md px-4 py-2 transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "border border-neutral-20 bg-white hover:bg-neutral-5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`text-bodySmall rounded-md px-4 py-2 ${
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border border-neutral-20 bg-white hover:bg-neutral-5"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`text-bodySmall rounded-md px-4 py-2 ${
                statusFilter === "active"
                  ? "bg-primary text-primary-foreground"
                  : "border border-neutral-20 bg-white hover:bg-neutral-5"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("sold")}
              className={`text-bodySmall rounded-md px-4 py-2 ${
                statusFilter === "sold"
                  ? "bg-primary text-primary-foreground"
                  : "border border-neutral-20 bg-white hover:bg-neutral-5"
              }`}
            >
              Sold
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`text-bodySmall rounded-md px-4 py-2 ${
                statusFilter === "draft"
                  ? "bg-primary text-primary-foreground"
                  : "border border-neutral-20 bg-white hover:bg-neutral-5"
              }`}
            >
              Draft
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* TODO: Add product cards */}
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              You don't have any listings yet.
            </p>
            <Button
              intent="primary"
              size="sm"
              className="mt-4"
              onClick={() => navigate(ROUTES.ADD_LISTING)}
            >
              Create Your First Listing
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
