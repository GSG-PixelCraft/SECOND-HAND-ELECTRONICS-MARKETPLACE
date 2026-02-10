import { Outlet } from "react-router-dom";
import { Text } from "@/components/ui/text";

export const AdminLayout = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
      <div className="space-y-2">
        <Text className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Admin
        </Text>
        <h2 className="text-2xl font-semibold text-slate-900">
          Admin Dashboard
        </h2>
        <Text className="text-sm text-slate-600">
          Manage your marketplace settings
        </Text>
      </div>
      <Outlet />
    </div>
  );
};
