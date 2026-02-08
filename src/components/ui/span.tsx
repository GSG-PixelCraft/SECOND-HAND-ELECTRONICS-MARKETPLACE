import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const spanVariants = cva("", {
  variants: {
    variant: {
      body: "text-body text-neutral-foreground",
      bodyLg: "text-bodyLg text-neutral-foreground",
      bodySmall: "text-bodySmall text-neutral-foreground",
      caption: "text-caption text-neutral-foreground",
      label: "text-label text-neutral-foreground",
      muted: "text-caption text-muted-foreground",
      primary: "text-bodySmall font-medium text-primary",
      success: "text-bodySmall font-medium text-success",
      warning: "text-bodySmall font-medium text-warning",
      error: "text-bodySmall font-medium text-error",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type SpanVariantProps = VariantProps<typeof spanVariants>;

export interface SpanProps
  extends React.HTMLAttributes<HTMLSpanElement>, SpanVariantProps {}

export const Span = React.forwardRef<HTMLSpanElement, SpanProps>(function Span(
  { className, variant, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(spanVariants({ variant }), className)}
      {...props}
    />
  );
});

Span.displayName = "Span";
