import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

export interface ShowProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  label?: string;
}

export const Show = forwardRef<HTMLDivElement, ShowProps>(
  (
    {
      value,
      onChange,
      options = [10, 25, 50, 100],
      label = "Show",
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <Text variant="body" className="text-neutral-60 font-medium">
          {label}
        </Text>
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="text-neutral-90 hover:border-neutral-30 rounded-md border border-neutral-20 bg-white px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Text variant="body" className="text-neutral-60 font-medium">
          entries
        </Text>
      </div>
    );
  },
);

Show.displayName = "Show";
