import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva(
  [
    "relative",
    "w-full",
    "rounded-md",
    "border",
    "p-4",
    "text-sm",
    "flex",
    "items-start",
    "gap-3",
  ],
  {
    variants: {
      variant: {
        error: "border-red-500 bg-red-50 text-red-700",
        warning: "border-yellow-500 bg-yellow-50 text-yellow-700",
        info: "border-blue-500 bg-blue-50 text-blue-700",
        success: "border-green-500 bg-green-50 text-green-700",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  },
);

type AlertVariantProps = VariantProps<typeof alertVariants>;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, AlertVariantProps {}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert({ variant, className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        role="alert"
        className={`${alertVariants({ variant })} ${className ?? ""}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Alert.displayName = "Alert";
