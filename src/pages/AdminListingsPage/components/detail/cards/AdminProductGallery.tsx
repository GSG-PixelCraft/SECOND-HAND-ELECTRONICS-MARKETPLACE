import { forwardRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";

export interface AdminProductGalleryProps {
  images: string[];
  title?: string;
}

export const AdminProductGallery = forwardRef<
  HTMLDivElement,
  AdminProductGalleryProps
>(({ images, title = "Product" }, ref) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;
  const activeImage = hasImages ? images[activeIndex] : "";

  const handlePrev = () => {
    if (!hasImages) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (!hasImages) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  if (!hasImages) {
    return (
      <div
        ref={ref}
        className="relative flex h-[460px] items-center justify-center overflow-hidden rounded-xl border border-neutral-20 bg-neutral-5"
      >
        <div className="text-center">
          <p className="text-neutral-50">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-xl border border-neutral-20 bg-white"
    >
      {/* Main Image */}
      <Image
        src={activeImage}
        alt={`${title} - Image ${activeIndex + 1}`}
        variant="cover"
        className="h-[460px] w-full object-cover"
      />

      {/* Navigation Buttons */}
      {hasMultipleImages && (
        <>
          <button
            onClick={handlePrev}
            className="hover:bg-neutral-50 absolute left-6 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="text-neutral-90 size-6" />
          </button>

          <button
            onClick={handleNext}
            className="hover:bg-neutral-50 absolute right-6 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="text-neutral-90 size-6" />
          </button>
        </>
      )}

      {/* Image Index Display */}
      <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
        {activeIndex + 1} / {images.length}
      </div>

      {/* Dot Indicators */}
      {hasMultipleImages && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`size-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-8 bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

AdminProductGallery.displayName = "AdminProductGallery";
