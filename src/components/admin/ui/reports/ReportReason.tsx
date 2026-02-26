import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text/text";
import { Span } from "@/components/ui/Span/span";

export interface ReportReasonOption {
  value: string;
  label: string;
  description?: string;
}

export interface ReportReasonProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  options?: ReportReasonOption[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
  mode?: "display" | "select";
}

const defaultOptions: ReportReasonOption[] = [
  {
    value: "spam",
    label: "Spam",
    description: "Repetitive or irrelevant content",
  },
  {
    value: "inappropriate",
    label: "Inappropriate Content",
    description: "Offensive or harmful material",
  },
  {
    value: "scam",
    label: "Scam or Fraud",
    description: "Suspicious or fraudulent activity",
  },
  {
    value: "counterfeit",
    label: "Counterfeit Product",
    description: "Fake or unauthorized items",
  },
  {
    value: "other",
    label: "Other",
    description: "Other reasons not listed",
  },
];

export const ReportReason = forwardRef<HTMLDivElement, ReportReasonProps>(
  (
    {
      options = defaultOptions,
      selectedValue,
      onSelect,
      mode = "select",
      className,
      ...props
    },
    ref,
  ) => {
    if (mode === "display" && selectedValue) {
      const selected = options.find((opt) => opt.value === selectedValue);
      if (!selected) return null;

      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-error/20 bg-error/5 px-3 py-2",
            className,
          )}
          {...props}
        >
          <div className="h-2 w-2 rounded-full bg-error" />
          <div>
            <Text variant="body" className="font-semibold text-error">
              {selected.label}
            </Text>
            {selected.description && (
              <Span variant="caption" className="text-error/70">
                {selected.description}
              </Span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onSelect?.(option.value)}
              className={cn(
                "w-full rounded-lg border p-4 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "hover:border-neutral-30 border-neutral-20 bg-white hover:bg-neutral-5",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2",
                    isSelected ? "border-primary" : "border-neutral-30",
                  )}
                >
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <Text
                    variant="body"
                    className="text-neutral-90 mb-1 font-semibold"
                  >
                    {option.label}
                  </Text>
                  {option.description && (
                    <Span variant="caption" className="text-neutral-60">
                      {option.description}
                    </Span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  },
);

ReportReason.displayName = "ReportReason";
