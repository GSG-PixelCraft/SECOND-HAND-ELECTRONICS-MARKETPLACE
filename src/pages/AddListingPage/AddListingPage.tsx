import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
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
  useCategoryDetail,
  productService,
  PRODUCTS_KEYS,
} from "@/services/product.service";
import type { CreateProductPayload } from "@/services/product.service";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import type { Product } from "@/types";
import type { Category } from "@/types/category";

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

type AttributeKey =
  | "brand"
  | "model"
  | "storage"
  | "battery"
  | "description"
  | "location";

type AttributeValueMap = Partial<Record<AttributeKey, string | undefined>>;

const ATTRIBUTE_KEYWORDS: Record<AttributeKey, string[]> = {
  brand: [
    "brand",
    "company",
    "manufacturer",
    "make",
    "ماركة",
    "الماركة",
    "العلامة",
    "العلامة التجارية",
    "الشركة",
    "الشركة المصنعة",
  ],
  model: [
    "model",
    "موديل",
    "الموديل",
    "طراز",
    "الطراز",
  ],
  storage: [
    "storage",
    "capacity",
    "rom",
    "التخزين",
    "سعة",
    "سعة التخزين",
    "الذاكرة",
    "مساحة التخزين",
  ],
  battery: [
    "battery",
    "battery health",
    "البطارية",
    "صحة البطارية",
    "عمر البطارية",
  ],
  description: [
    "description",
    "details",
    "notes",
    "الوصف",
    "التفاصيل",
    "ملاحظات",
  ],
  location: [
    "location",
    "address",
    "city",
    "الموقع",
    "العنوان",
    "المدينة",
    "المدينه",
    "المكان",
  ],
};

const CATEGORY_SYNONYM_GROUPS: Array<string[]> = [
  ["phone", "phones", "smartphone", "smartphones", "mobile", "mobiles"],
  ["laptop", "laptops", "notebook"],
  ["tablet", "tablets"],
  ["camera", "cameras"],
  ["audio", "headphone", "headphones", "earbud", "earbuds"],
  ["gaming", "console", "playstation", "xbox", "nintendo"],
  ["accessories", "accessory"],
  ["pc parts", "pc", "parts", "component", "components"],
];

const matchesAttributeName = (label: string, keywords: string[]): boolean => {
  const normalized = (label ?? "").toString().trim().toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const resolveListingAttributes = async (
  categoryId: string,
  attributeValues: AttributeValueMap,
) => {
  const catDetail = await productService.getCategoryDetail(categoryId);
  const defs = (catDetail?.attributes ?? []) as Array<{ id: string; name: string }>;
  const findAttribute = (key: AttributeKey) =>
    defs.find((definition) =>
      matchesAttributeName(definition.name, ATTRIBUTE_KEYWORDS[key]),
    );

  const attributeDefs: Record<
    AttributeKey,
    { id: string; name: string } | undefined
  > = {
    brand: findAttribute("brand"),
    model: findAttribute("model"),
    storage: findAttribute("storage"),
    battery: findAttribute("battery"),
    description: findAttribute("description"),
    location: findAttribute("location"),
  };

  const mappedAttrs: { attributeId: string; value: string }[] = [];
  const appendAttribute = (
    key: AttributeKey,
    formatter?: (value: string) => string,
  ) => {
    const def = attributeDefs[key];
    const raw = attributeValues[key];
    const safeValue = raw?.toString().trim();
    if (!def || !safeValue) return;
    mappedAttrs.push({
      attributeId: def.id,
      value: formatter ? formatter(safeValue) : safeValue,
    });
  };

  appendAttribute("brand");
  appendAttribute("model");
  appendAttribute("storage", (value) =>
    value.toUpperCase().endsWith("GB") ? value : `${value}GB`,
  );
  appendAttribute("battery");
  appendAttribute("description");
  appendAttribute("location");

  return { attributes: mappedAttrs };
};

const extractApiError = (
  error: unknown,
): { message: string; details?: string[] } => {
  const defaultMessage =
    isRecord(error) && typeof error.message === "string"
      ? error.message
      : "Request failed";

  const response = isRecord(error) && "response" in error ? (error as Record<string, unknown>).response : undefined;
  const responseRecord = isRecord(response) ? response : undefined;
  const responseData = responseRecord && "data" in responseRecord ? (responseRecord as Record<string, unknown>).data : undefined;

  if (!responseData) {
    return { message: defaultMessage };
  }

  if (typeof responseData === "string") {
    return { message: responseData };
  }

  const dataRecord = isRecord(responseData) ? responseData : undefined;

  const details = Array.isArray(dataRecord?.fields)
    ? dataRecord?.fields
        .map((field) => {
          if (!isRecord(field)) return "";
          const fieldLabel =
            typeof field.field === "string"
              ? field.field
              : typeof field.name === "string"
                ? field.name
                : "";
          const message =
            typeof field.message === "string" ? field.message : "";
          return fieldLabel
            ? `${fieldLabel}: ${message}`.trim()
            : message.trim();
        })
        .filter(Boolean)
    : undefined;

  const message =
    (typeof dataRecord?.message === "string" && dataRecord.message) ||
    (typeof dataRecord?.error === "string" && dataRecord.error) ||
    defaultMessage;

  return { message, details };
};

const getErrorStatus = (error: unknown): number | undefined => {
  if (!isRecord(error) || !("response" in error)) return undefined;
  const response = (error as Record<string, unknown>).response;
  if (!isRecord(response)) return undefined;
  const statusValue = response.status;
  return typeof statusValue === "number" ? statusValue : undefined;
};

export default function AddListingPage(): ReactElement {
  const { t } = useTranslation();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isPendingRoute =
    location.pathname.endsWith("/products/bending") ||
    location.pathname.endsWith("/products/pending");
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();
  const categoryOptions = useMemo(
    () =>
      (categoriesData ?? []).map((cat) => ({
        value: String(cat?.id ?? cat?.name ?? ""),
        label: String(cat?.name ?? cat?.id ?? ""),
      })),
    [categoriesData],
  );
  const findCategory = useCallback(
    (idOrName: string | undefined): Category | undefined => {
      if (!idOrName) return undefined;
      const categories = categoriesData ?? [];
      // First try direct ID match (category value stored in form)
      const idMatch = categories.find((cat) => String(cat.id) === idOrName);
      if (idMatch) return idMatch;
      // Fallback: name-based matching
      const norm = idOrName.trim().toLowerCase();
      const includesMatch = (label: string = "") => {
        const lower = label.toLowerCase();
        return CATEGORY_SYNONYM_GROUPS.some((group) =>
          group.some((key) => norm.includes(key) && lower.includes(group[0])),
        );
      };
      let match = categories.find((cat) => cat.name.toLowerCase() === norm);
      if (!match) {
        match = categories.find((cat) => includesMatch(cat.name));
      }
      return match;
    },
    [categoriesData],
  );
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
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
  });

  const values = watch();
  const selectedCategoryData = useMemo(
    () => findCategory(values.category),
    [findCategory, values.category],
  );
  const { data: categoryDetailData, isLoading: isCategoryDetailLoading } = useCategoryDetail(selectedCategoryData?.id);
  const [dynamicAttrValues, setDynamicAttrValues] = useState<Record<string, string>>({});
  // Reset dynamic attribute values whenever the selected category changes
  const prevCategoryIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const newId = selectedCategoryData?.id;
    if (newId !== prevCategoryIdRef.current) {
      prevCategoryIdRef.current = newId;
      setDynamicAttrValues({});
    }
  }, [selectedCategoryData?.id]);

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

  const resolveCategoryId = useCallback(
    async (selectedCategoryIdOrName: string): Promise<string> => {
      let localCategories: Category[] | undefined = categoriesData ?? undefined;
      if (!localCategories || !localCategories.length) {
        localCategories = await queryClient.fetchQuery<Category[]>({
          queryKey: PRODUCTS_KEYS.categories,
          queryFn: productService.getCategories,
        });
      }
      // First try direct ID match (category ID stored in form field)
      const directMatch = localCategories.find(
        (category) => String(category.id) === selectedCategoryIdOrName,
      );
      if (directMatch) return String(directMatch.id);
      // Fallback: name-based fuzzy matching
      const norm = selectedCategoryIdOrName.trim().toLowerCase();
      const includesMatch = (name: string = "") => {
        const lower = name.toLowerCase();
        return CATEGORY_SYNONYM_GROUPS.some((group) =>
          group.some(
            (key) => norm.includes(key) && lower.includes(group[0]),
          ),
        );
      };
      let match =
        localCategories.find(
          (category) => category.name.toLowerCase() === norm,
        ) ?? null;
      if (!match) {
        match =
          localCategories.find((category) => includesMatch(category.name)) ??
          null;
      }
      const fallbackId =
        localCategories?.[0]?.id !== undefined
          ? String(localCategories[0].id)
          : "1";
      return String(match?.id ?? fallbackId);
    },
    [categoriesData, queryClient],
  );

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const currentValues = getValues();
      const categoryId = await resolveCategoryId(currentValues.category ?? "");
      const images = photos.map((p) => p.file);

      // Build attributes from the category definition, pulling values from
      // dynamicAttrValues (user-selected) with direct RHF overrides for
      // well-known fields (description, location) so submission never falls
      // back to an empty array due to sync-effect timing.
      const resolvedLocation =
        currentValues.location?.trim() ||
        [locationValue.city, locationValue.country].filter(Boolean).join(", ");
      let mappedAttrs: { attributeId: string; value: string }[] = [];
      if (categoryDetailData?.attributes?.length) {
        for (const attr of categoryDetailData.attributes) {
          const nameLower = attr.name.toLowerCase();
          let value = dynamicAttrValues[attr.id] ?? "";
          if (["location", "address", "city"].some((k) => nameLower.includes(k))) {
            value = resolvedLocation || value;
          } else if (
            ["description", "details", "notes"].some((k) => nameLower.includes(k)) ||
            attr.type === "textarea"
          ) {
            const desc =
              typeof currentValues.description === "string"
                ? currentValues.description
                : "";
            value = desc || value;
          }
          if (value.trim()) mappedAttrs.push({ attributeId: attr.id, value });
        }
      } else {
        const attributeInputs: AttributeValueMap = {
          brand: currentValues.brand,
          model: currentValues.model,
          storage: currentValues.storage,
          battery: currentValues.batteryHealth,
          description:
            typeof currentValues.description === "string"
              ? currentValues.description
              : undefined,
          location: resolvedLocation,
        };
        const resolved = await resolveListingAttributes(categoryId, attributeInputs);
        mappedAttrs = resolved.attributes;
      }

      const draftPayload: CreateProductPayload = {
        title: currentValues.title?.trim() || "Untitled listing",
        categoryId,
        condition: normalizeCondition(currentValues.condition || "good"),
        price: Number(currentValues.price) || 0,
        isNegotiable: Boolean(currentValues.isNegotiable),
        images: images.length ? images : undefined,
        attributes: mappedAttrs,
      };
      await draftMutation.mutateAsync(draftPayload);
      toast.success("Draft saved. You can continue editing from My Listings.");
    } catch (e) {
      const { message, details } = extractApiError(e);
      toast.error(
        details?.length ? `${message}\n${details.join("\n")}` : message,
      );
    } finally {
      setIsSavingDraft(false);
    }
  };

  const onSubmit = async (data: ListingFormData) => {
    setIsSending(true);
    try {
      const categoryId = await resolveCategoryId(data.category ?? "");

      const images = photos.map((p) => p.file);
      const basePayload: CreateProductPayload = {
        title: data.title,
        categoryId,
        condition: normalizeCondition(data.condition),
        price: Number(data.price) || 0,
        isNegotiable: Boolean(data.isNegotiable),
        images,
      };

      const resolvedLocation =
        data.location?.trim() ||
        values.location?.trim() ||
        [locationValue.city, locationValue.country].filter(Boolean).join(", ");

      // Build attributes from the category definition, pulling values from
      // dynamicAttrValues (user-selected) with direct RHF overrides for
      // well-known fields (description, location).
      let mappedAttrs: { attributeId: string; value: string }[] = [];

      if (categoryDetailData?.attributes?.length) {
        for (const attr of categoryDetailData.attributes) {
          const nameLower = attr.name.toLowerCase();
          let value = dynamicAttrValues[attr.id] ?? "";
          if (["location", "address", "city"].some((k) => nameLower.includes(k))) {
            value = resolvedLocation || value;
          } else if (
            ["description", "details", "notes"].some((k) => nameLower.includes(k)) ||
            attr.type === "textarea"
          ) {
            const desc =
              typeof data.description === "string" ? data.description : "";
            value = desc || value;
          }
          if (value.trim()) mappedAttrs.push({ attributeId: attr.id, value });
        }
      } else {
        const attributeInputs: AttributeValueMap = {
          brand: data.brand,
          model: data.model,
          storage: data.storage,
          battery: data.batteryHealth,
          description:
            typeof data.description === "string" ? data.description : undefined,
          location: resolvedLocation,
        };
        const resolved = await resolveListingAttributes(categoryId, attributeInputs);
        mappedAttrs = resolved.attributes;
      }

      const payloadWithAttributes: CreateProductPayload = {
        ...basePayload,
        attributes: mappedAttrs,
      };

      if (isPendingRoute) {
        await pendingMutation.mutateAsync(payloadWithAttributes);
      } else {
        await draftMutation.mutateAsync(payloadWithAttributes);
      }

      setIsSending(false);
      setReviewOpen(false);
      setReviewSuccessOpen(true);
    } catch (e: unknown) {
      // If backend rejects, keep dialog open and stop the sending spinner
      const status = getErrorStatus(e);
      const { message, details } = extractApiError(e);
      const detailMessage = details?.length ? `\n${details.join("\n")}` : "";
      console.error("Create listing failed", status, message, detailMessage);
      toast.error(details?.length ? `${message}\n${details.join("\n")}` : message);
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
      // Block if the selected category has no attributes configured in the backend.
      // The API requires at least one attribute, so listing under such a category
      // would always fail at submission.
      if (
        !isCategoryDetailLoading &&
        categoryDetailData !== undefined &&
        categoryDetailData !== null &&
        (categoryDetailData.attributes ?? []).length === 0
      ) {
        toast.error(
          "This category is not available for listing yet. Please choose a different category or contact the administrator.",
        );
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const handleReview = async () => {
    const valid = await trigger();
    if (!valid) return;
    if ((categoryDetailData?.attributes ?? []).length === 0) {
      toast.error(
        "This category is not available for listing yet. Please go back and choose a different category.",
      );
      return;
    }
    setReviewOpen(true);
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
                categoriesList={categoryOptions}
                onSaveDraft={handleSaveDraft}
                isSavingDraft={isSavingDraft}
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
                categoryAttributes={categoryDetailData?.attributes}
                attributeValues={dynamicAttrValues}
                onAttributeValuesChange={setDynamicAttrValues}
                onSaveDraft={handleSaveDraft}
                isSavingDraft={isSavingDraft}
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
