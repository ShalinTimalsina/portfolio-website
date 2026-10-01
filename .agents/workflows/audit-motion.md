---
name: audit-motion
description: Audit a page's animations against MOTION.md rules.
---

# Workflow: Audit Motion

1. Read [MOTION.md](../../docs/MOTION.md)
2. Invoke `improve-animations` or `review-animations`
3. Verify all entrances use `--ease-out` and exits use `--ease-in`
4. Verify no `linear` or `ease-in-out` on UI elements
5. Verify `prefers-reduced-motion` collapses transforms to instant
6. Implement fixes
7. Complete [MOTION.md checklist](../../docs/MOTION.md#audit-checklist)

