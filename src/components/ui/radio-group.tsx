// src/components/ui/radio-group.tsx
import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const radioVariants = cva(
  [
    "rounded-full",
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

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof radioVariants> {
  options: RadioOption[];
  label?: string;
  helperText?: string;
  error?: string;
  orientation?: "horizontal" | "vertical";
  name: string;
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    {
      className,
      intent,
      size,
      options,
      label,
      helperText,
      error,
      orientation = "vertical",
      name,
      id,
      ...props
    },
    ref,
  ): ReactElement => {
    const groupId = useId();
    const resolvedId = id ?? groupId;

    const helperId = helperText ? `${resolvedId}-help` : undefined;
    const errorId = error ? `${resolvedId}-error` : undefined;
    const describedBy = error ? errorId : helperId;

    const effectiveIntent = error ? "error" : intent;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-label text-neutral-foreground">{label}</label>
        )}

        <div
          className={twMerge(
            "flex gap-4",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          )}
          role="radiogroup"
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
        >
          {options.map((option, index) => {
            const optionId = `${resolvedId}-${option.value}`;
            return (
              <div key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  ref={index === 0 ? ref : undefined}
                  disabled={option.disabled}
                  className={twMerge(
                    radioVariants({ intent: effectiveIntent, size }),
                    className,
                  )}
                  {...props}
                />
                <label
                  htmlFor={optionId}
                  className="cursor-pointer text-caption text-neutral-foreground"
                >
                  {option.label}
                </label>
              </div>
            );
          })}
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

RadioGroup.displayName = "RadioGroup";
