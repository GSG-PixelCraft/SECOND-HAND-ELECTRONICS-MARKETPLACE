// src/components/ui/checkbox.tsx
import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { Span } from "./span";
import { Text } from "./text";

const checkboxVariants = cva(
  [
    "rounded",
    "border",
    "transition-colors",
    "cursor-pointer",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-1",
  ],
  {
    variants: {
      intent: {
        default: [
          "border-neutral-20",
          "text-primary",
          "focus:ring-primary-20",
          "checked:bg-primary",
          "checked:border-primary",
        ],
        error: [
          "border-error",
          "text-error",
          "focus:ring-error-20",
          "checked:bg-error",
          "checked:border-error",
        ],
      },
      size: {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      intent: "default",
      size: "md",
    },
  },
);

export interface CheckboxProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, intent, size, label, helperText, error, id, ...props },
    ref,
  ): ReactElement => {
    const checkboxId = useId();
    const resolvedId = id ?? checkboxId;

    const helperId = helperText ? `${resolvedId}-help` : undefined;
    const errorId = error ? `${resolvedId}-error` : undefined;
    const describedBy = error ? errorId : helperId;

    const effectiveIntent = error ? "error" : intent;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={resolvedId}
            ref={ref}
            className={twMerge(
              checkboxVariants({ intent: effectiveIntent, size }),
              className,
            )}
            aria-describedby={describedBy}
            aria-invalid={error ? "true" : undefined}
            {...props}
          />
          {label && (
            <label htmlFor={resolvedId} className="cursor-pointer">
              <Span variant="caption">{label}</Span>
            </label>
          )}
        </div>

        {helperText && !error && (
          <Text variant="muted" className="text-caption" id={helperId}>
            {helperText}
          </Text>
        )}

        {error && (
          <Text variant="error" className="text-caption" id={errorId}>
            {error}
          </Text>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
