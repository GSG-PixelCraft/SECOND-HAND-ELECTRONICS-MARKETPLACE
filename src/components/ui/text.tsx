import { forwardRef } from "react";
import type { ElementType, HTMLAttributes } from "react";
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
      h3: "text-h3 text-neutral-foreground",
      displaySm: "text-h4 text-neutral-foreground",
      primary: "text-body text-primary",
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
  extends HTMLAttributes<HTMLElement>, TextVariantProps {
  as?: ElementType;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { className, variant, as: Component = "p", ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
});

Text.displayName = "Text";
