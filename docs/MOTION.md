# MOTION.md — Animation & Motion Rules

> **Informed by:** `animate`, `apple-design`, `review-animations`, `improve-animations`, `high-end-visual-design`

## Principle

Motion exists to explain spatial relationships and confirm input — never to decorate. Every animation must have a **purpose** (feedback, spatial consistency, state indication, preventing a jarring change) or it gets deleted.

## Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 0ms | Keyboard-triggered toggles (Cmd+K) |
| `--duration-micro` | 80ms | Button press feedback |
| `--duration-fast` | 150ms | Hovers, focus rings, tooltips |
| `--duration-normal` | 250ms | Dropdowns, toasts, small reveals |
| `--duration-slow` | 400ms | Modals, drawers, page sections |
| `--duration-hero` | 600–800ms | Hero entrance, the ONE memorable moment |

**Rule:** If you're reaching for >800ms, you're decorating, not communicating.

## Easing Tokens

| Token | Value | When |
|-------|-------|------|
| `--ease-out` | `cubic-bezier(0.32, 0.72, 0, 1)` | **Default.** All entrances. |
| `--ease-in` | `cubic-bezier(0.36, 0, 1, 1)` | Exits only. Never entrances. |
| `--ease-in-out` | — | **Banned.** Never use. |
| `--ease-linear` | — | **Banned** except for progress bars. |
| `--ease-spring` | `type: "spring", bounce: 0, duration: 0.4` | Motion lib springs, critically damped |
| `--ease-spring-bounce` | `type: "spring", bounce: 0.2, duration: 0.4` | Momentum gestures only (drag release) |

**Rule:** `ease-in-out` on a UI element is always wrong. Entrances use `ease-out`. Exits use `ease-in`. Combined motion uses springs.

## Spring Configs (Motion library)

| Interaction | Damping | Bounce | Duration |
|-------------|---------|--------|----------|
| Reposition / move | 1.0 | 0 | 0.4s |
| Modal / sheet open | 0.8 | 0 | 0.3s |
| Drag release (momentum) | 0.8 | 0.2 | 0.4s |
| Layout shift | 1.0 | 0 | 0.35s |

## Entrance Rules

| Element | Transform | Duration | Easing |
|---------|-----------|----------|--------|
| Section (scroll reveal) | `translateY(16px)` + `opacity: 0` | `--duration-slow` | `--ease-out` |
| Card (staggered) | `translateY(12px)` + `opacity: 0` | `--duration-normal` | `--ease-out` + 50ms stagger |
| Modal / drawer | `translateY(8px)` + `opacity: 0` | `--duration-slow` | `--ease-spring` |
| Toast | `translateY(-100%)` | `--duration-normal` | `--ease-spring` |
| Tooltip | `scale(0.96)` + `opacity: 0` | `--duration-fast` | `--ease-out` |

**Rule:** Never animate from `scale(0)`. Minimum entrance scale is `0.96`. `scale(0)` looks broken.

## Hover Rules

| Element | Effect | Duration |
|---------|--------|----------|
| Button (primary) | `scale(0.98)` on press, no scale on hover | `--duration-micro` |
| Card | `translateY(-2px)` + border color lighten | `--duration-fast` |
| Link | Underline slide-in (not color change) | `--duration-fast` |
| Icon button | `scale(1.05)` + accent glow | `--duration-fast` |

**Rule:** Hover effects must be gated behind `@media (hover: hover)`. Touch devices get no hover state.

## Press Rules

- Buttons: `scale(0.98)` via `:active` or `whileTap`
- Duration: `--duration-micro` (80ms)
- Always pair with haptic feedback on mobile if supported

## Page Transitions

- **Not animated between routes.** Page transitions on a portfolio are slow and disorienting.
- **Exception:** Shared element transitions for project cards → detail pages (if using View Transitions API)

## The "One Memorable Hero Moment" Rule

The hero section gets ONE animation that is allowed to be expressive — a staggered text reveal, a typing effect, a mascot wave. Every other section entrance is a simple, fast fade-up. The budget for "wow" is exactly one moment.

## Transform/Opacity-Only Rule

**Animate ONLY `transform` and `opacity`.** Never animate:
- ❌ `width`, `height` (use `scale` instead)
- ❌ `top`, `left`, `right`, `bottom` (use `translate`)
- ❌ `padding`, `margin`, `border-width`
- ❌ `color`, `background-color` (use opacity layering)
- ❌ `box-shadow` (use opacity on a pseudo-element)
- ❌ `filter: blur()` on scrolling content

`will-change: transform` is added only while animating, removed after.

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- Reduced motion ships WITH the animation, not as a follow-up
- Opacity fades are acceptable under reduced motion (they don't cause motion sickness)
- Transforms are not — they collapse to instant
- The mascot stops following the cursor — shows static forward-facing pose

## Audit Checklist

| # | Check | Pass/Fail |
|---|-------|-----------|
| 1 | Every animation has a named purpose (feedback/spatial/state/jarring) | ☐ |
| 2 | No `ease-in-out` or `linear` on UI elements | ☐ |
| 3 | No animations on keyboard-initiated, high-frequency actions | ☐ |
| 4 | All entrances use `ease-out`; all exits use `ease-in` | ☐ |
| 5 | No `scale(0)` entrances — minimum 0.96 | ☐ |
| 6 | Only `transform` and `opacity` are animated | ☐ |
| 7 | `will-change` is scoped and temporary | ☐ |
| 8 | Hover effects gated behind `@media (hover: hover)` | ☐ |
| 9 | `prefers-reduced-motion` honored — transforms collapse, fades remain | ☐ |
| 10 | No motion library for simple fades (CSS only) | ☐ |
| 11 | Stagger delay ≤ 50ms per item, total ≤ 400ms | ☐ |
| 12 | Hero has exactly ONE expressive moment | ☐ |
| 13 | No page transition animations between routes | ☐ |
| 14 | Duration ≤ 800ms on any single animation | ☐ |
