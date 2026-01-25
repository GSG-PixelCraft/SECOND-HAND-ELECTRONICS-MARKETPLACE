import * as React from "react";

export interface SearchSuggestionsProps extends React.HTMLAttributes<HTMLUListElement> {
  suggestions: string[];
  onSuggestionSelect?: (value: string) => void;
}

export function SearchSuggestions({
  suggestions,
  onSuggestionSelect,
  className,
  ...props
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <ul
      role="listbox"
      className={`rounded-md border border-neutral-20 bg-white shadow-sm ${className ?? ""}`}
      {...props}
    >
      {suggestions.map((suggestion) => (
        <li
          key={suggestion}
          role="option"
          tabIndex={0}
          className="flex cursor-pointer items-center justify-between px-3 py-2 text-body hover:bg-neutral-5"
          onClick={() => onSuggestionSelect?.(suggestion)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSuggestionSelect?.(suggestion);
            }
          }}
        >
          <span>{suggestion}</span>
          <span className="text-muted-foreground">→</span>
        </li>
      ))}
    </ul>
  );
}
