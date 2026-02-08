import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FiltersPart } from "@/components/ui/FiltersPart";
import { SearchSort } from "@/components/ui/SearchSort";
import { Text } from "@/components/ui/text";

interface Filters {
  categories: string[];
  condition: string[];
  priceRange: { min: string; max: string };
  brand: string[];
  model: string[];
  storage: string[];
  sellerType: string[];
  location: { country: string; city: string; useCurrentLocation: boolean };
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    condition: [],
    priceRange: { min: "", max: "" },
    brand: [],
    model: [],
    storage: [],
    sellerType: [],
    location: { country: "", city: "", useCurrentLocation: false },
  });
  const [sortBy, setSortBy] = useState("Newest");
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(
    (query: string) => {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
        console.log(
          "Searching for:",
          query,
          "with filters:",
          filters,
          "sorted by:",
          sortBy,
        );
      }, 500);
    },
    [filters, sortBy],
  );

  useEffect(() => {
    const query = searchParams.get("q");
    if (query && query !== searchQuery) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams, searchQuery, performSearch]);

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchParams({ q: query });
      performSearch(query);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
    performSearch(searchQuery);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    performSearch(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <div className="min-h-screen flex-shrink-0 border-r border-gray-200 bg-white lg:w-80">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <Button
                type="button"
                intent="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <FiltersPart
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
              </h2>
            </div>
            <SearchSort onSortChange={handleSortChange} />
          </div>

          {isSearching && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                Searching...
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!isSearching && (
              <div className="col-span-full py-12 text-center">
                <Text variant="muted">Search results will appear here.</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
