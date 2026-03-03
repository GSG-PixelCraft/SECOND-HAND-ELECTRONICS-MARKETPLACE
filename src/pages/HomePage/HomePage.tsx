// Landing page
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/Button/button";
import { Image } from "@/components/ui/Image/image";
import { Text } from "@/components/ui/Text/text";
import { beforeLoginHomeCover } from "@/assets";
import {
  ListingSection,
  type ListingItem,
  type ListingSectionData,
} from "../../components/homePage/ListingSection";
import { mockProducts } from "./mockProducts";
// import { useProducts } from "@/services/product.service";
import type { Product } from "@/types";
// import type { AxiosError } from "axios";

// Transform API product to ListingItem
const transformProductToListingItem = (product: Product): ListingItem => {
  // Get the first image or use a placeholder
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop";

  return {
    id: product.id,
    title: product.title,
    price: `${product.price} ILS`,
    location: "Gaza", // Default location - API doesn't seem to provide this
    category: product.category.name,
    image: imageUrl,
    isFavorite: false,
  };
};

const HomePage = () => {
  // Fetch products from API
  // TODO : uncomment this after BE fixes the API
  // const {
  //   data: productsData,
  //   isLoading,
  //   error,
  // } = useProducts({
  //   limit: 12,
  //   sortBy: "createdAt",
  //   sortOrder: "desc",
  // });

  const isLoading = false;
  const error = null;

  // Transform products to listing items
  const products = mockProducts;

  // Split products into sections (4 items each)
  const recentListings = products
    .slice(0, 4)
    .map(transformProductToListingItem);
  const nearbyListings = products
    .slice(4, 8)
    .map(transformProductToListingItem);
  const recommendedListings = products
    .slice(8, 12)
    .map(transformProductToListingItem);

  const listingSections: ListingSectionData[] = [
    {
      id: "recent",
      title: "Recent Listings",
      link: ROUTES.RECENT_LISTINGS,
      items: recentListings,
    },
    {
      id: "nearby",
      title: "Nearby Listings",
      link: ROUTES.SEARCH,
      items: nearbyListings,
    },
    {
      id: "recommended",
      title: "Recommended Listings",
      link: ROUTES.SEARCH,
      items: recommendedListings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* cover */}
      <section className="relative h-[260px] overflow-hidden">
        <Image
          src={beforeLoginHomeCover}
          alt="Electronics hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent" />
        <div className="absolute left-6 top-6 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
          <Text as="h2" className="text-lg font-semibold text-slate-900">
            Got unused electronics?
          </Text>
          <Text variant="muted" className="mt-2 text-sm">
            List your used devices and connect directly with buyers.
          </Text>
          <Link to={ROUTES.ADD_LISTING} className="mt-5 block">
            <Button
              intent="primary"
              size="md"
              fullWidth
              className="font-normal"
            >
              Add listing
            </Button>
          </Link>
        </div>
      </section>

      {/* sections */}
      <div className="mb-3 flex flex-col gap-3">
        {isLoading && (
          <div className="px-[96px] pt-8 text-center">
            <Text variant="muted">Loading products...</Text>
          </div>
        )}

        {!isLoading &&
          !error &&
          listingSections.map(
            (section) =>
              section.items.length > 0 && (
                <ListingSection
                  key={section.id}
                  title={section.title}
                  link={section.link}
                  items={section.items}
                />
              ),
          )}
      </div>
    </div>
  );
};

export default HomePage;
