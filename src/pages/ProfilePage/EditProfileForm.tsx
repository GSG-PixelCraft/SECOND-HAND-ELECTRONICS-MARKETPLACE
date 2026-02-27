import { useState } from "react";
import { Camera } from "lucide-react";
import { countries } from "countries-list";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Span } from "@/components/ui/span";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/auth.service";

interface EditProfileFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const COUNTRIES = Object.values(countries)
  .map((c) => c.name)
  .sort();

export const EditProfileForm = ({
  onCancel,
  onSubmit,
}: EditProfileFormProps) => {
  const { user, setUser } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const response = await authService.updateProfile({
        fullName,
        email,
        phoneNumber: phone,
      });

      const updatedUser = response.data;

      setUser(updatedUser);

      onSubmit();
    } catch (error) {
      console.error("Profile update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-20 bg-white p-6">
      <div className="flex flex-col items-center gap-6">
        <Button
          type="button"
          className="group relative h-28 w-28 overflow-hidden rounded-full border border-neutral-20"
        >
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted-10" />
          )}

          <div className="absolute inset-0 hidden items-center justify-center bg-black/40 group-hover:flex">
            <Camera size={20} className="text-white" />
          </div>
        </Button>

        <div className="flex w-full flex-col gap-4">
          <label className="flex flex-col gap-1">
            <Span variant="label">Full name</Span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-md border border-neutral-20 px-3 py-2 text-body focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <Span variant="label">Email</Span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-neutral-20 px-3 py-2 text-body focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <Span variant="label">Phone number</Span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-md border border-neutral-20 px-3 py-2 text-body focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <Span variant="label">Country</Span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-md border border-neutral-20 bg-white px-3 py-2 text-body focus:border-primary focus:outline-none"
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex w-full justify-between pt-4">
          <Button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-neutral-10 px-4 py-2 text-body text-neutral-foreground hover:bg-neutral-10"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-body text-primary-foreground hover:bg-primary-40"
          >
            {loading ? "Updating..." : "Update profile"}
          </Button>
        </div>
      </div>
    </div>
  );
};
