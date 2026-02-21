import { Heart, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Image } from "../ui/image";
import Card, { CardHeader, CardContent } from "../ui/Card";
import { Text } from "../ui/text";

type AdCardProps = {
  image: string;
  title: string;
  price: string;
  location: string;
  category: string;
  isFavorite?: boolean;
  downBadge?: boolean;
  onToggleFavorite?: () => void;
};

export function HomeProductCard({
  image,
  title,
  price,
  location,
  category,
  isFavorite = false,
  downBadge = false,
  onToggleFavorite,
}: AdCardProps) {
  return (
    <Card className="w-[294px] max-w-sm gap-0 overflow-visible rounded-xl border p-0 ring-0">
      <CardHeader className="relative p-0">
        <Image
          src={image}
          alt={title}
          className="h-[221px] w-full rounded-t-xl object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src =
              "https://www.youngurbanproject.com/wp-content/uploads/2025/03/Product-Marketing.jpg";
          }}
        />

        {category && !downBadge && (
          <Text className="absolute bottom-2 left-2 rounded-lg bg-[hsl(var(--border))] px-2 py-1 text-xs font-normal text-neutral shadow">
            {category}
          </Text>
        )}

        <Button
          type="button"
          onClick={onToggleFavorite}
          className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white p-1 shadow transition hover:bg-error"
          aria-label="Toggle Favorite"
        >
          <Heart
            fill={isFavorite ? "red" : "none"}
            className={`mx-auto h-5 w-5 hover:text-white ${
              isFavorite ? "text-error" : "text-slate-400"
            }`}
          />
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 rounded-b-lg border-t p-4">
        <h3 className="text-lg font-normal">{title}</h3>
        <Text variant="primary" className="text-xl font-medium">
          {price}
        </Text>
        <Text variant="muted" className="flex items-center text-sm font-normal">
          <MapPin className="mr-1 inline-block h-3 w-3" />
          {location}
        </Text>
      </CardContent>
    </Card>
  );
}
