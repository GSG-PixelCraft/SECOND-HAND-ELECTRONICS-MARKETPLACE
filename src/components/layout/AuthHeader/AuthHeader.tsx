import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import logoElectronics from "@/assets/LOGO-electronics.svg";

const AuthHeader = () => {
  return (
    <div className="flex items-center justify-between px-6 py-5">
      <Link to={ROUTES.HOME} className="text-sm text-white hover:text-gray-900">
        continue as a Guest
      </Link>
      <Link
        to={ROUTES.HOME}
        className="inline-block"
      >
        <img src={logoElectronics} alt="Electronics Marketplace" className="h-10 w-auto" />
      </Link>
      <Link
        to={ROUTES.HOME}
        className="text-sm text-gray-700 hover:text-gray-900"
      >
        continue as a Guest
      </Link>
    </div>
  );
};

export default AuthHeader;
