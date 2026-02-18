import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { listingSchema } from "@/components/forms/zod-schemas";
import { type PhotoItem } from "@/components/ui/file-upload";
import { StepIndicator } from "./components/StepIndicator";
import { BasicDetailsStep } from "./components/BasicDetailsStep";
import { MoreDetailsStep } from "./components/MoreDetailsStep";
import { PhotoTipsDialog } from "./components/PhotoTipsDialog";
import { LocationDialog } from "./components/LocationDialog";
import { ReviewDialog } from "./components/ReviewDialog";
import { ConfirmationDialogs } from "./components/ConfirmationDialogs";

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
    photos.length > 0;

  useEffect(() => {
    const formatted = [locationValue.city, locationValue.country]
      .filter(Boolean)
      .join(", ");
    if (formatted) {
      setValue("location", formatted, { shouldValidate: true });
    }
  }, [locationValue.city, locationValue.country, setValue]);

  const onSubmit = async (data: ListingFormData) => {
    console.log("Listing data:", data);
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    setReviewOpen(false);
    setReviewSuccessOpen(true);
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
