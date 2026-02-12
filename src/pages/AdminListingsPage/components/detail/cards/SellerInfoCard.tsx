import { forwardRef } from "react";
import { CheckCircle2, MoreVertical } from "lucide-react";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Image } from "@/components/ui/image";

export interface SellerInfoCardProps {
  seller: {
    name: string;
    email?: string;
    avatar?: string;
    id: string;
  };
  activeListings?: number;
  soldListings?: number;
  lastOnline?: string;
  avgResponseTime?: string;
}

export const SellerInfoCard = forwardRef<HTMLDivElement, SellerInfoCardProps>(
  (
    {
      seller,
      activeListings = 2,
      soldListings = 10,
      lastOnline = "1 week ago",
      avgResponseTime = "within 1 hour",
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className="rounded-xl border border-neutral-20 bg-white p-4"
      >
        <div className="space-y-4">
          {/* Seller Profile */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {seller.avatar ? (
                <Image
                  src={seller.avatar}
                  alt={seller.name}
                  variant="avatar"
                  className="size-20 rounded-full"
                />
              ) : (
                <div className="bg-neutral-100 flex size-20 items-center justify-center rounded-full">
                  <Span className="text-neutral-50 text-2xl font-semibold">
                    {seller.name.charAt(0).toUpperCase()}
                  </Span>
                </div>
              )}
              <CheckCircle2 className="absolute -bottom-1 -right-1 size-6 fill-white text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <Text className="text-neutral-90 truncate text-lg font-normal">
                {seller.name}
              </Text>
              <div className="text-neutral-50 flex flex-wrap items-center gap-2 text-sm">
                <Span>
                  <span className="font-medium text-primary">
                    {activeListings}
                  </span>{" "}
                  Active listing{activeListings !== 1 ? "s" : ""}
                </Span>
                <Span>-</Span>
                <Span>
                  <span className="font-medium text-secondary">
                    {soldListings}
                  </span>{" "}
                  Sold listing{soldListings !== 1 ? "s" : ""}
                </Span>
              </div>
            </div>

            <button className="shrink-0 rounded-lg p-2 transition-colors hover:bg-neutral-5">
              <MoreVertical className="text-neutral-60 size-5" />
            </button>
          </div>

          {/* Seller Stats */}
          <div className="text-neutral-50 space-y-3 text-sm">
            <Text>Last online {lastOnline}</Text>
            <Text>Avg. response time: {avgResponseTime}</Text>
          </div>
        </div>
      </div>
    );
  },
);

SellerInfoCard.displayName = "SellerInfoCard";
