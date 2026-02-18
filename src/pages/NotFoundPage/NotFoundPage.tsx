// 404 error page
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/PageTitle";

const NotFoundPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
      <PageTitle subtitle="The page you're looking for doesn't exist.">
        Page Not Found
      </PageTitle>
      <Link to={ROUTES.HOME}>
        <Button intent="primary" size="md">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
