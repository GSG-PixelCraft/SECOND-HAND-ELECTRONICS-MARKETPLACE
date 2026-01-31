import * as React from "react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { listingSchema } from "@/components/forms/zod-schemas";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { type PhotoItem } from "@/components/ui/file-upload";
import { StepIndicator } from "./components/StepIndicator";
import { BasicDetailsStep } from "./components/BasicDetailsStep";
import { MoreDetailsStep } from "./components/MoreDetailsStep";
import { PhotoTipsDialog } from "./components/PhotoTipsDialog";
import { LocationDialog } from "./components/LocationDialog";
import { ReviewDialog } from "./components/ReviewDialog";
import { ConfirmationDialogs } from "./components/ConfirmationDialogs";

type ListingFormData = z.infer<typeof listingSchema>;

const FALLBACK_IMAGE = new URL("../../images/Phone.jpg", import.meta.url).href;

export default function AddListingPage(): React.ReactElement {
  const { t } = useTranslation();
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
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
  });

  const values = watch();

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

      <StepIndicator currentStep={currentStep} steps={steps} />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        {currentStep === 1 && (
          <BasicDetailsStep
            register={register}
            errors={errors}
            photos={photos}
            setPhotos={setPhotos}
            photoError={photoError}
            setPhotoError={setPhotoError}
            onTipsClick={() => setTipsOpen(true)}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <MoreDetailsStep
            register={register}
            errors={errors}
            watch={watch}
            onBack={handleBackStep}
            onReview={handleReview}
            onLocationClick={() => setLocationOpen(true)}
          />
        )}
      </form>

      <PhotoTipsDialog open={tipsOpen} onOpenChange={setTipsOpen} />

      <LocationDialog open={locationOpen} onOpenChange={setLocationOpen} />

      <ReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        values={values}
        photos={photos}
        fallbackImage={FALLBACK_IMAGE}
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
    </Container>
  );
}
