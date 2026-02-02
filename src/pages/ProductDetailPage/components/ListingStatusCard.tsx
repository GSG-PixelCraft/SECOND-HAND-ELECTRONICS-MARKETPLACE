import { Card, CardContent } from "@/components/ui/Card";

type ListingStatus = "pending" | "rejected";

interface ListingStatusCardProps {
  status: ListingStatus;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const statusStyles: Record<ListingStatus, { chip: string; label: string }> = {
  pending: {
    chip: "bg-warning-10 text-warning",
    label: "Pending",
  },
  rejected: {
    chip: "bg-error-10 text-error",
    label: "Rejected",
  },
};

export const ListingStatusCard = ({
  status,
  message,
  actionLabel,
  onAction,
}: ListingStatusCardProps) => {
  const { chip, label } = statusStyles[status];

  return (
    <Card className="gap-2 rounded-2xl border border-neutral-10 bg-white">
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Status</p>
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="text-xs font-semibold text-primary"
            >
              {actionLabel}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${chip}`}
          >
            {label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
};
