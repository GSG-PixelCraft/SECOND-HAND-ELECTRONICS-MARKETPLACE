import { Heart } from "lucide-react";
import { EmptyState } from "./EmptyState.tsx";

interface FavoritesEmptyStateProps {
  title: string;
  description: string;
}

export function FavoritesEmptyState({
  title,
  description,
}: FavoritesEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      illustration={
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-10">
          <Heart className="h-8 w-8 text-primary" />
        </div>
      }
    />
  );
}
