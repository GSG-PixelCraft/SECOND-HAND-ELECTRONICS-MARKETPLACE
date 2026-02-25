import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { countries } from "countries-list";

interface EditProfileSubmitPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  avatarFile?: File | null;
}

interface EditProfileFormProps {
  initialValues?: Partial<EditProfileSubmitPayload> & { avatarUrl?: string };
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (payload: EditProfileSubmitPayload) => void | Promise<void>;
}

// const COUNTRIES = [
//   "Palestine",
//   "Jordan",
//   "Egypt",
//   "Saudi Arabia",
//   "United Arab Emirates",
// ];
const COUNTRIES = Object.values(countries)
  .map((c) => c.name)
  .sort();

export const EditProfileForm = ({
  initialValues,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: EditProfileFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fullName, setFullName] = useState(initialValues?.fullName || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [phone, setPhone] = useState(initialValues?.phoneNumber || "");
  const [country, setCountry] = useState(initialValues?.country || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    initialValues?.avatarUrl || "",
  );

  useEffect(() => {
    setFullName(initialValues?.fullName || "");
    setEmail(initialValues?.email || "");
    setPhone(initialValues?.phoneNumber || "");
    setCountry(initialValues?.country || "");
    setAvatarPreview(initialValues?.avatarUrl || "");
    setAvatarFile(null);
  }, [initialValues]);

  return (
    <div className="rounded-xl border border-neutral-20 bg-white p-6">
      <div className="flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-28 w-28 overflow-hidden rounded-full border border-neutral-20"
        >
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted-10" />
          )}
          <div className="absolute inset-0 hidden items-center justify-center bg-black/40 group-hover:flex">
            <Camera size={20} className="text-white" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            setAvatarFile(file);
            if (file) {
              setAvatarPreview(URL.createObjectURL(file));
            }
          }}
        />

        <div className="flex w-full flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-label text-neutral-foreground">
              Full name
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-md border border-neutral-20 px-3 py-2 text-body focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-label text-neutral-foreground">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-neutral-20 px-3 py-2 text-body focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-label text-neutral-foreground">
              Phone number
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-md border border-neutral-20 px-3 py-2 text-body focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-label text-neutral-foreground">Country</span>
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
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md bg-neutral-10 px-4 py-2 text-body text-neutral-foreground hover:bg-neutral-10"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() =>
              onSubmit({
                fullName: fullName.trim(),
                email: email.trim(),
                phoneNumber: phone.trim(),
                country: country.trim(),
                avatarFile,
              })
            }
            className="rounded-md bg-primary px-4 py-2 text-body text-primary-foreground hover:bg-primary-40"
          >
            {isSubmitting ? "Updating..." : "Update profile"}
          </button>
        </div>
      </div>
    </div>
  );
};
