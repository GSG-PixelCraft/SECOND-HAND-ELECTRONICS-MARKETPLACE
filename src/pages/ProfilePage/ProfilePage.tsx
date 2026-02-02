import * as React from "react";
import PageLayout from "@/components/layout/PageLayout";
// import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Fragment } from "react";
import ProfileDetails from "./ProfileDetails";
import { NotificationSettings } from "./NotificationSettings";
import { LanguageSettings } from "./LanguageSettings";
import { ChangePassword } from "./ChangePassword";
import { HelpCenter } from "./HelpCenter";

type Section =
  | "profile"
  | "notifications"
  | "language"
  | "password"
  | "help"
  | "logout";

const ProfilePage = () => {
  const [activeSection, setActiveSection] = React.useState<Section>("profile");

  return (
    <Fragment>
      {/* <Header></Header> */}
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
              // TODO: Implement logout confirmation or trigger logout action
              <div className="rounded-lg border border-neutral-20 bg-white p-5">
                <p>Are you sure you want to logout?</p>
                <button
                  type="button"
                  onClick={() => {
                    /* Call logout handler */
                  }}
                  className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
                >
                  Confirm Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
      <Footer></Footer>
    </Fragment>
  );
};

export default ProfilePage;
