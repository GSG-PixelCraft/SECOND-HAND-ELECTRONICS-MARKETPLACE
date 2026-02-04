// Landing page
import { Link } from "react-router-dom";
import { ROUTES, getProductRoute } from "@/constants/routes";
import { ChatsParts } from "@/components/chats/ChatsParts";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const HomePage = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <section className="rounded-3xl bg-white px-8 py-10 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-slate-900">
              Welcome to Second-Hand Electronics Marketplace
            </h1>
            <Text variant="muted" className="max-w-xl text-base">
              Buy and sell used electronics safely and easily. Find great deals
              on quality pre-owned devices.
            </Text>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={ROUTES.RECENT_LISTINGS}>
              <Button intent="primary" size="md">
                Browse Listings
              </Button>
            </Link>
            <Link to={ROUTES.SIGN_UP}>
              <Button intent="outline" size="md">
                Sign Up
              </Button>
            </Link>
            {/* TEMPORARY DEMO BUTTON */}
            <Link to={ROUTES.ADD_LISTING}>
              <Button intent="primary" size="md">
                🎨 DEMO: Add Listing
              </Button>
            </Link>
            <Link to={`${getProductRoute("p-101")}?demo=1`}>
              <Button intent="outline" size="md">
                🎨 DEMO: Product Details
              </Button>
            </Link>
            <Link to={ROUTES.VERIFY}>
              <Button intent="primary" size="md">
                ✨ DEMO: Verification
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Trusted Marketplace
          </h3>
          <Text variant="muted" className="mt-2 text-sm">
            Buy and sell with confidence
          </Text>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Fast Shipping
          </h3>
          <Text variant="muted" className="mt-2 text-sm">
            Quick and secure delivery
          </Text>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">24/7 Support</h3>
          <Text variant="muted" className="mt-2 text-sm">
            Always here to help
          </Text>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Chats Demo</h2>
          <Link
            to={ROUTES.CHAT}
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Open Chat
          </Link>
        </div>
        <div className="flex justify-center">
          <ChatsParts aria-label="Chats demo" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
