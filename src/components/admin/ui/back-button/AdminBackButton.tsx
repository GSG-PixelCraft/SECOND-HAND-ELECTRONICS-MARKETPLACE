import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminBackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconClassName?: string;
}

export const AdminBackButton = forwardRef<
  HTMLButtonElement,
  AdminBackButtonProps
>(({ className, iconClassName, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "text-neutral-60 hover:text-neutral-90 flex size-10 items-center justify-center rounded-full border border-neutral-20 bg-white transition-colors hover:bg-neutral-5",
        className,
      )}
      {...props}
    >
      <ArrowLeft className={cn("size-5", iconClassName)} />
    </button>
  );
});

AdminBackButton.displayName = "AdminBackButton";
