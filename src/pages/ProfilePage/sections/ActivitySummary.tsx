export const ActivitySummary = () => (
  <section className="rounded-lg border border-neutral-20 bg-white p-5">
    <p className="mb-4 font-semibold text-neutral-foreground">
      Activity Summary
    </p>

    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-neutral-20 p-4">
        <p className="text-bodyLg font-semibold text-neutral-foreground">
          10 hours
        </p>
        <p className="text-caption text-muted-foreground">Avg. response</p>
      </div>

      <div className="rounded-lg border border-neutral-20 p-4">
        <p className="text-bodyLg font-semibold text-neutral-foreground">12</p>
        <p className="text-caption text-muted-foreground">Active listing</p>
      </div>
    </div>
  </section>
);

