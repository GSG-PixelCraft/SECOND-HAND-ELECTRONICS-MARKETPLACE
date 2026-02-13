import { forwardRef } from "react";
import type { ImgHTMLAttributes, ReactEventHandler } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const imageVariants = cva("", {
  variants: {
    variant: {
      default: "",
      avatar: "rounded-full object-cover",
      thumbnail: "rounded object-cover",
      cover: "h-full w-full object-cover",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ImageVariantProps = VariantProps<typeof imageVariants>;

export interface ImageProps
  extends ImgHTMLAttributes<HTMLImageElement>, ImageVariantProps {}

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { className, variant, ...props },
  ref,
) {
  const handleError: ReactEventHandler<HTMLImageElement> = (e) => {
    e.currentTarget.src = "src\\images\\ErrorImage.png";
    props.onError?.(e);
  };

  return (
    <img
      ref={ref}
      className={cn(imageVariants({ variant }), className)}
      {...props}
      onError={handleError}
    />
  );
});

Image.displayName = "Image";
