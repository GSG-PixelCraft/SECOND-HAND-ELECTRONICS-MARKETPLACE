import { Button } from "@/components/ui/Button/button";
import { Span } from "@/components/ui/Span/span";
import { ROUTES } from "@/constants";
import { ChevronDownIcon, GlobeIcon } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import logoElectronics from "@/assets/LOGO-electronics.svg";

export const GuestHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            <NavLink to={ROUTES.HOME} className="inline-block">
              <img
                src={logoElectronics}
                alt="Electronics Marketplace"
                className="h-10 w-auto"
              />
            </NavLink>

            <div className="hidden items-center gap-3 sm:gap-4 lg:flex">
              <Button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                <GlobeIcon />
                <Span className="hidden font-medium xl:inline">English</Span>
                <ChevronDownIcon />
              </Button>
              <Button
                onClick={() => navigate(ROUTES.SIGN_IN)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:px-8 sm:py-2.5"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
