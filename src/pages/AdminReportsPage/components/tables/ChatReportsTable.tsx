import { forwardRef } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Eye } from "lucide-react";
import { Span } from "@/components/ui/span";
import { Image } from "@/components/ui/image";
import { ReportReasonBadge } from "@/components/admin";
import { cn } from "@/lib/utils";
import { getAdminReportDetailRoute } from "@/constants/routes";
import type { ChatReport } from "@/types/admin";

export interface ChatReportsTableProps {
  reports: ChatReport[];
  className?: string;
}

const formatDate = (dateString: string) => {
  try {
    const formatted = new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formatted.replaceAll("/", "-");
  } catch {
    return dateString;
  }
};

export const ChatReportsTable = forwardRef<
  HTMLDivElement,
  ChatReportsTableProps
>(({ reports, className }, ref) => {
  const navigate = useNavigate();

  const handleRowClick = (report: ChatReport) => {
    navigate(getAdminReportDetailRoute("chat", report.id));
  };

  const handleViewClick = (e: MouseEvent, reportId: string) => {
    e.stopPropagation();
    navigate(getAdminReportDetailRoute("chat", reportId));
  };

  return (
    <div ref={ref} className={cn("overflow-hidden rounded-xl", className)}>
      <div className="flex h-12 items-center bg-primary/10">
        <div className="flex w-[140px] items-center gap-1 px-4">
          <Span className="text-neutral-90 text-sm font-medium">Report ID</Span>
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
              />
            </svg>
          </div>
        </div>
        <div className="flex w-[260px] items-center gap-1 px-4">
          <Span className="text-neutral-90 text-sm font-medium">
            Reported user
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
              />
            </svg>
          </div>
        </div>
        <div className="flex w-[240px] items-center gap-1 px-4">
          <Span className="text-neutral-90 text-sm font-medium">
            Reported by
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
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-1 px-4">
          <Span className="text-neutral-90 text-sm font-medium">
            Report reason
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
              />
            </svg>
          </div>
        </div>
        <div className="flex w-[180px] items-center gap-1 px-4">
          <Span className="text-neutral-90 text-sm font-medium">
            Submission date
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
              />
            </svg>
          </div>
        </div>
        <div className="flex w-[80px] items-center justify-center px-4">
          <Span className="text-neutral-90 text-sm font-medium">Actions</Span>
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
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white">
        {reports.map((report) => (
          <div
            key={report.id}
            onClick={() => handleRowClick(report)}
            className="flex h-16 cursor-pointer items-center border-b border-neutral-10 transition-colors hover:bg-neutral-5"
          >
            <div className="flex w-[140px] items-center px-4">
              <Span className="text-neutral-70 text-sm font-normal">
                #{report.id}
              </Span>
            </div>

            <div className="flex w-[260px] items-center gap-2 px-4">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-neutral-10">
                {report.reportedUser.avatar ? (
                  <Image
                    src={report.reportedUser.avatar}
                    alt={report.reportedUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-primary">
                    {report.reportedUser.name.charAt(0)}
                  </span>
                )}
              </div>
              <Span className="text-neutral-70 max-w-[140px] truncate text-sm">
                {report.reportedUser.name}
              </Span>
              {report.reportedUser.isFlagged && (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
            </div>

            <div className="flex w-[240px] items-center gap-2 px-4">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-neutral-10">
                {report.reporter.avatar ? (
                  <Image
                    src={report.reporter.avatar}
                    alt={report.reporter.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-primary">
                    {report.reporter.name.charAt(0)}
                  </span>
                )}
              </div>
              <Span className="text-neutral-70 max-w-[140px] truncate text-sm">
                {report.reporter.name}
              </Span>
              {report.reporter.isFlagged && (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
            </div>

            <div className="flex flex-1 items-center px-4">
              <ReportReasonBadge reason={report.reason} />
            </div>

            <div className="flex w-[160px] items-center px-4">
              <Span className="text-neutral-70 text-sm font-normal">
                {formatDate(report.submittedAt)}
              </Span>
            </div>

            <div className="flex w-[80px] items-center justify-center px-4">
              <button
                onClick={(e) => handleViewClick(e, report.id)}
                className="text-neutral-50 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label="View details"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ChatReportsTable.displayName = "ChatReportsTable";
