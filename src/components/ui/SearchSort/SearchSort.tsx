import { useState } from "react";
import { Span } from "@/components/ui/Span/span";

interface SearchSortProps {
  onSortChange?: (sortBy: string) => void;
  className?: string;
}

const SearchSort = ({ onSortChange, className = "" }: SearchSortProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Newest");
  const [isSorted, setIsSorted] = useState(false);

  const sortOptions = [
    "Best Match",
    "Newest",
    "Most Viewed",
    "Price - Low to High",
    "Price - High to Low",
    "Nearest",
  ];

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    setIsSorted(true);
    onSortChange?.(option);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-caption transition-colors ${
          isSorted
            ? "border-2 border-primary bg-primary-10 text-muted-foreground focus:outline-none"
            : isOpen
              ? "border-2 border-primary bg-white text-muted-foreground focus:outline-none"
              : "border border-[hsl(var(--border))] bg-white text-muted-foreground hover:border-neutral-20 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        }`}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.33333 5.33333L5.33333 3.33333M5.33333 3.33333L7.33333 5.33333M5.33333 3.33333V10.6667M12.6667 10.6667L10.6667 12.6667M10.6667 12.6667L8.66667 10.6667M10.6667 12.6667V5.33333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Span variant="muted">Sort by:</Span>
        <Span className="font-medium text-neutral-foreground">{selected}</Span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-max rounded-lg border border-[hsl(var(--border))] bg-white shadow-lg">
          <div className="space-y-1 p-2">
            {sortOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 transition-colors hover:bg-muted-5"
              >
                <input
                  type="radio"
                  name="sort"
                  checked={selected === option}
                  onChange={() => handleSelect(option)}
                  className="h-4 w-4 cursor-pointer border-[hsl(var(--border))] text-primary focus:ring-primary"
                />
                <Span
                  className={`text-caption ${selected === option ? "font-medium text-neutral-foreground" : "text-muted-foreground"}`}
                >
                  {option}
                </Span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { SearchSort };
export default SearchSort;
