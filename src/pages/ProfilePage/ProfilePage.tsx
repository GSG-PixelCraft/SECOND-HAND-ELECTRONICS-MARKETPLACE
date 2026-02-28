import * as React from "react";
import PageLayout from "@/components/layout/PageLayout/PageLayout";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import { NotificationSettings } from "./NotificationSettings";
import { LanguageSettings } from "./LanguageSettings";
import { ChangePassword } from "./ChangePassword";
import { HelpCenter } from "./HelpCenter";
import { removeToken } from "@/lib/storage";
import { useAuthStore } from "@/stores/useAuthStore";
import { ROUTES } from "@/constants/routes";

type Section =
  | "profile"
  | "notifications"
  | "language"
  | "password"
  | "help"
  | "logout";

const ProfilePage = () => {
  const navigate = useNavigate();
  const clearAuthState = useAuthStore((state) => state.logout);
  const [activeSection, setActiveSection] = React.useState<Section>("profile");
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    // No /auth/logout in Swagger; clear client state only
    removeToken();
    clearAuthState();
    navigate(ROUTES.SIGN_IN);
    setIsLoggingOut(false);
  };

  return (
    <Fragment>
    
      <PageLayout>
        <h2 className="text-xl font-semibold text-neutral-foreground">
          My profile
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
          <aside className="rounded-lg border border-neutral-20 bg-white">
            <ul>
              {(
                [
                  { key: "profile", label: "Profile Details" },
                  { key: "notifications", label: "Notification settings" },
                  { key: "language", label: "Language & Currency" },
                  { key: "password", label: "Change password" },
                  { key: "help", label: "Help center" },
                  { key: "logout", label: "Logout" },
                ] as const satisfies readonly { key: Section; label: string }[]
              ).map((item) => {
                const isActive = activeSection === item.key;

                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => setActiveSection(item.key)}
                      className={`w-full px-4 py-4 text-left text-body transition-colors ${
                        isActive
                          ? "font-semibold text-neutral-foreground"
                          : "text-muted-foreground hover:text-neutral-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="flex flex-col gap-6">
            {activeSection === "profile" && <ProfileDetails />}
            {activeSection === "notifications" && <NotificationSettings />}
            {activeSection === "language" && <LanguageSettings />}
            {activeSection === "password" && <ChangePassword />}
            {activeSection === "help" && <HelpCenter />}
            {activeSection === "logout" && (
              <div className="rounded-lg border border-neutral-20 bg-white p-5">
                <p>Are you sure you want to logout?</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
                >
                  {isLoggingOut ? "Logging out..." : "Confirm Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
    </Fragment>
  );
};

export default ProfilePage;
