import { Bell, MessageSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function AdminTopHeader() {
  return (
    <header className="border-border flex h-[72px] items-center justify-between border-b bg-white px-6">
      {/* Logo */}
      <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-5 text-white"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <span className="text-xl font-semibold text-primary">ElectroLink</span>
      </Link>

      {/* Search Bar */}
      <div className="relative mx-8 max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#828282]" />
        <input
          type="text"
          placeholder="Search..."
          className="border-border h-10 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-[#3D3D3D] placeholder:text-[#C7C7C7] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 transition-colors hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="size-6 text-[#828282]" />
          <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full bg-error" />
        </button>

        {/* Messages */}
        <button
          type="button"
          className="relative rounded-lg p-2 transition-colors hover:bg-muted"
          aria-label="Messages"
        >
          <MessageSquare className="size-6 text-[#828282]" />
          <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full bg-error" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted"
        >
          <div className="size-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
        </button>
      </div>
    </header>
  );
}
