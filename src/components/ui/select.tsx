import * as React from "react";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";

const selectVariants = cva(
  [
    "w-full",
    "rounded-md",
    "border",
    "bg-white",
    "text-body",
    "outline-none",
    "transition-colors",
    "placeholder:text-muted-foreground",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      intent: {
        default: [
          "border-neutral-20",
          "focus:border-primary",
          "focus:ring-1",
          "focus:ring-primary-20",
        ],
        error: [
          "border-error",
          "focus:border-error",
          "focus:ring-1",
          "focus:ring-error-20",
        ],
        success: [
          "border-success",
          "focus:border-success",
          "focus:ring-1",
          "focus:ring-success-20",
        ],
      },
      size: {
        sm: "px-2 py-1.5 text-caption",
        md: "px-3 py-2 text-body",
        lg: "px-4 py-2.5 text-bodyLg",
      },
    },
    defaultVariants: {
      intent: "default",
      size: "md",
    },
  },
);

type SelectVariantProps = VariantProps<typeof selectVariants>;

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  intent?: SelectVariantProps["intent"];
  size?: SelectVariantProps["size"];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { intent, size, helperText, error, id, className, children, ...props },
    ref,
  ) {
    const autoId = React.useId();
    const resolvedId = id ?? autoId;
    const helperId = helperText ? `${resolvedId}-help` : undefined;
    const errorId = error ? `${resolvedId}-error` : undefined;
    const describedBy = error ? errorId : helperId;

    return (
      <div className="flex flex-col gap-2">
        <select
          id={resolvedId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={twMerge(
            selectVariants({
              intent: error ? "error" : intent,
              size,
            }),
            className,
          )}
          {...props}
        >
          {children}
        </select>

        {error ? (
          <p id={errorId} className="text-caption text-error-foreground">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-caption text-muted-foreground">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
