import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-body text-neutral-foreground",
      bodyLg: "text-bodyLg text-neutral-foreground",
      bodySmall: "text-bodySmall text-neutral-foreground",
      caption: "text-caption text-neutral-foreground",
      label: "text-label text-neutral-foreground",
      muted: "text-body text-muted-foreground",
      error: "text-caption text-error",
      success: "text-caption text-success",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TextVariantProps = VariantProps<typeof textVariants>;

export interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>, TextVariantProps {}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { className, variant, ...props },
  ref,
) {
  return (
    <p
      ref={ref}
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
});

Text.displayName = "Text";
