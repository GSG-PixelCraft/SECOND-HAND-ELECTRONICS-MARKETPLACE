// src/pages/AddListingPage/components/ReviewDialog.tsx
import * as React from "react";
import { useTranslation } from "react-i18next";
import type { UseFormHandleSubmit } from "react-hook-form";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type PhotoItem } from "@/components/ui/file-upload";
import { Check, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
  description: string | undefined;
  location: string;
  isPickupAvailable?: boolean;
}

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: Partial<ListingFormData>;
  photos: PhotoItem[];
  fallbackImage: string;
  locationCoordinates?: { lat: number; lng: number };
  onSubmit: (data: ListingFormData) => Promise<void>;
  handleSubmit: UseFormHandleSubmit<ListingFormData>;
}

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onOpenChange,
  values,
  photos,
  fallbackImage,
  locationCoordinates,
  onSubmit,
  handleSubmit,
}): React.ReactElement => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const mainImage = photos[currentSlide]?.url ?? fallbackImage;

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  };

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);
  };
  const coordinates = locationCoordinates ?? { lat: 31.5017, lng: 34.4668 };
  const locationLabel = values.location || "Gaza, Palestine";
  const priceLabel = values.price ? `${values.price} ILS` : "—";
  const categoryLabel = values.category
    ? t(`addListing.categories.${values.category}`, {
        defaultValue: values.category,
      })
    : "—";
  const brandLabel = values.brand
    ? t(`addListing.brands.${values.brand}`, { defaultValue: values.brand })
    : "—";
  const storageLabel = values.storage
    ? t(`addListing.storage.${values.storage}`, {
        defaultValue: values.storage,
      })
    : "—";
  const conditionLabel = values.condition || "New";
  const descriptionText =
    values.description ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies nisl sit ut varius dapibus et interdum donecaccumsan risus erat Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies nisl sit ut varius dapibus et interdum donecaccumsan risus erat...";

  const handlePublish = handleSubmit(async (data) => {
    onOpenChange(false);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await onSubmit(data);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      className="max-h-[90vh] w-[1340px] max-w-[1340px] overflow-y-auto rounded-[20px] border border-neutral-20 p-0 shadow-xl backdrop:bg-black/85"
    >
      <div className="flex items-center justify-between px-8 pb-2 pt-6">
        <div className="h-6 w-6 opacity-0" aria-hidden="true" />
        <h2 className="text-center text-[20px] font-medium text-[#212121]">
          {t("addListing.reviewModal.title")}
        </h2>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-neutral-20 text-sm text-[#828282]"
          aria-label={t("common.close")}
        >
          ×
        </button>
      </div>

      <div className="flex flex-col gap-6 px-8 pb-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-6 xl:col-span-2">
            <div className="relative h-[645px] overflow-hidden rounded-[12px]">
              <img
                src={mainImage}
                alt={values.title ?? t("addListing.fields.title.label")}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <button
                type="button"
                className="absolute left-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0px_1px_4px_0px_rgba(255,255,255,0.3)]"
                aria-label="Previous"
                onClick={handlePrevious}
                disabled={photos.length <= 1}
              >
                <ChevronLeft className="h-5 w-5 text-[#3d3d3d]" />
              </button>
              <button
                type="button"
                className="absolute right-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0px_1px_4px_0px_rgba(255,255,255,0.3)]"
                aria-label="Next"
                onClick={handleNext}
                disabled={photos.length <= 1}
              >
                <ChevronRight className="h-5 w-5 text-[#3d3d3d]" />
              </button>
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`h-2 rounded-full transition-all duration-200 ${
                      index === currentSlide
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-neutral-20 p-4">
              <h3 className="text-[18px] font-medium text-[#212121]">
                Key features
              </h3>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-[12px] bg-[#14b8a6]/5 p-4 text-[16px]">
                  <span className="min-w-0 text-[#828282]">
                    {t("addListing.fields.category.label")}
                  </span>
                  <span className="text-right text-[#3d3d3d]">
                    {categoryLabel}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-[12px] bg-white p-4 text-[16px]">
                  <span className="min-w-0 text-[#828282]">
                    {t("addListing.fields.brand.label")}
                  </span>
                  <span className="text-right text-[#3d3d3d]">
                    {brandLabel}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-[12px] bg-white p-4 text-[16px]">
                  <span className="min-w-0 text-[#828282]">
                    {t("addListing.fields.model.label")}
                  </span>
                  <span className="text-right text-[#3d3d3d]">
                    {values.model || "—"}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-[12px] bg-[#14b8a6]/5 p-4 text-[16px]">
                  <span className="min-w-0 text-[#828282]">
                    {t("addListing.fields.storage.label")}
                  </span>
                  <span className="text-right text-[#3d3d3d]">
                    {storageLabel}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-[12px] bg-[#14b8a6]/5 p-4 text-[16px]">
                  <span className="min-w-0 text-[#828282]">
                    {t("addListing.fields.batteryHealth.label")}
                  </span>
                  <span className="text-right text-[#3d3d3d]">
                    {values.batteryHealth || "—"}
                  </span>
                </div>
                <div className="opacity-0">&nbsp;</div>
              </div>
            </div>

            <div className="rounded-[12px] border border-neutral-20 p-4">
              <h3 className="text-[18px] font-medium text-[#212121]">
                {t("addListing.fields.description.label")}
              </h3>
              <p className="mt-3 text-[16px] text-[#3d3d3d]">
                {descriptionText}{" "}
                <span className="text-[#828282]">Show More</span>
              </p>
            </div>

            <div className="rounded-[12px] border border-neutral-20 p-4">
              <h3 className="text-[18px] font-medium text-[#212121]">
                {t("addListing.fields.location.label")}
              </h3>
              <div className="mt-3 flex items-center gap-2 text-[16px] text-[#3d3d3d]">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{locationLabel}</span>
              </div>
              <div className="mt-3 h-[248px] overflow-hidden rounded-[10px]">
                <MapContainer
                  center={[coordinates.lat, coordinates.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[coordinates.lat, coordinates.lng]} />
                </MapContainer>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 xl:col-span-1 xl:w-[400px]">
            <div className="rounded-[12px] border border-neutral-20 p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <p className="text-[20px] font-normal text-[#212121]">
                    {values.title || "iPhone 11 Pro 256GB"}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[24px] font-medium text-primary">
                      {priceLabel}
                    </span>
                    {values.isNegotiable && (
                      <span className="text-[12px] text-[#828282]">
                        {t("addListing.fields.price.negotiable")}
                      </span>
                    )}
                  </div>
                </div>
                <span className="rounded-[12px] bg-primary px-4 py-2 text-[14px] text-white">
                  {conditionLabel}
                </span>
              </div>
            </div>

            <div className="rounded-[12px] border border-neutral-20 p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-neutral-10">
                  <img
                    src={mainImage}
                    alt={t("addListing.reviewModal.seller")}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-[10px] bg-white">
                    <Check className="h-4 w-4 text-[#22c55e]" />
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[18px] text-[#3d3d3d]">Eleanor Vance</p>
                  <div className="mt-2 flex items-center gap-2 text-[14px] text-[#828282]">
                    <span className="text-primary">2</span>
                    <span>Active listing</span>
                    <span>-</span>
                    <span className="text-[#14b8a6]">10</span>
                    <span>Sold listing</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-[14px] text-[#828282]">
                <p>Last online 1 week ago</p>
                <p>Avg. response time: within 1 hour</p>
              </div>
            </div>

            <div className="rounded-[10px] bg-primary/10 p-4">
              <p className="text-[18px] text-[#212121]">Safety tips!</p>
              <ul className="mt-3 space-y-2 text-[16px] text-[#3d3d3d]">
                <li className="ms-6 list-disc">
                  Never meet in an unsafe location
                </li>
                <li className="ms-6 list-disc">Don’t pay inspection fees</li>
                <li className="ms-6 list-disc">
                  Never pay down a deposit in a bank account until you have met
                  the seller and observed the Goods
                </li>
                <li className="ms-6 list-disc">
                  If possible, take friends along for viewing
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            intent="outline"
            className="h-[58px] w-[358px] rounded-[12px] border-[#6b7280] text-[16px] font-medium text-[#6b7280] hover:bg-transparent"
            onClick={() => onOpenChange(false)}
          >
            {t("addListing.buttons.continueEditing")}
          </Button>
          <Button
            type="button"
            className="h-[58px] w-[371px] rounded-[12px] text-[16px] font-medium"
            onClick={handlePublish}
          >
            {t("addListing.buttons.publish")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
