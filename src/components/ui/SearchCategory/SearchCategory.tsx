import { useMemo, useState } from "react";
import { Button } from "../Button/button";
import { Span } from "@/components/ui/Span/span";
import { useCategories } from "@/services/product.service";

interface SearchCategoryProps {
  onSearch?: (searchTerm: string) => void;
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string;
  placeholder?: string;
  className?: string;
}

const FALLBACK_CATEGORIES = [
  { id: "all", name: "All", icon: "??" },
  { id: "phones", name: "Phones", icon: "??" },
  { id: "laptops", name: "Laptops", icon: "??" },
  { id: "tablets", name: "Tablets", icon: "??" },
  { id: "accessories", name: "Accessories", icon: "??" },
  { id: "smartwatches", name: "Smartwatches", icon: "?" },
  { id: "gaming", name: "Gaming", icon: "??" },
  { id: "cameras", name: "Cameras", icon: "??" },
];

const SearchIcon = () => (
  <svg
    className="h-5 w-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export default function SearchCategory({
  onSearch,
  onCategorySelect,
  selectedCategory = "all",
  placeholder = "Search for products...",
  className = "",
}: SearchCategoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const { data: categoriesData } = useCategories();
  const categories = useMemo(() => {
    const backend = (categoriesData ?? []).map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon?.fileName
        ? cat.icon.fileName.charAt(0).toUpperCase()
        : cat.name.charAt(0).toUpperCase(),
    }));
    if (!backend.length) {
      return FALLBACK_CATEGORIES;
    }
    return [{ id: "all", name: "All", icon: "📦" }, ...backend];
  }, [categoriesData]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategorySelect?.(categoryId);
  };

  return (
    <div className={`mx-auto w-full max-w-4xl ${className}`}>
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-lg shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeCategory === category.id
                ? "scale-105 transform bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
            }`}
          >
            <Span className="text-base">{category.icon}</Span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
