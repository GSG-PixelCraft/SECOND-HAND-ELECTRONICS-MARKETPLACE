export type ListingStatus =
  | "active"
  | "product"
  | "rejected"
  | "pending"
  | "sold"
  | "archived"
  | "draft";

export interface ListingOptionsProps {
  status: ListingStatus;
  onAction?: (action: string) => void;
}

const OPTIONS_MAP: Record<ListingStatus, string[]> = {
  active: ["Edit", "Share", "Mark as Sold", "Archive", "Delete"],
  product: ["Edit", "Mark as Sold", "Archive", "Delete"],
  rejected: ["Edit", "View Reason", "Delete"],
  pending: ["Edit", "Delete"],
  sold: ["Archive", "Republish", "Delete"],
  archived: ["Republish", "Delete"],
  draft: ["Continue editing", "Delete"],
};

export function ListingOptions({ status, onAction }: ListingOptionsProps) {
  const options = OPTIONS_MAP[status];

  return (
    <ul
      role="menu"
      className="w-56 rounded-md border border-neutral-20 bg-white shadow-sm"
    >
      {options.map((option, index) => {
        const isDelete = option === "Delete";

        return (
          <li key={option} role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => onAction?.(option)}
              className={`flex w-full items-center px-4 py-2 text-left text-body transition-colors ${isDelete ? "text-error hover:bg-error-10" : "hover:bg-neutral-5"} `}
            >
              {option}
            </button>

            {index !== options.length - 1 && (
              <div className="mx-4 h-px bg-neutral-10" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
