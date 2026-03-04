import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { listingSchema } from "@/components/forms/zod-schemas";
import { type PhotoItem } from "@/components/ui/FileUpload/file-upload";
import { StepIndicator } from "./components/StepIndicator";
import { BasicDetailsStep } from "./components/BasicDetailsStep";
import { MoreDetailsStep } from "./components/MoreDetailsStep";
import { PhotoTipsDialog } from "./components/PhotoTipsDialog";
import { LocationDialog } from "./components/LocationDialog";
import { ReviewDialog } from "./components/ReviewDialog";
import { ConfirmationDialogs } from "./components/ConfirmationDialogs";
import {
  useCreateProduct,
  useCreatePendingProduct,
  useCategories,
  productService,
  PRODUCTS_KEYS,
} from "@/services/product.service";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import type { Product } from "@/types";

type ListingFormData = z.infer<typeof listingSchema>;
type PhotoItemWithProgress = PhotoItem & { uploadProgress?: number };
type LocationValue = {
  country: string;
  city: string;
  street: string;
  lat: number;
  lng: number;
};

const FALLBACK_IMAGE = new URL("../../images/Phone.jpg", import.meta.url).href;

export default function AddListingPage(): ReactElement {
  const { t } = useTranslation();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isPendingRoute =
    location.pathname.endsWith("/products/bending") ||
    location.pathname.endsWith("/products/pending");
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories() as any;
  const draftMutation = useCreateProduct();
  const pendingMutation = useCreatePendingProduct();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [photos, setPhotos] = useState<PhotoItemWithProgress[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationValue, setLocationValue] = useState<LocationValue>({
    country: "Palestine",
    city: "Gaza",
    street: "",
    lat: 31.5017,
    lng: 34.4668,
  });
  const [reviewOpen, setReviewOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [reviewSuccessOpen, setReviewSuccessOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
  });

  const values = watch();
  const isBasicDetailsValid =
    Boolean(values.title?.trim().length) &&
    Boolean(values.category?.trim().length) &&
    Boolean(values.condition?.trim().length) &&
    Number(values.price) > 0 &&
    photos.length > 0 &&
    !isCategoriesLoading;

  useEffect(() => {
    const formatted = [locationValue.city, locationValue.country]
      .filter(Boolean)
      .join(", ");
    if (formatted) {
      setValue("location", formatted, { shouldValidate: true });
    }
  }, [locationValue.city, locationValue.country, setValue]);

  const normalizeCondition = (value: string): Product["condition"] => {
    const v = value.trim().toLowerCase();
    if (v === "new") return "new";
    if (v === "like new" || v === "like-new") return "like-new";
    if (v === "excellent") return "like-new";
    if (v === "good") return "good";
    if (v === "fair") return "fair";
    return "good";
  };

  const onSubmit = async (data: ListingFormData) => {
    setIsSending(true);
    try {
      // Ensure categories available (fetch if not yet loaded)
      let localCategories = categoriesData as any[] | undefined;
      if (!localCategories || !localCategories.length) {
        localCategories = await queryClient.fetchQuery({
          queryKey: PRODUCTS_KEYS.categories as any,
          queryFn: productService.getCategories,
        });
      }
      // Try to match selected category to backend categories (fallback to heuristic/first)
      const selectedCategoryName = data.category?.trim() || "";
      const norm = selectedCategoryName.toLowerCase();
      const synonymGroups: Array<string[]> = [
        ["phone", "phones", "smartphone", "smartphones", "mobile", "mobiles"],
        ["laptop", "laptops", "notebook"],
        ["tablet", "tablets"],
        ["camera", "cameras"],
        ["audio", "headphone", "headphones", "earbud", "earbuds"],
        ["gaming", "console", "playstation", "xbox", "nintendo"],
        ["accessories", "accessory"],
        ["pc parts", "pc", "parts", "component", "components"],
      ];
      const includesMatch = (name: string) => {
        const n = name.toLowerCase();
        return synonymGroups.some((group) =>
          group.some((key) => n.includes(key) && norm.includes(group[0])),
        );
      };
      let match = (localCategories ?? []).find(
        (c: any) => String(c.name).toLowerCase() === norm,
      );
      if (!match) {
        match = (localCategories ?? []).find((c: any) => includesMatch(String(c.name)));
      }
      // If backend has no categories, fall back to '1' (common default in seeded DBs)
      const categoryFallbackId = "1";
      const categoryId = String(
        match?.id ?? localCategories?.[0]?.id ?? categoryFallbackId,
      );

      // Build attributes (required for pending; harmless for draft)
      const attributes = [
        data.brand && { attributeId: "1", value: String(data.brand) },
        data.model && { attributeId: "2", value: String(data.model) },
        data.storage && {
          attributeId: "3",
          value:
            String(data.storage) + (String(data.storage).endsWith("GB") ? "" : "GB"),
        },
        data.batteryHealth && {
          attributeId: "4",
          value: String(data.batteryHealth),
        },
        data.description && { attributeId: "5", value: String(data.description) },
        values.location && { attributeId: "6", value: String(values.location) },
      ].filter(Boolean) as { attributeId: string; value: string }[];

      const images = photos.map((p) => p.file);

      if (isPendingRoute) {
        // Fetch category attributes to map to real attribute IDs
        const catDetail = await productService.getCategoryDetail(categoryId);
        const defs = catDetail?.attributes ?? [];
        const pick = (names: string[]) =>
          defs.find((d) => names.some((n) => d.name.toLowerCase().includes(n)));

        const brandDef = pick(["brand", "company", "manufacturer", "make"]);
        const modelDef = pick(["model"]);
        const storageDef = pick(["storage", "capacity", "rom"]);
        const batteryDef = pick(["battery", "battery health"]);
        const descDef = pick(["description", "details", "notes"]);
        const locDef = pick(["location", "address", "city"]);

        const mappedAttrs = [] as { attributeId: string; value: string }[];
        if (brandDef && data.brand) mappedAttrs.push({ attributeId: brandDef.id, value: String(data.brand) });
        if (modelDef && data.model) mappedAttrs.push({ attributeId: modelDef.id, value: String(data.model) });
        if (storageDef && data.storage)
          mappedAttrs.push({
            attributeId: storageDef.id,
            value: String(data.storage).endsWith("GB") ? String(data.storage) : `${data.storage}GB`,
          });
        if (batteryDef && data.batteryHealth)
          mappedAttrs.push({ attributeId: batteryDef.id, value: String(data.batteryHealth) });
        if (descDef && data.description)
          mappedAttrs.push({ attributeId: descDef.id, value: String(data.description) });
        if (locDef && values.location)
          mappedAttrs.push({ attributeId: locDef.id, value: String(values.location) });

        // Example-based fallback mapping (as per Swagger example)
        const exampleAttrs = [
          data.brand && { attributeId: "1", value: String(data.brand) },
          data.model && { attributeId: "2", value: String(data.model) },
          data.storage && {
            attributeId: "3",
            value: String(data.storage).endsWith("GB")
              ? String(data.storage)
              : `${data.storage}GB`,
          },
          data.batteryHealth && { attributeId: "4", value: String(data.batteryHealth) },
          data.description && { attributeId: "5", value: String(data.description) },
          values.location && { attributeId: "6", value: String(values.location) },
        ].filter(Boolean) as { attributeId: string; value: string }[];

        const attrsForPending = mappedAttrs.length ? mappedAttrs : exampleAttrs;

        if (attrsForPending.length) {
          await pendingMutation.mutateAsync({
            title: data.title,
            categoryId,
            condition: normalizeCondition(data.condition),
            price: Number(data.price) || 0,
            isNegotiable: Boolean(data.isNegotiable),
            images,
            attributes: attrsForPending,
          } as any);
        } else {
          // Last resort: fallback to draft to avoid 400
          await draftMutation.mutateAsync({
            title: data.title,
            categoryId,
            condition: normalizeCondition(data.condition),
            price: Number(data.price) || 0,
            isNegotiable: Boolean(data.isNegotiable),
            images,
          } as any);
        }
      } else {
        await draftMutation.mutateAsync({
          title: data.title,
          categoryId,
          condition: normalizeCondition(data.condition),
          price: Number(data.price) || 0,
          isNegotiable: Boolean(data.isNegotiable),
          images,
        } as any);
      }

      setIsSending(false);
      setReviewOpen(false);
      setReviewSuccessOpen(true);
    } catch (e: any) {
      // If backend rejects, keep dialog open and stop the sending spinner
      const status = e?.response?.status;
      const message = e?.response?.data || e?.message;
      console.error("Create listing failed", status, message);
      setIsSending(false);
    }
  };

  const steps = useMemo(
    () => [
      { id: 1, label: t("addListing.steps.basicDetails") },
      { id: 2, label: t("addListing.steps.moreDetails") },
    ],
    [t],
  );

  const handleNextStep = async () => {
    const valid = await trigger(["title", "category", "condition", "price"]);
    if (!photos.length) {
      setPhotoError(t("addListing.photos.errorMissing"));
    }
    if (valid && photos.length) {
      setCurrentStep(2);
    }
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const handleReview = async () => {
    const valid = await trigger();
    if (valid) {
      setReviewOpen(true);
    }
  };

  const handleApplyLocation = (next: LocationValue) => {
    setLocationValue(next);
    const formatted = [next.city, next.country].filter(Boolean).join(", ");
    setValue("location", formatted, { shouldValidate: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Body */}
      <div className="flex flex-col gap-8 px-24 pb-14 pt-10">
        {/* Title */}
        <div className="flex w-full items-center">
          <h1 className="flex-1 whitespace-pre-wrap font-['Poppins'] text-2xl font-medium leading-normal text-[#212121]">
            Add Listings
          </h1>
        </div>

        <StepIndicator currentStep={currentStep} steps={steps} />

        {/* Inputs container with centered max-width */}
        <div className="flex w-full flex-col items-center px-[212px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            {currentStep === 1 && (
              <BasicDetailsStep
                register={register}
                setValue={setValue}
                errors={errors}
                photos={photos}
                setPhotos={setPhotos}
                photoError={photoError}
                setPhotoError={setPhotoError}
                onTipsClick={() => setTipsOpen(true)}
                onNext={handleNextStep}
                isNextDisabled={!isBasicDetailsValid}
              />
            )}

            {currentStep === 2 && (
              <MoreDetailsStep
                register={register}
                setValue={setValue}
                errors={errors}
                watch={watch}
                onBack={handleBackStep}
                onReview={handleReview}
                onLocationClick={() => setLocationOpen(true)}
              />
            )}
          </form>
        </div>
      </div>

      <PhotoTipsDialog open={tipsOpen} onOpenChange={setTipsOpen} />

      <LocationDialog
        open={locationOpen}
        onOpenChange={setLocationOpen}
        value={locationValue}
        onApply={handleApplyLocation}
      />

      <ReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        values={values}
        photos={photos}
        fallbackImage={FALLBACK_IMAGE}
        locationCoordinates={{
          lat: locationValue.lat,
          lng: locationValue.lng,
        }}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
      />

      <ConfirmationDialogs
        leaveOpen={leaveOpen}
        setLeaveOpen={setLeaveOpen}
        reviewSuccessOpen={reviewSuccessOpen}
        setReviewSuccessOpen={setReviewSuccessOpen}
        isSending={isSending}
      />
    </div>
  );
}
