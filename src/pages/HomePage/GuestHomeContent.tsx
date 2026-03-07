import { Button } from "@/components/ui/Button/button";
import { ROUTES } from "@/constants/routes";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  MessageCircleMore,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  UserRound,
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

const steps = [
  {
    title: "Create your account",
    description: "Set up your profile and unlock favorites, chat, and orders.",
    icon: UserRound,
  },
  {
    title: "Discover or list",
    description: "Find a great deal or post your own device in a few clicks.",
    icon: Search,
  },
  {
    title: "Deal safely",
    description: "Message directly and trade with verified community members.",
    icon: Store,
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

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:pt-16">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm text-neutral-foreground shadow-sm backdrop-blur">
          <Sparkles className="h-4 w-4 text-primary" />
          Your trusted marketplace for second-hand electronics
        </div>

        <div className="mt-6 grid items-stretch gap-8 lg:grid-cols-2">
          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-neutral-foreground sm:text-5xl">
              Give great devices a second life.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral sm:text-lg">
              Join thousands of buyers and sellers exchanging quality
              electronics with confidence. Create your account to save
              favorites, chat with sellers, and post listings in minutes.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={ROUTES.SIGN_IN}>
                <Button
                  intent="outline"
                  size="lg"
                  className="w-full border-primary/30 bg-white/90 px-8 text-primary hover:bg-primary-5 sm:w-auto"
                >
                  Login now
                </Button>
              </Link>
              <Link to={ROUTES.SIGN_UP}>
                <Button
                  intent="primary"
                  size="lg"
                  className="group w-full px-8 sm:w-auto"
                >
                  Register free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-neutral">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                <Zap className="h-4 w-4 text-secondary" />
                New listings every day
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Secure account protection
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                <Clock3 className="h-4 w-4 text-secondary" />
                Fast setup in under 2 minutes
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-white/85 p-6 shadow-xl shadow-primary/10 backdrop-blur-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.2em] text-secondary">
                Why sign up?
              </p>
              <span className="rounded-full bg-primary-10 px-3 py-1 text-xs font-medium text-primary">
                New here?
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {highlights.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-neutral-20 bg-white p-4 transition-transform duration-200 hover:-translate-y-0.5"
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

        <section className="mt-10 rounded-3xl border border-neutral-20 bg-white/80 p-6 shadow-lg shadow-primary/5 backdrop-blur sm:p-8">
          <h2 className="text-2xl font-semibold text-neutral-foreground">
            Start in 3 simple steps
          </h2>
          <p className="mt-2 text-neutral">
            A clear onboarding flow designed to help you buy and sell with
            confidence.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-neutral-20 bg-white p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="inline-flex items-center justify-center rounded-xl bg-secondary-10 p-2">
                    <Icon className="h-5 w-5 text-secondary" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-primary">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-neutral-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-neutral">{description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};
