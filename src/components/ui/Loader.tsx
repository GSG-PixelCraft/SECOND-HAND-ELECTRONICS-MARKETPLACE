import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const loaderVariants = cva(
  [
    "inline-block",
    "animate-spin",
    "rounded-full",
    "border-2",
    "border-neutral-20",
    "border-t-primary",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type LoaderVariantProps = VariantProps<typeof loaderVariants>;

export interface LoaderProps extends LoaderVariantProps {
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size, className }) => {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={loaderVariants({ size, className })}
    />
  );
};

Loader.displayName = "Loader";
