import { Span } from "./span";

export type TabValue =
  | "all"
  | "pending"
  | "active"
  | "rejected"
  | "sold"
  | "archived"
  | "drafts";

export interface TabsProps {
  value: TabValue;
  onChange: (value: TabValue) => void;
  counts?: Partial<Record<TabValue, number>>;
}

const TABS: { label: string; value: TabValue }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Rejected", value: "rejected" },
  { label: "Sold", value: "sold" },
  { label: "Hidden", value: "archived" },
  { label: "Removed", value: "drafts" },
];

export function Tabs({ value, onChange, counts }: TabsProps) {
  return (
    <div className="flex gap-3">
      {TABS.map((tab) => {
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
