import { useEffect } from "react";
import { Portal } from "@/components/ui/portal";

export interface FullScreenLoadingOverlayProps {
  open: boolean;
}

export function FullScreenLoadingOverlay({
  open,
}: FullScreenLoadingOverlayProps) {
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
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        </div>
      </div>
    </Portal>
  );
}
