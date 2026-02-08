import * as React from "react";
import {
  MapPin,
  Calendar,
  Pencil,
  Smartphone,
  IdCard,
  Mail,
  CheckCircle,
} from "lucide-react";
import { EditProfileForm } from "./EditProfileForm";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";

export default function ProfileDetails() {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleVerify = (label: string) => {
    console.log("Verify clicked:", label);
  };

  if (isEditing) {
    return (
      <EditProfileForm
        onCancel={() => setIsEditing(false)}
        onSubmit={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted-10" />

            <div className="space-y-1">
              <Text variant="bodyLg" className="font-semibold">
                Eleanor Vance
              </Text>

              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-muted-foreground" />
                <Span variant="caption">Palestine</Span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                <Span variant="caption">Member since May 2023</Span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-10 text-primary transition hover:bg-primary-20"
          >
            <Pencil size={18} />
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <Text variant="body" className="font-semibold">
            Profile Completion
          </Text>
          <Text variant="body" className="font-semibold text-primary">
            50%
          </Text>
        </div>

        <div className="h-2 w-full rounded-full bg-neutral-10">
          <div className="h-2 w-1/2 rounded-full bg-primary" />
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <Text variant="body" className="mb-1 font-semibold">
          Trust indicators
        </Text>
        <Text variant="muted" className="mb-4">
          Verify your identity, mobile and email to get "Verified" badge. Tap to
          verify missing items
        </Text>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Verified Phone", icon: Smartphone, verified: true },
            { label: "Verified Identity", icon: IdCard, verified: false },
            { label: "Verified Email", icon: Mail, verified: false },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Button
                type="button"
                onClick={() => !item.verified && handleVerify(item.label)}
                disabled={item.verified}
                key={item.label}
                className={`relative flex flex-col items-center gap-2 rounded-lg border border-neutral-20 p-4 ${
                  !item.verified ? "cursor-pointer hover:border-primary" : ""
                }`}
              >
                <Icon className="text-primary" />
                <Span variant="caption">{item.label}</Span>

                {item.verified && (
                  <CheckCircle
                    size={16}
                    className="absolute -right-2 -top-2 text-success"
                  />
                )}
              </Button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <Text variant="body" className="mb-4 font-semibold">
          Activity Summary
        </Text>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-20 p-4">
            <Text variant="bodyLg" className="font-semibold">
              10 hours
            </Text>
            <Text variant="muted">Avg. response</Text>
          </div>

          <div className="rounded-lg border border-neutral-20 p-4">
            <Text variant="bodyLg" className="font-semibold">
              12
            </Text>
            <Text variant="muted">Active listing</Text>
          </div>
        </div>
      </section>
    </div>
  );
}
