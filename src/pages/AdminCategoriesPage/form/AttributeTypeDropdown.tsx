import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryAttributeType } from "@/types/admin";
import {
  CATEGORY_ATTRIBUTE_TYPE_OPTIONS,
  getCategoryAttributeTypeLabel,
} from "./constants";

export interface AttributeTypeDropdownProps {
  value?: CategoryAttributeType | "";
  onChange: (value: CategoryAttributeType) => void;
}

export function AttributeTypeDropdown({
  value = "",
  onChange,
}: AttributeTypeDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-neutral-80 flex h-12 w-full items-center justify-between rounded-xl border border-neutral-20 bg-white px-4 text-left text-sm"
      >
        <span className={cn(!value && "text-neutral-40")}>
          {getCategoryAttributeTypeLabel(value)}
        </span>
        <ChevronDown className="text-neutral-50 h-5 w-5" />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+4px)] z-20 w-full overflow-hidden rounded-xl border border-neutral-20 bg-white shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
          {CATEGORY_ATTRIBUTE_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="text-neutral-80 flex w-full items-center gap-3 border-b border-neutral-10 px-4 py-3 text-sm last:border-b-0 hover:bg-neutral-5"
            >
              <span
                className={cn(
                  "border-neutral-30 h-5 w-5 rounded-full border",
                  value === option.value && "border-primary",
                )}
              >
                {value === option.value ? (
                  <span className="m-[4px] block h-2.5 w-2.5 rounded-full bg-primary" />
                ) : null}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
