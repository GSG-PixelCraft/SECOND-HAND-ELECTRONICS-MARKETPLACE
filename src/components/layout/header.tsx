import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import { NotificationMenu } from "@/pages/NotificationsPage/components";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";

const SearchIcon = () => (
  <svg
    className="h-5 w-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const LocationIcon = () => (
  <svg
    className="h-5 w-5 text-blue-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const GlobeIcon = () => (
  <svg
    className="h-5 w-5 text-blue-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const UserIcon = () => (
  <svg
    className="h-6 w-6 text-blue-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const ChatIcon = () => (
  <svg
    className="h-6 w-6 text-blue-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);
const HeartIcon = () => (
  <svg
    className="h-6 w-6 text-blue-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);
const MenuIcon = () => (
  <svg
    className="h-5 w-5 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
const ListIcon = () => (
  <svg
    className="h-6 w-6 text-blue-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    className="h-4 w-4 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const categories = [
  "Phones",
  "Laptops",
  "Tablets",
  "Accessories",
  "Smartwatches",
  "Gaming",
  "Cameras",
];

export const Header = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const isAuthenticated = Boolean(user && token);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setSearchQuery(q);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim())
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <MenuIcon />
            </Button>
            <NavLink
              to={ROUTES.HOME}
              className="inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-base font-bold text-blue-600 sm:px-6 sm:py-2.5 sm:text-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Logo
            </NavLink>

            <form
              onSubmit={handleSearch}
              className="hidden max-w-2xl flex-1 md:flex"
            >
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-12 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 sm:py-3"
                />
              </div>
            </form>

            <div className="hidden items-center gap-3 sm:gap-4 lg:flex">
              <Button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                <LocationIcon />
                <Span className="hidden font-medium xl:inline">Palestine</Span>
                <ChevronDownIcon />
              </Button>
              <Button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                <GlobeIcon />
                <Span className="hidden font-medium xl:inline">English</Span>
                <ChevronDownIcon />
              </Button>
              <Button
                onClick={() => navigate(ROUTES.MY_LISTINGS)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:px-8 sm:py-2.5"
              >
                Add listing
              </Button>
              <Button
                onClick={() =>
                  isAuthenticated
                    ? navigate(ROUTES.PROFILE)
                    : navigate(ROUTES.SIGN_IN)
                }
                className="rounded-lg p-1 transition hover:bg-gray-100"
              >
                <UserIcon />
              </Button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <NotificationMenu />
              <Button
                onClick={() =>
                  isAuthenticated
                    ? navigate(ROUTES.PROFILE)
                    : navigate(ROUTES.SIGN_IN)
                }
                className="rounded-lg p-1 transition hover:bg-gray-100"
              >
                <UserIcon />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-3 md:hidden">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-12 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="hidden bg-white lg:block">
        <div className="mx-auto max-w-[1400px] px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">
            <nav className="flex items-center gap-6 overflow-x-auto">
              <Button className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-gray-600 hover:text-gray-900">
                <MenuIcon />
                <Span>All Categories</Span>
              </Button>
              {categories.map((cat) => (
                <NavLink
                  key={cat}
                  to={`${ROUTES.SEARCH}?category=${cat.toLowerCase()}`}
                  className="whitespace-nowrap text-sm font-medium text-gray-600 transition hover:text-gray-900"
                >
                  {cat}
                </NavLink>
              ))}
              <NavLink
                to={ROUTES.MY_LISTINGS}
                className="whitespace-nowrap text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                Dashboard
              </NavLink>
              <NavLink
                to={ROUTES.ADMIN_DASHBOARD}
                className="whitespace-nowrap text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                Admin
              </NavLink>
            </nav>

            <div className="flex items-center gap-3">
              <NotificationMenu />
              <Button className="rounded-lg p-1.5 transition hover:bg-gray-100">
                <ChatIcon />
              </Button>
              <Button className="rounded-lg p-1.5 transition hover:bg-gray-100">
                <HeartIcon />
              </Button>
              <Button className="rounded-lg p-1.5 transition hover:bg-gray-100">
                <ListIcon />
              </Button>
              {isAuthenticated ? (
                <Button
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition hover:text-gray-900"
                  onClick={logout}
                >
                  Logout
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <NavLink
                    to={ROUTES.SIGN_IN}
                    className="px-4 py-2 text-sm font-medium text-gray-700 transition hover:text-gray-900"
                  >
                    Login
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <div className="space-y-3 px-4 py-3">
            <div className="space-y-1">
              <Text className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">
                Categories
              </Text>
              {["All", ...categories].map((cat) => (
                <NavLink
                  key={cat}
                  to={
                    cat === "All"
                      ? ROUTES.SEARCH
                      : `${ROUTES.SEARCH}?category=${cat.toLowerCase()}`
                  }
                  className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat}
                </NavLink>
              ))}
            </div>
            <div className="space-y-1 border-t border-gray-200 pt-2">
              <Text className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">
                Pages
              </Text>
              <NavLink
                to={ROUTES.MY_LISTINGS}
                className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to={ROUTES.ADMIN_DASHBOARD}
                className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </NavLink>
            </div>
            <div className="space-y-2 border-t border-gray-200 pt-2">
              {isAuthenticated ? (
                <Button
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <NavLink
                    to={ROUTES.SIGN_IN}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
