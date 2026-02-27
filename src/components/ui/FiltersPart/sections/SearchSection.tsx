import { useMemo } from "react";
import { Checkbox } from "@/components/ui/Checkbox/checkbox";

interface Props {
  title: string;
  placeholder: string;
  options: string[];
  selected: string[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggle: (value: string) => void;
}

export const SearchSection = ({
  title,
  placeholder,
  options,
  selected,
  searchValue,
  onSearchChange,
  onToggle,
}: Props) => {
  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [options, searchValue]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>

      <div className="relative mb-3">
        <SearchIcon />

        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredOptions.map((option) => (
        <Checkbox
          key={option}
          label={option}
          checked={selected.includes(option)}
          onChange={() => onToggle(option)}
        />
      ))}
    </div>
  );
};

const SearchIcon = () => (
  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
    <svg
      className="h-4 w-4 text-gray-500"
      aria-hidden="true"
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
  </div>
);