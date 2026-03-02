import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button/button";
import { FiltersPart } from "@/components/ui/FiltersPart/FiltersPart";
import { SearchSort } from "@/components/ui/SearchSort/SearchSort";
import { Text } from "@/components/ui/Text/text";
import { mockProducts } from "@/pages/HomePage/mockProducts";
import { HomeProductCard } from "@/components/homePage/HomeProductCard";
import type { Product } from "@/types";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);

  const performSearch = useCallback(
    (query: string) => {
      setIsSearching(true);
      setTimeout(() => {
        let results = mockProducts;

        // Filter by category
        if (categoryFilter) {
          results = results.filter(
            (product) =>
              product.category.name.toLowerCase() ===
              categoryFilter.toLowerCase(),
          );
        }

        // Filter by search query
        if (query.trim()) {
          results = results.filter(
            (product) =>
              product.title.toLowerCase().includes(query.toLowerCase()) ||
              product.category.name.toLowerCase().includes(query.toLowerCase()),
          );
        }

        setFilteredProducts(results);
        setIsSearching(false);
      }, 300);
    },
    [categoryFilter],
  );

  useEffect(() => {
    const query = searchParams.get("q");
    const category = searchParams.get("category");

    if (category && category !== categoryFilter) {
      setCategoryFilter(category);
    }

    if (query && query !== searchQuery) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams, searchQuery, categoryFilter, performSearch]);

  useEffect(() => {
    if (searchQuery || categoryFilter) {
      performSearch(searchQuery);
    }
  }, [searchQuery, categoryFilter, performSearch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchParams({ q: query });
      performSearch(query);
    }
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
              <FiltersPart onSearch={handleSearch} />
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {categoryFilter
                  ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Products`
                  : searchQuery
                    ? `Results for "${searchQuery}"`
                    : "All Products"}
              </h2>
            </div>
            <SearchSort />
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
            {!isSearching && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <HomeProductCard
                  key={product.id}
                  image={product.images[0] ?? ""}
                  title={product.title}
                  price={`${product.price} ILS`}
                  location="Gaza"
                  category={product.category.name}
                  isFavorite={false}
                />
              ))
            ) : !isSearching ? (
              <div className="col-span-full py-12 text-center">
                <Text variant="muted">
                  {searchQuery || categoryFilter
                    ? "No products found."
                    : "Search results will appear here."}
                </Text>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
