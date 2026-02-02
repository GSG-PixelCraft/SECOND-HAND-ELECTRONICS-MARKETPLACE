import PageLayout from "@/components/layout/PageLayout";
import { Clock } from "lucide-react";

export default function RecentListingsPage() {
  return (
    <PageLayout title="Recent Listings" maxWidth="6xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-h2 font-semibold">Recent Listings</h1>
            <p className="text-body text-muted-foreground">
              Browse the latest products added to the marketplace
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button className="whitespace-nowrap rounded-md bg-primary px-4 py-2 text-primary-foreground">
            All
          </button>
          <button className="whitespace-nowrap rounded-md border border-neutral-20 bg-white px-4 py-2 hover:bg-neutral-5">
            Last 24 hours
          </button>
          <button className="whitespace-nowrap rounded-md border border-neutral-20 bg-white px-4 py-2 hover:bg-neutral-5">
            Last 7 days
          </button>
          <button className="whitespace-nowrap rounded-md border border-neutral-20 bg-white px-4 py-2 hover:bg-neutral-5">
            Last 30 days
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* TODO: Add product cards */}
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <p className="text-muted-foreground">
              No recent listings available at the moment.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
