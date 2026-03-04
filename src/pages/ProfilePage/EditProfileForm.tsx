import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCountries } from "@/services/location.service";
import type { UpdateProfilePayload } from "@/dto/profile";

// ──────────────────────────────────────────────────────────────────────────────
// Schema
// ──────────────────────────────────────────────────────────────────────────────
const profileEditSchema = z.object({
  bio: z.string().max(300, "Bio must be at most 300 characters"),
  location: z.string().max(100, "Location must be at most 100 characters"),
  countryId: z.string(),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
export interface EditProfileFormProps {
  initialValues?: {
    bio?: string;
    location?: string;
    countryId?: string;
    avatarUrl?: string;
  };
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (payload: UpdateProfilePayload) => void | Promise<void>;
}

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────
export const EditProfileForm = ({
  initialValues,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: EditProfileFormProps) => {
  const user = useAuthStore((state) => state.user);
  const { data: countries = [] } = useCountries();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    initialValues?.avatarUrl,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      bio: initialValues?.bio ?? "",
      location: initialValues?.location ?? "",
      countryId: initialValues?.countryId ?? "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = async (data: ProfileEditFormData) => {
    await onSubmit({
      bio: data.bio,
      location: data.location,
      countryId: data.countryId !== "" ? data.countryId : undefined,
      avatarFile: avatarFile ?? null,
    });
  };

  const inputCls =
    "w-full rounded-md border border-neutral-20 bg-white px-3 py-2 text-body text-neutral-foreground focus:border-primary focus:outline-none";
  const disabledInputCls =
    "w-full rounded-md border border-neutral-10 bg-neutral-5 px-3 py-2 text-body text-muted-foreground cursor-not-allowed";
  const labelCls = "flex flex-col gap-1";
  const labelTextCls = "text-label text-neutral-foreground";
  const errorCls = "text-caption text-error";

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="rounded-xl border border-neutral-20 bg-white p-6"
    >
      <h2 className="mb-6 text-bodyLg font-semibold text-neutral-foreground">
        Edit Profile
      </h2>

      {/* Avatar picker */}
      <div className="mb-6 flex flex-col items-center">
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
        <p className="mt-2 text-caption text-muted-foreground">
          JPG, PNG, GIF or WebP
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col gap-4">
        {/* Read-only: name */}
        <label className={labelCls}>
          <span className={labelTextCls}>Full name</span>
          <input
            type="text"
            value={user?.fullName ?? user?.name ?? ""}
            disabled
            className={disabledInputCls}
            title="Name can only be changed via account settings"
          />
          <span className="text-xs text-muted-foreground">
            Name is managed at the account level.
          </span>
        </label>

        {/* Read-only: email */}
        <label className={labelCls}>
          <span className={labelTextCls}>Email</span>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            className={disabledInputCls}
            title="Email can only be changed via account settings"
          />
          <span className="text-xs text-muted-foreground">
            Email is managed at the account level.
          </span>
        </label>

        {/* Read-only: phone */}
        <label className={labelCls}>
          <span className={labelTextCls}>Phone number</span>
          <input
            type="tel"
            value={user?.phoneNumber ?? ""}
            disabled
            className={disabledInputCls}
            title="Phone can only be changed via account settings"
          />
          <span className="text-xs text-muted-foreground">
            Phone is managed at the account level.
          </span>
        </label>

        {/* Editable: bio */}
        <label className={labelCls}>
          <span className={labelTextCls}>Bio</span>
          <textarea
            {...register("bio")}
            rows={3}
            maxLength={300}
            placeholder="Tell us a bit about yourself…"
            className={`${inputCls} resize-none`}
          />
          {errors.bio && <span className={errorCls}>{errors.bio.message}</span>}
        </label>

        {/* Editable: location */}
        <label className={labelCls}>
          <span className={labelTextCls}>Location</span>
          <input
            type="text"
            {...register("location")}
            placeholder="e.g. Cairo, Egypt"
            className={inputCls}
          />
          {errors.location && (
            <span className={errorCls}>{errors.location.message}</span>
          )}
        </label>

        {/* Editable: country */}
        <label className={labelCls}>
          <span className={labelTextCls}>Country</span>
          <select {...register("countryId")} className={inputCls}>
            <option value="">Select a country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEn}
              </option>
            ))}
          </select>
          {errors.countryId && (
            <span className={errorCls}>{errors.countryId.message}</span>
          )}
        </label>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md bg-neutral-10 px-4 py-2 text-body text-neutral-foreground hover:bg-neutral-20 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-4 py-2 text-body text-primary-foreground hover:bg-primary-40 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
};
