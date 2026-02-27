import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button/button";
import { Span } from "@/components/ui/Span/span";
import { Text } from "@/components/ui/Text/text";
import { useProfile, useUpdateProfile } from "@/services/profile.service";
import type { NotificationPreferences } from "@/types/profile";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <Button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-neutral-20"
      }`}
    >
      <Span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "left-[1.35rem]" : "left-0.5"
        }`}
      />
    </Button>
  );
};

interface SettingRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  boxed?: boolean;
  divider?: boolean;
}

const SettingRow = ({
  label,
  checked,
  onToggle,
  boxed = false,
  divider = false,
}: SettingRowProps) => {
  const content = (
    <div className="flex items-center justify-between px-4 py-4">
      <Span variant="label">{label}</Span>
      <ToggleSwitch checked={checked} onChange={onToggle} />
    </div>
  );

  return (
    <>
      {boxed ? (
        <div className="rounded-md bg-neutral-10">{content}</div>
      ) : (
        content
      )}
      {divider && <div className="h-px bg-neutral-20" />}
    </>
  );
};

const DEFAULT_NOTIFICATION_SETTINGS: NotificationPreferences = {
  muteAll: false,
  push: false,
  email: false,
  inApp: false,
  listingStatus: false,
  listingReminders: false,
  newMessage: false,
  responseReminders: false,
  discoveryNearby: false,
  accountVerification: false,
};

const mergeSettings = (
  preferences?: NotificationPreferences | null,
): NotificationPreferences => ({
  ...DEFAULT_NOTIFICATION_SETTINGS,
  ...(preferences || {}),
});

const computeNextSettings = (
  current: NotificationPreferences,
  key: keyof NotificationPreferences,
): NotificationPreferences => {
  if (key === "muteAll") {
    const muteAll = !current.muteAll;
    return muteAll
      ? { ...DEFAULT_NOTIFICATION_SETTINGS, muteAll: true }
      : { ...current, muteAll: false };
  }
  return {
    ...current,
    [key]: !current[key],
    muteAll: false,
  };
};

export const NotificationSettings = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [settings, setSettings] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_SETTINGS,
  );

  useEffect(() => {
    if (profile) {
      setSettings(
        mergeSettings(
          profile.notificationPreferences as NotificationPreferences | undefined,
        ),
      );
    }
  }, [profile]);

  const isSaving = updateProfile.isPending;

  const handleToggle = (key: keyof NotificationPreferences) => {
    setSettings((prev) => {
      const next = computeNextSettings(prev, key);
      updateProfile.mutate({ notificationPreferences: next });
      return next;
    });
  };

  const isMuted = useMemo(() => settings.muteAll, [settings.muteAll]);

  return (
    <section className="rounded-lg border border-neutral-20 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-neutral-foreground">
        Notification Settings
      </h2>
      {isLoading && (
        <Text className="text-sm text-muted-foreground">Loading...</Text>
      )}
      {!isLoading && (
        <>
          <SettingRow
            label="Mute all notifications"
            checked={settings.muteAll}
            onToggle={() => handleToggle("muteAll")}
            boxed
          />

          <div className="mt-2 text-right text-xs text-muted-foreground">
            {isSaving ? "Saving changes..." : isMuted && "Notifications muted"}
          </div>

          <div className="mt-6">
            <Text className="mb-2 font-semibold text-neutral-foreground">
              General
            </Text>

            <div className="rounded-md border border-neutral-20">
              <SettingRow
                label="Push notifications"
                checked={settings.push}
                onToggle={() => handleToggle("push")}
                divider
              />
              <SettingRow
                label="Email notifications"
                checked={settings.email}
                onToggle={() => handleToggle("email")}
                divider
              />
              <SettingRow
                label="In-app notifications"
                checked={settings.inApp}
                onToggle={() => handleToggle("inApp")}
              />
            </div>
          </div>

          <div className="mt-6">
            <Text className="mb-2 font-semibold text-neutral-foreground">
              My Listings
            </Text>

            <div className="rounded-md border border-neutral-20">
              <SettingRow
                label="Listing status"
                checked={settings.listingStatus}
                onToggle={() => handleToggle("listingStatus")}
                divider
              />
              <SettingRow
                label="Listing reminders"
                checked={settings.listingReminders}
                onToggle={() => handleToggle("listingReminders")}
              />
            </div>
          </div>

          <div className="mt-6">
            <Text className="mb-2 font-semibold text-neutral-foreground">
              Messages & Chats
            </Text>

            <div className="rounded-md border border-neutral-20">
              <SettingRow
                label="New message"
                checked={settings.newMessage}
                onToggle={() => handleToggle("newMessage")}
                divider
              />
              <SettingRow
                label="Response reminders"
                checked={settings.responseReminders}
                onToggle={() => handleToggle("responseReminders")}
              />
            </div>
          </div>

          <div className="mt-6">
            <Text className="mb-2 font-semibold text-neutral-foreground">
              Discovery
            </Text>

            <SettingRow
              label="New items near you"
              checked={settings.discoveryNearby}
              onToggle={() => handleToggle("discoveryNearby")}
              boxed
            />
          </div>

          <div className="mt-6">
            <Text className="mb-2 font-semibold text-neutral-foreground">
              System
            </Text>

            <SettingRow
              label="Account & identity verification"
              checked={settings.accountVerification}
              onToggle={() => handleToggle("accountVerification")}
              boxed
            />
          </div>
        </>
      )}
    </section>
  );
};
