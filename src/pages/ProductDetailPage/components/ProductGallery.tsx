import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";

interface OwnerActions {
  onEdit?: () => void;
  onDelete?: () => void;
}

interface ProductGalleryProps {
  title: string;
  images: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
  ownerActions?: OwnerActions;
}

export const ProductGallery = ({
  title,
  images,
  isFavorite = false,
  onToggleFavorite,
  onShare,
  ownerActions,
}: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];
  const hasOwnerActions = Boolean(ownerActions);
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const handlePrev = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-10 bg-white">
      <img
        src={activeImage}
        alt={title}
        className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[460px]"
      />

      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-center">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!hasMultipleImages}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-foreground shadow transition hover:bg-white"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center">
        <button
          type="button"
          onClick={handleNext}
          disabled={!hasMultipleImages}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-foreground shadow transition hover:bg-white"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {images.map((_, index) => (
          <button
            type="button"
            key={`indicator-${index}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === activeIndex ? "bg-white" : "bg-white/60"
            }`}
          />
        ))}
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-2">
        {hasOwnerActions ? (
          <>
            <button
              type="button"
              onClick={ownerActions?.onEdit}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-foreground shadow transition hover:bg-white"
              aria-label="Edit listing"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={ownerActions?.onDelete}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-error shadow transition hover:bg-white"
              aria-label="Delete listing"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onShare}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-foreground shadow transition hover:bg-white"
              aria-label="Share listing"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onToggleFavorite}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-error shadow transition hover:bg-white"
              aria-label="Favorite listing"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-error" : ""}`} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
