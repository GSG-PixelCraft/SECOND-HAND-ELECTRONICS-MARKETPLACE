interface ActivitySummaryProps {
  listingsCount?: number;
  isLoading?: boolean;
}

export const ActivitySummary = ({
  listingsCount,
  isLoading = false,
}: ActivitySummaryProps) => (
  <section className="rounded-lg border border-neutral-20 bg-white p-5">
    <p className="mb-4 font-semibold text-neutral-foreground">
      Activity Summary
    </p>
    <div className="grid grid-cols-1 gap-4">
      <div className="rounded-lg border border-neutral-20 p-4">
        <p className="text-bodyLg font-semibold text-neutral-foreground">
          {isLoading ? (
            <span className="inline-block h-5 w-6 animate-pulse rounded bg-neutral-10" />
          ) : (
            (listingsCount ?? 0)
          )}
        </p>
        <p className="text-caption text-muted-foreground">Active listings</p>
      </div>
    </div>
  </section>
);
