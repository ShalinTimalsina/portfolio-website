# HCI-A11Y.md — UX Heuristics & Accessibility

> **Informed by:** `design-taste-frontend`, `emil-design-eng`, `mobile-native`

## UX Heuristics

### 1. Visibility of System Status (Nielsen #1)

**How we implement it:** Loading states on every async action (form submissions, data fetches). Skeleton screens for content. Progress indicators on multi-step flows. Toast confirmations after mutations.

**Pass/Fail:** Every button that triggers an async operation shows a loading spinner within 100ms. ☐

### 2. Match Between System and Real World (Nielsen #2)

**How we implement it:** Terminal commands use familiar shell syntax (`ls`, `cat`, `help`). Navigation labels match mental models ("Work" not "Portfolio Items"). Dates in relative format ("3 days ago").

**Pass/Fail:** No internal jargon or database field names visible in the UI. ☐

### 3. User Control and Freedom (Nielsen #3)

**How we implement it:** Cmd+K search closes with Escape. Terminal has `clear` command. Contact form has a reset. All modals close on backdrop click and Escape. Back navigation always works.

**Pass/Fail:** Every modal/overlay can be dismissed via Escape key and backdrop click. ☐

### 4. Consistency and Standards (Nielsen #4)

**How we implement it:** All design tokens from [DESIGN.md](./DESIGN.md). shadcn/ui primitives for consistent behavior. Same hover pattern across all interactive elements. Same transition timing.

**Pass/Fail:** No component uses a one-off color, radius, or shadow outside the token system. ☐

### 5. Error Prevention (Nielsen #5)

**How we implement it:** Zod validation on all forms. Inline validation on blur (not just on submit). Confirmation dialogs for destructive admin actions. Disabled submit buttons until form is valid.

**Pass/Fail:** No form can be submitted in an invalid state. ☐

### 6. Recognition Rather Than Recall (Nielsen #6)

**How we implement it:** Terminal autocomplete suggests available commands. Cmd+K shows recent searches. Skill badges show the tier label. Navigation highlights the active section.

**Pass/Fail:** The user never needs to memorize a command or page structure. ☐

### 7. Flexibility and Efficiency (Nielsen #7)

**How we implement it:** Cmd+K for power users. Terminal for exploration. Direct section links in nav for scanners. Admin keyboard shortcuts for content management.

**Pass/Fail:** Cmd+K search is accessible and returns results within 200ms. ☐

### 8. Aesthetic and Minimalist Design (Nielsen #8)

**How we implement it:** See [DESIGN.md](./DESIGN.md). No decorative elements without function. Every pixel earns its place. Content-first hierarchy.

**Pass/Fail:** Removing any visual element would reduce clarity or function. ☐

### 9. Help Users Recognize, Diagnose, and Recover from Errors (Nielsen #9)

**How we implement it:** Form errors name the field and the fix ("Email is required" not "Validation error"). 404 page offers navigation. Terminal shows "Command not found. Type `help` for available commands."

**Pass/Fail:** Every error message tells the user what went wrong AND what to do next. ☐

### 10. Help and Documentation (Nielsen #10)

**How we implement it:** Terminal `help` command lists all commands. Cmd+K has contextual hints. Admin CMS has inline field descriptions.

**Pass/Fail:** The terminal `help` command exists and lists every registered command. ☐

## Cognitive Laws

### Fitts's Law

**Implementation:** Primary CTAs are large touch targets (min 44×44px). Navigation items have generous padding. The most important action is closest to the user's likely cursor position.

**Check:** No interactive element is smaller than 44×44px on touch devices. ☐

### Hick's Law

**Implementation:** Navigation has ≤7 top-level items. Terminal commands are discoverable via categories. Skill grid groups by tier, not alphabetically. No dropdown with >10 items without search.

**Check:** No single menu or list presents >7 choices without grouping or filtering. ☐

### Miller's Law (7±2)

**Implementation:** Skills section groups into 3 tiers. Project grid shows 3–6 featured items with "View all" for the rest. Blog index paginates at 6 per page.

**Check:** No section displays >9 ungrouped items simultaneously. ☐

### Jakob's Law

**Implementation:** Navigation at the top. Logo links home. External links open in new tabs with `rel="noopener"`. Contact form looks and behaves like every other contact form.

**Check:** No interaction surprises a user familiar with standard web conventions. ☐

### Doherty Threshold (<400ms)

**Implementation:** All interactions respond within 400ms. Page navigations show content within 400ms (SSR/ISR). Optimistic UI for admin mutations.

**Check:** No user action takes >400ms to show visual feedback. ☐

### Gestalt Principles

**Implementation:** Related items grouped with proximity (cards in a grid). Consistent styling signals similarity. Section dividers use whitespace, not `<hr>`. Continuation via scroll implies more content.

**Check:** Every group of related items is visually clustered via spacing. ☐

### Progressive Disclosure

**Implementation:** Project cards show title + tech + one-line summary. Click expands to full case study. About section shows highlights; full bio is expandable. Terminal shows basic commands; `help --all` shows advanced.

**Check:** No page section dumps all available information on first render. ☐

### Peak-End Rule

**Implementation:** The hero (peak) and the footer/contact (end) are the two most polished sections. The mascot wave on the hero is the memorable "peak" moment. The footer has a warm, personal CTA.

**Check:** Hero and footer received equal design attention to middle sections. ☐

## WCAG 2.2 AA Requirements

### Contrast

| Element | Requirement | Check |
|---------|------------|-------|
| Body text on background | ≥ 4.5:1 | ☐ |
| Large text (≥24px or ≥18.66px bold) | ≥ 3:1 | ☐ |
| UI components and graphics | ≥ 3:1 | ☐ |
| `--accent` on `--bg-primary` (dark) | ≥ 4.5:1 | ☐ |
| `--accent` on `--bg-primary` (light) | ≥ 4.5:1 | ☐ |

### Focus Management

- All interactive elements have a visible focus ring (`outline: 2px solid var(--accent)`, offset 2px)
- Focus ring is visible in both light and dark themes
- Focus order follows visual order (no `tabindex` > 0)
- Modals trap focus; focus returns to trigger on close
- Skip-to-content link is the first focusable element

**Check:** Tab through every page — focus is always visible and logical. ☐

### Keyboard Navigation

- All functionality available via keyboard
- Escape closes modals, dropdowns, Cmd+K
- Arrow keys navigate terminal history and autocomplete
- Enter submits forms and activates buttons
- Tab order is logical and complete

**Check:** Complete every user flow using only the keyboard. ☐

### ARIA

- Images have descriptive `alt` text (not "image" or filename)
- Decorative images use `alt=""`
- Interactive regions use `aria-label` or `aria-labelledby`
- Live regions (`aria-live="polite"`) for toast notifications
- Terminal output uses `role="log"` and `aria-live="polite"`
- Mascot uses `aria-label` describing its current state

**Check:** Run axe-core — zero violations. ☐

### Reduced Motion

See [MOTION.md](./MOTION.md) for full specification.

**Check:** Enable `prefers-reduced-motion: reduce` — all transforms collapse, fades remain, mascot is static. ☐
