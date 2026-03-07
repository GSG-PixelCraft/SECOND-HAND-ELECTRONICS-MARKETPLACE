// Main app layout with header and footer
//Layout عام يلف أغلب الصفحات.
// خصائصه

// لا API

// لا state معقّد

// فقط هيكل
import { Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Header } from "../Header/header";
import { Footer } from "../Footer/footer";
import { ScrollToTop } from "../ScrollToTop/ScrollToTop";

const authPaths: ReadonlySet<string> = new Set([
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.OTP_EMAIL,
  ROUTES.OTP_PHONE,
  ROUTES.FORGOT_PASSWORD_EMAIL,
  ROUTES.FORGOT_PASSWORD_PHONE,
  ROUTES.CHANGE_PASSWORD,
]);

export const AppLayout = () => {
  const { pathname } = useLocation();
  const hideHeader = authPaths.has(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <ScrollToTop />
      {!hideHeader && <Header />}
      <div className="flex flex-1">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
