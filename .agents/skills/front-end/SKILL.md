# AI Coding Guidelines

This file defines project-specific instructions for AI agents working in this repo.

**Goals**

1. Produce reusable and generic code by default.
2. Use the design-system primitives instead of raw HTML where available.

**Reusable And Generic Code**

- Prefer extracting shared UI into components under `src/components/` rather than duplicating markup.
- Favor small, composable utilities and hooks in `src/utils/` and `src/hooks/` when logic repeats.
- Design components to be data-driven with props instead of hard-coded content.
- Keep components flexible by exposing variants, sizes, and className overrides when needed.
- Avoid component-specific logic in pages when it can be generalized.
- Write types and interfaces that are reusable across similar modules.
- When adding new components, check for existing ones first and extend them instead of creating near-duplicates.

**UI Primitives Over HTML**

- Use `Text` instead of `p`, `h1`-`h6`, `label`, or `small` unless a semantic element is required
- Use `Span` instead of `span`.
- Use `Image` instead of `img`.
- Use `Button` instead of `button` or clickable `div`.
- If a third-party library requires a specific HTML tag, wrap it in the appropriate primitive when possible.
- If a semantic HTML tag is required for accessibility or SEO, use it and explain briefly in code comments.
- if the variants prop can't cover the use case, create a new variant.

**Implementation Guardrails**

- Prefer composition over inheritance and keep prop surfaces minimal.
- Keep styles centralized and reuse tokens, classes, or variants instead of new one-off styles.
- When you add a new pattern, add a small example usage in the same PR or commit.
