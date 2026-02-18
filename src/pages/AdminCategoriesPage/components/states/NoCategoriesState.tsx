import { Button } from "@/components/ui/button";

export interface NoCategoriesStateProps {
  onAddCategory: () => void;
}

function CategoriesEmptyIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="56" cy="56" r="20" fill="#E5E7EB" />
      <circle cx="56" cy="56" r="16" fill="#D1D5DB" />
      <circle cx="56" cy="56" r="10" fill="#BFDBFE" />
      <path
        d="M46 66L30 82"
        stroke="#9CA3AF"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <rect x="86" y="28" width="34" height="18" rx="4" fill="#F87171" />
      <rect x="86" y="50" width="34" height="18" rx="4" fill="#4ADE80" />
      <rect x="86" y="72" width="34" height="18" rx="4" fill="#60A5FA" />
      <rect x="40" y="76" width="34" height="18" rx="4" fill="#FACC15" />

      <rect x="92" y="33" width="8" height="3" rx="1.5" fill="white" />
      <rect x="104" y="33" width="10" height="3" rx="1.5" fill="white" />
      <rect x="92" y="39" width="22" height="3" rx="1.5" fill="white" />

      <rect x="92" y="55" width="8" height="3" rx="1.5" fill="white" />
      <rect x="104" y="55" width="10" height="3" rx="1.5" fill="white" />
      <rect x="92" y="61" width="22" height="3" rx="1.5" fill="white" />

      <rect x="92" y="77" width="8" height="3" rx="1.5" fill="white" />
      <rect x="104" y="77" width="10" height="3" rx="1.5" fill="white" />
      <rect x="92" y="83" width="22" height="3" rx="1.5" fill="white" />

      <rect x="46" y="81" width="8" height="3" rx="1.5" fill="white" />
      <rect x="58" y="81" width="10" height="3" rx="1.5" fill="white" />
      <rect x="46" y="87" width="22" height="3" rx="1.5" fill="white" />

      <path
        d="M54.6 61.2V50.8H59.2V61.2H54.6ZM56.9 67.1C56.08 67.1 55.43 66.88 54.95 66.44C54.49 66 54.26 65.45 54.26 64.79C54.26 64.12 54.5 63.58 54.99 63.16C55.49 62.73 56.12 62.52 56.9 62.52C57.67 62.52 58.29 62.73 58.77 63.16C59.26 63.58 59.51 64.12 59.51 64.79C59.51 65.45 59.27 66 58.79 66.44C58.32 66.88 57.69 67.1 56.9 67.1Z"
        fill="#FBBF24"
      />
    </svg>
  );
}

export function NoCategoriesState({ onAddCategory }: NoCategoriesStateProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <CategoriesEmptyIllustration />
      <h2 className="text-neutral-80 mt-6 text-4xl font-medium">
        No categories added yet
      </h2>
      <Button
        onClick={onAddCategory}
        className="mt-7 h-12 w-full max-w-[420px] rounded-xl border-none bg-primary text-base font-medium text-white hover:bg-primary/90"
      >
        Add Category
      </Button>
    </div>
  );
}
