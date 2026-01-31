// src/pages/AddListingPage/components/MoreDetailsStep.tsx
import * as React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

interface MoreDetailsStepProps {
  register: UseFormRegister<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
  watch: UseFormWatch<ListingFormData>;
  onBack: () => void;
  onReview: () => void;
  onLocationClick: () => void;
}

const BRANDS = [
  { value: "", labelKey: "addListing.fields.brand.placeholder" },
  { value: "apple", labelKey: "addListing.brands.apple" },
  { value: "samsung", labelKey: "addListing.brands.samsung" },
  { value: "xiaomi", labelKey: "addListing.brands.xiaomi" },
  { value: "huawei", labelKey: "addListing.brands.huawei" },
];

const STORAGE_OPTIONS = [
  { value: "", labelKey: "addListing.fields.storage.placeholder" },
  { value: "64", labelKey: "addListing.storage.64" },
  { value: "128", labelKey: "addListing.storage.128" },
  { value: "256", labelKey: "addListing.storage.256" },
  { value: "512", labelKey: "addListing.storage.512" },
];

export const MoreDetailsStep: React.FC<MoreDetailsStepProps> = ({
  register,
  errors,
  watch,
  onBack,
  onReview,
  onLocationClick,
}): React.ReactElement => {
  const { t } = useTranslation();
  const descriptionValue = watch("description") ?? "";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="brand" className="text-label text-neutral-foreground">
          {t("addListing.fields.brand.label")} *
        </label>
        <Select
          id="brand"
          aria-label={t("addListing.fields.brand.label")}
          intent={errors.brand ? "error" : "default"}
          error={errors.brand?.message}
          {...register("brand")}
        >
          {BRANDS.map((brand) => (
            <option key={brand.value} value={brand.value}>
              {t(brand.labelKey)}
            </option>
          ))}
        </Select>
      </div>

      <Input
        id="model"
        label={`${t("addListing.fields.model.label")} *`}
        placeholder={t("addListing.fields.model.placeholder")}
        error={errors.model?.message}
        {...register("model")}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="storage" className="text-label text-neutral-foreground">
          {t("addListing.fields.storage.label")} *
        </label>
        <Select
          id="storage"
          aria-label={t("addListing.fields.storage.label")}
          intent={errors.storage ? "error" : "default"}
          error={errors.storage?.message}
          {...register("storage")}
        >
          {STORAGE_OPTIONS.map((storage) => (
            <option key={storage.value} value={storage.value}>
              {t(storage.labelKey)}
            </option>
          ))}
        </Select>
      </div>

      <Input
        id="batteryHealth"
        label={t("addListing.fields.batteryHealth.label")}
        placeholder={t("addListing.fields.batteryHealth.placeholder")}
        error={errors.batteryHealth?.message}
        {...register("batteryHealth")}
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-label text-neutral-foreground"
        >
          {t("addListing.fields.description.label")}
        </label>
        <Textarea
          id="description"
          placeholder={t("addListing.fields.description.placeholder")}
          rows={6}
          intent={errors.description ? "error" : "default"}
          {...register("description")}
        />
        <div className="flex items-center justify-between text-caption text-muted-foreground">
          <span>{t("addListing.fields.description.helper")}</span>
          <span>{descriptionValue.length} / 500</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="location"
            className="text-label text-neutral-foreground"
          >
            {t("addListing.fields.location.label")} *
          </label>
          <button
            type="button"
            onClick={onLocationClick}
            className="text-caption font-medium text-primary hover:underline"
          >
            {t("addListing.fields.location.useMap")}
          </button>
        </div>
        <Input
          id="location"
          placeholder={t("addListing.fields.location.placeholder")}
          error={errors.location?.message}
          {...register("location")}
        />
      </div>

      <Checkbox
        id="isPickupAvailable"
        label={t("addListing.fields.location.pickup")}
        {...register("isPickupAvailable")}
      />

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          type="button"
          intent="outline"
          size="lg"
          className="w-full max-w-xs"
          onClick={onBack}
        >
          {t("addListing.buttons.back")}
        </Button>
        <Button
          type="button"
          size="lg"
          className="w-full max-w-xs"
          onClick={onReview}
        >
          {t("addListing.buttons.review")}
        </Button>
      </div>
    </div>
  );
};
