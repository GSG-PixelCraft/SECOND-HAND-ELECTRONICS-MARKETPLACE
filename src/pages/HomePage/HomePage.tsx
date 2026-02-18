// Landing page
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const HomePage = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <section className="rounded-3xl bg-white px-8 py-10 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <Text className="text-3xl font-semibold text-slate-900">
              Welcome to Second-Hand Electronics Marketplace
            </Text>
            <Text variant="muted" className="max-w-xl text-base">
              Buy and sell used electronics safely and easily. Find great deals
              on quality pre-owned devices.
            </Text>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={ROUTES.PRODUCTS}>
              <Button intent="primary" size="md">
                Browse Products
              </Button>
            </Link>
            <Link to={ROUTES.RECENT_LISTINGS}>
              <Button intent="outline" size="md">
                Recent Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Text className="text-lg font-semibold text-slate-900">
            Trusted Marketplace
          </Text>
          <Text variant="muted" className="mt-2 text-sm">
            Buy and sell with confidence
          </Text>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Text className="text-lg font-semibold text-slate-900">
            Fast Shipping
          </Text>
          <Text variant="muted" className="mt-2 text-sm">
            Quick and secure delivery
          </Text>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Text className="text-lg font-semibold text-slate-900">
            24/7 Support
          </Text>
          <Text variant="muted" className="mt-2 text-sm">
            Always here to help
          </Text>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
