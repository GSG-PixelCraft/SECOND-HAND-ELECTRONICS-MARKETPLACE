import { Text } from "@/components/ui/text";

const AdminOverviewPage = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Statistics
        </Text>
        <Text className="mt-2 text-2xl font-semibold text-slate-900">42</Text>
        <Text className="text-sm text-slate-600">Active Listings</Text>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Users
        </Text>
        <Text className="mt-2 text-2xl font-semibold text-slate-900">128</Text>
        <Text className="text-sm text-slate-600">Registered Users</Text>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Revenue
        </Text>
        <Text className="mt-2 text-2xl font-semibold text-slate-900">
          $1,234
        </Text>
        <Text className="text-sm text-slate-600">Monthly Revenue</Text>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
