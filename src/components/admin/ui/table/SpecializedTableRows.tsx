// Specialized Table Row Components
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";

// Verification Table Row
export interface VerificationTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  userId: string;
  userName: string;
  userAvatar?: string;
  verificationType: string;
  submittedDate: string;
  status: "pending" | "verified" | "rejected" | "under-review";
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export const VerificationTableRow = forwardRef<
  HTMLTableRowElement,
  VerificationTableRowProps
>(
  (
    {
      userId,
      userName,
      userAvatar,
      verificationType,
      submittedDate,
      status,
      onView,
      onApprove,
      onReject,
      className,
      ...props
    },
    ref,
  ) => {
    const statusStyles = {
      pending: "bg-warning/10 text-warning",
      verified: "bg-success/10 text-success",
      rejected: "bg-error/10 text-error",
      "under-review": "bg-primary/10 text-primary",
    };

    const statusLabels = {
      pending: "Pending",
      verified: "Verified",
      rejected: "Rejected",
      "under-review": "Under Review",
    };

    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-neutral-10 transition-colors hover:bg-neutral-5",
          className,
        )}
        {...props}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-10">
              {userAvatar ? (
                <Image
                  src={userAvatar}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 font-semibold text-primary">
                  {userName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <Text variant="body" className="text-neutral-90 font-medium">
                {userName}
              </Text>
              <Span variant="caption" className="text-neutral-50">
                ID: {userId}
              </Span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <Text variant="body" className="text-neutral-70">
            {verificationType}
          </Text>
        </td>
        <td className="px-6 py-4">
          <Span variant="body" className="text-neutral-60">
            {submittedDate}
          </Span>
        </td>
        <td className="px-6 py-4 text-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
              statusStyles[status],
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusLabels[status]}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Button intent="outline" size="sm" onClick={onView}>
              View
            </Button>
            {status === "pending" && (
              <>
                <Button
                  intent="primary"
                  size="sm"
                  onClick={onApprove}
                  className="bg-success hover:bg-success/90"
                >
                  Approve
                </Button>
                <Button intent="danger" size="sm" onClick={onReject}>
                  Reject
                </Button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  },
);

VerificationTableRow.displayName = "VerificationTableRow";

// Country Management Table Row
export interface CountryManagementTableRowProps extends Omit<
  HTMLAttributes<HTMLTableRowElement>,
  "onToggle"
> {
  countryCode: string;
  countryName: string;
  flag: string;
  isEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CountryManagementTableRow = forwardRef<
  HTMLTableRowElement,
  CountryManagementTableRowProps
>(
  (
    {
      countryCode,
      countryName,
      flag,
      isEnabled,
      onToggle,
      onEdit,
      onDelete,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-neutral-10 transition-colors hover:bg-neutral-5",
          className,
        )}
        {...props}
      >
        <td className="px-6 py-4">
          <span className="text-3xl">{flag}</span>
        </td>
        <td className="px-6 py-4">
          <Text variant="body" className="text-neutral-90 font-medium">
            {countryName}
          </Text>
        </td>
        <td className="px-6 py-4">
          <Span variant="body" className="text-neutral-70 font-mono">
            {countryCode}
          </Span>
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-center">
            <button
              onClick={() => onToggle?.(!isEnabled)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                isEnabled ? "bg-success" : "bg-neutral-30",
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  isEnabled ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Button intent="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button intent="danger" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </td>
      </tr>
    );
  },
);

CountryManagementTableRow.displayName = "CountryManagementTableRow";

// Currency Management Table Row
export interface CurrencyManagementTableRowProps extends Omit<
  HTMLAttributes<HTMLTableRowElement>,
  "onToggle"
> {
  currencyCode: string;
  currencyName: string;
  symbol: string;
  isEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CurrencyManagementTableRow = forwardRef<
  HTMLTableRowElement,
  CurrencyManagementTableRowProps
>(
  (
    {
      currencyCode,
      currencyName,
      symbol,
      isEnabled,
      onToggle,
      onEdit,
      onDelete,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-neutral-10 transition-colors hover:bg-neutral-5",
          className,
        )}
        {...props}
      >
        <td className="px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
            {symbol}
          </div>
        </td>
        <td className="px-6 py-4">
          <Text variant="body" className="text-neutral-90 font-medium">
            {currencyName}
          </Text>
        </td>
        <td className="px-6 py-4">
          <Span variant="body" className="text-neutral-70 font-mono">
            {currencyCode}
          </Span>
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-center">
            <button
              onClick={() => onToggle?.(!isEnabled)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                isEnabled ? "bg-success" : "bg-neutral-30",
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  isEnabled ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Button intent="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button intent="danger" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </td>
      </tr>
    );
  },
);

CurrencyManagementTableRow.displayName = "CurrencyManagementTableRow";

// User Management Row
export interface UserManagementRowProps extends HTMLAttributes<HTMLTableRowElement> {
  userId: string;
  userName: string;
  userAvatar?: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const UserManagementRow = forwardRef<
  HTMLTableRowElement,
  UserManagementRowProps
>(
  (
    {
      userId,
      userName,
      userAvatar,
      email,
      role,
      status,
      onView,
      onEdit,
      onDelete,
      className,
      ...props
    },
    ref,
  ) => {
    const statusStyles = {
      active: "bg-success/10 text-success",
      inactive: "bg-neutral-10 text-neutral-60",
      suspended: "bg-error/10 text-error",
    };

    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-neutral-10 transition-colors hover:bg-neutral-5",
          className,
        )}
        {...props}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-10">
              {userAvatar ? (
                <Image
                  src={userAvatar}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 font-semibold text-primary">
                  {userName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <Text variant="body" className="text-neutral-90 font-medium">
                {userName}
              </Text>
              <Span variant="caption" className="text-neutral-50">
                ID: {userId}
              </Span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <Text variant="body" className="text-neutral-70">
            {email}
          </Text>
        </td>
        <td className="px-6 py-4">
          <Span variant="body" className="text-neutral-90 font-medium">
            {role}
          </Span>
        </td>
        <td className="px-6 py-4 text-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
              statusStyles[status],
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Button intent="outline" size="sm" onClick={onView}>
              View
            </Button>
            <Button intent="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button intent="danger" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </td>
      </tr>
    );
  },
);

UserManagementRow.displayName = "UserManagementRow";

// Categories Table Row
export interface CategoriesTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  categoryId: string;
  categoryName: string;
  icon?: ReactNode;
  subcategoriesCount: number;
  listingsCount: number;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CategoriesTableRow = forwardRef<
  HTMLTableRowElement,
  CategoriesTableRowProps
>(
  (
    {
      categoryId,
      categoryName,
      icon,
      subcategoriesCount,
      listingsCount,
      onView,
      onEdit,
      onDelete,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-neutral-10 transition-colors hover:bg-neutral-5",
          className,
        )}
        {...props}
      >
        <td className="px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon || <span className="text-xl">📁</span>}
          </div>
        </td>
        <td className="px-6 py-4">
          <div>
            <Text variant="body" className="text-neutral-90 font-medium">
              {categoryName}
            </Text>
            <Span variant="caption" className="text-neutral-50">
              ID: {categoryId}
            </Span>
          </div>
        </td>
        <td className="px-6 py-4 text-center">
          <Span variant="body" className="text-neutral-70 font-semibold">
            {subcategoriesCount}
          </Span>
        </td>
        <td className="px-6 py-4 text-center">
          <Span variant="body" className="text-neutral-70 font-semibold">
            {listingsCount}
          </Span>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Button intent="outline" size="sm" onClick={onView}>
              View
            </Button>
            <Button intent="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button intent="danger" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </td>
      </tr>
    );
  },
);

CategoriesTableRow.displayName = "CategoriesTableRow";
