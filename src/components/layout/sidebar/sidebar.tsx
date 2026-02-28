import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Text } from "@/components/ui/Text/text";

const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export const Sidebar = () => {
  return (
    <aside className="hidden w-64 flex-col gap-6 border-r border-slate-200 bg-white px-5 py-8 lg:flex">
      <div className="space-y-3">
        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Navigation
        </Text>
        <nav className="flex flex-col gap-2">
          <NavLink to={ROUTES.HOME} className={sidebarLinkClass}>
            Home
          </NavLink>
          <NavLink to={ROUTES.RECENT_LISTINGS} className={sidebarLinkClass}>
            Products
          </NavLink>
          <NavLink to={ROUTES.FAVORITES} className={sidebarLinkClass}>
            Favorites
          </NavLink>
          <NavLink to={ROUTES.MY_LISTINGS} className={sidebarLinkClass}>
            Dashboard
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};
