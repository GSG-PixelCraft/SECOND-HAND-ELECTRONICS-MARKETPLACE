import * as React from "react";
import { Camera } from "lucide-react";
import { countries } from "countries-list";

interface EditProfileFormProps {
  onCancel: () => void;
  onSubmit: () => void;
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
  onCancel,
  onSubmit,
}: EditProfileFormProps) => {
  const [fullName, setFullName] = React.useState("Eleanor Vance");
  const [email, setEmail] = React.useState("eleanor@example.com");
  const [phone, setPhone] = React.useState("+970 599 000 000");
  const [country, setCountry] = React.useState("Palestine");

  return (
    <div className="rounded-xl border border-neutral-20 bg-white p-6">
      <div className="flex flex-col items-center gap-6">
        <button
          type="button"
          className="group relative h-28 w-28 overflow-hidden rounded-full border border-neutral-20"
        >
          <img
            src="https://i.pravatar.cc/150?img=32"
            alt="Profile"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 hidden items-center justify-center bg-black/40 group-hover:flex">
            <Camera size={20} className="text-white" />
          </div>
        </button>

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
            className="rounded-md bg-neutral-10 px-4 py-2 text-body text-neutral-foreground hover:bg-neutral-10"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="rounded-md bg-primary px-4 py-2 text-body text-primary-foreground hover:bg-primary-40"
          >
            Update profile
          </button>
        </div>
      </div>
    </div>
  );
};
