import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { listingSchema } from "@/components/forms/zod-schemas";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/Loader";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

type ListingFormData = z.infer<typeof listingSchema>;

const MAX_PHOTOS = 8;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const FALLBACK_IMAGE = new URL("../../images/Phone.jpg", import.meta.url).href;

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

interface PhotoItem {
  id: string;
  url: string;
  file: File;
}

export default function AddListingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [reviewSuccessOpen, setReviewSuccessOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
  });

  const values = watch();
  const descriptionValue = values.description ?? "";

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  const onSubmit = async (data: ListingFormData) => {
    console.log("Listing data:", data);
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    setReviewSuccessOpen(true);
  };

  const steps = useMemo(
    () => [
      { id: 1, label: t("addListing.steps.basicDetails") },
      { id: 2, label: t("addListing.steps.moreDetails") },
    ],
    [t],
  );

  const tips = useMemo(
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

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) return;

    const oversized = files.find((file) => file.size > MAX_PHOTO_SIZE);
    if (oversized) {
      setPhotoError(t("addListing.photos.errorSize"));
      event.target.value = "";
      return;
    }

    setPhotoError(null);
    setPhotos((prev) => {
      const remainingSlots = MAX_PHOTOS - prev.length;
      const nextFiles = files.slice(0, remainingSlots);
      const nextPhotos = nextFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...nextPhotos];
    });
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files ?? []);
    if (!files.length) return;

    const oversized = files.find((file) => file.size > MAX_PHOTO_SIZE);
    if (oversized) {
      setPhotoError(t("addListing.photos.errorSize"));
      return;
    }

    setPhotoError(null);
    setPhotos((prev) => {
      const remainingSlots = MAX_PHOTOS - prev.length;
      const nextFiles = files.slice(0, remainingSlots);
      const nextPhotos = nextFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...nextPhotos];
    });
  };

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => {
      const photoToRemove = prev.find((photo) => photo.id === photoId);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.url);
      }
      return prev.filter((photo) => photo.id !== photoId);
    });
  };

  const handleNextStep = async () => {
    const valid = await trigger(["title", "category", "condition", "price"]);
    if (!photos.length) {
      setPhotoError(t("addListing.photos.errorMissing"));
    }
    if (valid && photos.length) {
      setCurrentStep(2);
    }
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container maxWidth="4xl" className="pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-neutral-foreground">
            {t("addListing.title")}
          </h1>
        </div>
        <Button intent="outline" size="sm" onClick={() => setLeaveOpen(true)}>
          {t("addListing.buttons.back")}
        </Button>
      </div>

      <div className="mt-6 flex flex-col items-start gap-4">
        <ol className="flex flex-wrap items-center gap-6">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <li key={step.id} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id as 1 | 2)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-caption",
                    isActive && "border-primary text-primary",
                    isCompleted && "border-primary bg-primary text-white",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted ? "✓" : step.id}
                </button>
                <span
                  className={cn(
                    "text-body",
                    isActive || isCompleted
                      ? "text-neutral-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <span className="hidden h-px w-24 bg-neutral-10 sm:block" />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        {currentStep === 1 && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-label text-neutral-foreground">
                  {t("addListing.photos.label")}{" "}
                  <span className="text-error">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setTipsOpen(true)}
                  className="text-caption text-primary"
                >
                  {t("addListing.photos.tips")}
                </button>
              </div>

              <div
                className={cn(
                  "mt-3 rounded-lg border border-dashed border-neutral-20 bg-white p-6",
                  photoError && "border-error bg-error-10",
                )}
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoChange}
                />

                {photos.length === 0 ? (
                  <button
                    type="button"
                    onClick={handleOpenFilePicker}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-20 py-10 text-center"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-20 text-xl text-neutral-foreground">
                      +
                    </span>
                    <span className="text-body text-neutral-foreground">
                      {t("addListing.photos.emptyTitle")}
                    </span>
                    <span className="text-caption text-muted-foreground">
                      {t("addListing.photos.emptyHint")}
                    </span>
                  </button>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="group relative overflow-hidden rounded-lg border border-neutral-10"
                      >
                        <img
                          src={photo.url}
                          alt={t("addListing.photos.label")}
                          className="h-40 w-full object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 rounded-full bg-primary px-2 py-0.5 text-caption text-white">
                            {t("addListing.photos.main")}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-neutral-foreground shadow"
                          aria-label={t("common.close")}
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {photos.length < MAX_PHOTOS && (
                      <button
                        type="button"
                        onClick={handleOpenFilePicker}
                        className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-20 text-caption text-muted-foreground"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-20 text-lg">
                          +
                        </span>
                        {t("addListing.photos.addMore")}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {photoError ? (
                <p className="mt-2 text-caption text-error">{photoError}</p>
              ) : (
                <p className="mt-2 text-caption text-muted-foreground">
                  {t("addListing.photos.helper")}
                </p>
              )}
            </div>

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
                {t("addListing.fields.category.label")}{" "}
                <span className="text-error">*</span>
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
                {t("addListing.fields.condition.label")}{" "}
                <span className="text-error">*</span>
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

            <label className="flex items-center gap-2 text-caption text-neutral-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-20 text-primary"
                {...register("isNegotiable")}
              />
              {t("addListing.fields.price.negotiable")}
            </label>

            <div className="flex items-center justify-center">
              <Button
                type="button"
                size="lg"
                className="w-full max-w-sm"
                disabled={isSubmitting}
                onClick={handleNextStep}
              >
                {t("addListing.buttons.next")}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="brand"
                className="text-label text-neutral-foreground"
              >
                {t("addListing.fields.brand.label")}{" "}
                <span className="text-error">*</span>
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
              <label
                htmlFor="storage"
                className="text-label text-neutral-foreground"
              >
                {t("addListing.fields.storage.label")}{" "}
                <span className="text-error">*</span>
              </label>
              <Select
                id="storage"
                aria-label={t("addListing.fields.storage.label")}
                intent={errors.storage ? "error" : "default"}
                error={errors.storage?.message}
                {...register("storage")}
              >
                {STORAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
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
                <span>{descriptionValue.length}/500</span>
              </div>
              {errors.description?.message && (
                <p className="text-caption text-error">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="location"
                  className="text-label text-neutral-foreground"
                >
                  {t("addListing.fields.location.label")}{" "}
                  <span className="text-error">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setLocationOpen(true)}
                  className="text-caption text-primary"
                >
                  {t("addListing.fields.location.helper")}
                </button>
              </div>
              <Input
                id="location"
                placeholder={t("addListing.fields.location.placeholder")}
                error={errors.location?.message}
                {...register("location")}
              />
            </div>

            <label className="flex items-center gap-2 text-caption text-neutral-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-20 text-primary"
                {...register("confirmNotStolen")}
              />
              {t("addListing.fields.confirmNotStolen")}
              <span className="text-error">*</span>
            </label>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                type="button"
                intent="outline"
                size="lg"
                className="w-full max-w-xs"
                onClick={() => setReviewOpen(true)}
              >
                {t("addListing.buttons.review")}
              </Button>
              <Button
                type="submit"
                size="lg"
                className="w-full max-w-xs"
                disabled={isSubmitting}
              >
                {t("addListing.buttons.publish")}
              </Button>
            </div>
          </div>
        )}
      </form>

      <Dialog open={tipsOpen} onOpenChange={setTipsOpen} size="lg">
        <div className="flex items-center justify-between">
          <h2 className="text-h5 text-neutral-foreground">
            {t("addListing.tipsModal.title")}
          </h2>
          <button
            type="button"
            onClick={() => setTipsOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-20 text-sm"
            aria-label={t("common.close")}
          >
            ×
          </button>
        </div>
        <p className="mt-3 text-body text-muted-foreground">
          {t("addListing.tipsModal.intro")}
        </p>
        <ul className="mt-4 space-y-4">
          {tips.map((tip) => (
            <li key={tip.title} className="space-y-1">
              <p className="text-body font-medium text-primary">
                • {tip.title}
              </p>
              <p className="text-body text-muted-foreground">{tip.body}</p>
            </li>
          ))}
        </ul>
      </Dialog>

      <Dialog open={locationOpen} onOpenChange={setLocationOpen} size="lg">
        <div className="flex items-center justify-between">
          <h2 className="text-h5 text-neutral-foreground">
            {t("addListing.locationModal.title")}
          </h2>
          <button
            type="button"
            onClick={() => setLocationOpen(false)}
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

      <Dialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        size="lg"
        className="max-w-5xl overflow-hidden p-0"
      >
        <div className="flex items-center justify-between border-b border-neutral-10 px-6 py-4">
          <h2 className="text-h5 text-neutral-foreground">
            {t("addListing.reviewModal.title")}
          </h2>
          <button
            type="button"
            onClick={() => setReviewOpen(false)}
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
                src={photos[0]?.url ?? FALLBACK_IMAGE}
                alt={values.title ?? t("addListing.fields.title.label")}
                className="h-64 w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="h-2 w-2 rounded-full bg-white/60" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
              </div>
            </div>

            <div className="rounded-xl border border-neutral-10 p-4">
              <h3 className="text-body font-medium text-neutral-foreground">
                {t("addListing.reviewModal.keyFeatures")}
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-primary-5 p-3">
                  <p className="text-caption text-muted-foreground">
                    {t("addListing.fields.category.label")}
                  </p>
                  <p className="text-body text-neutral-foreground">
                    {values.category || "-"}
                  </p>
                </div>
                <div className="rounded-lg bg-primary-5 p-3">
                  <p className="text-caption text-muted-foreground">
                    {t("addListing.fields.brand.label")}
                  </p>
                  <p className="text-body text-neutral-foreground">
                    {values.brand || "-"}
                  </p>
                </div>
                <div className="rounded-lg bg-primary-5 p-3">
                  <p className="text-caption text-muted-foreground">
                    {t("addListing.fields.model.label")}
                  </p>
                  <p className="text-body text-neutral-foreground">
                    {values.model || "-"}
                  </p>
                </div>
                <div className="rounded-lg bg-primary-5 p-3">
                  <p className="text-caption text-muted-foreground">
                    {t("addListing.fields.storage.label")}
                  </p>
                  <p className="text-body text-neutral-foreground">
                    {values.storage ? `${values.storage} GB` : "-"}
                  </p>
                </div>
                <div className="rounded-lg bg-primary-5 p-3">
                  <p className="text-caption text-muted-foreground">
                    {t("addListing.fields.batteryHealth.label")}
                  </p>
                  <p className="text-body text-neutral-foreground">
                    {values.batteryHealth || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-10 p-4">
              <h3 className="text-body font-medium text-neutral-foreground">
                {t("addListing.reviewModal.description")}
              </h3>
              <p className="mt-3 text-body text-muted-foreground">
                {values.description || "-"}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-10 p-4">
              <h3 className="text-body font-medium text-neutral-foreground">
                {t("addListing.reviewModal.location")}
              </h3>
              <p className="mt-3 text-body text-muted-foreground">
                {values.location || "-"}
              </p>
              <div className="mt-4 h-32 rounded-lg border border-neutral-10 bg-muted-5" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-neutral-10 p-4">
              <p className="text-body font-medium text-neutral-foreground">
                {values.title || t("addListing.fields.title.label")}
              </p>
              <p className="mt-2 text-h5 text-primary">
                {values.price ? `${values.price} ILS` : "-"}
              </p>
              <p className="text-caption text-muted-foreground">
                {values.isNegotiable
                  ? t("addListing.fields.price.negotiable")
                  : ""}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-10 p-4">
              <p className="text-body font-medium text-neutral-foreground">
                {t("addListing.reviewModal.seller.name")}
              </p>
              <p className="text-caption text-muted-foreground">
                {t("addListing.reviewModal.seller.stats")}
              </p>
              <p className="mt-2 text-caption text-muted-foreground">
                {t("addListing.reviewModal.seller.lastOnline")}
              </p>
              <p className="text-caption text-muted-foreground">
                {t("addListing.reviewModal.seller.response")}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-10 bg-primary-5 p-4">
              <p className="text-body font-medium text-neutral-foreground">
                {t("addListing.reviewModal.safetyTips")}
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-caption text-muted-foreground">
                <li>{t("addListing.reviewModal.safetyItems.safeLocation")}</li>
                <li>{t("addListing.reviewModal.safetyItems.noDeposit")}</li>
                <li>{t("addListing.reviewModal.safetyItems.bankDeposit")}</li>
                <li>{t("addListing.reviewModal.safetyItems.bringFriend")}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-neutral-10 px-6 py-4">
          <Button
            type="button"
            intent="outline"
            size="lg"
            className="w-full max-w-xs"
            onClick={() => setReviewOpen(false)}
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

      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen} size="sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-10 text-warning">
            !
          </div>
          <div className="space-y-2">
            <p className="text-h5 text-neutral-foreground">
              {t("addListing.leaveModal.title")}
            </p>
            <p className="text-body text-muted-foreground">
              {t("addListing.leaveModal.body")}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button onClick={() => setLeaveOpen(false)}>
              {t("addListing.buttons.continueEditing")}
            </Button>
            <Button
              intent="outline"
              onClick={() => {
                setLeaveOpen(false);
                navigate(-1);
              }}
            >
              {t("addListing.buttons.leave")}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={reviewSuccessOpen}
        onOpenChange={setReviewSuccessOpen}
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-20 text-success">
            ✓
          </div>
          <div className="space-y-2">
            <p className="text-h5 text-neutral-foreground">
              {t("addListing.reviewSuccess.title")}
            </p>
            <p className="text-body text-muted-foreground">
              {t("addListing.reviewSuccess.body")}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button
              onClick={() => {
                setReviewSuccessOpen(false);
                navigate(ROUTES.MY_LISTINGS);
              }}
            >
              {t("addListing.buttons.viewListings")}
            </Button>
            <Button
              intent="outline"
              onClick={() => {
                setReviewSuccessOpen(false);
                navigate(ROUTES.HOME);
              }}
            >
              {t("addListing.buttons.goHome")}
            </Button>
          </div>
        </div>
      </Dialog>

      {isSending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-8 py-6 text-center">
            <Loader size="lg" />
            <p className="text-body font-medium text-neutral-foreground">
              {t("addListing.sending.title")}
            </p>
            <p className="text-caption text-muted-foreground">
              {t("addListing.sending.body")}
            </p>
          </div>
        </div>
      )}
    </Container>
  );
}
