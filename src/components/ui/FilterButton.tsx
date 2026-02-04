import { Button } from "./button";

export interface FilterButtonProps {
  value: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const FilterButton = ({
  label,
  isActive,
  onClick,
}: Omit<FilterButtonProps, "value">) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-md px-4 py-2 ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "border border-neutral-20 bg-white hover:bg-neutral-5"
      }`}
      aria-pressed={isActive}
    >
      {label}
    </Button>
  );
};
