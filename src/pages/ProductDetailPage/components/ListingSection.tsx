import { AdCard } from "@/components/ui/AdCard";

interface ListingItem {
  image: string;
  title: string;
  price: string;
  location: string;
  category: string;
}

interface ListingSectionProps {
  title: string;
  items: ListingItem[];
  actionLabel?: string;
  onAction?: () => void;
}

export const ListingSection = ({
  title,
  items,
  actionLabel = "See all",
  onAction,
}: ListingSectionProps) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-neutral-foreground">
          {title}
        </h3>
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-semibold text-primary"
        >
          {actionLabel}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <AdCard
            key={item.title}
            image={item.image}
            title={item.title}
            price={item.price}
            location={item.location}
            category={item.category}
          />
        ))}
      </div>
    </section>
  );
};
