import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

export interface ToggleControlPanelProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export const ToggleControlPanel = forwardRef<
  HTMLDivElement,
  ToggleControlPanelProps
>(
  (
    {
      label,
      description,
      enabled,
      onToggle,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between rounded-lg border border-neutral-20 bg-white p-4 transition-colors",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        <div className="flex-1">
          <Text variant="body" className="text-neutral-90 font-semibold">
            {label}
          </Text>
          {description && (
            <Text variant="caption" className="text-neutral-60 mt-1">
              {description}
            </Text>
          )}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={disabled}
          onClick={() => !disabled && onToggle(!enabled)}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            enabled ? "bg-primary" : "bg-neutral-30",
            disabled && "cursor-not-allowed",
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              enabled ? "translate-x-5" : "translate-x-0",
            )}
          />
        </button>
      </div>
    );
  },
);

ToggleControlPanel.displayName = "ToggleControlPanel";
