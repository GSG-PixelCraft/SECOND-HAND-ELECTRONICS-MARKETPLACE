import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Container from "@/components/layout/Container/Container";
import phoneImage from "@/images/Phone.jpg";
import { ProductGallery } from "./components/ProductGallery";
import { ProductSummaryCard } from "./components/ProductSummaryCard";
import { SellerCard } from "./components/SellerCard";
import { SafetyTipsCard } from "./components/SafetyTipsCard";
import { KeyFeaturesCard } from "./components/KeyFeaturesCard";
import { DescriptionCard } from "./components/DescriptionCard";
import { LocationCard } from "./components/LocationCard";
import { ListingSection } from "./components/ListingSection";
import { ListingStatusCard } from "./components/ListingStatusCard";
import { ReportListingDialog } from "./components/ReportListingDialog";
import { ReportSuccessDialog } from "./components/ReportSuccessDialog";
import { Button } from "@/components/ui/Button/button";
import { Span } from "@/components/ui/Span/span";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { useProduct } from "@/services/product.service";
import { useToggleWishlist } from "@/services/wishlist.service";
import type { Product } from "@/types";

type OwnerStatus = "pending" | "rejected" | null;

const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop";
const DEFAULT_COORDINATES = { lat: 31.5017, lng: 34.4668 };

interface ProductDetailViewModel {
  id: string;
  title: string;
  price: number;
  negotiable: boolean;
  conditionLabel: string;
  createdAt: string;
  views: number;
  favorites: number;
  images: string[];
  description: string;
  location: string;
  locationCoordinates: { lat: number; lng: number };
  features: Array<{ label: string; value: string }>;
  seller: {
    name: string;
    avatarUrl: string;
    activeListings: number;
    soldListings: number;
    lastOnline: string;
    responseTime: string;
  };
}

const formatConditionLabel = (condition: Product["condition"]): string => {
  if (condition === "like-new") return "Like New";
  return condition.charAt(0).toUpperCase() + condition.slice(1);
};

const formatPostedAtLabel = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const diffWeeks = Math.max(1, Math.floor(diffDays / 7));
    return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const toViewModelFromProduct = (
  product: Product,
): ProductDetailViewModel => {
  const features =
    product.attributes?.map((attr) => ({
      label: attr.attributeName ?? `Attribute ${attr.attributeId}`,
      value: attr.value,
    })) ?? [];
  const location =
    (typeof product.location === "string" && product.location.trim()) ||
    "Location not specified";
  const coords = product.locationCoordinates ?? DEFAULT_COORDINATES;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [FALLBACK_IMAGE_URL];

  return {
    id: product.id,
    title: product.title,
    price: product.price ?? 0,
    negotiable: Boolean(product.isNegotiable),
    conditionLabel: formatConditionLabel(product.condition),
    createdAt: product.createdAt,
    views: product.viewCount ?? 0,
    favorites: 0,
    images,
    description:
      product.description ??
      "No description has been provided for this listing.",
    location,
    locationCoordinates: coords,
    features,
    seller: {
      name:
        product.seller?.name ??
        product.seller?.email ??
        "Marketplace seller",
      avatarUrl:
        product.seller?.avatar ??
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=120&q=80",
      activeListings: product.seller?.activeListings ?? 0,
      soldListings: product.seller?.soldListings ?? 0,
      lastOnline: product.seller?.lastOnline ?? "Recently online",
      responseTime: product.seller?.responseTime ?? "Responds within a day",
    },
  };
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [reportStep, setReportStep] = useState<
    "idle" | "form" | "loading" | "success"
  >("idle");

  const isDemo = searchParams.get("demo") === "1";
  const baseViewMode =
    searchParams.get("view") === "owner" ? "owner" : "public";
  const statusParam = searchParams.get("status");
  const baseOwnerStatus: OwnerStatus =
    statusParam === "pending" || statusParam === "rejected"
      ? statusParam
      : null;

  const [demoViewMode, setDemoViewMode] = useState<"owner" | "public">(
    baseViewMode,
  );
  const [demoOwnerStatus, setDemoOwnerStatus] =
    useState<OwnerStatus>(baseOwnerStatus);

  const viewMode = isDemo ? demoViewMode : baseViewMode;
  const ownerStatus = isDemo ? demoOwnerStatus : baseOwnerStatus;

  useEffect(() => {
    if (!isDemo) return;
    setDemoViewMode(baseViewMode);
    setDemoOwnerStatus(baseOwnerStatus);
  }, [isDemo, baseViewMode, baseOwnerStatus]);

  useEffect(() => {
    if (reportStep !== "loading") return;
    const timer = window.setTimeout(() => {
      setReportStep("success");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [reportStep]);

  const demoViewModel = useMemo<ProductDetailViewModel>(
    () => ({
      id: id ?? "p-101",
      title: "iPhone 11 Pro 256GB",
      price: 250,
      negotiable: true,
      conditionLabel: "New",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      views: 100,
      favorites: 20,
      images: [phoneImage, phoneImage, phoneImage],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies nisl sit ut varius dapibus et interdum donec accumsan risus erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies nisl sit ut varius dapibus et interdum donec accumsan risus erat.",
      location: "Gaza, Palestine",
      locationCoordinates: DEFAULT_COORDINATES,
      features: [
        { label: "Category", value: "Phones" },
        { label: "Brand", value: "Apple" },
        { label: "Model", value: "iPhone 11" },
        { label: "Storage", value: "256 GB" },
        { label: "Battery Health", value: "85%" },
      ],
      seller: {
        name: "Eleanor Vance",
        avatarUrl:
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=120&q=80",
        activeListings: 2,
        soldListings: 10,
        lastOnline: "1 week ago",
        responseTime: "within 1 hour",
      },
    }),
    [id],
  );

  const productId = id ?? "";
  const effectiveProductId = isDemo ? "" : productId;
  const { isFavorite, toggle: toggleFavorite } = useToggleWishlist(effectiveProductId);
  const {
    data: serverProduct,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useProduct(effectiveProductId);

  const serverViewModel = useMemo(
    () =>
      !isDemo && serverProduct ? toViewModelFromProduct(serverProduct) : null,
    [isDemo, serverProduct],
  );

  if (!isDemo && isProductLoading) {
    return <FullScreenLoading message="Loading listing..." />;
  }

  if (!isDemo && (isProductError || !serverViewModel)) {
    return (
      <Container className="py-16">
        <p className="text-center text-sm text-muted-foreground">
          We couldn't load this listing. Please try again later.
        </p>
      </Container>
    );
  }

  const viewModel: ProductDetailViewModel = isDemo
    ? demoViewModel
    : (serverViewModel as ProductDetailViewModel);

  const priceLabel = `${viewModel.price.toLocaleString("en-US")} ILS`;
  const postedAtLabel = formatPostedAtLabel(viewModel.createdAt);

  const moreFromSeller = [
    {
      id: "demo-seller-1",
      image: phoneImage,
      title: "iPhone 14 Pro Max",
      price: "2000 ILS",
      location: "Gaza City",
      category: "Phones",
    },
    {
      id: "demo-seller-2",
      image: phoneImage,
      title: "Dell XPS 15",
      price: "680 ILS",
      location: "Nablus",
      category: "Laptops",
    },
    {
      id: "demo-seller-3",
      image: phoneImage,
      title: "Headphones",
      price: "150 ILS",
      location: "Gaza",
      category: "Audio",
    },
    {
      id: "demo-seller-4",
      image: phoneImage,
      title: "Nintendo Switch",
      price: "150 ILS",
      location: "Gaza",
      category: "Gaming",
    },
  ];

  const similarListings = [
    {
      id: "demo-similar-1",
      image: phoneImage,
      title: "Samsung Galaxy S21",
      price: "450 ILS",
      location: "Hebron",
      category: "Phones",
    },
    {
      id: "demo-similar-2",
      image: phoneImage,
      title: "iPhone 13 Pro",
      price: "750 ILS",
      location: "Gaza",
      category: "Phones",
    },
    {
      id: "demo-similar-3",
      image: phoneImage,
      title: "Huawei P50 Pro",
      price: "1300 ILS",
      location: "Gaza",
      category: "Phones",
    },
    {
      id: "demo-similar-4",
      image: phoneImage,
      title: "Samsung Galaxy S21",
      price: "450 ILS",
      location: "Gaza",
      category: "Phones",
    },
  ];

  const showOwnerActions = viewMode === "owner";
  const showReportMenu = viewMode === "public";

  const getToggleClass = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-semibold transition ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-neutral-20 bg-white text-neutral-foreground hover:bg-neutral-5"
    }`;

  return (
    <Container maxWidth="7xl" className="space-y-10">
      {isDemo && (
        <section className="rounded-2xl border border-neutral-10 bg-muted/40 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Span
              variant="muted"
              className="text-xs font-semibold uppercase tracking-wide"
            >
              Demo controls
            </Span>
            <div className="flex flex-wrap items-center gap-2">
              <Span variant="muted" className="text-xs">
                View
              </Span>
              <Button
                type="button"
                className={getToggleClass(demoViewMode === "public")}
                onClick={() => setDemoViewMode("public")}
              >
                Public
              </Button>
              <Button
                type="button"
                className={getToggleClass(demoViewMode === "owner")}
                onClick={() => setDemoViewMode("owner")}
              >
                Owner
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Span variant="muted" className="text-xs">
                Status
              </Span>
              <Button
                type="button"
                className={getToggleClass(demoOwnerStatus === null)}
                onClick={() => setDemoOwnerStatus(null)}
              >
                None
              </Button>
              <Button
                type="button"
                className={getToggleClass(demoOwnerStatus === "pending")}
                onClick={() => setDemoOwnerStatus("pending")}
              >
                Pending
              </Button>
              <Button
                type="button"
                className={getToggleClass(demoOwnerStatus === "rejected")}
                onClick={() => setDemoOwnerStatus("rejected")}
              >
                Rejected
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Span variant="muted" className="text-xs">
                Report flow
              </Span>
              <Button
                type="button"
                className={getToggleClass(reportStep === "form")}
                onClick={() => setReportStep("form")}
              >
                Form
              </Button>
              <Button
                type="button"
                className={getToggleClass(reportStep === "loading")}
                onClick={() => setReportStep("loading")}
              >
                Loading
              </Button>
              <Button
                type="button"
                className={getToggleClass(reportStep === "success")}
                onClick={() => setReportStep("success")}
              >
                Success
              </Button>
              <Button
                type="button"
                className={getToggleClass(reportStep === "idle")}
                onClick={() => setReportStep("idle")}
              >
                Reset
              </Button>
            </div>
          </div>
        </section>
      )}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <ProductGallery
            title={viewModel.title}
            images={viewModel.images}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            ownerActions={
              showOwnerActions
                ? {
                    onEdit: () => {},
                    onDelete: () => {},
                  }
                : undefined
            }
          />
          <KeyFeaturesCard features={viewModel.features} />
          <DescriptionCard description={viewModel.description} />
          <LocationCard
            location={viewModel.location}
            coordinates={viewModel.locationCoordinates}
          />
        </div>

        <div className="space-y-6">
          {showOwnerActions && ownerStatus && (
            <ListingStatusCard
              status={ownerStatus}
              message={
                ownerStatus === "pending"
                  ? "Your listing is under review and not visible to others yet."
                  : "Your listing was rejected. Please review the feedback and update your listing."
              }
              actionLabel={
                ownerStatus === "rejected" ? "View reason" : undefined
              }
            />
          )}

          <ProductSummaryCard
            postedAt={postedAtLabel}
            views={viewModel.views}
            favorites={viewModel.favorites}
            title={viewModel.title}
            priceLabel={priceLabel}
            negotiable={viewModel.negotiable}
            conditionLabel={viewModel.conditionLabel}
          />

          <SellerCard
            name={viewModel.seller.name}
            avatarUrl={viewModel.seller.avatarUrl}
            activeListings={viewModel.seller.activeListings}
            soldListings={viewModel.seller.soldListings}
            lastOnline={viewModel.seller.lastOnline}
            responseTime={viewModel.seller.responseTime}
            showReportMenu={showReportMenu}
            onReportListing={() => setReportStep("form")}
            onReportUser={() => setReportStep("form")}
          />

          <SafetyTipsCard
            tips={[
              "Never meet in an unsafe location",
              "Don't pay inspection fees",
              "Never pay down a deposit in a bank account until you have met the seller and observed the goods",
              "If possible, take friends along for viewing",
            ]}
          />
        </div>
      </section>

      <ListingSection title="More from this seller" items={moreFromSeller} />
      <ListingSection title="Similar listing" items={similarListings} />

      <ReportListingDialog
        open={reportStep === "form"}
        onClose={() => setReportStep("idle")}
        onSubmit={() => setReportStep("loading")}
      />
      <FullScreenLoading open={reportStep === "loading"} message="Waiting..." />
      <ReportSuccessDialog
        open={reportStep === "success"}
        onClose={() => setReportStep("idle")}
      />
    </Container>
  );
};

export default ProductDetailPage;
