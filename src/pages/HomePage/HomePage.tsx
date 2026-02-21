// Landing page
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { beforeLoginHomeCover } from "@/assets";
import {
  ListingSection,
  type ListingItem,
  type ListingSectionData,
} from "../../components/homePage/ListingSection";

const recentListings: ListingItem[] = [
  {
    id: "r-1",
    title: "iPhone 14 Pro Max",
    price: "2000 ILS",
    location: "Gaza City",
    category: "Phone",
    image:
      "https://images.unsplash.com/photo-1510557880182-3de5c5a5f6f6?q=80&w=800&auto=format&fit=crop",
    isFavorite: true,
  },
  {
    id: "r-2",
    title: "Dell XPS 15",
    price: "680 ILS",
    location: "Rafah",
    category: "Laptop",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "r-3",
    title: "Sony WH-1000XM4",
    price: "150 ILS",
    location: "Gaza",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "r-4",
    title: "Nintendo Switch",
    price: "150 ILS",
    location: "North",
    category: "Gaming",
    image:
      "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=800&auto=format&fit=crop",
  },
];

const nearbyListings: ListingItem[] = [
  {
    id: "n-1",
    title: "Samsung Galaxy S21",
    price: "450 ILS",
    location: "Yafa",
    category: "Phone",
    image:
      "https://images.unsplash.com/photo-1512499617640-c2f999fe15a3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "n-2",
    title: "iPad Pro 11",
    price: "680 ILS",
    location: "Gaza",
    category: "Tablet",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "n-3",
    title: "Redmi Note 12",
    price: "150 ILS",
    location: "Gaza",
    category: "Phone",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "n-4",
    title: "Dell Inspiron 15",
    price: "650 ILS",
    location: "Rafah",
    category: "Laptop",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
  },
];

const recommendedListings: ListingItem[] = [
  {
    id: "rec-1",
    title: "iPhone 13 Pro",
    price: "1800 ILS",
    location: "Gaza",
    category: "Phone",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "rec-2",
    title: "Sony WH-1000XM4",
    price: "150 ILS",
    location: "Rafah",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "rec-3",
    title: "PlayStation 4 Pro",
    price: "1200 ILS",
    location: "Gaza",
    category: "Gaming",
    image:
      "https://images.unsplash.com/photo-1606813909355-9fcdf2aa76bf?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "rec-4",
    title: "Canon EOS 200D",
    price: "1400 ILS",
    location: "Nablus",
    category: "Cameras",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764ce7?q=80&w=800&auto=format&fit=crop",
  },
];

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

const HomePage = () => {
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
        {listingSections.map((section) => (
          <ListingSection
            key={section.id}
            title={section.title}
            link={section.link}
            items={section.items}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
