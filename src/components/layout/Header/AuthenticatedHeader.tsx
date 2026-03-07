import { Button } from "@/components/ui/Button/button";
import { Span } from "@/components/ui/Span/span";
import { ROUTES } from "@/constants";
import { NotificationMenu } from "@/pages/NotificationsPage/components";
import {
  MenuIcon,
  HeartIcon,
  ChevronDownIcon,
  GlobeIcon,
  SearchIcon,
} from "lucide-react";
import { Text } from "@/components/ui/Text/text";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { useCategories } from "@/services/product.service";
import { ChatIcon, LocationIcon, UserIcon } from "./HeaderIconsSvg";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState, useEffect } from "react";
import logoElectronics from "@/assets/LOGO-electronics.svg";

export const AuthenticatedHeader = () => {
  const navigate = useNavigate();
  const { data: categoriesData } = useCategories();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const location = useLocation();
  const navCategories = (categoriesData ?? []).filter(
    (cat) => cat.isActive !== false,
  );
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
              className="inline-block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src={logoElectronics}
                alt="Electronics Marketplace"
                className="h-10 w-auto"
              />
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
                onClick={() => navigate(ROUTES.PROFILE)}
                className="rounded-lg p-1 transition hover:bg-gray-100"
              >
                <UserIcon />
              </Button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <NotificationMenu />
              <Button
                onClick={() => navigate(ROUTES.PROFILE)}
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
              <Button
                onClick={() => navigate(ROUTES.HOME)}
                className={`flex items-center gap-2 whitespace-nowrap text-sm font-medium ${new URLSearchParams(location.search).get("category") ? "text-gray-600 hover:text-gray-900" : "text-blue-600"}`}
              >
                <MenuIcon />
                <Span>All Categories</Span>
              </Button>
              {navCategories.map((cat) => {
                const activeCategory =
                  new URLSearchParams(location.search).get("category") || "";
                const isActive =
                  activeCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <NavLink
                    key={"cat" + cat.id}
                    to={`${ROUTES.SEARCH}?category=${cat.name.toLowerCase()}`}
                    className={`whitespace-nowrap text-sm font-medium transition ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {cat.name}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <NotificationMenu />
              <Button
                onClick={() => navigate(ROUTES.CHAT)}
                className="rounded-lg p-1.5 transition hover:bg-gray-100"
              >
                <ChatIcon />
              </Button>
              <Button
                className="rounded-lg p-1.5 text-blue-600 transition hover:bg-gray-100"
                onClick={() => navigate(ROUTES.FAVORITES)}
              >
                <HeartIcon />
              </Button>
              {isAdmin && (
                <Button
                  onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                  Admin
                </Button>
              )}
              <Button
                className="px-4 py-2 text-sm font-medium text-red-500 transition hover:text-gray-900"
                onClick={logout}
              >
                Logout
              </Button>
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
              <button
                type="button"
                onClick={() => {
                  navigate(ROUTES.HOME);
                  setMobileMenuOpen(false);
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                All
              </button>
              {navCategories.map((cat) => {
                const activeCategory =
                  new URLSearchParams(location.search).get("category") || "";
                const isActive =
                  activeCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <NavLink
                    key={cat.id}
                    to={`${ROUTES.SEARCH}?category=${cat.name.toLowerCase()}`}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </NavLink>
                );
              })}
            </div>
            <div className="space-y-2 border-t border-gray-200 pt-2">
              {isAdmin && (
                <NavLink
                  to={ROUTES.ADMIN_DASHBOARD}
                  className="block rounded-lg bg-gray-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </NavLink>
              )}
              <Button
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
