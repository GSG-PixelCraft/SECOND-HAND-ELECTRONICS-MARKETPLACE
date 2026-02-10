import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const AuthHeader = () => {
  return (
    <div className="flex items-center justify-between px-6 py-5">
      <Link to={ROUTES.HOME} className="text-sm text-white hover:text-gray-900">
        continue as a Guest
      </Link>
      <Link
        to={ROUTES.HOME}
        className="bg-blue-100 px-4 py-2 text-base font-bold text-blue-600 hover:bg-blue-200"
      >
        Logo
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
