interface ReportLoadingOverlayProps {
  open: boolean;
  message?: string;
}

export const ReportLoadingOverlay = ({
  open,
  message = "Waiting...",
}: ReportLoadingOverlayProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/40 border-t-white" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};
