import type { FC } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Span } from "../Span/span";

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

export const Loader: FC<LoaderProps> = ({ size, className }) => {
  return (
    <Span
      role="status"
      aria-label="Loading"
      className={loaderVariants({ size, className })}
    />
  );
};

Loader.displayName = "Loader";
