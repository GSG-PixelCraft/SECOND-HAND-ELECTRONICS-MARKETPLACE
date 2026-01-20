import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        brand: "Second-Hand Electronics",
        home: "Home",
        products: "Products",
        cart: "Cart",
        dashboard: "Dashboard",
        admin: "Admin",
        login: "Log in",
        register: "Create account",
        logout: "Log out",
        theme: "Toggle theme",
      },
      home: {
        heroTitle: "Buy and sell trusted tech, fast.",
        heroSubtitle:
          "Browse verified devices, compare sellers, and upgrade with confidence.",
        ctaPrimary: "Browse products",
        ctaSecondary: "Start selling",
        highlightsTitle: "Why shoppers love this marketplace",
        highlights: {
          trusted: "Verified sellers and transparent listings",
          shipping: "Secure payments with fast checkout",
          support: "Easy returns and proactive support",
        },
      },
      dashboard: {
        title: "Your marketplace overview",
        subtitle: "Track listings, orders, and saved items in one place.",
        cardTitle: "Quick actions",
        actionSell: "Create a listing",
        actionOrders: "View orders",
        actionProfile: "Update profile",
      },
      auth: {
        loginTitle: "Welcome back",
        loginSubtitle: "Access your listings, orders, and saved devices.",
        registerTitle: "Create your account",
        registerSubtitle:
          "Join a community of trusted tech sellers and buyers.",
        demoCta: "Continue with demo account",
      },
      products: {
        title: "Featured devices",
        subtitle: "A quick demo catalogue of popular listings.",
        viewDetails: "View details",
        conditionLabel: "Condition",
      },
      product: {
        detailTitle: "Listing details",
        detailSubtitle: "Preview the condition, seller info, and pricing.",
        addToCart: "Add to cart",
        backToProducts: "Back to products",
        condition: {
          new: "New",
          likeNew: "Like new",
          good: "Good",
          fair: "Fair",
        },
      },
      cart: {
        title: "Your cart",
        emptyTitle: "Your cart is empty",
        emptySubtitle: "Add a few listings to compare and check out.",
        checkout: "Proceed to checkout",
        clear: "Clear cart",
      },
      profile: {
        title: "Profile settings",
        subtitle: "Update your contact details and marketplace preferences.",
      },
      settings: {
        title: "Account settings",
        subtitle: "Manage notifications, payments, and security preferences.",
      },
      orders: {
        title: "Order history",
        subtitle: "Review recent purchases and delivery updates.",
        viewDetail: "View details",
        detailTitle: "Order {{id}}",
        detailSubtitle: "Track delivery status and payment confirmation.",
        back: "Back to orders",
      },
      checkout: {
        title: "Checkout",
        subtitle: "Confirm your delivery details and payment method.",
        back: "Back to cart",
      },
      admin: {
        title: "Admin overview",
        subtitle: "Monitor listings, reports, and marketplace activity.",
        statsTitle: "Today at a glance",
        metrics: {
          listings: "New listings",
          reviews: "Pending reviews",
          reports: "Reports to resolve",
        },
      },
      error: {
        notFoundTitle: "404 - Page not found",
        notFoundSubtitle: "The page you are looking for does not exist.",
        accessDeniedTitle: "403 - Access denied",
        accessDeniedSubtitle: "You do not have permission to view this page.",
        unexpectedBadge: "Unexpected error",
        unexpectedTitle: "Something went wrong",
        unexpectedDescription:
          "Try refreshing the page or return home to continue browsing.",
      },
      actions: {
        backHome: "Back to home",
        viewDashboard: "Go to dashboard",
      },
      demo: {
        seller: "Seller rating",
        price: "Price",
        userName: "Demo user",
      },
      loading: {
        title: "Loading…",
      },
      footer: {
        logo: "Logo",
        description:
          "We are a trusted marketplace for buying and selling used electronics. Our platform connects buyers and sellers in a safe, transparent environment, focusing on direct communication and clear agreements through in-app chat. We don't handle payments or delivery — instead, we empower users to connect, negotiate, and close deals with confidence.",
        contactLabel: "Contact us at",
        contactEmail: "unreal@outlook.com",
        rights: "©All Rights Reserved",
        links: {
          about: "About us",
          contact: "Contact",
          privacy: "Privacy policy",
          terms: "Terms of Use",
        },
        social: {
          facebook: "Facebook",
          twitter: "Twitter",
          instagram: "Instagram",
          youtube: "YouTube",
          abbr: {
            facebook: "f",
            twitter: "x",
            instagram: "ig",
            youtube: "yt",
          },
        },
      },
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
