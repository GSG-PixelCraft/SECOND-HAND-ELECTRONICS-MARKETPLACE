import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-md",
    "font-medium",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-primary",
          "text-primary-foreground",
          "hover:bg-primary/90",
          "focus:ring-primary-20",
        ],
        secondary: [
          "bg-secondary",
          "text-secondary-foreground",
          "hover:bg-secondary/90",
          "focus:ring-secondary-20",
        ],
        outline: [
          "bg-white",
          "border",
          "border-neutral-20",
          "text-neutral-foreground",
          "hover:bg-neutral-5",
          "focus:ring-neutral-20",
        ],
        danger: [
          "bg-error",
          "text-error-foreground",
          "hover:bg-error/90",
          "focus:ring-error-20",
        ],
      },
      size: {
        sm: "px-3 py-1.5 text-caption",
        md: "px-4 py-2 text-body",
        lg: "px-5 py-2.5 text-bodyLg",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "size"
> {
  intent?: ButtonVariantProps["intent"];
  size?: ButtonVariantProps["size"];
  fullWidth?: ButtonVariantProps["fullWidth"];
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, intent, size, fullWidth, children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ intent, size, fullWidth }), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
