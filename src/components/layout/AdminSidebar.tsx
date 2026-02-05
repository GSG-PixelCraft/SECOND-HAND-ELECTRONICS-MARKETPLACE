import {
  LayoutDashboard,
  Package,
  CheckCircle,
  Users,
  Flag,
  FolderOpen,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { name: "Listings", href: "/admin/listings", icon: Package },
  { name: "Verifications", href: "/admin/verifications", icon: CheckCircle },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Reports", href: "/admin/reports", icon: Flag },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="border-border flex w-[240px] flex-col border-r bg-white">
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 pt-6">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal transition-colors",
                isActive
                  ? "bg-primary/10 font-medium text-primary"
                  : "hover:text-foreground text-[#828282] hover:bg-muted",
              )
            }
          >
            <item.icon className="size-5 shrink-0" />
            <Text>{item.name}</Text>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-border border-t p-4">
        <Button className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
          <div className="size-10 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary" />
          <div className="min-w-0 flex-1 text-left">
            <Text className="text-foreground truncate text-sm font-medium">
              Yousef Yahia
            </Text>
            <Text className="truncate text-xs text-[#828282]">
              Yousef@gmail.com
            </Text>
          </div>
          <ChevronDown className="size-4 flex-shrink-0 text-[#828282]" />
        </Button>

        <Button className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#828282] transition-colors hover:bg-muted hover:text-error">
          <LogOut className="size-5" />
          <Text>Logout</Text>
        </Button>
      </div>
    </aside>
  );
}
