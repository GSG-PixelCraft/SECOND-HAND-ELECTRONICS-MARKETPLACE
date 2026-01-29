// Main app layout with header, sidebar, footer
//Layout عام يلف أغلب الصفحات.
// خصائصه

// لا API

// لا state معقّد

// فقط هيكل
import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";

export const AppLayout = () => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
);
