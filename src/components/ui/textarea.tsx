import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const textareaVariants = cva(
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
    "resize-none",
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

export interface TextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, intent, size, ...props }, ref) {
    const ariaInvalid =
      props["aria-invalid"] ?? (intent === "error" ? true : undefined);
    return (
      <textarea
        ref={ref}
        aria-invalid={ariaInvalid}
        className={`${textareaVariants({ intent, size })} ${className ?? ""}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
