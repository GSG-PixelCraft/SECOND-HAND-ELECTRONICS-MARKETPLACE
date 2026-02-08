import { ChevronRight, ImageOff } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  image?: string | null;
};

export default function ChatProductPreview({ title, image }: Props) {
  const { t } = useTranslation();

  return (
    <div className="border-border flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-3">
        {image ? (
          <img
            src={image}
            alt={title}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="h-12 w-12 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
            <ImageOff size={18} className="text-muted-foreground" />
          </div>
        )}

        <p className="text-body font-medium text-neutral-foreground">
          {title || t("chat.productFallback")}
        </p>
      </div>

      <ChevronRight size={18} className="text-neutral" />
    </div>
  );
}
