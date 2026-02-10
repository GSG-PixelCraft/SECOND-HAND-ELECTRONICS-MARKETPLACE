import PageLayout from "@/components/layout/PageLayout";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function RecentListingsPage() {
  return (
    <PageLayout title="Recent Listings" maxWidth="6xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-h2 font-semibold">Recent Listings</h1>
            <Text variant="muted">
              Browse the latest products added to the marketplace
            </Text>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button className="whitespace-nowrap rounded-md bg-primary px-4 py-2 text-primary-foreground">
            All
          </Button>
          <Button className="whitespace-nowrap rounded-md border border-neutral-20 bg-white px-4 py-2 hover:bg-neutral-5">
            Last 24 hours
          </Button>
          <Button className="whitespace-nowrap rounded-md border border-neutral-20 bg-white px-4 py-2 hover:bg-neutral-5">
            Last 7 days
          </Button>
          <Button className="whitespace-nowrap rounded-md border border-neutral-20 bg-white px-4 py-2 hover:bg-neutral-5">
            Last 30 days
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* TODO: Add product cards */}
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <Text variant="muted">
              No recent listings available at the moment.
            </Text>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
