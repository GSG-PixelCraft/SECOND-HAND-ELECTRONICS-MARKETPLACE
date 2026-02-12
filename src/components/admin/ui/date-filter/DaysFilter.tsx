import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dayFilterVariants = cva(
  [
    "px-4",
    "py-2",
    "rounded-md",
    "font-medium",
    "text-sm",
    "transition-all",
    "duration-200",
  ],
  {
    variants: {
      state: {
        active: ["bg-primary", "text-white", "shadow-sm"],
        inactive: [
          "bg-white",
          "text-neutral-70",
          "border",
          "border-neutral-20",
          "hover:border-primary",
          "hover:text-primary",
        ],
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  },
);

export interface DaysFilterOption {
  value: string | number;
  label: string;
}

export interface DaysFilterProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  options?: DaysFilterOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
}

const defaultOptions: DaysFilterOption[] = [
  { value: 7, label: "7 Days" },
  { value: 30, label: "30 Days" },
  { value: 90, label: "90 Days" },
  { value: 365, label: "1 Year" },
  { value: "all", label: "All Time" },
];

export const DaysFilter = forwardRef<HTMLDivElement, DaysFilterProps>(
  ({ options = defaultOptions, value, onChange, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg bg-neutral-5 p-1",
          className,
        )}
        {...props}
      >
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange?.(option.value)}
              className={cn(
                dayFilterVariants({ state: isActive ? "active" : "inactive" }),
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  },
);

DaysFilter.displayName = "DaysFilter";
