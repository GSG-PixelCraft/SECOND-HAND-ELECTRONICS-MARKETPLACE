const AdminOverviewPage = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Statistics
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">42</p>
        <p className="text-sm text-slate-600">Active Listings</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Users
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">128</p>
        <p className="text-sm text-slate-600">Registered Users</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Revenue
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">$1,234</p>
        <p className="text-sm text-slate-600">Monthly Revenue</p>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
