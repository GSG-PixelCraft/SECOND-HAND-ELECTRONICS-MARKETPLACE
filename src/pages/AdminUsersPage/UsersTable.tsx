import { forwardRef, Fragment } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Span } from "@/components/ui/span";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import type { AdminUser, UserStatus } from "@/types/user";

export interface UsersTableProps {
  users: AdminUser[];
  onRowClick?: (user: AdminUser) => void;
  className?: string;
}

export const UsersTable = forwardRef<HTMLDivElement, UsersTableProps>(
  ({ users, onRowClick, className }, ref) => {
    const navigate = useNavigate();

    const handleRowClick = (user: AdminUser) => {
      if (onRowClick) {
        onRowClick(user);
      } else {
        navigate(`/admin/users/${encodeURIComponent(user.id)}`);
      }
    };

    const handleViewClick = (e: MouseEvent, userId: string) => {
      e.stopPropagation();
      navigate(`/admin/users/${encodeURIComponent(userId)}`);
    };

    const getStatusVariant = (status: UserStatus) => {
      switch (status) {
        case "active":
          return "completed";
        case "suspended":
          return "processing";
        case "banned":
          return "rejected";
        default:
          return "neutral";
      }
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)}>
        {/* Table Header */}
        <div className="flex h-12 items-center overflow-hidden rounded-xl bg-primary/10">
          <div className="flex w-[80px] items-center gap-1 px-4">
            <Span className="text-neutral-90 text-sm font-medium">Id</Span>
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
              User Name
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
            <Span className="text-neutral-90 text-sm font-medium">Email</Span>
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
              Phone Number
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
              Joined date
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
                />
              </svg>
            </div>
          </div>
          <div className="flex w-[100px] items-center gap-1 px-4">
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

        {/* Table Rows */}
        <div className="flex flex-col gap-3">
          {users.map((user, index) => (
            <Fragment key={user.id}>
              <div
                className="flex h-12 cursor-pointer items-center overflow-hidden bg-white transition-colors hover:bg-neutral-5/30"
                onClick={() => handleRowClick(user)}
              >
                {/* Id */}
                <div className="flex w-[80px] items-center px-4">
                  <Span className="text-neutral-60 text-sm">{user.id}</Span>
                </div>

                {/* User Name */}
                <div className="flex flex-1 items-center gap-2 px-4">
                  <div className="relative h-8 w-8 flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    {/* Verification check mark */}
                    {user.verificationStatus.phoneVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success">
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <Span className="text-neutral-60 max-w-[150px] truncate text-sm">
                    {user.name}
                  </Span>
                </div>

                {/* Email */}
                <div className="flex flex-1 items-center px-4">
                  <Span className="text-neutral-60 text-sm">{user.email}</Span>
                </div>

                {/* Phone Number */}
                <div className="flex flex-1 items-center px-4">
                  <Span className="text-neutral-60 text-sm">
                    {user.phoneNumber}
                  </Span>
                </div>

                {/* Joined Date */}
                <div className="flex flex-1 items-center px-4">
                  <Span className="text-neutral-60 text-sm">
                    {new Date(user.joinedDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Span>
                </div>

                {/* Status */}
                <div className="flex w-[120px] items-center justify-center px-4">
                  <StatusBadge variant={getStatusVariant(user.status)}>
                    {user.status}
                  </StatusBadge>
                </div>

                {/* Actions */}
                <div className="flex w-[100px] items-center justify-center">
                  <button
                    onClick={(e) => handleViewClick(e, user.id)}
                    className="text-neutral-50 flex h-6 w-6 items-center justify-center transition-colors hover:text-primary"
                    aria-label="View details"
                  >
                    <Eye className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Divider Line */}
              {index < users.length - 1 && (
                <div className="h-px bg-neutral-20" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    );
  },
);

UsersTable.displayName = "UsersTable";
