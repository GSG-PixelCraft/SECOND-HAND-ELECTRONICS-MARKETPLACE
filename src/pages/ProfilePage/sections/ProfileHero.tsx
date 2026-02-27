import { Calendar, MapPin, Pencil } from "lucide-react";

interface ProfileHeroProps {
  name: string;
  country: string;
  memberSince: string;
  avatar?: string;
  isLoading?: boolean;
  onEdit: () => void;
}

export const ProfileHero = ({
  name,
  country,
  memberSince,
  avatar,
  isLoading = false,
  onEdit,
}: ProfileHeroProps) => (
  <section className="rounded-lg border border-neutral-20 bg-white p-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {avatar ? (
          <img
            src={avatar}
            alt="Profile avatar"
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-muted-10" />
        )}

        <div className="space-y-1">
          <p className="text-bodyLg font-semibold">
            {isLoading ? "Loading..." : name || "-"}
          </p>

          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-muted-foreground" />
            <span className="text-caption">{country}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-muted-foreground" />
            <span className="text-caption">{memberSince}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-10 text-primary transition hover:bg-primary-20"
      >
        <Pencil size={18} />
      </button>
    </div>
  </section>
);

