import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Crosshair, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface LocationLanguageDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon: React.ReactNode;
  placeholder?: string;
  type: "location" | "language";
  onDetectLocation?: () => void;
  onManualEntry?: () => void;
}

export const LocationLanguageDropdown = ({
  value,
  onChange,
  options,
  icon,
  placeholder = "Search...",
  type,
  onDetectLocation,
  onManualEntry,
}: LocationLanguageDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-body text-neutral-foreground transition-colors hover:bg-neutral-5"
      >
        {icon}
        <span>{selectedOption?.label || value}</span>
        <svg
          className={`h-4 w-4 text-neutral transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-xl border border-neutral-20 bg-white p-4 shadow-lg">
          {/* Action Buttons - Only for location */}
          {type === "location" && (
            <>
              <button
                type="button"
                onClick={() => {
                  onDetectLocation?.();
                  setIsOpen(false);
                }}
                className="mb-3 flex w-full items-center gap-3 rounded-lg border border-neutral-20 px-4 py-3 text-body text-neutral-foreground transition-colors hover:bg-neutral-5"
              >
                <Crosshair size={20} className="text-neutral" />
                <span>Detect my location</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onManualEntry?.();
                  setIsOpen(false);
                }}
                className="mb-3 flex w-full items-center gap-3 rounded-lg border border-neutral-20 px-4 py-3 text-body text-neutral-foreground transition-colors hover:bg-neutral-5"
              >
                <MapPin size={20} className="text-neutral" />
                <span>Enter location manually</span>
              </button>

              <div className="mb-4 text-center text-caption text-neutral">
                Or
              </div>
            </>
          )}

          {/* Search Input */}
          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-neutral-20 bg-white py-2.5 pl-10 pr-10 text-body outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary-20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-neutral-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-72 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <div className="space-y-2">
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-body transition-colors ${
                      value === option.value
                        ? "border-primary bg-primary-5"
                        : "border-neutral-20 hover:bg-neutral-5"
                    }`}
                  >
                    <span
                      className={
                        value === option.value
                          ? "text-neutral-foreground"
                          : "text-neutral"
                      }
                    >
                      {option.label}
                    </span>
                    <div
                      className={`relative h-5 w-5 rounded-full border-2 transition-colors ${
                        value === option.value
                          ? "border-primary"
                          : "border-neutral-20"
                      }`}
                    >
                      {value === option.value && (
                        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-caption text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
