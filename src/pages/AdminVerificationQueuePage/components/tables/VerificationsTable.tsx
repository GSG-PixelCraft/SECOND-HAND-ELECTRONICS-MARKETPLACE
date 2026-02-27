import { forwardRef } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Span } from "@/components/ui/Span/span";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { cn } from "@/lib/utils";
import { getAdminVerificationReviewRoute } from "@/constants/routes";
import type { VerificationSubmission } from "@/types/admin";

export interface VerificationsTableProps {
  verifications: VerificationSubmission[];
  onRowClick?: (verification: VerificationSubmission) => void;
  className?: string;
}

export const VerificationsTable = forwardRef<
  HTMLDivElement,
  VerificationsTableProps
>(({ verifications, onRowClick, className }, ref) => {
  const navigate = useNavigate();

  const handleRowClick = (verification: VerificationSubmission) => {
    if (onRowClick) {
      onRowClick(verification);
    } else {
      navigate(getAdminVerificationReviewRoute(verification.id));
    }
  };

  const handleViewClick = (e: MouseEvent, verificationId: string) => {
    e.stopPropagation();
    navigate(getAdminVerificationReviewRoute(verificationId));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusVariant = (
    status: string,
  ): "pending" | "active" | "rejected" => {
    switch (status) {
      case "approved":
        return "active";
      case "rejected":
        return "rejected";
      case "pending":
      default:
        return "pending";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
      default:
        return "Pending";
    }
  };

  return (
    <div ref={ref} className={cn("flex flex-col gap-2", className)}>
      {/* Table Header */}
      <div className="flex h-12 items-center overflow-hidden rounded-xl bg-primary/10">
        <div className="flex w-[100px] items-center gap-1 px-4">
          <Span className="text-neutral-90 text-sm font-medium">ID</Span>
          <div className="flex h-4 w-4 items-center justify-center">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              className="text-primary"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-1 px-4">
          <Span className="text-neutral-90 text-sm font-medium">User</Span>
        </div>

        <div className="flex w-[180px] items-center gap-1 px-4">
          <Span className="text-neutral-90 text-sm font-medium">
            Document Type
          </Span>
          <div className="flex h-4 w-4 items-center justify-center">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              className="text-primary"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex w-[180px] items-center gap-1 px-4">
          <Span className="text-neutral-90 text-sm font-medium">
            Submitted Date
          </Span>
          <div className="flex h-4 w-4 items-center justify-center">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              className="text-primary"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex w-[120px] items-center gap-1 px-4">
          <Span className="text-neutral-90 text-sm font-medium">Status</Span>
          <div className="flex h-4 w-4 items-center justify-center">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              className="text-primary"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex w-[100px] items-center px-4">
          <Span className="text-neutral-90 text-sm font-medium">Actions</Span>
        </div>
      </div>

      {/* Table Rows */}
      {verifications.map((verification) => (
        <div
          key={verification.id}
          onClick={() => handleRowClick(verification)}
          className="flex h-16 cursor-pointer items-center overflow-hidden rounded-xl border border-neutral-20 bg-white transition-colors hover:bg-neutral-10"
        >
          {/* ID Column */}
          <div className="flex w-[100px] items-center px-4">
            <Span className="text-neutral-70 text-sm font-normal">
              #{verification.id}
            </Span>
          </div>

          {/* User Column */}
          <div className="flex flex-1 items-center gap-3 px-4">
            {verification.userAvatar ? (
              <img
                src={verification.userAvatar}
                alt={verification.userName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {verification.userName.charAt(0)}
              </div>
            )}
            <Span className="text-neutral-90 text-sm font-medium">
              {verification.userName}
            </Span>
          </div>

          {/* Document Type Column */}
          <div className="flex w-[160px] items-center px-4">
            <Span className="text-neutral-70 text-sm font-normal">
              {verification.documentType}
            </Span>
          </div>

          {/* Submitted Date Column */}
          <div className="flex w-[160px] items-center px-4">
            <Span className="text-neutral-70 text-sm font-normal">
              {formatDate(verification.submittedDate)}
            </Span>
          </div>

          {/* Status Column */}
          <div className="flex w-[120px] items-center px-4">
            <StatusBadge variant={getStatusVariant(verification.status)}>
              {getStatusLabel(verification.status)}
            </StatusBadge>
          </div>

          {/* Actions Column */}
          <div className="flex w-[100px] items-center px-4">
            <button
              onClick={(e) => handleViewClick(e, verification.id)}
              className="border-neutral-30 text-neutral-70 flex h-8 w-8 items-center justify-center rounded-lg border bg-white transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
              aria-label="View details"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

VerificationsTable.displayName = "VerificationsTable";
