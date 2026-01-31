// Landing page
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const HomePage = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <section className="rounded-3xl bg-white px-8 py-10 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-slate-900">
              Welcome to Second-Hand Electronics Marketplace
            </h1>
            <p className="max-w-xl text-base text-slate-600">
              Buy and sell used electronics safely and easily. Find great deals
              on quality pre-owned devices.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              to={ROUTES.RECENT_LISTINGS}
            >
              Browse Listings
            </Link>
            <Link
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              to={ROUTES.SIGN_UP}
            >
              Sign Up
            </Link>
            {/* TEMPORARY DEMO BUTTON */}
            <Link
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white ring-2 ring-primary ring-offset-2 transition hover:bg-primary/90"
              to={ROUTES.ADD_LISTING}
            >
              🎨 DEMO: Add Listing
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Trusted Marketplace
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Buy and sell with confidence
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Fast Shipping
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Quick and secure delivery
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">24/7 Support</h3>
          <p className="mt-2 text-sm text-slate-600">Always here to help</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
