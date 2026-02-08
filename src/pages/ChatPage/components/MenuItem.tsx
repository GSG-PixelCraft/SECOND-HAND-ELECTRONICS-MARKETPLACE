import type { ElementType } from "react";
type MenuItemProps = {
  label: string;
  danger?: boolean;
  Icon?: ElementType;
  onClick?: () => void;
};

export default function MenuItem({
  Icon,
  label,
  danger,
  onClick,
}: MenuItemProps) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 border-b px-4 py-2 text-left text-sm ${
        danger ? "text-error hover:bg-error-10" : "text-neutral hover:bg-muted"
      }`}
      onClick={onClick}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </button>
  );
}
