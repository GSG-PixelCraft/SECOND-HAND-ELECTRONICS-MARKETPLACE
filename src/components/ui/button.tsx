import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  // Minimal base styles that don't conflict with custom styling
  ["disabled:opacity-50", "disabled:cursor-not-allowed"],
  {
    variants: {
      intent: {
        primary: [
          "inline-flex",
          "items-center",
          "justify-center",
          "rounded-md",
          "font-medium",
          "transition-colors",
          "bg-primary",
          "text-primary-foreground",
          "hover:bg-primary/90",
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-offset-2",
          "focus:ring-primary-20",
        ],
        secondary: [
          "inline-flex",
          "items-center",
          "justify-center",
          "rounded-md",
          "font-medium",
          "transition-colors",
          "bg-secondary",
          "text-secondary-foreground",
          "hover:bg-secondary/90",
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-offset-2",
          "focus:ring-secondary-20",
        ],
        outline: [
          "inline-flex",
          "items-center",
          "justify-center",
          "rounded-md",
          "font-medium",
          "transition-colors",
          "bg-white",
          "border",
          "border-neutral-20",
          "text-neutral-foreground",
          "hover:bg-neutral-5",
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-offset-2",
          "focus:ring-neutral-20",
        ],
        danger: [
          "inline-flex",
          "items-center",
          "justify-center",
          "rounded-md",
          "font-medium",
          "transition-colors",
          "bg-error",
          "text-error-foreground",
          "hover:bg-error/90",
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-offset-2",
          "focus:ring-error-20",
        ],
        ghost: [
          "inline-flex",
          "items-center",
          "justify-center",
          "rounded-md",
          "font-medium",
          "transition-colors",
          "bg-transparent",
          "text-neutral-foreground",
          "hover:bg-neutral-5",
          "focus:outline-none",
        ],
      },
      size: {
        sm: "px-3 py-1.5 ",
        md: "px-4 py-2 y",
        lg: "px-5 py-2.5 ",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    // Remove default variants - only apply when explicitly specified
    defaultVariants: {},
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
    { type = "button", className, intent, size, fullWidth, children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ intent, size, fullWidth }), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
