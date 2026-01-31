import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      // TODO: Implement search API call
    }
  };

  return (
    <PageLayout title="Search" maxWidth="6xl">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search for electronics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="button"
              intent="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </Button>
            <Button type="submit" intent="primary">
              Search
            </Button>
          </form>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-h4 font-semibold">Filters</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* TODO: Add filter components */}
              <div>
                <label className="text-bodySmall mb-2 block font-medium">
                  Category
                </label>
                <select className="w-full rounded-md border border-neutral-20 px-3 py-2">
                  <option>All Categories</option>
                  <option>Phones</option>
                  <option>Laptops</option>
                  <option>Tablets</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div>
                <label className="text-bodySmall mb-2 block font-medium">
                  Condition
                </label>
                <select className="w-full rounded-md border border-neutral-20 px-3 py-2">
                  <option>All Conditions</option>
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
              <div>
                <label className="text-bodySmall mb-2 block font-medium">
                  Price Range
                </label>
                <select className="w-full rounded-md border border-neutral-20 px-3 py-2">
                  <option>All Prices</option>
                  <option>Under $100</option>
                  <option>$100 - $500</option>
                  <option>$500 - $1000</option>
                  <option>Over $1000</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-semibold">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : "Popular Products"}
            </h2>
            <p className="text-bodySmall text-muted-foreground">
              {/* TODO: Show actual count */}0 results found
            </p>
          </div>

          {/* TODO: Add product grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-muted-foreground">
                No products found. Try adjusting your search.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
