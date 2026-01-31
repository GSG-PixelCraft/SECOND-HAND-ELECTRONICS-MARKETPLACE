// src/pages/AddListingPage/components/LocationDialog.tsx
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  onOpenChange,
}): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange} size="lg">
      <div className="flex items-center justify-between">
        <h2 className="text-h5 text-neutral-foreground">
          {t("addListing.locationModal.title")}
        </h2>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-20 text-sm"
          aria-label={t("common.close")}
        >
          ×
        </button>
      </div>
      <div className="mt-4 space-y-4">
        <Input
          label={`${t("addListing.locationModal.country")} *`}
          placeholder={t("addListing.locationModal.country")}
        />
        <Input
          label={`${t("addListing.locationModal.city")} *`}
          placeholder={t("addListing.locationModal.city")}
        />
        <Input
          label={t("addListing.locationModal.street")}
          placeholder={t("addListing.locationModal.streetPlaceholder")}
        />
        <div className="flex items-center gap-3 text-caption text-muted-foreground">
          <span className="h-px flex-1 bg-neutral-10" />
          {t("addListing.locationModal.mapHelper")}
          <span className="h-px flex-1 bg-neutral-10" />
        </div>
        <div className="flex h-40 items-center justify-center rounded-lg border border-neutral-20 bg-muted-5 text-caption text-muted-foreground">
          {t("addListing.locationModal.mapPlaceholder")}
        </div>
        <Button size="lg" className="w-full">
          {t("addListing.buttons.useThisAddress")}
        </Button>
      </div>
    </Dialog>
  );
};
