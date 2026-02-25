import { Link } from "react-router-dom";
import { Text } from "@/components/ui/Text/text";
import { HomeProductCard } from "./HomeProductCard";

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
}

export const ListingSection = ({ title, link, items }: ListingSectionProps) => {
  return (
    <section className="space-y-6 px-[96px] pt-8">
      <div className="flex items-center justify-between">
        <Text as="h2" className="text-xl font-semibold text-slate-900">
          {title}
        </Text>
        <Link to={link} className="text-sm font-medium text-primary">
          See all
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:justify-items-center">
        {items.map((item) => (
          <HomeProductCard
            key={item.id}
            image={item.image}
            title={item.title}
            price={item.price}
            location={item.location}
            category={item.category}
            isFavorite={item.isFavorite}
            downBadge={item.downBadge}
          />
        ))}
      </div>
    </section>
  );
};
