import { forwardRef } from "react";
import {
  Camera,
  Cpu,
  Gamepad2,
  GripVertical,
  Headphones,
  Home,
  Laptop,
  Monitor,
  Pencil,
  Smartphone,
  Tablet,
  Trash2,
  Watch,
} from "lucide-react";
import { Switch } from "@/components/ui/Switch/switch";
import { Span } from "@/components/ui/Span/span";
import { cn } from "@/lib/utils";
import type { AdminCategory, CategoryIconKey } from "@/types/admin";

export interface CategoriesTableProps {
  categories: AdminCategory[];
  onToggleStatus: (category: AdminCategory, nextStatus: boolean) => void;
  onEdit: (category: AdminCategory) => void;
  onDelete: (category: AdminCategory) => void;
  statusUpdating?: boolean;
  className?: string;
}

const categoryIconMap: Record<CategoryIconKey, typeof Smartphone> = {
  phone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  "pc-parts": Cpu,
  gaming: Gamepad2,
  audio: Headphones,
  smartwatch: Watch,
  camera: Camera,
  "smart-home": Home,
  "tv-monitor": Monitor,
};

export const CategoriesTable = forwardRef<HTMLDivElement, CategoriesTableProps>(
  (
    {
      categories,
      onToggleStatus,
      onEdit,
      onDelete,
      statusUpdating = false,
      className,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("overflow-hidden rounded-xl", className)}>
        <div className="flex h-12 items-center bg-primary/10">
          <div className="w-[56px]" />
          <div className="flex w-[84px] items-center px-4">
            <Span className="text-neutral-90 text-sm font-medium">Icon</Span>
          </div>
          <div className="flex flex-1 items-center px-4">
            <Span className="text-neutral-90 text-sm font-medium">
              Category Name
            </Span>
          </div>
          <div className="flex w-[220px] items-center px-4">
            <Span className="text-neutral-90 text-sm font-medium">
              Attributes
            </Span>
          </div>
          <div className="flex w-[180px] items-center px-4">
            <Span className="text-neutral-90 text-sm font-medium">Status</Span>
          </div>
          <div className="flex w-[140px] items-center justify-center px-4">
            <Span className="text-neutral-90 text-sm font-medium">Actions</Span>
          </div>
        </div>

        <div className="bg-white">
          {categories.map((category) => {
            const Icon = categoryIconMap[category.iconKey];
            return (
              <div
                key={category.id}
                className="flex h-[78px] items-center border-b border-neutral-10"
              >
                <div className="flex w-[56px] items-center justify-center">
                  <GripVertical className="text-neutral-40 h-4 w-4" />
                </div>

                <div className="flex w-[84px] items-center px-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-10">
                    <Icon className="text-neutral-60 h-5 w-5" />
                  </div>
                </div>

                <div className="flex flex-1 items-center px-4">
                  <Span className="text-neutral-80 text-sm font-medium">
                    {category.name}
                  </Span>
                </div>

                <div className="flex w-[220px] items-center px-4">
                  <span className="text-neutral-50 rounded-lg bg-neutral-10 px-3 py-1 text-[13px]">
                    {category.attributesCount} Attributes
                  </span>
                </div>

                <div className="flex w-[180px] items-center px-4">
                  <Switch
                    checked={category.isActive}
                    onCheckedChange={(nextStatus) =>
                      onToggleStatus(category, nextStatus)
                    }
                    disabled={statusUpdating}
                  />
                </div>

                <div className="flex w-[140px] items-center justify-center gap-4 px-4">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="text-neutral-50 hover:text-neutral-70 transition-colors"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    className="text-error transition-colors hover:text-error/80"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

CategoriesTable.displayName = "CategoriesTable";
