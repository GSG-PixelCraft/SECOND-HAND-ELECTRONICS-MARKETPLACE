import { useState } from "react";
import { Button } from "@/components/ui/Button/button";
import { Span } from "@/components/ui/Span/span";
import { Text } from "@/components/ui/Text/text";

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

export const NotificationSettings = () => {
  const [settings, setSettings] = useState({
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
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="rounded-lg border border-neutral-20 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-neutral-foreground">
        Notification Settings
      </h2>

      <SettingRow
        label="Mute all notifications"
        checked={settings.muteAll}
        onToggle={() => toggle("muteAll")}
        boxed
      />

      <div className="mt-6">
        <Text className="mb-2 font-semibold text-neutral-foreground">
          General
        </Text>

        <div className="rounded-md border border-neutral-20">
          <SettingRow
            label="Push notifications"
            checked={settings.push}
            onToggle={() => toggle("push")}
            divider
          />
          <SettingRow
            label="Email notifications"
            checked={settings.email}
            onToggle={() => toggle("email")}
            divider
          />
          <SettingRow
            label="In-app notifications"
            checked={settings.inApp}
            onToggle={() => toggle("inApp")}
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
            onToggle={() => toggle("listingStatus")}
            divider
          />
          <SettingRow
            label="Listing reminders"
            checked={settings.listingReminders}
            onToggle={() => toggle("listingReminders")}
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
            onToggle={() => toggle("newMessage")}
            divider
          />
          <SettingRow
            label="Response reminders"
            checked={settings.responseReminders}
            onToggle={() => toggle("responseReminders")}
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
          onToggle={() => toggle("discoveryNearby")}
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
          onToggle={() => toggle("accountVerification")}
          boxed
        />
      </div>
    </section>
  );
};
