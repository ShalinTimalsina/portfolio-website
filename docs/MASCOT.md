# MASCOT.md — Cursor-Following Mascot Specification

> **Informed by:** `page-mascot` (skill wins where it conflicts with other docs)

## Character Inventory

| File | Depicts |
|------|---------|
| `characters/shalin/directions.png` | 3×3 sprite sheet — Shalin chibi looking in 9 head directions (up-left through down-right). Green-screen background, pending key removal. |
| `characters/shalin/reactions.png` | 3×3 sprite sheet — Shalin chibi with 9 expressions (happy, heart, sparkles, surprised, starstruck, blushing, sleeping, dizzy, grinning). Green-screen background, pending key removal. |

**Build status:** Raw source sheets saved. Green background NOT yet removed. Atlas `.webp` files NOT yet built. Run the build pipeline before wiring up the component.

## State Machine

| State | Trigger | Sheet Used | Behavior |
|-------|---------|------------|----------|
| `idle` | Default (no cursor movement for 5s) | Directions: center | Faces forward, blinks occasionally |
| `watching` | Cursor moves | Directions: varies | Head follows cursor across 9 directions |
| `typing` | Terminal input active | Directions: down | Looks down at the terminal |
| `thinking` | Terminal processing a command | Reactions: dizzy | Spiral eyes, brief thinking state |
| `success` | Terminal command succeeds | Reactions: sparkles | Happy with sparkle stars, 2s then back to watching |
| `error` | Terminal command fails | Reactions: surprised | Surprised face, 2s then back to watching |
| `sleeping` | No interaction for 30s | Reactions: sleeping | Zzz, wakes on any interaction |
| `wave` | Page load (hero) OR `mascot` command | Reactions: grinning | The ONE memorable hero moment. Grin for 2s, then watching |

### State Transitions

```
[page load] → wave (2s) → watching
[cursor moves] → watching
[no cursor for 5s] → idle
[no interaction for 30s] → sleeping
[any interaction from sleeping] → watching
[terminal focus] → typing
[command submitted] → thinking (brief) → success OR error (2s) → watching
[`mascot` command] → wave (2s) → watching
```

## Cursor-Follow Approach

Per the `page-mascot` skill — the component uses `background-position` on a sprite sheet, not per-frame JavaScript.

1. Listen to `mousemove` on `document` (throttled to ~60fps via `requestAnimationFrame`)
2. Calculate angle from mascot center to cursor position
3. Map angle to one of 9 grid cells (8 compass directions + center)
4. Set `background-position` on the directions sprite sheet
5. On click or state trigger, swap to the reactions sprite sheet

**No animation library needed.** The swap is instant — the sprite sheet approach is inherently performant.

## Terminal-Awareness Triggers

The mascot reacts to terminal events:

| Terminal Event | Mascot Reaction |
|---------------|-----------------|
| Terminal panel opens | → `typing` state |
| User types a command | → `typing` (looks down) |
| Command executing | → `thinking` (brief, 300ms) |
| Command output (success) | → `success` (sparkles, 2s) |
| Command output (error) | → `error` (surprised, 2s) |
| Terminal closes | → `watching` |
| `mascot` command typed | → `wave` (grinning, 2s) |

Use a lightweight event emitter or React context to communicate between terminal and mascot. No prop drilling.

## Placement & Avoidance Rules

1. **Default position:** Top-right of the hero section, floating above/beside the heading
2. **Fixed when scrolling:** Sticks to viewport corner after scrolling past the hero
3. **Size:** 140px default (adjustable via `size` prop)
4. **Z-index:** Below modals/overlays, above page content
5. **Never overlaps:** Navigation, CTAs, form inputs, or the terminal panel
6. **Mobile:** Smaller (100px), positioned in top-right corner, does NOT follow touch (see below)

## Touch & Mobile Behavior

- **No cursor following on touch devices.** The mascot shows the static `idle` (forward-facing) state
- **Tap to trigger reactions:** A tap cycles through expressions (grinning → heart → sparkles → back to idle)
- **No drag interaction.** The mascot is not draggable
- Touch targets: the mascot itself is a 44×44px minimum tap target

## Reduced Motion Behavior

When `prefers-reduced-motion: reduce`:
- Mascot is visible but static — shows the forward-facing direction
- No cursor following
- State changes (reactions) swap instantly — no transition
- The mascot still responds to clicks/taps (instant swap, no animation)

## Performance Rules

1. Sprite sheets are loaded as a single image each — no splitting into 9 files
2. `background-position` changes are GPU-composited — no reflow
3. `mousemove` handler is throttled via `requestAnimationFrame`
4. The mascot component is `React.memo`'d
5. Sprite sheets are WebP format, ≤100KB each after build
6. `will-change: background-position` is NOT needed (instant swap, no transition)

## Missing Poses / Known Gaps

The current sprite sheets cover the core states. The following are NOT available and would require drawing additional sheets or adding CSS effects:

| Missing | Workaround |
|---------|-----------|
| Explicit "typing" direction (looking at keyboard) | Use `directions: down-center` cell |
| Explicit "thinking" animation (animated swirls) | Use static `reactions: dizzy` cell |
| Blink animation | CSS opacity flash on eyes (pseudo-element overlay) or skip |
| Wave hand gesture | Not possible with head-only sprites — use `grinning` reaction instead |

**To add new poses:** Draw a new 3×3 sheet following the same process in [page-mascot SKILL.md](./agents/skills/page-mascot/SKILL.md), ensuring identical cell sizing and body position.
