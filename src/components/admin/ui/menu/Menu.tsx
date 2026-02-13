import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";

const menuItemVariants = cva(
  [
    "flex",
    "items-center",
    "gap-3",
    "px-4",
    "py-3",
    "rounded-lg",
    "transition-all",
    "duration-200",
    "cursor-pointer",
    "group",
  ],
  {
    variants: {
      state: {
        active: ["bg-primary", "text-white", "shadow-sm"],
        inactive: [
          "text-neutral-60",
          "hover:bg-neutral-5",
          "hover:text-neutral-80",
        ],
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  },
);

const menuIconVariants = cva(
  ["w-5", "h-5", "transition-colors", "duration-200"],
  {
    variants: {
      state: {
        active: "text-white",
        inactive: "text-neutral-50 group-hover:text-neutral-70",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  },
);

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  badge?: string | number;
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ icon, label, isActive = false, badge, className, ...props }, ref) => {
    const state = isActive ? "active" : "inactive";

    return (
      <div
        ref={ref}
        className={cn(menuItemVariants({ state }), className)}
        {...props}
      >
        <div className={cn(menuIconVariants({ state }))}>{icon}</div>
        <Text
          variant="body"
          className={cn(
            "flex-1 font-medium",
            isActive
              ? "text-white"
              : "text-neutral-70 group-hover:text-neutral-90",
          )}
        >
          {label}
        </Text>
        {badge !== undefined && (
          <Span
            variant="caption"
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              isActive
                ? "bg-white/20 text-white"
                : "bg-primary/10 text-primary",
            )}
          >
            {badge}
          </Span>
        )}
      </div>
    );
  },
);

MenuItem.displayName = "MenuItem";

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  items: Array<{
    id: string;
    icon: ReactNode;
    label: string;
    badge?: string | number;
    onClick?: () => void;
  }>;
  activeItemId?: string;
  onItemClick?: (id: string) => void;
}

export const Menu = forwardRef<HTMLDivElement, MenuProps>(
  ({ items, activeItemId, onItemClick, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("flex flex-col gap-1", className)}
        {...props}
      >
        {items.map((item) => (
          <MenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            isActive={item.id === activeItemId}
            onClick={() => {
              item.onClick?.();
              onItemClick?.(item.id);
            }}
          />
        ))}
      </nav>
    );
  },
);

Menu.displayName = "Menu";
