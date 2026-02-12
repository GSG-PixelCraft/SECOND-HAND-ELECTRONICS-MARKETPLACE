import {
  LayoutDashboard,
  Package,
  CheckCircle,
  Users,
  Flag,
  LayoutGrid,
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Menu } from "@/components/admin";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: ROUTES.ADMIN_DASHBOARD,
    icon: <LayoutDashboard />,
  },
  {
    id: "listings",
    label: "Listings",
    href: "/admin/listings",
    icon: <Package />,
    badge: 12,
  },
  {
    id: "verifications",
    label: "Verifications",
    href: "/admin/verifications",
    icon: <CheckCircle />,
    badge: 5,
  },
  { id: "users", label: "Users", href: "/admin/users", icon: <Users /> },
  {
    id: "reports",
    label: "Reports",
    href: "/admin/reports",
    icon: <Flag />,
    badge: 3,
  },
  {
    id: "categories",
    label: "Categories",
    href: ROUTES.ADMIN_CATEGORIES,
    icon: <LayoutGrid />,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings />,
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Find active item by checking if current path starts with the nav item's href
  // Sort by href length descending to match most specific path first
  const activeItemId =
    [...navigationItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => location.pathname.startsWith(item.href))?.id ||
    "dashboard";

  return (
    <aside className="flex w-[260px] flex-col border-r border-neutral-10 bg-white">
      <div className="flex items-center gap-2 border-b border-neutral-10 px-4 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <span className="font-['Poppins'] text-[18px] font-semibold text-primary">
          ElectroLink
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <Menu
          items={navigationItems}
          activeItemId={activeItemId}
          onItemClick={(id) => {
            const item = navigationItems.find((i) => i.id === id);
            if (item) navigate(item.href);
          }}
        />
      </div>

      {/* User Profile Section */}
      <div className="border-t border-neutral-10 p-4">
        <div className="group flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-neutral-5">
          <div className="size-10 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary shadow-sm" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <Text
              variant="body"
              className="text-neutral-90 truncate font-semibold"
            >
              Yousef Yahia
            </Text>
            <Span variant="caption" className="text-neutral-50 truncate">
              Yousef@gmail.com
            </Span>
          </div>
          <ChevronDown className="text-neutral-40 group-hover:text-neutral-60 size-4 flex-shrink-0" />
        </div>

        <Button
          intent="outline"
          fullWidth
          className="text-neutral-60 mt-4 border-neutral-20 hover:border-error/20 hover:bg-error/5 hover:text-error"
          size="sm"
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
