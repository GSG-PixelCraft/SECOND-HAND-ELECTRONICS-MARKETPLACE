import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tip } from "./Tip";
import { Camera, Sun, Focus, Image as ImageIcon } from "lucide-react";

export interface PhotoTipsProps extends HTMLAttributes<HTMLDivElement> {
  tips?: Array<{
    icon?: ReactNode;
    title?: string;
    content: string;
  }>;
}

const defaultTips = [
  {
    icon: <Camera className="h-5 w-5" />,
    title: "Use good lighting",
    content:
      "Take photos in well-lit areas. Natural daylight works best for clear, accurate colors.",
  },
  {
    icon: <Focus className="h-5 w-5" />,
    title: "Keep it focused",
    content:
      "Ensure your camera is focused on the product. Blurry images may be rejected.",
  },
  {
    icon: <ImageIcon className="h-5 w-5" />,
    title: "Show all angles",
    content:
      "Include multiple photos from different angles to give buyers a complete view.",
  },
  {
    icon: <Sun className="h-5 w-5" />,
    title: "Avoid filters",
    content:
      "Don't use filters or heavy editing. Show the product as it actually appears.",
  },
];

export const PhotoTips = forwardRef<HTMLDivElement, PhotoTipsProps>(
  ({ tips = defaultTips, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {tips.map((tip, index) => (
          <Tip key={index} title={tip.title} icon={tip.icon} variant="info">
            {tip.content}
          </Tip>
        ))}
      </div>
    );
  },
);

PhotoTips.displayName = "PhotoTips";
