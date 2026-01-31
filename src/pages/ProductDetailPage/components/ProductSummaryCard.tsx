import { Clock, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface ProductSummaryCardProps {
  postedAt: string;
  views: number;
  favorites: number;
  title: string;
  priceLabel: string;
  negotiable?: boolean;
  conditionLabel?: string;
}

export const ProductSummaryCard = ({
  postedAt,
  views,
  favorites,
  title,
  priceLabel,
  negotiable = false,
  conditionLabel,
}: ProductSummaryCardProps) => {
  return (
    <Card className="gap-3 rounded-2xl border border-neutral-10 bg-white">
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{postedAt}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {favorites}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-neutral-foreground">
              {title}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-primary">
                {priceLabel}
              </span>
              {negotiable && (
                <span className="text-xs text-muted-foreground">
                  Price is negotiable
                </span>
              )}
            </div>
          </div>
          {conditionLabel && (
            <span className="rounded-full bg-primary-10 px-3 py-1 text-xs font-semibold text-primary">
              {conditionLabel}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
