import { Button } from "@/components/ui/Button/button";
import { ROUTES } from "@/constants/routes";
import {
  BadgeCheck,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Verified community",
    description:
      "Shop and sell with people who care about safe, trusted deals.",
    icon: ShieldCheck,
  },
  {
    title: "Direct chat",
    description: "Ask questions, compare options, and close deals faster.",
    icon: MessageCircleMore,
  },
  {
    title: "Quality electronics",
    description: "From phones to laptops, discover great value every day.",
    icon: BadgeCheck,
  },
] as const;

export const GuestHomeContent = () => {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-primary-10 via-white to-secondary-10 text-neutral-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-20 blur-3xl" />
        <div className="absolute right-10 top-52 h-64 w-64 rounded-full bg-primary-10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-secondary-20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(221,83%,53%,0.16),transparent_50%)]" />
      </div>

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-14 pt-8 sm:px-6 lg:pt-16">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-sm text-neutral-foreground backdrop-blur">
          <Sparkles className="h-4 w-4 text-primary" />
          Your trusted marketplace for second-hand electronics
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-neutral-foreground sm:text-5xl">
              Give great devices a second life.
            </h1>
            <p className="mt-5 max-w-xl text-base text-neutral sm:text-lg">
              Join thousands of buyers and sellers exchanging quality
              electronics with confidence. Create your account to save
              favorites, chat with sellers, and post listings in minutes.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={ROUTES.SIGN_IN}>
                <Button
                  intent="outline"
                  size="lg"
                  className="w-full border-primary/30 bg-white/80 px-8 text-primary hover:bg-primary-5 sm:w-auto"
                >
                  Login now
                </Button>
              </Link>
              <Link to={ROUTES.SIGN_UP}>
                <Button
                  intent="primary"
                  size="lg"
                  className="w-full px-8 sm:w-auto"
                >
                  Register free
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-neutral">
              <div className="inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-secondary" />
                New listings every day
              </div>
              <div className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Secure account protection
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-white/80 p-6 shadow-xl shadow-primary/10 backdrop-blur-xl sm:p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">
              Why sign up?
            </p>
            <div className="mt-5 space-y-4">
              {highlights.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-neutral-20 bg-white p-4"
                >
                  <div className="inline-flex items-center justify-center rounded-xl bg-primary-10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="mt-3 text-lg font-medium text-neutral-foreground">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm text-neutral">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
