---
trigger: always_on
---

# Motion Rules

All animation decisions follow [MOTION.md](../../docs/MOTION.md). Key rules:
- Animate ONLY `transform` and `opacity`.
- Default easing: `--ease-out` for entrances, `--ease-in` for exits.
- `ease-in-out` and `linear` are BANNED on UI elements.
- Reduced motion ships WITH the animation, not later.
- ONE memorable hero moment. Everything else is a fast fade-up.
- Hover effects gated behind `@media (hover: hover)`.

