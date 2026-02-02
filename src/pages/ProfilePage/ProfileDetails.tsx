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
              <p className="text-bodyLg font-semibold text-neutral-foreground">
                Eleanor Vance
              </p>

              <div className="flex items-center gap-2 text-caption text-muted-foreground">
                <MapPin size={14} />
                <span>Palestine</span>
              </div>

              <div className="flex items-center gap-2 text-caption text-muted-foreground">
                <Calendar size={14} />
                <span>Member since May 2023</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-10 text-primary transition hover:bg-primary-20"
          >
            <Pencil size={18} />
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-neutral-foreground">
            Profile Completion
          </p>
          <p className="text-body font-semibold text-primary">50%</p>
        </div>

        <div className="h-2 w-full rounded-full bg-neutral-10">
          <div className="h-2 w-1/2 rounded-full bg-primary" />
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <p className="mb-1 font-semibold text-neutral-foreground">
          Trust indicators
        </p>
        <p className="mb-4 text-caption text-muted-foreground">
          Verify your identity, mobile and email to get “Verified” badge. Tap to
          verify missing items
        </p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Verified Phone", icon: Smartphone, verified: true },
            { label: "Verified Identity", icon: IdCard, verified: false },
            { label: "Verified Email", icon: Mail, verified: false },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                onClick={() => !item.verified && handleVerify(item.label)}
                disabled={item.verified}
                key={item.label}
                className={`relative flex flex-col items-center gap-2 rounded-lg border border-neutral-20 p-4 ${
                  !item.verified ? "cursor-pointer hover:border-primary" : ""
                }`}
              >
                <Icon className="text-primary" />
                <span className="text-caption text-neutral-foreground">
                  {item.label}
                </span>

                {item.verified && (
                  <CheckCircle
                    size={16}
                    className="absolute -right-2 -top-2 text-success"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <p className="mb-4 font-semibold text-neutral-foreground">
          Activity Summary
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-20 p-4">
            <p className="text-bodyLg font-semibold text-neutral-foreground">
              10 hours
            </p>
            <p className="text-caption text-muted-foreground">Avg. response</p>
          </div>

          <div className="rounded-lg border border-neutral-20 p-4">
            <p className="text-bodyLg font-semibold text-neutral-foreground">
              12
            </p>
            <p className="text-caption text-muted-foreground">Active listing</p>
          </div>
        </div>
      </section>
    </div>
  );
}
