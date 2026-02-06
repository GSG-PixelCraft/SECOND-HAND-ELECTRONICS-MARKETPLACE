import * as React from "react";
import { cn } from "@/lib/utils";
import { Image } from "@/components/ui/image";
import { X, ZoomIn } from "lucide-react";

export interface VerificationImage {
    id: string;
    url: string;
    alt?: string;
    type?: string;
}

export interface VerificationImagesProps extends React.HTMLAttributes<HTMLDivElement> {
    images: VerificationImage[];
    onImageClick?: (image: VerificationImage) => void;
    onImageRemove?: (id: string) => void;
    maxDisplay?: number;
    columns?: 2 | 3 | 4;
}

export const VerificationImages = React.forwardRef<HTMLDivElement, VerificationImagesProps>(
    (
        {
            images,
            onImageClick,
            onImageRemove,
            maxDisplay,
            columns = 3,
            className,
            ...props
        },
        ref,
    ) => {
        const displayImages = maxDisplay ? images.slice(0, maxDisplay) : images;
        const remainingCount = images.length - displayImages.length;

        const gridCols = {
            2: "grid-cols-2",
            3: "grid-cols-3",
            4: "grid-cols-4",
        };

        return (
            <div
                ref={ref}
                className={cn("space-y-3", className)}
                {...props}
            >
                <div className={cn("grid gap-3", gridCols[columns])}>
                    {displayImages.map((image, index) => (
                        <div
                            key={image.id}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-20 bg-neutral-5"
                        >
                            <Image
                                src={image.url}
                                alt={image.alt || `Verification image ${index + 1}`}
                                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center gap-2">
                                {onImageClick && (
                                    <button
                                        onClick={() => onImageClick(image)}
                                        className="rounded-full bg-white p-2 text-neutral-90 hover:bg-neutral-10 transition-colors"
                                        aria-label="View image"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </button>
                                )}
                                {onImageRemove && (
                                    <button
                                        onClick={() => onImageRemove(image.id)}
                                        className="rounded-full bg-white p-2 text-error hover:bg-error/10 transition-colors"
                                        aria-label="Remove image"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Image type label */}
                            {image.type && (
                                <div className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
                                    {image.type}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Show remaining count */}
                    {remainingCount > 0 && (
                        <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-neutral-30 bg-neutral-5">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-neutral-60">+{remainingCount}</div>
                                <div className="text-xs text-neutral-50">more images</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    },
);

VerificationImages.displayName = "VerificationImages";
