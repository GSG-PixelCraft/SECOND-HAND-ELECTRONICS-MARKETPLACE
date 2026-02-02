import { useState } from "react";
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
// import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Fragment } from "react";
import { AdCard } from "@/components/ui/AdCard";
import PageLayout from "@/components/layout/PageLayout";

export const PublicProfilePage = () => {
  const [sort] = useState("Newest");

  // dummy listings until API arrives
  const listings = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: `Sample Listing ${i + 1}`,
    price: "$120",
    image: "https://via.placeholder.com/300",
    location: "Ramallah",
    category: "Electronics",
  }));

  return (
    <Fragment>
      {/* <Header></Header> */}
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

              <button className="text-muted-foreground hover:text-neutral-foreground">
                <MoreVertical />
              </button>
            </div>
          </section>

          <section>
            <p className="mb-3 font-semibold text-neutral-foreground">
              Trust indicators
            </p>

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
                    <span className="text-caption text-neutral-foreground">
                      {item.label}
                    </span>

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
              <p className="border-b-2 border-neutral-foreground pb-2 font-semibold text-neutral-foreground">
                Active Listings
              </p>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2 text-sm text-neutral-foreground">
                  <ArrowUpDown size={14} />
                  Sort by: {sort}
                </button>

                <button className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2 text-sm text-neutral-foreground">
                  <Filter size={14} />
                  Filter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {listings.map((item) => (
                <AdCard key={item.id} {...item} />
              ))}
            </div>
          </section>
        </div>
      </PageLayout>
      <Footer></Footer>
    </Fragment>
  );
};
