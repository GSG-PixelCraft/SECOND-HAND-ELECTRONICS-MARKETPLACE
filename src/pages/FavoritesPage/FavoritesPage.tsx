import { Link } from "react-router-dom";
import Container from "@/components/layout/Container/Container";
import { FavoritesEmptyState } from "@/components/feedback/emptyState";
import { HomeProductCard } from "@/components/homePage/HomeProductCard";
import { useWishlist, useRemoveFromWishlist } from "@/services/wishlist.service";
import { getProductRoute } from "@/constants/routes";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop";

export default function FavoritesPage() {
  const { data: wishlist = [], isLoading } = useWishlist();
  const remove = useRemoveFromWishlist();

  return (
    <Container maxWidth="7xl" className="py-8 px-4 sm:px-6 lg:px-10 xl:px-[96px]">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Favorites</h1>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="h-[200px] bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
                <div className="h-3 w-1/3 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && wishlist.length === 0 && (
        <div className="rounded-xl bg-white p-10 shadow-sm">
          <FavoritesEmptyState
            title="No favorites yet"
            description="Items you save will appear here."
          />
        </div>
      )}

      {/* Grid */}
      {!isLoading && wishlist.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((item) => (
            <Link
              key={item.id}
              to={getProductRoute(String(item.id))}
              className="block w-full"
            >
              <HomeProductCard
                image={item.images?.[0] ?? FALLBACK_IMAGE}
                title={item.title}
                price={`${item.price} ILS`}
                location={item.location ?? "Location not specified"}
                category={item.category?.name ?? ""}
                status={item.status}
                isFavorite
                className="max-w-none"
                onToggleFavorite={() => remove.mutate(item.id)}
              />
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}

