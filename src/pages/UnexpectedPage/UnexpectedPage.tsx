// 500 error page
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/Button/button";
import { PageTitle } from "@/components/layout/PageTitle/PageTitle";

const UnexpectedErrorPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
      <PageTitle subtitle="An unexpected error occurred. Please try again later.">
        Something went wrong
      </PageTitle>
      <Link to={ROUTES.HOME}>
        <Button intent="primary" size="md">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default UnexpectedErrorPage;
