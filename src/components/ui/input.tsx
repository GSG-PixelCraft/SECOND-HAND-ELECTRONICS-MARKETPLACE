// src/components/ui/Input.tsx
import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { Text } from "./text";

const inputVariants = cva(
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

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;

  helperText?: string;

  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, intent, size, label, helperText, error, id, ...props },
    ref,
  ): ReactElement => {
    const inputId = useId();

    const resolvedId = id ?? inputId;

    const helperId = helperText ? `${resolvedId}-help` : undefined;
    const errorId = error ? `${resolvedId}-error` : undefined;
    const describedBy = error ? errorId : helperId;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={resolvedId}
            className="text-label text-neutral-foreground"
          >
            {label}
          </label>
        )}

        <input
          id={resolvedId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={twMerge(
            inputVariants({
              intent: error ? "error" : intent,
              size,
              className,
            }),
          )}
          {...props}
        />

        {error ? (
          <Text id={errorId} className="text-caption text-error-foreground">
            {error}
          </Text>
        ) : helperText ? (
          <Text variant="muted" className="text-caption" id={helperId}>
            {helperText}
          </Text>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
