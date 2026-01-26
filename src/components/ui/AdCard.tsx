import { Heart, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "./Card";

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

export function AdCard({
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
    <Card className="w-[294px] max-w-sm gap-0 overflow-visible rounded-lg border p-0 ring-0">
      <CardHeader className="relative p-0">
        <img
          src={image}
          alt={title}
          className="h-[221px] w-full rounded-t-lg object-cover"
        />

        {category && !downBadge && (
          <p className="absolute bottom-2 left-2 rounded-lg bg-[hsl(var(--border))] px-2 py-1 text-xs font-normal text-neutral shadow">
            {category}
          </p>
        )}

        <button
          type="button"
          onClick={onToggleFavorite}
          className="absolute right-2 top-2 rounded-full bg-white p-1 shadow transition hover:bg-error/50"
          aria-label="Toggle Favorite"
        >
          <Heart
            fill={isFavorite ? "red" : "none"}
            className={`h-5 w-5 ${isFavorite ? "text-error" : "text-foreground"}`}
          />
        </button>
      </CardHeader>

      <CardContent className="space-y-3 rounded-b-lg border-t p-4">
        <h3 className="text-lg font-normal">{title}</h3>
        <p className="text-xl font-medium text-primary">{price}</p>
        <p className="flex items-center text-sm font-normal text-muted-foreground">
          <MapPin className="mr-1 inline-block h-3 w-3" />
          {location}
        </p>
        {downBadge && (
          <p className="w-fit rounded-lg bg-[hsl(var(--border))] px-3 py-1 text-xs font-normal text-neutral">
            {category}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
