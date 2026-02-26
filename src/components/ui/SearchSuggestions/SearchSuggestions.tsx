import type { HTMLAttributes } from "react";
import { Button } from "../Button/button";
import { Span } from "../Span/span";

export interface SearchSuggestionsProps extends HTMLAttributes<HTMLUListElement> {
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
      className={`rounded-md border border-neutral-20 bg-white shadow-sm ${className ?? ""}`}
      {...props}
    >
      {suggestions.map((suggestion, index) => (
        <li key={`${suggestion}-${index}`}>
          <Button
            type="button"
            className="flex w-full items-center justify-between px-3 py-2 text-body hover:bg-neutral-5"
            onClick={() => onSuggestionSelect?.(suggestion)}
          >
            <Span>{suggestion}</Span>
            <Span variant="muted" aria-hidden="true">
              →
            </Span>
          </Button>
        </li>
      ))}
    </ul>
  );
}
