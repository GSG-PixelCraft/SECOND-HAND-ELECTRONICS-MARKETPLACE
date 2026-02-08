// src/pages/AddListingPage/components/PhotoTipsDialog.tsx
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface PhotoTipsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PhotoTipsDialog: React.FC<PhotoTipsDialogProps> = ({
  open,
  onOpenChange,
}): React.ReactElement => {
  const { t } = useTranslation();

  const tips = React.useMemo(
    () => [
      {
        title: t("addListing.tipsModal.items.zoom.title"),
        body: t("addListing.tipsModal.items.zoom.body"),
      },
      {
        title: t("addListing.tipsModal.items.lighting.title"),
        body: t("addListing.tipsModal.items.lighting.body"),
      },
      {
        title: t("addListing.tipsModal.items.angles.title"),
        body: t("addListing.tipsModal.items.angles.body"),
      },
      {
        title: t("addListing.tipsModal.items.background.title"),
        body: t("addListing.tipsModal.items.background.body"),
      },
      {
        title: t("addListing.tipsModal.items.blurry.title"),
        body: t("addListing.tipsModal.items.blurry.body"),
      },
    ],
    [t],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} size="lg">
      <div className="flex items-center justify-between">
        <h2 className="text-h5 text-neutral-foreground">
          {t("addListing.tipsModal.title")}
        </h2>
        <Button
          type="button"
          onClick={() => onOpenChange(false)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-20 text-sm"
          aria-label={t("common.close")}
        >
          ×
        </Button>
      </div>
      <Text variant="muted" className="mt-3">
        {t("addListing.tipsModal.intro")}
      </Text>
      <ul className="mt-4 space-y-4">
        {tips.map((tip) => (
          <li key={tip.title} className="space-y-1">
            <h3 className="text-body font-medium text-neutral-foreground">
              {tip.title}
            </h3>
            <Text variant="muted" className="text-caption">
              {tip.body}
            </Text>
          </li>
        ))}
      </ul>
    </Dialog>
  );
};
