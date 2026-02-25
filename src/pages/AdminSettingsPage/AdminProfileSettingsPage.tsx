import { useRef, useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Upload, ChevronDown } from "lucide-react";
import {
  initialProfileForm,
  initialProfileImage,
  languageOptions,
  timezoneOptions,
  type ProfileForm,
} from "./adminProfileSettings.data";

const AdminProfileSettingsPage = () => {
  const [form, setForm] = useState<ProfileForm>(initialProfileForm);
  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setProfileImage(localUrl);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="font-['Poppins'] text-[44px] font-semibold leading-[1.2] text-[#101010] max-[1200px]:text-[32px]">
        Admin Profile
      </h1>

      <section className="rounded-[18px] border border-[#e8e8e8] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
        <h2 className="font-['Poppins'] text-[24px] font-semibold leading-[1.2] text-[#101010]">
          Profile Information
        </h2>

        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            <div className="h-[140px] w-[140px] overflow-hidden rounded-full border border-[#dedede]">
              <Image
                src={profileImage}
                alt="Admin avatar"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-3">
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#EAF0FF] px-5 font-['Poppins'] text-base font-medium leading-none text-[#2563EB] transition-colors hover:bg-[#dfe8ff]"
              >
                <Upload className="h-5 w-5" />
                Upload New Photo
              </button>
              <p className="font-['Poppins'] text-sm leading-[1.5] text-[#8B8B8B]">
                Upload a square image (140x140 px recommended).
                <br />
                JPG or PNG. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-2">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              className="h-14 rounded-xl border-[#d7d7d7] bg-white px-4 text-lg font-normal text-[#3D3D3D]"
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              className="h-14 rounded-xl border-[#d7d7d7] bg-white px-4 text-lg font-normal text-[#3D3D3D]"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="h-14 rounded-xl border-[#d7d7d7] bg-white px-4 text-lg font-normal text-[#3D3D3D]"
            />
            <div className="flex flex-col gap-2">
              <label className="font-['Poppins'] text-[14px] font-medium text-[#3D3D3D]">
                Phone number
              </label>
              <div className="flex h-14 items-center gap-3 rounded-xl border border-[#d7d7d7] bg-white px-4">
                <span className="text-[14px] font-semibold text-[#3D3D3D]">
                  PS
                </span>
                <span className="font-['Poppins'] text-lg text-[#3D3D3D]">
                  {form.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              intent="primary"
              className="h-10 rounded-xl px-6 font-['Poppins'] text-base font-medium"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[18px] border border-[#e8e8e8] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
        <h2 className="font-['Poppins'] text-[24px] font-semibold leading-[1.2] text-[#101010]">
          General Settings
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="font-['Poppins'] text-[14px] font-medium text-[#3D3D3D]">
              Interface Language
            </label>
            <div className="relative">
              <Select
                value={form.language}
                onChange={(event) =>
                  updateField("language", event.target.value)
                }
                className="h-14 appearance-none rounded-xl border-[#d7d7d7] bg-white px-4 pr-11 text-lg text-[#3D3D3D]"
              >
                {languageOptions.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </Select>
              <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#8B8B8B]" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-['Poppins'] text-[14px] font-medium text-[#3D3D3D]">
              Timezone
            </label>
            <div className="relative">
              <Select
                value={form.timezone}
                onChange={(event) =>
                  updateField("timezone", event.target.value)
                }
                className="h-14 appearance-none rounded-xl border-[#d7d7d7] bg-white px-4 pr-11 text-lg text-[#3D3D3D]"
              >
                {timezoneOptions.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </Select>
              <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#8B8B8B]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminProfileSettingsPage;
