// src/pages/AddListingPage/components/BasicDetailsStep.tsx
import * as React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FileUpload, type PhotoItem } from "@/components/ui/file-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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

interface BasicDetailsStepProps {
  register: UseFormRegister<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
  photos: PhotoItem[];
  setPhotos: (photos: PhotoItem[]) => void;
  photoError: string | null;
  setPhotoError: (error: string | null) => void;
  onTipsClick: () => void;
  onNext: () => void;
}

const CATEGORIES = [
  { value: "", labelKey: "addListing.fields.category.placeholder" },
  { value: "phones", labelKey: "addListing.categories.phones" },
  { value: "tablets", labelKey: "addListing.categories.tablets" },
  { value: "laptops", labelKey: "addListing.categories.laptops" },
  { value: "pc-parts", labelKey: "addListing.categories.pcParts" },
  { value: "gaming", labelKey: "addListing.categories.gaming" },
  { value: "audio", labelKey: "addListing.categories.audio" },
  { value: "accessories", labelKey: "addListing.categories.accessories" },
];

const CONDITIONS = [
  { value: "", labelKey: "addListing.fields.condition.placeholder" },
  { value: "new", labelKey: "addListing.conditions.new" },
  { value: "like-new", labelKey: "addListing.conditions.likeNew" },
  { value: "excellent", labelKey: "addListing.conditions.excellent" },
  { value: "good", labelKey: "addListing.conditions.good" },
  { value: "fair", labelKey: "addListing.conditions.fair" },
];

export const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({
  register,
  errors,
  photos,
  setPhotos,
  photoError,
  setPhotoError,
  onTipsClick,
  onNext,
}): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <FileUpload
        photos={photos}
        maxPhotos={8}
        maxPhotoSize={5 * 1024 * 1024}
        onPhotosChange={setPhotos}
        error={photoError}
        onErrorChange={setPhotoError}
        emptyTitle={t("addListing.photos.emptyTitle")}
        emptyHint={t("addListing.photos.emptyHint")}
        addMoreLabel={t("addListing.photos.addMore")}
        mainLabel={t("addListing.photos.main")}
        helperText={t("addListing.photos.helper")}
        tipsLabel={t("addListing.photos.label")}
        onTipsClick={onTipsClick}
      />

      <Input
        id="title"
        label={`${t("addListing.fields.title.label")} *`}
        placeholder={t("addListing.fields.title.placeholder")}
        helperText={t("addListing.fields.title.helper")}
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="category"
          className="text-label text-neutral-foreground"
        >
          {t("addListing.fields.category.label")} *
        </label>
        <Select
          id="category"
          aria-label={t("addListing.fields.category.label")}
          intent={errors.category ? "error" : "default"}
          helperText={t("addListing.fields.category.helper")}
          error={errors.category?.message}
          {...register("category")}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {t(cat.labelKey)}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="condition"
          className="text-label text-neutral-foreground"
        >
          {t("addListing.fields.condition.label")} *
        </label>
        <Select
          id="condition"
          aria-label={t("addListing.fields.condition.label")}
          intent={errors.condition ? "error" : "default"}
          error={errors.condition?.message}
          {...register("condition")}
        >
          {CONDITIONS.map((cond) => (
            <option key={cond.value} value={cond.value}>
              {t(cond.labelKey)}
            </option>
          ))}
        </Select>
      </div>

      <Input
        id="price"
        label={`${t("addListing.fields.price.label")} *`}
        type="number"
        step="0.01"
        placeholder={t("addListing.fields.price.placeholder")}
        helperText={t("addListing.fields.price.helper")}
        error={errors.price?.message}
        {...register("price", { valueAsNumber: true })}
      />

      <Checkbox
        id="isNegotiable"
        label={t("addListing.fields.price.negotiable")}
        {...register("isNegotiable")}
      />

      <div className="flex items-center justify-center">
        <Button
          type="button"
          size="lg"
          className="w-full max-w-md"
          onClick={onNext}
        >
          {t("addListing.buttons.next")}
        </Button>
      </div>
    </div>
  );
};
