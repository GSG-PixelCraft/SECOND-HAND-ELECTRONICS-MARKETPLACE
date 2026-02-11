import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Span } from "@/components/ui/span";
import { cn } from "@/lib/utils";

export interface BulkActionsToolbarProps {
  selectedCount: number;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
  onClearSelection: () => void;
  availableActions?: ("approve" | "reject" | "delete")[];
  className?: string;
}

export const BulkActionsToolbar = forwardRef<
  HTMLDivElement,
  BulkActionsToolbarProps
>(
  (
    {
      selectedCount,
      onApprove,
      onReject,
      onDelete,
      onClearSelection,
      availableActions = ["approve", "reject", "delete"],
      className,
    },
    ref,
  ) => {
    if (selectedCount === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "sticky top-0 z-10 flex items-center justify-between gap-4 rounded-lg border border-primary-20 bg-primary-5 px-6 py-4 shadow-sm",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {selectedCount}
          </div>
          <Span variant="label" className="font-medium">
            {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
          </Span>
        </div>

        <div className="flex items-center gap-2">
          {availableActions.includes("approve") && onApprove && (
            <Button
              intent="primary"
              size="sm"
              onClick={onApprove}
              className="bg-success hover:bg-success/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Approve
            </Button>
          )}

          {availableActions.includes("reject") && onReject && (
            <Button
              intent="danger"
              size="sm"
              onClick={onReject}
              className="bg-warning hover:bg-warning/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              Reject
            </Button>
          )}

          {availableActions.includes("delete") && onDelete && (
            <Button intent="danger" size="sm" onClick={onDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              Delete
            </Button>
          )}

          <Button intent="outline" size="sm" onClick={onClearSelection}>
            Clear
          </Button>
        </div>
      </div>
    );
  },
);

BulkActionsToolbar.displayName = "BulkActionsToolbar";
