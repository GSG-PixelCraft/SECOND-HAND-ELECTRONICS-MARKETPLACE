import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
  MoreVertical,
  Smartphone,
  IdCard,
  Mail,
  CheckCircle,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { Header } from "@/components/layout/Header/header";
import { AdCard } from "@/components/ui/AdCard/AdCard";
import PageLayout from "@/components/layout/PageLayout/PageLayout";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";
import { Span } from "@/components/ui/Span/span";
import { useProducts } from "@/services/product.service";
import type { Product } from "@/types";

export default function PublicProfilePage() {
  const [sort] = useState("Newest");
  const { id } = useParams<{ id?: string }>();
  const sellerId = id ? Number(id) : undefined;
  const sellerIdFilter =
    typeof sellerId === "number" && !Number.isNaN(sellerId)
      ? [sellerId]
      : undefined;

  const { data, isLoading, isError } = useProducts({
    sellerIds: sellerIdFilter,
    sortBy: "createdAt",
    sortOrder: "desc",
    status: ["active"],
    limit: 10,
    page: 1,
  });

  // dummy listings until API arrives
  const listings: Product[] = data?.products ?? [];

  return (
    <Fragment>
      <Header></Header>
      <PageLayout>
        <div className="flex flex-col gap-8 rounded-lg bg-neutral-5 p-6">
          <section className="rounded-lg border border-neutral-20 bg-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-6">
                <div className="h-24 w-24 rounded-full border-2 border-white bg-muted-10 shadow-sm" />

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-neutral-foreground">
                    Eleanor Vance
                  </h2>

                  <div className="space-y-1 text-caption text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} /> Palestine
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} /> Member since May 2023
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> Last seen 1 hour ago
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={14} /> Avg. response within 10 hours
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                aria-label="More options"
                className="text-muted-foreground hover:text-neutral-foreground"
              >
                <MoreVertical />
              </Button>
            </div>
          </section>

          <section>
            <Text className="mb-3 font-semibold text-neutral-foreground">
              Trust indicators
            </Text>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Verified Phone", icon: Smartphone, verified: true },
                { label: "Verified Identity", icon: IdCard, verified: false },
                { label: "Verified Email", icon: Mail, verified: false },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="relative flex flex-col items-center gap-2 rounded-lg border border-neutral-20 bg-white p-4"
                  >
                    <Icon className="text-primary" />
                    <Span className="text-caption text-neutral-foreground">
                      {item.label}
                    </Span>

                    {item.verified && (
                      <CheckCircle
                        size={16}
                        className="absolute -right-2 -top-2 text-success"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-neutral-20 pb-2">
              <Text className="border-b-2 border-neutral-foreground pb-2 font-semibold text-neutral-foreground">
                Active Listings
              </Text>

              <div className="flex gap-3">
                <Button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2 text-sm text-neutral-foreground"
                >
                  <ArrowUpDown size={14} />
                  Sort by: {sort}
                </Button>

                <Button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2 text-sm text-neutral-foreground"
                >
                  {" "}
                  <Filter size={14} />
                  Filter
                </Button>
              </div>
            </div>
            {isLoading && <div>Loading listings...</div>}
            {isError && <div>Error loading listings.</div>}

            <div className="grid grid-cols-3 gap-6">
              {listings.map((item) => (
                <AdCard
                  key={item.id}
                  image={item.images[0] ?? "https://via.placeholder.com/300"}
                  title={item.name}
                  location="Unknown"
                  category={item.category}
                  price={`$${item.price}`}
                />
              ))}
            </div>
          </section>
        </div>
      </PageLayout>
    </Fragment>
  );
}
