interface ProfileCompletionCardProps {
  completion: number;
}

export const ProfileCompletionCard = ({
  completion,
}: ProfileCompletionCardProps) => (
  <section className="rounded-lg border border-neutral-20 bg-white p-5">
    <div className="mb-3 flex items-center justify-between">
      <p className="font-semibold text-neutral-foreground">
        Profile Completion
      </p>
      <p className="text-body font-semibold text-primary">
        {Math.min(100, Math.max(0, completion))}%
      </p>
    </div>

    <div className="h-2 w-full rounded-full bg-neutral-10">
      <div
        className="h-2 rounded-full bg-primary transition-all"
        style={{ width: `${completion}%` }}
      />
    </div>
  </section>
);

