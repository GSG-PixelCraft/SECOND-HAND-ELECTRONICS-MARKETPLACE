import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Ban,
  BadgeCheck,
  Calendar,
  Camera,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  MapPin,
  MessageCircle,
  Mic,
  MinusCircle,
  Paperclip,
  Smile,
  X,
  XCircle,
} from "lucide-react";
import { AdminBackButton } from "@/components/admin/ui/back-button/AdminBackButton";
import { ReportReasonBadge } from "@/components/admin/ui/reports/ReportReasonBadge";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Portal } from "@/components/ui/portal";
import { useAdminReportDetail } from "@/services/admin-reports.service";
import type {
  AccountHistoryItem,
  ChatReportDetails,
  HideReason,
  ListingReportDetails,
  ReportChatMessage,
  ReportDetail,
  ReportMetric,
  ReportType,
  RiskIndicator,
  RiskLevel,
  TrustIndicator,
  UserReportDetails,
} from "@/types/admin";
import { cn } from "@/lib/utils";
import { getAdminUserDetailRoute } from "@/constants/routes";
import { WarnUserModal } from "@/pages/AdminUserDetailPage/modals/WarnUserModal";
import { HideListingModal } from "@/components/admin/modals/HideListingModal";

const cardClassName = "rounded-2xl border border-neutral-10 bg-white p-6";

const riskBadgeStyles: Record<RiskLevel, string> = {
  "High Risk": "bg-error/10 text-error",
  "Medium Risk": "bg-warning/10 text-warning",
  "Low Risk": "bg-neutral-10 text-neutral-60",
};

type MetricTone = NonNullable<ReportMetric["valueTone"]> | "default";

const metricToneStyles: Record<MetricTone, string> = {
  default: "text-neutral-90",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-error",
};

const trustIndicatorStyles: Record<TrustIndicator["status"], string> = {
  verified: "text-success",
  unverified: "text-error",
};

const riskIconMap: Record<string, ComponentType<{ className?: string }>> = {
  warnings: AlertTriangle,
  suspension: MinusCircle,
  ban: Ban,
};

const accountHistoryIconMap: Record<
  AccountHistoryItem["iconType"],
  ComponentType<{ className?: string }>
> = {
  report: FileText,
  warning: AlertTriangle,
  suspension: MinusCircle,
  ban: Ban,
};

const accountHistoryIconStyles: Record<AccountHistoryItem["iconType"], string> =
  {
    report: "text-neutral-60",
    warning: "text-warning",
    suspension: "text-error",
    ban: "text-error",
  };

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const normalizedHours = hours % 12 || 12;
  return `${normalizedHours}:${minutes.toString().padStart(2, "0")}`;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const isValidReportType = (value?: string): value is ReportType =>
  value === "listing" || value === "user" || value === "chat";

function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        riskBadgeStyles[level],
      )}
    >
      {level}
    </span>
  );
}

function MetricTile({ metric }: { metric: ReportMetric }) {
  const tone = metric.valueTone || "default";
  return (
    <div className="rounded-xl bg-[#f9fafb] px-4 py-3">
      <Span className="text-neutral-50 text-xs">{metric.label}</Span>
      <Text
        variant="body"
        className={cn("mt-2 text-lg font-semibold", metricToneStyles[tone])}
      >
        {metric.value}
      </Text>
    </div>
  );
}

function MetricsRow({
  metrics,
  columns = 4,
}: {
  metrics?: ReportMetric[];
  columns?: number;
}) {
  if (!metrics?.length) return null;
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 4
          ? "grid-cols-2 lg:grid-cols-4"
          : columns === 3
            ? "grid-cols-1 sm:grid-cols-3"
            : "grid-cols-2",
      )}
    >
      {metrics.map((metric) => (
        <MetricTile key={metric.label} metric={metric} />
      ))}
    </div>
  );
}

function TrustIndicatorsList({
  indicators,
}: {
  indicators?: TrustIndicator[];
}) {
  if (!indicators?.length) return null;
  return (
    <div className="space-y-4">
      {indicators.map((indicator) => {
        const Icon = indicator.status === "verified" ? CheckCircle : XCircle;
        return (
          <div key={indicator.label} className="flex items-center gap-3">
            <Icon
              className={cn("h-5 w-5", trustIndicatorStyles[indicator.status])}
            />
            <Span className="text-neutral-70 text-sm">{indicator.label}</Span>
            <Span className="text-neutral-40 ml-auto text-xs">
              {indicator.date}
            </Span>
          </div>
        );
      })}
    </div>
  );
}

function RiskIndicatorsList({ indicators }: { indicators?: RiskIndicator[] }) {
  if (!indicators?.length) return null;
  return (
    <div className="space-y-4">
      {indicators.map((indicator) => {
        const Icon =
          riskIconMap[indicator.label.toLowerCase()] || AlertTriangle;
        const isWarning = indicator.label.toLowerCase() === "warnings";
        const countColor = isWarning ? "text-warning" : "text-error";
        const iconColor = isWarning ? "text-warning" : "text-error";
        return (
          <div key={indicator.label} className="flex items-center gap-3">
            <Icon className={cn("h-5 w-5", iconColor)} />
            <Span className="text-neutral-70 text-sm">{indicator.label}</Span>
            <Span className={cn("ml-auto text-sm font-semibold", countColor)}>
              {indicator.count}
            </Span>
          </div>
        );
      })}
    </div>
  );
}

function AccountHistoryList({ items }: { items?: AccountHistoryItem[] }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const Icon = accountHistoryIconMap[item.iconType] || FileText;
        const iconTone = accountHistoryIconStyles[item.iconType];
        return (
          <div key={item.label} className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-5">
              <Icon className={cn("h-5 w-5", iconTone)} />
            </div>
            <div className="flex-1 space-y-1">
              <Text
                variant="body"
                className="text-neutral-90 text-sm font-medium"
              >
                {item.label}
              </Text>
              <Span className="text-neutral-40 text-xs">
                {item.date}
                {item.reason ? ` - ${item.reason}` : ""}
              </Span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ResolveMenuItem {
  key: string;
  label: string;
  onSelect: () => void;
  dividerBefore?: boolean;
  highlighted?: boolean;
}

function ResolveReportMenu({ items }: { items: ResolveMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Resolve Report
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-neutral-10 bg-white py-2 shadow-[0px_12px_30px_rgba(15,23,42,0.12)]"
        >
          {items.map((item) => (
            <div key={item.key}>
              {item.dividerBefore ? (
                <div className="my-1 h-px bg-neutral-10" />
              ) : null}
              <button
                type="button"
                onClick={() => {
                  item.onSelect();
                  setOpen(false);
                }}
                className={cn(
                  "text-neutral-80 flex w-full items-center px-4 py-2.5 text-sm hover:bg-neutral-5",
                  item.highlighted && "bg-neutral-5",
                )}
                role="menuitem"
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function WarnUserSuccessDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      onCancel={(event) => event.preventDefault()}
      className="w-full max-w-md rounded-2xl border border-neutral-10 bg-white p-8 text-center backdrop:bg-black/50"
    >
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <BadgeCheck className="h-8 w-8 text-success" />
        </div>
      </div>
      <h3 className="text-neutral-90 mt-4 text-lg font-semibold">
        Warning Sent Successfully
      </h3>
      <Text variant="body" className="text-neutral-60 mt-2 text-sm">
        The user has been sent a warning with your message. They retain full
        access to their account.
      </Text>
      <Button
        className="mt-6 h-12 w-full rounded-xl border-none bg-primary text-base font-medium text-white hover:bg-primary/90"
        onClick={onClose}
      >
        Done
      </Button>
    </Dialog>
  );
}

function WarnSellerModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const maxLength = 500;
  const isValid = message.trim().length > 0;

  useEffect(() => {
    if (!open) {
      setMessage("");
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      className="w-full max-w-md rounded-2xl border border-neutral-10 bg-white p-6 shadow-xl backdrop:bg-black/50"
    >
      <div className="space-y-5">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDB022]/10">
            <AlertTriangle className="h-8 w-8 text-[#FDB022]" />
          </div>
        </div>

        <h3 className="text-neutral-90 text-center text-xl font-semibold">
          Send a Warning to This User?
        </h3>
        <Text
          variant="body"
          className="text-neutral-60 text-center text-sm leading-relaxed"
        >
          The user will receive a warning message, but will maintain full access
          to their account.
        </Text>

        <div className="space-y-2">
          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value.slice(0, maxLength))
            }
            placeholder="Enter the reason for this warning..."
            rows={5}
            className="text-neutral-90 placeholder:text-neutral-40 h-32 w-full resize-none rounded-xl border border-neutral-20 p-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-neutral-50 text-right text-xs">
            ({message.length}/{maxLength})
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <Button
            className="h-12 w-full rounded-xl border-none bg-error text-base font-medium text-white hover:bg-error/90"
            disabled={!isValid}
            onClick={() => onConfirm(message.trim())}
          >
            Send Warning
          </Button>
          <Button
            intent="outline"
            className="text-neutral-70 h-12 w-full rounded-xl border border-neutral-20 text-base font-medium hover:bg-neutral-10"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

type RemoveListingReason =
  | "policy_violation"
  | "fraudulent_scam"
  | "copyright_ip"
  | "duplicate_spam"
  | "other";

const removeListingReasons: { value: RemoveListingReason; label: string }[] = [
  { value: "policy_violation", label: "Violation of marketplace policies" },
  { value: "fraudulent_scam", label: "Fraudulent or scam listing" },
  {
    value: "copyright_ip",
    label: "Copyright or intellectual property infringement",
  },
  { value: "duplicate_spam", label: "Duplicate or spam listing" },
  { value: "other", label: "Other" },
];

function RemoveListingModal({
  open,
  listingName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  listingName: string;
  onClose: () => void;
  onConfirm: (reason: RemoveListingReason, comment?: string) => void;
}) {
  const [selectedReason, setSelectedReason] = useState<
    RemoveListingReason | ""
  >("");
  const [comment, setComment] = useState("");
  const showComment = selectedReason === "other";
  const maxLength = 500;
  const isValid = selectedReason !== "";

  useEffect(() => {
    if (!open) {
      setSelectedReason("");
      setComment("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirm(selectedReason, showComment ? comment.trim() : undefined);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      className="w-full max-w-[760px] rounded-[28px] border border-neutral-10 bg-white p-8 shadow-xl backdrop:bg-black/60 md:p-10"
    >
      <div className="space-y-6">
        <div className="relative flex items-center justify-center">
          <h2 className="text-neutral-90 text-lg font-semibold">
            Remove Listing
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-50 hover:text-neutral-80 absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md border border-neutral-20"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <span className="sr-only">Listing: {listingName}</span>

        <div className="space-y-4">
          <p className="text-neutral-90 text-sm font-medium">
            Reason for Removing the list <span className="text-error">*</span>
          </p>
          <div className="space-y-3">
            {removeListingReasons.map((reason) => (
              <label
                key={reason.value}
                className="text-neutral-90 flex cursor-pointer items-center gap-3 text-sm"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    selectedReason === reason.value
                      ? "border-primary"
                      : "border-neutral-30",
                  )}
                >
                  {selectedReason === reason.value ? (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  ) : null}
                </span>
                <input
                  type="radio"
                  name="removeListingReason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={(event) =>
                    setSelectedReason(event.target.value as RemoveListingReason)
                  }
                  className="sr-only"
                />
                {reason.label}
              </label>
            ))}
          </div>
        </div>

        {showComment ? (
          <div className="space-y-2">
            <textarea
              value={comment}
              onChange={(event) =>
                setComment(event.target.value.slice(0, maxLength))
              }
              placeholder="If there are any other reasons or notes, please add them here and clearly explain what the user should fix."
              rows={4}
              className="text-neutral-90 placeholder:text-neutral-40 min-h-[160px] w-full resize-none rounded-2xl border border-neutral-20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-20"
            />
            <p className="text-neutral-50 text-right text-xs">
              ({comment.length}/{maxLength})
            </p>
          </div>
        ) : null}

        <div className="space-y-3">
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className="h-12 w-full rounded-xl border-none bg-error text-sm font-medium text-white hover:bg-error/90 disabled:opacity-60"
          >
            Confirm Removing
          </Button>
          <p className="text-neutral-50 text-center text-xs">
            The user will be notified with the reason and your comments.
          </p>
        </div>
      </div>
    </Dialog>
  );
}

function ReportActionConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  confirmTone = "danger",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmTone?: "danger" | "primary";
}) {
  const confirmClassName =
    confirmTone === "primary"
      ? "bg-primary text-white hover:bg-primary/90"
      : "bg-error text-white hover:bg-error/90";

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      className="w-full max-w-[360px] rounded-2xl border border-neutral-10 bg-white p-6 text-center backdrop:bg-black/50"
    >
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
      </div>
      <h3 className="text-neutral-90 mt-4 text-base font-semibold">{title}</h3>
      <Text
        variant="body"
        className="text-neutral-60 mt-2 text-xs leading-relaxed"
      >
        {description}
      </Text>
      <div className="mt-5 space-y-3">
        <Button
          className={cn(
            "h-10 w-full rounded-xl border-none text-sm font-semibold",
            confirmClassName,
          )}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
        <Button
          intent="outline"
          className="text-neutral-70 h-10 w-full rounded-xl border border-neutral-20 text-sm font-semibold hover:bg-neutral-5"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}

function ReportActionSuccessDialog({
  open,
  onClose,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      onCancel={(event) => event.preventDefault()}
      className="w-full max-w-md rounded-2xl border border-neutral-10 bg-white p-8 text-center backdrop:bg-black/50"
    >
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <BadgeCheck className="h-8 w-8 text-success" />
        </div>
      </div>
      <h3 className="text-neutral-90 mt-4 text-lg font-semibold">{title}</h3>
      <Text variant="body" className="text-neutral-60 mt-2 text-sm">
        {description}
      </Text>
      <Button
        className="mt-6 h-12 w-full rounded-xl border-none bg-primary text-base font-medium text-white hover:bg-primary/90"
        onClick={onClose}
      >
        Done
      </Button>
    </Dialog>
  );
}

function FullScreenLoadingOverlay({ open }: { open: boolean }) {
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

function ReportedByCard({
  report,
  onViewProfile,
}: {
  report: ReportDetail;
  onViewProfile: (id?: string) => void;
}) {
  const memberSince = report.reporter.memberSince
    ? `Member since ${report.reporter.memberSince}`
    : "";
  return (
    <div className={cardClassName}>
      <div className="flex items-center justify-between">
        <Text
          variant="body"
          className="text-neutral-90 text-base font-semibold"
        >
          Reported by:
        </Text>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-10">
          {report.reporter.avatar ? (
            <Image
              src={report.reporter.avatar}
              alt={report.reporter.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-primary">
              {getInitials(report.reporter.name)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <Text variant="body" className="text-neutral-90 font-semibold">
            {report.reporter.name}
          </Text>
          {memberSince ? (
            <Span className="text-neutral-50 text-xs">{memberSince}</Span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onViewProfile(report.reporter.id)}
          className="text-sm font-medium text-primary"
        >
          View Profile
        </button>
      </div>
      <div className="mt-4 space-y-2">
        <Span className="text-neutral-50 text-xs">Reason Tag:</Span>
        <Text variant="body" className="text-neutral-90 text-sm font-semibold">
          {report.reasonTagDetail || report.reason}
        </Text>
      </div>
    </div>
  );
}

function ReportedUserCard({
  title,
  user,
  onViewProfile,
}: {
  title: string;
  user: ReportDetail["reporter"];
  onViewProfile: (id?: string) => void;
}) {
  const memberSince = user.memberSince
    ? `Member since ${user.memberSince}`
    : "";
  return (
    <div className={cardClassName}>
      <Text variant="body" className="text-neutral-90 text-base font-semibold">
        {title}
      </Text>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-10">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-primary">
              {getInitials(user.name)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <Text variant="body" className="text-neutral-90 font-semibold">
            {user.name}
          </Text>
          {memberSince ? (
            <Span className="text-neutral-50 text-xs">{memberSince}</Span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onViewProfile(user.id)}
          className="text-sm font-medium text-primary"
        >
          View Profile
        </button>
      </div>
      {(user.prevReports !== undefined || user.totalSales !== undefined) && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-neutral-5 px-4 py-3 text-center">
            <Span className="text-neutral-50 text-xs">Prev. Reports</Span>
            <Text
              variant="body"
              className={cn(
                "mt-2 text-lg font-semibold",
                (user.prevReports || 0) > 0 ? "text-error" : "text-neutral-90",
              )}
            >
              {user.prevReports ?? 0}
            </Text>
          </div>
          <div className="rounded-xl bg-neutral-5 px-4 py-3 text-center">
            <Span className="text-neutral-50 text-xs">Total sales</Span>
            <Text
              variant="body"
              className="text-neutral-90 mt-2 text-lg font-semibold"
            >
              {user.totalSales ?? 0}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}

function UserReportDetailLayout({
  report,
  onViewProfile,
}: {
  report: UserReportDetails;
  onViewProfile: (id?: string) => void;
}) {
  const riskLevel = report.riskLevel || "High Risk";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className={cardClassName}>
          <div className="flex items-center justify-between border-b border-neutral-10 pb-4">
            <Text
              variant="body"
              className="text-neutral-90 text-base font-semibold"
            >
              Reported Account
            </Text>
            <RiskBadge level={riskLevel} />
          </div>
          <div className="mt-5 flex items-start gap-5">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-neutral-10">
              {report.reportedUser.avatar ? (
                <Image
                  src={report.reportedUser.avatar}
                  alt={report.reportedUser.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-primary">
                  {getInitials(report.reportedUser.name)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <Text
                  variant="body"
                  className="text-neutral-90 text-lg font-semibold"
                >
                  {report.reportedUser.name}
                </Text>
                <button
                  type="button"
                  onClick={() => onViewProfile(report.reportedUser.id)}
                  className="text-sm font-medium text-primary"
                >
                  View Profile
                </button>
              </div>
              <div className="text-neutral-60 mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <Span className="text-sm">
                    {report.reportedUser.location}
                  </Span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Span className="text-sm">
                    Member since {report.reportedUser.memberSince}
                  </Span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <Span className="text-sm">
                    {report.reportedUser.lastSeen}
                  </Span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <Span className="text-sm">
                    {report.reportedUser.avgResponseTime}
                  </Span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cardClassName}>
          <Span className="text-neutral-40 text-xs">User Metrics</Span>
          <Text
            variant="body"
            className="text-neutral-90 mt-2 text-lg font-semibold"
          >
            User Activities
          </Text>
          <div className="mt-4">
            <MetricsRow metrics={report.metrics} columns={4} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={cardClassName}>
            <Text
              variant="body"
              className="text-neutral-90 text-base font-semibold"
            >
              Trust indicators
            </Text>
            <div className="mt-4">
              <TrustIndicatorsList indicators={report.trustIndicators} />
            </div>
          </div>
          <div className={cardClassName}>
            <Text
              variant="body"
              className="text-neutral-90 text-base font-semibold"
            >
              Risk indicators
            </Text>
            <div className="mt-4">
              <RiskIndicatorsList indicators={report.riskIndicators} />
            </div>
          </div>
        </div>

        <div className={cardClassName}>
          <Text
            variant="body"
            className="text-neutral-90 text-base font-semibold"
          >
            Account History
          </Text>
          <div className="mt-4">
            <AccountHistoryList items={report.accountHistory} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ReportedByCard report={report} onViewProfile={onViewProfile} />
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ReportChatMessage }) {
  const outgoing = message.direction === "outgoing";
  return (
    <div className={cn("flex", outgoing ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "text-neutral-90 max-w-[70%] rounded-2xl px-4 py-3 text-sm",
          outgoing ? "bg-[#eef2ff]" : "bg-[#e8f6f0]",
        )}
      >
        <Text variant="body" className="text-sm">
          {message.message}
        </Text>
        <Span className="text-neutral-40 mt-2 block text-right text-[10px]">
          {message.time || formatTime(message.sentAt)}
        </Span>
      </div>
    </div>
  );
}

function ChatReportDetailLayout({
  report,
  onViewProfile,
}: {
  report: ChatReportDetails;
  onViewProfile: (id?: string) => void;
}) {
  const riskLevel = report.riskLevel || "Low Risk";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className={cardClassName}>
          <div className="flex items-center justify-between border-b border-neutral-10 pb-4">
            <Text
              variant="body"
              className="text-neutral-90 text-base font-semibold"
            >
              Reported Chat
            </Text>
            <RiskBadge level={riskLevel} />
          </div>

          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-neutral-10 bg-white p-4">
              <div className="flex items-center justify-between">
                <Span className="text-neutral-40 text-xs font-medium">
                  CHAT CONTEXT
                </Span>
                <Span className="text-neutral-40 text-xs">
                  {report.chatContext?.timestamp}
                </Span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                {report.chatContext?.itemImage ? (
                  <Image
                    src={report.chatContext.itemImage}
                    alt={report.chatContext.itemTitle}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-neutral-10" />
                )}
                <Text
                  variant="body"
                  className="text-neutral-90 text-sm font-medium"
                >
                  {report.chatContext?.itemTitle}
                </Text>
              </div>
            </div>

            <div className="space-y-4">
              {(report.chatMessages || []).map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-full border border-neutral-10 px-4 py-2">
              <Smile className="text-neutral-40 h-5 w-5" />
              <input
                type="text"
                placeholder="Send Message"
                className="text-neutral-70 flex-1 text-sm outline-none"
              />
              <Camera className="text-neutral-40 h-5 w-5" />
              <Paperclip className="text-neutral-40 h-5 w-5" />
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className={cardClassName}>
          <Span className="text-neutral-40 text-xs">Conversation Metrics</Span>
          <Text
            variant="body"
            className="text-neutral-90 mt-2 text-lg font-semibold"
          >
            Transaction Discussion
          </Text>
          <div className="mt-4">
            <MetricsRow metrics={report.conversationMetrics} columns={3} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ReportedUserCard
          title="Reported user:"
          user={report.reportedUser}
          onViewProfile={onViewProfile}
        />
        <div className={cardClassName}>
          <Text
            variant="body"
            className="text-neutral-90 text-base font-semibold"
          >
            Risk indicators
          </Text>
          <div className="mt-4">
            <RiskIndicatorsList indicators={report.riskIndicators} />
          </div>
          <Text variant="body" className="text-neutral-40 mt-4 text-xs">
            Based on the user's history, a warning or suspension may be
            appropriate.
          </Text>
        </div>
        <ReportedByCard report={report} onViewProfile={onViewProfile} />
      </div>
    </div>
  );
}

function ListingReportDetailLayout({
  report,
  onViewProfile,
}: {
  report: ListingReportDetails;
  onViewProfile: (id?: string) => void;
}) {
  const riskLevel = report.riskLevel || "Medium Risk";
  const listingDetails = report.listingDetails;
  const reportedUser = report.reportedUser || report.listing.seller;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className={cardClassName}>
          <div className="flex items-center justify-between border-b border-neutral-10 pb-4">
            <Text
              variant="body"
              className="text-neutral-90 text-base font-semibold"
            >
              Reported Listing
            </Text>
            <RiskBadge level={riskLevel} />
          </div>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row">
            <div className="w-full overflow-hidden rounded-xl bg-neutral-5 lg:w-[45%]">
              <Image
                src={report.listing.image}
                alt={report.listing.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <Text
                  variant="body"
                  className="text-neutral-90 text-lg font-semibold"
                >
                  {report.listing.title}
                </Text>
                {listingDetails?.status && (
                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    {listingDetails.status}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-3">
                <Text
                  variant="body"
                  className="text-2xl font-semibold text-primary"
                >
                  {listingDetails?.price} {listingDetails?.currency}
                </Text>
                <Span className="text-neutral-50 text-xs">
                  {listingDetails?.negotiable ? "Price is negotiable" : ""}
                </Span>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-2 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Span className="text-neutral-40 text-xs uppercase">
                      Seller
                    </Span>
                    <Span className="text-neutral-70 text-sm">
                      {report.listing.seller.name}
                    </Span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Span className="text-neutral-40 text-xs uppercase">
                      Category
                    </Span>
                    <Span className="text-neutral-70 text-sm">
                      {listingDetails?.category}
                    </Span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Span className="text-neutral-40 text-xs uppercase">
                      Condition
                    </Span>
                    <Span className="text-neutral-70 text-sm">
                      {listingDetails?.condition}
                    </Span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Span className="text-neutral-40 text-xs uppercase">
                      Listed
                    </Span>
                    <Span className="text-neutral-70 text-sm">
                      {listingDetails?.listedAt}
                    </Span>
                  </div>
                </div>
              </div>
              {listingDetails?.description && (
                <Text variant="body" className="text-neutral-50 pt-3 text-sm">
                  "{listingDetails.description}"
                </Text>
              )}
            </div>
          </div>
        </div>

        <div className={cardClassName}>
          <Span className="text-neutral-40 text-xs">Listing Metrics</Span>
          <Text
            variant="body"
            className="text-neutral-90 mt-2 text-lg font-semibold"
          >
            Listing Performance
          </Text>
          <div className="mt-4">
            <MetricsRow metrics={report.metrics} columns={3} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ReportedUserCard
          title="Reported user:"
          user={reportedUser}
          onViewProfile={onViewProfile}
        />
        <div className={cardClassName}>
          <Text
            variant="body"
            className="text-neutral-90 text-base font-semibold"
          >
            Risk indicators
          </Text>
          <div className="mt-4">
            <RiskIndicatorsList indicators={report.riskIndicators} />
          </div>
          <Text variant="body" className="text-neutral-40 mt-4 text-xs">
            Based on the user's history, a warning or suspension may be
            appropriate.
          </Text>
        </div>
        <ReportedByCard report={report} onViewProfile={onViewProfile} />
      </div>
    </div>
  );
}

export default function AdminReportDetailPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const reportType = isValidReportType(type) ? type : undefined;
  const [warnModalOpen, setWarnModalOpen] = useState(false);
  const [warnSuccessOpen, setWarnSuccessOpen] = useState(false);
  const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false);
  const [suspendSuccessOpen, setSuspendSuccessOpen] = useState(false);
  const [banConfirmOpen, setBanConfirmOpen] = useState(false);
  const [banSuccessOpen, setBanSuccessOpen] = useState(false);
  const [dismissConfirmOpen, setDismissConfirmOpen] = useState(false);
  const [dismissSuccessOpen, setDismissSuccessOpen] = useState(false);
  const [hideListingOpen, setHideListingOpen] = useState(false);
  const [hideListingSuccessOpen, setHideListingSuccessOpen] = useState(false);
  const [removeListingConfirmOpen, setRemoveListingConfirmOpen] =
    useState(false);
  const [removeListingSuccessOpen, setRemoveListingSuccessOpen] =
    useState(false);
  const [warnSellerOpen, setWarnSellerOpen] = useState(false);
  const [warnSellerSuccessOpen, setWarnSellerSuccessOpen] = useState(false);
  const [dismissListingConfirmOpen, setDismissListingConfirmOpen] =
    useState(false);
  const [dismissListingSuccessOpen, setDismissListingSuccessOpen] =
    useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const loadingTimerRef = useRef<number | null>(null);

  const { data, isLoading, error } = useAdminReportDetail(
    reportType || "listing",
    reportType ? id : undefined,
  );

  const report = data as ReportDetail | undefined;

  const handleViewProfile = (userId?: string) => {
    if (!userId) return;
    navigate(getAdminUserDetailRoute(encodeURIComponent(userId)));
  };

  const headerReason = report?.reason || "";
  const targetUserId =
    report?.type === "listing"
      ? report.listing.seller.id
      : report?.reportedUser?.id;

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  const startLoadingThen = (action: () => void) => {
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
    }
    setLoadingOpen(true);
    loadingTimerRef.current = window.setTimeout(() => {
      setLoadingOpen(false);
      action();
    }, 800);
  };

  if (!reportType || !id) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl border border-error/10 bg-error/5 p-8 text-center">
          <Text variant="bodyLg" className="font-semibold text-error">
            Invalid report link
          </Text>
          <Text variant="caption" className="mt-2 block text-error/70">
            The report type or ID is missing.
          </Text>
          <Button
            intent="outline"
            size="sm"
            className="mt-6"
            onClick={() => navigate("/admin/reports")}
          >
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <Text variant="body" className="text-neutral-50 mt-4 font-medium">
            Loading report details...
          </Text>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl border border-error/10 bg-error/5 p-8 text-center">
          <Text variant="bodyLg" className="font-semibold text-error">
            Report not found
          </Text>
          <Text variant="caption" className="mt-2 block text-error/70">
            The report you're looking for doesn't exist or has been removed.
          </Text>
          <Button
            intent="outline"
            size="sm"
            className="mt-6"
            onClick={() => navigate("/admin/reports")}
          >
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  const listingName =
    report.type === "listing" ? report.listing.title : "Listing";

  const resolveMenuItems: ResolveMenuItem[] =
    report.type === "listing"
      ? [
          {
            key: "hide-listing",
            label: "Hide listing",
            highlighted: true,
            onSelect: () => setHideListingOpen(true),
          },
          {
            key: "remove-listing",
            label: "Remove Listing",
            onSelect: () => setRemoveListingConfirmOpen(true),
          },
          {
            key: "warn-seller",
            label: "Warn seller",
            onSelect: () => setWarnSellerOpen(true),
          },
          {
            key: "dismiss-listing-report",
            label: "Dismiss Report",
            dividerBefore: true,
            onSelect: () => setDismissListingConfirmOpen(true),
          },
        ]
      : report.type === "user" || report.type === "chat"
        ? [
            {
              key: "warn-user",
              label: "Warn User",
              onSelect: () => setWarnModalOpen(true),
            },
            {
              key: "suspend-user",
              label: "Suspend User",
              onSelect: () => setSuspendConfirmOpen(true),
            },
            {
              key: "ban-user",
              label: "Ban User",
              onSelect: () => setBanConfirmOpen(true),
            },
            {
              key: "dismiss-user-chat-report",
              label: "Dismiss Report",
              dividerBefore: true,
              onSelect: () => setDismissConfirmOpen(true),
            },
          ]
        : [];

  return (
    <div className="min-h-screen bg-neutral-5 p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AdminBackButton onClick={() => navigate(-1)} />
            <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-semibold text-[#101010]">
                #{report.id}
              </h1>
              <ReportReasonBadge
                reason={headerReason}
                className="px-3 py-1 text-xs"
              />
            </div>
          </div>
          {resolveMenuItems.length ? (
            <ResolveReportMenu items={resolveMenuItems} />
          ) : null}
        </div>

        {report.type === "user" && (
          <UserReportDetailLayout
            report={report as UserReportDetails}
            onViewProfile={handleViewProfile}
          />
        )}
        {report.type === "chat" && (
          <ChatReportDetailLayout
            report={report as ChatReportDetails}
            onViewProfile={handleViewProfile}
          />
        )}
        {report.type === "listing" && (
          <ListingReportDetailLayout
            report={report as ListingReportDetails}
            onViewProfile={handleViewProfile}
          />
        )}
      </div>

      <WarnUserModal
        isOpen={warnModalOpen}
        onClose={() => setWarnModalOpen(false)}
        onConfirm={(reason) => {
          console.log("Warn user", targetUserId, reason);
          setWarnModalOpen(false);
          startLoadingThen(() => setWarnSuccessOpen(true));
        }}
      />
      <WarnUserSuccessDialog
        open={warnSuccessOpen}
        onClose={() => setWarnSuccessOpen(false)}
      />
      <ReportActionConfirmDialog
        open={suspendConfirmOpen}
        onClose={() => setSuspendConfirmOpen(false)}
        onConfirm={() => {
          console.log("Suspend user", targetUserId);
          setSuspendConfirmOpen(false);
          startLoadingThen(() => setSuspendSuccessOpen(true));
        }}
        title="Suspend user"
        description="Are you sure you want to suspend this user? The user will be temporarily suspended and will not be able to log in or use their account. You can reactivate their account at any time."
        confirmLabel="Suspend User"
        confirmTone="danger"
      />
      <ReportActionSuccessDialog
        open={suspendSuccessOpen}
        onClose={() => setSuspendSuccessOpen(false)}
        title="User Suspended Successfully"
        description="The user has been temporarily suspended and will not be able to log in or use the platform until their suspension period ends."
      />
      <ReportActionConfirmDialog
        open={banConfirmOpen}
        onClose={() => setBanConfirmOpen(false)}
        onConfirm={() => {
          console.log("Ban user", targetUserId);
          setBanConfirmOpen(false);
          startLoadingThen(() => setBanSuccessOpen(true));
        }}
        title="Ban user"
        description="Are you sure you want to permanently ban this user? The user will be unable to log in or access their account."
        confirmLabel="Ban User"
        confirmTone="danger"
      />
      <ReportActionSuccessDialog
        open={banSuccessOpen}
        onClose={() => setBanSuccessOpen(false)}
        title="User Permanently Banned Successfully"
        description="The user has been permanently banned and will no longer be able to access their account."
      />
      <ReportActionConfirmDialog
        open={dismissConfirmOpen}
        onClose={() => setDismissConfirmOpen(false)}
        onConfirm={() => {
          console.log("Dismiss report", report.id);
          setDismissConfirmOpen(false);
          startLoadingThen(() => setDismissSuccessOpen(true));
        }}
        title="Dismiss report"
        description="This report will be marked as resolved and no action will be taken."
        confirmLabel="Dismiss Report"
        confirmTone="primary"
      />
      <ReportActionSuccessDialog
        open={dismissSuccessOpen}
        onClose={() => setDismissSuccessOpen(false)}
        title="Report Dismissed Successfully"
        description="This report has been marked as resolved. No further action was taken."
      />
      <HideListingModal
        open={hideListingOpen}
        onOpenChange={setHideListingOpen}
        listingName={listingName}
        onConfirm={(reason: HideReason, comment?: string) => {
          console.log("Hide listing", report.id, reason, comment);
          setHideListingOpen(false);
          startLoadingThen(() => setHideListingSuccessOpen(true));
        }}
      />
      <ReportActionSuccessDialog
        open={hideListingSuccessOpen}
        onClose={() => setHideListingSuccessOpen(false)}
        title="Listing Hidden"
        description="The listing has been hidden. The user has been notified with the selected reason and your comments."
      />
      <RemoveListingModal
        open={removeListingConfirmOpen}
        listingName={listingName}
        onClose={() => setRemoveListingConfirmOpen(false)}
        onConfirm={(reason, comment) => {
          console.log("Remove listing", report.id, reason, comment);
          setRemoveListingConfirmOpen(false);
          startLoadingThen(() => setRemoveListingSuccessOpen(true));
        }}
      />
      <ReportActionSuccessDialog
        open={removeListingSuccessOpen}
        onClose={() => setRemoveListingSuccessOpen(false)}
        title="Listing Removed Successfully"
        description="The listing has been permanently removed and cannot be restored."
      />
      <WarnSellerModal
        open={warnSellerOpen}
        onClose={() => setWarnSellerOpen(false)}
        onConfirm={(message) => {
          console.log("Warn seller", targetUserId, message);
          setWarnSellerOpen(false);
          startLoadingThen(() => setWarnSellerSuccessOpen(true));
        }}
      />
      <WarnUserSuccessDialog
        open={warnSellerSuccessOpen}
        onClose={() => setWarnSellerSuccessOpen(false)}
      />
      <ListingDismissReportDialog
        open={dismissListingConfirmOpen}
        onClose={() => setDismissListingConfirmOpen(false)}
        onConfirm={() => {
          console.log("Dismiss listing report", report.id);
          setDismissListingConfirmOpen(false);
          startLoadingThen(() => setDismissListingSuccessOpen(true));
        }}
      />
      <ReportActionSuccessDialog
        open={dismissListingSuccessOpen}
        onClose={() => setDismissListingSuccessOpen(false)}
        title="Report Dismissed Successfully"
        description="This report has been marked as resolved. No action was taken."
      />
      <FullScreenLoadingOverlay open={loadingOpen} />
    </div>
  );
}

function ListingDismissReportDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      className="w-full max-w-md rounded-2xl border border-neutral-10 bg-white p-6 text-center backdrop:bg-black/50"
    >
      <h3 className="text-neutral-90 text-xl font-semibold">Dismiss Report?</h3>
      <Text
        variant="body"
        className="text-neutral-60 mt-3 text-sm leading-relaxed"
      >
        This report will be marked as resolved and no action will be taken.
      </Text>
      <div className="mt-6 flex flex-col gap-3">
        <Button
          className="h-12 w-full rounded-xl border-none bg-primary text-base font-medium text-white hover:bg-primary/90"
          onClick={onConfirm}
        >
          Dismiss Report
        </Button>
        <Button
          intent="outline"
          className="text-neutral-70 h-12 w-full rounded-xl border border-neutral-20 text-base font-medium hover:bg-neutral-10"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}
