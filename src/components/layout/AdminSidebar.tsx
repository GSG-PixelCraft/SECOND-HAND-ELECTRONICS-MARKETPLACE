import { useState, type MouseEvent } from "react";
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
  User,
  Shield,
  Bell,
  Globe,
  CircleDollarSign,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Menu } from "@/components/admin";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Image } from "@/components/ui/image";

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
];

const settingsSubItems = [
  {
    id: "admin-profile",
    label: "Admin Profile",
    icon: <User className="h-4 w-4" />,
    href: ROUTES.ADMIN_SETTINGS_PROFILE,
  },
  {
    id: "security-login",
    label: "Security & Login",
    icon: <Shield className="h-4 w-4" />,
    href: ROUTES.ADMIN_SETTINGS_SECURITY_LOGIN,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="h-4 w-4" />,
    href: ROUTES.ADMIN_SETTINGS_NOTIFICATIONS,
  },
  {
    id: "countries",
    label: "Countries",
    icon: <Globe className="h-4 w-4" />,
    href: ROUTES.ADMIN_SETTINGS_COUNTRIES,
  },
  {
    id: "currencies",
    label: "Currencies",
    icon: <CircleDollarSign className="h-4 w-4" />,
    href: ROUTES.ADMIN_SETTINGS_CURRENCIES,
  },
  {
    id: "safety-policies",
    label: "Safety & Policies",
    icon: <ShieldAlert className="h-4 w-4" />,
    href: ROUTES.ADMIN_SETTINGS_SAFETY_POLICIES,
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(
    location.pathname.startsWith(ROUTES.ADMIN_SETTINGS),
  );

  const activeItemId =
    [...navigationItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => location.pathname.startsWith(item.href))?.id ||
    "dashboard";

  const isSettingsSectionActive = location.pathname.startsWith(
    ROUTES.ADMIN_SETTINGS,
  );

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

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <Menu
          items={navigationItems}
          activeItemId={activeItemId}
          onItemClick={(id) => {
            const item = navigationItems.find((i) => i.id === id);
            if (item) navigate(item.href);
          }}
        />

        <div className="mt-1">
          <div
            className={`group flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
              isSettingsSectionActive || isSettingsOpen
                ? "text-neutral-80 bg-neutral-5"
                : "text-neutral-60 hover:text-neutral-80 hover:bg-neutral-5"
            }`}
            onClick={() => navigate(ROUTES.ADMIN_SETTINGS_PROFILE)}
          >
            <Settings className="text-neutral-50 group-hover:text-neutral-70 h-5 w-5" />
            <Text variant="body" className="flex-1 font-medium">
              Settings
            </Text>
            <button
              type="button"
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                setIsSettingsOpen((prev) => !prev);
              }}
              aria-label={
                isSettingsOpen
                  ? "Collapse settings menu"
                  : "Expand settings menu"
              }
              className="flex h-5 w-5 items-center justify-center"
            >
              <ChevronDown
                className={`text-neutral-50 h-4 w-4 transition-transform ${isSettingsOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {isSettingsOpen && (
            <div className="mt-1 flex flex-col gap-1">
              {settingsSubItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => navigate(item.href)}
                    className={`flex items-center gap-2 rounded-r-none px-4 py-3 ${
                      isActive
                        ? "border-r-4 border-[#2563EB] bg-[#EFF4FF] text-[#2563EB]"
                        : "text-neutral-50 hover:bg-neutral-5"
                    }`}
                  >
                    <span className={isActive ? "text-[#2563EB]" : ""}>
                      {item.icon}
                    </span>
                    <span
                      className={`font-['Poppins'] text-[14px] ${isActive ? "font-medium" : "font-normal"}`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-10 p-4">
        <div className="group flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-neutral-5">
          <div className="size-10 flex-shrink-0 overflow-hidden rounded-full border border-neutral-20">
            <Image
              src="https://i.pravatar.cc/120?img=11"
              alt="Yousef Yahia"
              className="h-full w-full object-cover"
            />
          </div>
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
          <button
            type="button"
            className="text-neutral-40 hover:text-neutral-70 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-10"
            aria-label="Logout"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
