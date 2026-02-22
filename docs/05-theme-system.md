# Theme System

## Overview

The workflow engine supports **Light** and **Dark** themes with automatic persistence via `localStorage`. The theme system is built on CSS custom properties (variables) and Tailwind CSS v4's `@theme` directive.

## Architecture

### CSS Variables (`index.css`)

Two sets of CSS variables are defined:

- **`:root`** — Dark theme (default)
- **`:root.light`** — Light theme overrides

```css
:root {
  --t-primary: #60a5fa;      /* Light blue accent */
  --t-bg: #0f172a;           /* Dark navy background */
  --t-surface: #1e293b;      /* Card/surface */
  --t-heading: #f1f5f9;      /* White text */
  --t-body: #94a3b8;         /* Muted body text */
  /* ... more variables */
}

:root.light {
  --t-primary: #2563eb;      /* Blue accent */
  --t-bg: #f8fafc;           /* White background */
  --t-surface: #ffffff;      /* White surface */
  --t-heading: #0f172a;      /* Dark text */
  --t-body: #475569;         /* Gray body text */
  /* ... overrides */
}
```

### Tailwind Integration (`@theme` block)

CSS variables are mapped to Tailwind tokens through the `@theme` block:

```css
@theme {
  --color-primary: var(--t-primary);
  --color-bg-dark: var(--t-bg);
  --color-heading: var(--t-heading);
  /* ... */
}
```

This lets components use standard Tailwind classes like `text-heading`, `bg-surface-dark`, `border-border-dark` that automatically adapt to the current theme.

### State Management (`uiStore.ts`)

The `uiStore` Zustand store manages theme state:

- `theme: "light" | "dark"` — current theme
- `toggleTheme()` — switches theme, persists to `localStorage`, updates `<html>` class
- `getInitialTheme()` — reads from `localStorage` on first load
- `applyThemeClass()` — adds/removes `.light` class on `document.documentElement`

### Theme Toggle (Header)

The `Header` component includes a toggle button with Material Icons:
- Dark mode: `dark_mode` icon
- Light mode: `light_mode` icon

## Customizing

### Adding a new color token

1. Add the variable to both `:root` and `:root.light` in `index.css`
2. Map it in the `@theme` block
3. Use the Tailwind class in components (e.g., `text-my-token`)

### Changing accent colors

Edit `--t-primary` and `--t-primary-hover` in both `:root` (dark) and `:root.light` sections.

## Color Token Reference

| Token | Tailwind Class | Dark Value | Light Value |
|-------|---------------|------------|-------------|
| `--t-primary` | `text-primary`, `bg-primary` | `#60a5fa` | `#2563eb` |
| `--t-bg` | `bg-bg-dark` | `#0f172a` (slate-900) | `#f8fafc` |
| `--t-bg-deep` | `bg-bg-dark-deep` | `#020617` (slate-950) | `#f1f5f9` |
| `--t-surface` | `bg-surface-dark` | `#1e293b` (slate-800) | `#ffffff` |
| `--t-border` | `border-border-dark` | `#334155` (slate-700) | `#e2e8f0` |
| `--t-heading` | `text-heading` | `#f1f5f9` | `#0f172a` |
| `--t-body` | `text-body` | `#94a3b8` | `#475569` |
| `--t-muted` | `text-muted` | `#64748b` | `#94a3b8` |
| `--t-canvas-dot` | — (CSS only) | `#1e3a5f` (dark navy) | `#cbd5e1` |
| `--t-handle-bg` | — (CSS only) | `#0f172a` | `#ffffff` |
| `--t-scrollbar` | — (CSS only) | `#334155` | `#cbd5e1` |

> **Note:** All dark-mode background colors use the Tailwind Slate palette (blue-gray family) to ensure a consistent dark **blue** appearance — not purple.
|-------|---------------|------------|-------------|
| `--t-primary` | `text-primary`, `bg-primary` | `#60a5fa` | `#2563eb` |
| `--t-bg` | `bg-bg-dark` | `#0f172a` | `#f8fafc` |
| `--t-surface` | `bg-surface-dark` | `#1e293b` | `#ffffff` |
| `--t-heading` | `text-heading` | `#f1f5f9` | `#0f172a` |
| `--t-body` | `text-body` | `#94a3b8` | `#475569` |
| `--t-muted` | `text-muted` | `#64748b` | `#94a3b8` |
| `--t-border` | `border-border-dark` | `#1e293b` | `#e2e8f0` |
