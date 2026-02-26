import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";
import { Span } from "@/components/ui/Span/span";

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
          <Text variant="muted" className="text-xs">
            Status
          </Text>
          {actionLabel && (
            <Button
              type="button"
              onClick={onAction}
              className="text-xs font-semibold text-primary"
            >
              {actionLabel}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${chip}`}
          >
            {label}
          </Span>
        </div>
        <Text variant="muted" className="text-xs">
          {message}
        </Text>
      </CardContent>
    </Card>
  );
};
