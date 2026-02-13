import type { ReactNode } from "react";
import { AdminTopHeader } from "./AdminTopHeader";
import { AdminSidebar } from "./AdminSidebar";

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <AdminTopHeader />

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[#F9FAFB]">{children}</main>
      </div>
    </div>
  );
}
