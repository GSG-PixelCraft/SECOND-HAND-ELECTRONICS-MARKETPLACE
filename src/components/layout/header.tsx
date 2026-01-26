import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Globe,
  CircleUser,
  MessageCircle,
  Heart,
  Menu,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { LocationLanguageDropdown } from "@/components/ui/location-language-dropdown";
import { NotificationDropdown } from "@/pages/NotificationsPage/components/notification-dropdown";

const categories = [
  "Phones",
  "Tablets",
  "Laptops",
  "PC Parts",
  "Gaming",
  "Audio",
  "Accessories",
  "Smartwatches",
  "Cameras",
];

const locationOptions = [
  { value: "palestine", label: "Palestine" },
  { value: "egypt", label: "Egypt" },
  { value: "jordan", label: "Jordan" },
  { value: "qatar", label: "Qatar" },
  { value: "uae", label: "United Arab Emirates" },
  { value: "saudi", label: "Saudi Arabia" },
  { value: "kuwait", label: "Kuwait" },
  { value: "bahrain", label: "Bahrain" },
  { value: "oman", label: "Oman" },
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "arabic", label: "Arabic" },
  { value: "french", label: "French" },
  { value: "spanish", label: "Spanish" },
];

export const Header = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const isAuthenticated = Boolean(user && token);

  const [location, setLocation] = useState("palestine");
  const [language, setLanguage] = useState("english");

  const handleDetectLocation = () => {
    // TODO: Implement geolocation detection
    console.log("Detecting location...");
  };

  const handleManualEntry = () => {
    // TODO: Implement manual location entry
    console.log("Manual entry...");
  };

  const handleSignIn = () => {
    navigate(ROUTES.SIGN_IN);
  };

  const handleAddListing = () => {
    navigate(ROUTES.ADD_LISTING);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-20 bg-white">
      {/* Main Header Bar */}
      <div className="border-b border-neutral-10">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          {/* Logo */}
          <NavLink
            to={ROUTES.HOME}
            className="text-h5 font-bold text-primary hover:text-primary/90"
          >
            Logo
          </NavLink>

          {/* Search Bar */}
          <div className="relative mx-4 flex flex-1 items-center">
            <Search
              className="absolute left-3 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Search ..."
              className="w-full rounded-lg border border-neutral-20 bg-white py-2.5 pl-10 pr-4 text-body outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary-20"
            />
          </div>

          {/* Location Dropdown */}
          <LocationLanguageDropdown
            value={location}
            onChange={setLocation}
            options={locationOptions}
            icon={<MapPin size={18} className="text-neutral" />}
            placeholder="Search about country"
            type="location"
            onDetectLocation={handleDetectLocation}
            onManualEntry={handleManualEntry}
          />

          {/* Language Dropdown */}
          <LocationLanguageDropdown
            value={language}
            onChange={setLanguage}
            options={languageOptions}
            icon={<Globe size={18} className="text-neutral" />}
            placeholder="Search language"
            type="language"
          />

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Button
                  intent="outline"
                  size="md"
                  onClick={handleSignIn}
                  className="rounded-lg"
                >
                  Sign in
                </Button>
                <Button
                  intent="primary"
                  size="md"
                  onClick={handleAddListing}
                  className="rounded-lg text-white"
                >
                  Add listing
                </Button>
              </>
            ) : (
              <>
                <Button
                  intent="primary"
                  size="md"
                  onClick={handleAddListing}
                  className="rounded-lg"
                >
                  Add listing
                </Button>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-full p-2 text-neutral transition-colors hover:bg-neutral-5"
                  onClick={() => navigate(ROUTES.PROFILE)}
                >
                  <CircleUser size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation (visible when authenticated) */}
      {isAuthenticated && (
        <div className="bg-neutral-5">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            {/* Left side - Categories */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                className="flex items-center gap-2 text-body font-medium text-neutral-foreground transition-colors hover:text-primary"
              >
                <Menu size={18} />
                <span>All Categories</span>
              </button>

              <nav className="flex items-center gap-6">
                {categories.map((category) => (
                  <NavLink
                    key={category}
                    to={`${ROUTES.RECENT_LISTINGS}?category=${category.toLowerCase()}`}
                    className="text-body text-neutral transition-colors hover:text-primary"
                  >
                    {category}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right side - Action Icons */}
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <button
                type="button"
                className="flex items-center justify-center rounded-full p-2 text-primary transition-colors hover:bg-primary-10"
                onClick={() => {}}
              >
                <MessageCircle size={20} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-full p-2 text-primary transition-colors hover:bg-primary-10"
                onClick={() => navigate(ROUTES.FAVORITES)}
              >
                <Heart size={20} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-full p-2 text-primary transition-colors hover:bg-primary-10"
                onClick={() => {}}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
