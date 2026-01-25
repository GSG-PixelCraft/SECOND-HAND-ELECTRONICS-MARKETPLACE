import * as React from "react";

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
}

const TABS: { label: string; value: TabValue }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Rejected", value: "rejected" },
  { label: "Sold", value: "sold" },
  { label: "Archived", value: "archived" },
  { label: "Drafts", value: "drafts" },
];

export function Tabs({ value, onChange }: TabsProps) {
  return (
    <div className="border-b border-neutral-20 bg-primary-5">
      <ul className="flex justify-between">
        {TABS.map((tab) => {
          const isActive = value === tab.value;

          return (
            <li key={tab.value}>
              <button
                type="button"
                onClick={() => onChange(tab.value)}
                className={`relative pb-3 text-body transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-neutral-foreground"
                } `}
              >
                {tab.label}

                {isActive && (
                  <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
