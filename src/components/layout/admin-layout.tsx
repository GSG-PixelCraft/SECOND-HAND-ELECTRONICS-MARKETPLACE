import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Admin
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Admin Dashboard
        </h2>
        <p className="text-sm text-slate-600">
          Manage your marketplace settings
        </p>
      </div>
      <Outlet />
    </div>
  );
};
