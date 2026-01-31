// src/pages/AddListingPage/components/ReviewDialog.tsx
import * as React from "react";
import { useTranslation } from "react-i18next";
import type { UseFormHandleSubmit } from "react-hook-form";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type PhotoItem } from "@/components/ui/file-upload";

interface ListingFormData {
  title: string;
  category: string;
  condition: string;
  price: number;
  isNegotiable?: boolean;
  brand: string;
  storage: string;
  model: string;
  batteryHealth?: string;
  description?: string;
  location: string;
  isPickupAvailable?: boolean;
}

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: Partial<ListingFormData>;
  photos: PhotoItem[];
  fallbackImage: string;
  onSubmit: (data: ListingFormData) => Promise<void>;
  handleSubmit: UseFormHandleSubmit<ListingFormData>;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onOpenChange,
  values,
  photos,
  fallbackImage,
  onSubmit,
  handleSubmit,
}): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      className="max-w-5xl overflow-hidden p-0"
    >
      <div className="flex items-center justify-between border-b border-neutral-10 px-6 py-4">
        <h2 className="text-h5 text-neutral-foreground">
          {t("addListing.reviewModal.title")}
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
      <div className="grid gap-6 px-6 py-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-xl border border-neutral-10">
            <img
              src={photos[0]?.url ?? fallbackImage}
              alt={values.title ?? t("addListing.fields.title.label")}
              className="h-64 w-full object-cover"
            />
            {photos.length > 1 && (
              <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-caption text-white">
                +{photos.length - 1}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-neutral-10 p-4">
            <h3 className="text-label font-semibold text-neutral-foreground">
              {t("addListing.reviewModal.basicDetails")}
            </h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-caption text-muted-foreground">
                  {t("addListing.fields.title.label")}
                </dt>
                <dd className="text-body text-neutral-foreground">
                  {values.title || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-caption text-muted-foreground">
                  {t("addListing.fields.category.label")}
                </dt>
                <dd className="text-body text-neutral-foreground">
                  {values.category
                    ? t(`addListing.categories.${values.category}`)
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-caption text-muted-foreground">
                  {t("addListing.fields.condition.label")}
                </dt>
                <dd className="text-body text-neutral-foreground">
                  {values.condition
                    ? t(
                        `addListing.conditions.${values.condition.replace("-", "")}`,
                      )
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-caption text-muted-foreground">
                  {t("addListing.fields.price.label")}
                </dt>
                <dd className="text-body text-neutral-foreground">
                  ${values.price || 0}{" "}
                  {values.isNegotiable &&
                    `(${t("addListing.fields.price.negotiable")})`}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-neutral-10 p-4">
            <h3 className="text-label font-semibold text-neutral-foreground">
              {t("addListing.reviewModal.moreDetails")}
            </h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-caption text-muted-foreground">
                  {t("addListing.fields.brand.label")}
                </dt>
                <dd className="text-body text-neutral-foreground">
                  {values.brand ? t(`addListing.brands.${values.brand}`) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-caption text-muted-foreground">
                  {t("addListing.fields.model.label")}
                </dt>
                <dd className="text-body text-neutral-foreground">
                  {values.model || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-caption text-muted-foreground">
                  {t("addListing.fields.storage.label")}
                </dt>
                <dd className="text-body text-neutral-foreground">
                  {values.storage
                    ? t(`addListing.storage.${values.storage}`)
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-caption text-muted-foreground">
                  {t("addListing.fields.batteryHealth.label")}
                </dt>
                <dd className="text-body text-neutral-foreground">
                  {values.batteryHealth || "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-neutral-10 p-4">
            <h3 className="text-label font-semibold text-neutral-foreground">
              {t("addListing.fields.description.label")}
            </h3>
            <p className="mt-2 text-body text-muted-foreground">
              {values.description || "—"}
            </p>
            <div className="mt-4 h-32 rounded-lg border border-neutral-10 bg-muted-5" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-10 p-4">
            <h3 className="text-label font-semibold text-neutral-foreground">
              {t("addListing.fields.location.label")}
            </h3>
            <p className="mt-2 text-body text-neutral-foreground">
              {values.location || "—"}
            </p>
            {values.isPickupAvailable && (
              <p className="mt-1 text-caption text-muted-foreground">
                {t("addListing.fields.location.pickup")}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-neutral-10 p-4">
            <h3 className="text-label font-semibold text-neutral-foreground">
              {t("addListing.reviewModal.seller")}
            </h3>
            <p className="mt-2 text-body text-neutral-foreground">John Doe</p>
            <p className="text-caption text-muted-foreground">
              {t("addListing.reviewModal.memberSince")}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-10 bg-primary-5 p-4">
            <h3 className="text-label font-semibold text-neutral-foreground">
              {t("addListing.reviewModal.publishNote")}
            </h3>
            <p className="mt-2 text-caption text-muted-foreground">
              {t("addListing.reviewModal.publishNoteBody")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-neutral-10 px-6 py-4">
        <Button
          type="button"
          intent="outline"
          size="lg"
          className="w-full max-w-xs"
          onClick={() => onOpenChange(false)}
        >
          {t("addListing.buttons.continueEditing")}
        </Button>
        <Button
          type="button"
          size="lg"
          className="w-full max-w-xs"
          onClick={handleSubmit(onSubmit)}
        >
          {t("addListing.buttons.publish")}
        </Button>
      </div>
    </Dialog>
  );
};
