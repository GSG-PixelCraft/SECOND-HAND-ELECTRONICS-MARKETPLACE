import { Checkbox } from "@/components/ui/Checkbox/checkbox";

interface Props {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export const CheckboxSection = ({
  title,
  options,
  selected,
  onToggle,
}: Props) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>

    {options.map((option) => (
      <Checkbox
        key={option}
        label={option}
        checked={selected.includes(option)}
        onChange={() => onToggle(option)}
      />
    ))}
  </div>
);