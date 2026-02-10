import { Span } from "@/components/ui/span";

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85">
      <div className="flex flex-col items-center gap-6 text-white">
        <svg
          viewBox="0 0 50 50"
          className="h-14 w-14 animate-spin"
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, index) => {
            const angle = (index * Math.PI) / 4;
            const radius = 18;
            const cx = 25 + radius * Math.cos(angle);
            const cy = 25 + radius * Math.sin(angle);
            const opacity = (index + 1) / 8;
            return (
              <circle
                key={`dot-${index}`}
                cx={cx}
                cy={cy}
                r={3}
                fill="white"
                opacity={opacity}
              />
            );
          })}
        </svg>
        <Span className="text-[20px] font-normal">{message}</Span>
      </div>
    </div>
  );
};
