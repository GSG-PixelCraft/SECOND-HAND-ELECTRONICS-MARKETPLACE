import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Container from "@/components/layout/Container";
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
import { ReportLoadingOverlay } from "./components/ReportLoadingOverlay";

type OwnerStatus = "pending" | "rejected" | null;

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

  const product = useMemo(
    () => ({
      id: id ?? "p-101",
      title: "iPhone 11 Pro 256GB",
      price: 250,
      currency: "ILS",
      negotiable: true,
      condition: "New",
      postedAt: "2 days ago",
      views: 100,
      favorites: 20,
      images: [phoneImage, phoneImage, phoneImage],
      seller: {
        name: "Eleanor Vance",
        avatarUrl:
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=120&q=80",
        activeListings: 2,
        soldListings: 10,
        lastOnline: "1 week ago",
        responseTime: "within 1 hour",
      },
      features: [
        { label: "Category", value: "Phones" },
        { label: "Brand", value: "Apple" },
        { label: "Model", value: "iPhone 11" },
        { label: "Storage", value: "256 GB" },
        { label: "Battery Health", value: "85%" },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies nisl sit ut varius dapibus et interdum donec accumsan risus erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies nisl sit ut varius dapibus et interdum donec accumsan risus erat.",
      location: "Gaza, Palestine",
      locationCoordinates: { lat: 31.5017, lng: 34.4668 },
    }),
    [id],
  );

  const priceLabel = `${product.price.toLocaleString("en-US")} ${product.currency}`;

  const moreFromSeller = [
    {
      image: phoneImage,
      title: "iPhone 14 Pro Max",
      price: "2000 ILS",
      location: "Gaza City",
      category: "Phones",
    },
    {
      image: phoneImage,
      title: "Dell XPS 15",
      price: "680 ILS",
      location: "Nablus",
      category: "Laptops",
    },
    {
      image: phoneImage,
      title: "Headphones",
      price: "150 ILS",
      location: "Gaza",
      category: "Audio",
    },
    {
      image: phoneImage,
      title: "Nintendo Switch",
      price: "150 ILS",
      location: "Gaza",
      category: "Gaming",
    },
  ];

  const similarListings = [
    {
      image: phoneImage,
      title: "Samsung Galaxy S21",
      price: "450 ILS",
      location: "Hebron",
      category: "Phones",
    },
    {
      image: phoneImage,
      title: "iPhone 13 Pro",
      price: "750 ILS",
      location: "Gaza",
      category: "Phones",
    },
    {
      image: phoneImage,
      title: "Huawei P50 Pro",
      price: "1300 ILS",
      location: "Gaza",
      category: "Phones",
    },
    {
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
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Demo controls
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">View</span>
              <button
                type="button"
                className={getToggleClass(demoViewMode === "public")}
                onClick={() => setDemoViewMode("public")}
              >
                Public
              </button>
              <button
                type="button"
                className={getToggleClass(demoViewMode === "owner")}
                onClick={() => setDemoViewMode("owner")}
              >
                Owner
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Status</span>
              <button
                type="button"
                className={getToggleClass(demoOwnerStatus === null)}
                onClick={() => setDemoOwnerStatus(null)}
              >
                None
              </button>
              <button
                type="button"
                className={getToggleClass(demoOwnerStatus === "pending")}
                onClick={() => setDemoOwnerStatus("pending")}
              >
                Pending
              </button>
              <button
                type="button"
                className={getToggleClass(demoOwnerStatus === "rejected")}
                onClick={() => setDemoOwnerStatus("rejected")}
              >
                Rejected
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Report flow</span>
              <button
                type="button"
                className={getToggleClass(reportStep === "form")}
                onClick={() => setReportStep("form")}
              >
                Form
              </button>
              <button
                type="button"
                className={getToggleClass(reportStep === "loading")}
                onClick={() => setReportStep("loading")}
              >
                Loading
              </button>
              <button
                type="button"
                className={getToggleClass(reportStep === "success")}
                onClick={() => setReportStep("success")}
              >
                Success
              </button>
              <button
                type="button"
                className={getToggleClass(reportStep === "idle")}
                onClick={() => setReportStep("idle")}
              >
                Reset
              </button>
            </div>
          </div>
        </section>
      )}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <ProductGallery
            title={product.title}
            images={product.images}
            ownerActions={
              showOwnerActions
                ? {
                    onEdit: () => {},
                    onDelete: () => {},
                  }
                : undefined
            }
          />
          <KeyFeaturesCard features={product.features} />
          <DescriptionCard description={product.description} />
          <LocationCard
            location={product.location}
            coordinates={product.locationCoordinates}
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
            postedAt={product.postedAt}
            views={product.views}
            favorites={product.favorites}
            title={product.title}
            priceLabel={priceLabel}
            negotiable={product.negotiable}
            conditionLabel={product.condition}
          />

          <SellerCard
            name={product.seller.name}
            avatarUrl={product.seller.avatarUrl}
            activeListings={product.seller.activeListings}
            soldListings={product.seller.soldListings}
            lastOnline={product.seller.lastOnline}
            responseTime={product.seller.responseTime}
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
      <ReportLoadingOverlay open={reportStep === "loading"} />
      <ReportSuccessDialog
        open={reportStep === "success"}
        onClose={() => setReportStep("idle")}
      />
    </Container>
  );
};

export default ProductDetailPage;
