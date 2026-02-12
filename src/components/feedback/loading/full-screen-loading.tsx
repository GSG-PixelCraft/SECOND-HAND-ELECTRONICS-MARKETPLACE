import { useEffect, type ReactNode } from "react";
import { Portal } from "@/components/ui/portal";

export interface FullScreenLoadingProps {
  open?: boolean;
  message?: ReactNode;
  ariaLabel?: string;
}

export function FullScreenLoading({
  open = true,
  message = "Loading...",
  ariaLabel = "Loading",
}: FullScreenLoadingProps) {
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50"
        role="status"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        <div className="flex min-w-[220px] flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-neutral-60 whitespace-pre-wrap text-center text-sm font-medium">
            {message}
          </p>
        </div>
      </div>
    </Portal>
  );
}
