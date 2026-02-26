import { Span } from "../Span/span";

export type TabValue =
  | "all"
  | "pending"
  | "active"
  | "rejected"
  | "sold"
  | "archived"
  | "drafts"
  | "verified"
  | "suspended"
  | "banned";

export interface TabsProps<T extends string = TabValue> {
  value: T;
  onChange: (value: T) => void;
  counts?: Partial<Record<T, number>>;
  tabs?: { label: string; value: T }[]; // Optional custom tabs
}

const DEFAULT_TABS: { label: string; value: TabValue }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Rejected", value: "rejected" },
  { label: "Sold", value: "sold" },
  { label: "Hidden", value: "archived" },
  { label: "Removed", value: "drafts" },
];

export function Tabs<T extends string = TabValue>({
  value,
  onChange,
  counts,
  tabs,
}: TabsProps<T>) {
  const tabsToRender = (tabs || DEFAULT_TABS) as { label: string; value: T }[];

  return (
    <div className="flex gap-3">
      {tabsToRender.map((tab) => {
        const isActive = value === tab.value;
        const count = counts?.[tab.value];

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={`flex items-center gap-2 border-b-2 px-3 pb-2 text-base transition-colors ${
              isActive
                ? "border-[#2563eb] text-[#2563eb]"
                : "border-transparent text-[#828282] hover:text-[#3d3d3d]"
            }`}
          >
            <Span
              variant="body"
              className={
                isActive ? "font-medium text-[#2563eb]" : "text-[#828282]"
              }
            >
              {tab.label}
            </Span>
            {count !== undefined && count > 0 && (
              <Span
                className={`rounded-xl px-2 py-0.5 text-xs ${
                  isActive
                    ? "bg-[rgba(37,99,235,0.2)] text-[#2563eb]"
                    : "bg-[rgba(107,114,128,0.2)] text-[#6b7280]"
                }`}
              >
                {count}
              </Span>
            )}
          </button>
        );
      })}
    </div>
  );
}
