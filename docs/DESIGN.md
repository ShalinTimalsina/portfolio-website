# DESIGN.md — Visual Design System

> **Informed by:** `high-end-visual-design`, `design-taste-frontend`, `emil-design-eng`, `minimalist-ui`

## Concept: "Quiet Infrastructure"

The site looks and feels like well-engineered infrastructure: precise, minimal, confident. Dark surfaces suggest a terminal; light mode suggests clean documentation. Nothing screams — everything is earned through spacing, type contrast, and restraint.

## Theme

- **Primary:** Dark-first (`prefers-color-scheme: dark` default)
- **Light mode:** Available via toggle, not an afterthought
- **Switching:** Instant, no flash — use `next-themes` with `attribute="class"`

## Color Tokens

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--bg-primary` | `#0A0A0A` | `#FAFAFA` | Page background |
| `--bg-surface` | `#111111` | `#FFFFFF` | Cards, panels |
| `--bg-elevated` | `#1A1A1A` | `#F5F5F5` | Hover states, nested surfaces |
| `--fg-primary` | `#EDEDED` | `#171717` | Body text |
| `--fg-secondary` | `#888888` | `#6B6B6B` | Muted text, labels |
| `--fg-tertiary` | `#555555` | `#A3A3A3` | Disabled, placeholder |
| `--accent` | `#00C896` | `#00A37A` | **ONE accent — Mint/Emerald** |
| `--accent-muted` | `#00C896/15%` | `#00A37A/10%` | Accent backgrounds |
| `--border-default` | `#1E1E1E` | `#E5E5E5` | Subtle dividers |
| `--border-hover` | `#2E2E2E` | `#D4D4D4` | Interactive borders |
| `--destructive` | `#EF4444` | `#DC2626` | Error states only |

**Rule:** ONE accent color. No secondary accent. If something needs emphasis beyond the accent, use type weight or size — not another color.

## Typography

| Token | Font | Weight | Size | Leading | Tracking |
|-------|------|--------|------|---------|----------|
| `--font-display` | Clash Display | 600 | — | — | -0.02em |
| `--font-body` | Plus Jakarta Sans | 400, 500, 600 | — | — | 0 |
| `--font-mono` | JetBrains Mono | 400, 500 | — | — | 0 |

### Type Scale (rem, fluid via `clamp()`)

| Name | Min | Preferred | Max | Usage |
|------|-----|-----------|-----|-------|
| `--text-hero` | 2.5rem | 5vw | 4.5rem | Hero heading only |
| `--text-h1` | 2rem | 3.5vw | 3rem | Section headings |
| `--text-h2` | 1.5rem | 2.5vw | 2rem | Subsection headings |
| `--text-h3` | 1.125rem | 1.5vw | 1.5rem | Card titles |
| `--text-body` | 0.9375rem | 1vw | 1.0625rem | Body copy |
| `--text-small` | 0.8125rem | — | 0.875rem | Labels, captions |
| `--text-micro` | 0.6875rem | — | 0.75rem | Eyebrow tags |

**Rule:** Hero heading uses `--font-display`. Everything else uses `--font-body`. Code blocks use `--font-mono`.

## Spacing

Base unit: **8px**. All spacing is a multiple of 8.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon padding, hairline gaps |
| `--space-2` | 8px | Inline element gaps |
| `--space-3` | 12px | Tight component padding |
| `--space-4` | 16px | Standard component padding |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section internal spacing |
| `--space-12` | 48px | Between subsections |
| `--space-16` | 64px | Between sections (mobile) |
| `--space-24` | 96px | Between sections (desktop) |
| `--space-32` | 128px | Hero vertical padding |

## Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Badges, tags |
| `--radius-md` | 10px | Cards, inputs |
| `--radius-lg` | 16px | Modals, panels |
| `--radius-xl` | 24px | Hero cards, feature blocks |
| `--radius-full` | 9999px | Pills, avatars, buttons |

## Shadow

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-subtle` | `0 1px 2px rgba(0,0,0,0.04)` | Light-mode card lift |
| `--shadow-ambient` | `0 8px 32px rgba(0,0,0,0.08)` | Floating elements |
| `--shadow-glow` | `0 0 40px var(--accent)/10%` | Accent glow (dark mode only) |
| `--shadow-inset` | `inset 0 1px 0 rgba(255,255,255,0.06)` | Surface highlight (dark) |

**Rule:** Dark mode uses NO drop shadows — only `--shadow-inset` and `--shadow-glow` on accent elements.

## Borders

- Default: `1px solid var(--border-default)`
- Never use `border-gray-300` or any Tailwind gray literal
- Inner highlights via `--shadow-inset`, not a second border
- Cards use border + inset shadow to create the "double-bezel" depth

## Component Rules

1. **Cards:** Always nested architecture (outer shell + inner core). Never flat on background.
2. **Buttons:** Primary = `--accent` fill, pill shape. Secondary = ghost with `--border-default`. No outline buttons.
3. **Inputs:** `--bg-elevated` background, `--border-default` border, `--radius-md`. Focus ring uses `--accent`.
4. **Badges/Eyebrows:** `--text-micro`, uppercase, `tracking-[0.15em]`, `--font-body` weight-500, pill-shaped.
5. **Images:** Always in a container with `--radius-md` and `overflow-hidden`. Never raw `<img>`.
6. **Icons:** Phosphor Light or custom SVG. 20px default size. Never thick-stroked Lucide defaults.

## Layout Grid

- **Max content width:** 1200px
- **Page padding:** `--space-4` (mobile) → `--space-8` (tablet) → auto-centered (desktop)
- **Section spacing:** `--space-16` (mobile) → `--space-24` (desktop)
- **Grid:** CSS Grid with `gap` token — never margin hacks
- **Mobile:** Everything collapses to single column below 768px. No exceptions.

## Imagery Rules

1. All project screenshots are real — no mockups or stock photos
2. Use `next/image` with proper `width`, `height`, and `placeholder="blur"`
3. Hero images/illustrations are optional — typography alone can carry
4. The mascot is the only illustrated element on the site

## Banned Cheap-AI Patterns

| Pattern | Why It Fails | What To Do Instead |
|---------|-------------|-------------------|
| Generic purple/blue gradient backgrounds | Screams "AI made this" | Solid `--bg-primary` or single-tone mesh |
| `bg-gradient-to-r from-purple-500 to-pink-500` text | Unreadable, generic | Solid `--fg-primary` or `--accent` |
| Emoji as section icons (🚀 📊 💡) | Unprofessional | Phosphor icons or nothing |
| Wall of identical 3-column cards | Zero visual hierarchy | Vary card sizes, use bento grid |
| Filler copy ("Lorem ipsum", "We deliver solutions") | Dishonest | Real copy or `TODO(Shalin): confirm` |
| Fake statistics ("10K+ users", "99.9% uptime") | Unverifiable on a portfolio | Show real GitHub stars/contributions |
| Centered-everything layout | Monotonous, no tension | Left-aligned body, asymmetric sections |
| Default unstyled shadcn components | Looks like a demo app | Always customize with design tokens |
| Giant hero illustration of a person at a desk | Clip-art energy | Photo of Shalin or mascot, not stock |
| Excessive glassmorphism on every card | Performance killer, tired trend | Reserve glass for nav and modals only |

**Pass/Fail:** If a reviewer can identify the site as "AI-generated" from the design alone, it fails.
