// 500 error page
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const UnexpectedErrorPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">
        Something went wrong
      </h1>
      <p className="text-sm text-slate-600">
        An unexpected error occurred. Please try again later.
      </p>
      <Link
        className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        to={ROUTES.HOME}
      >
        Back to Home
      </Link>
    </div>
  );
};

export default UnexpectedErrorPage;
