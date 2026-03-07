import { Link } from "react-router-dom";
import { Text } from "@/components/ui/Text/text";
import { HomeProductCard } from "./HomeProductCard";
import { getProductRoute } from "@/constants/routes";

export interface ListingItem {
  id: string;
  title: string;
  price: string;
  location: string;
  category: string;
  image: string;
  isFavorite?: boolean;
  downBadge?: boolean;
}

export interface ListingSectionData {
  id: string;
  title: string;
  link: string;
  items: ListingItem[];
}

interface ListingSectionProps {
  title: string;
  link: string;
  items: ListingItem[];
  wishlistedIds?: Set<string>;
  onToggleFavorite?: (productId: string) => void;
}

export const ListingSection = ({ title, link, items, wishlistedIds, onToggleFavorite }: ListingSectionProps) => {
  return (
    <section className="space-y-6 px-4 pt-8 sm:px-6 lg:px-10 xl:px-[96px]">
      <div className="flex items-center justify-between">
        <Text as="h2" className="text-xl font-semibold text-slate-900">
          {title}
        </Text>
        <Link to={link} className="text-sm font-medium text-primary">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Link key={item.id} to={getProductRoute(item.id)} className="block w-full max-w-[294px]">
            <HomeProductCard
              image={item.image}
              title={item.title}
              price={item.price}
              location={item.location}
              category={item.category}
              isFavorite={wishlistedIds?.has(item.id) ?? item.isFavorite}
              downBadge={item.downBadge}
              onToggleFavorite={() => onToggleFavorite?.(item.id)}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};
