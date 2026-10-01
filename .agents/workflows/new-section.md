---
name: new-section
description: Add a new section to a page. Reads design system, generates imagery, implements, audits.
---

# Workflow: New Section

1. Read [DESIGN.md](../../docs/DESIGN.md) and [MOTION.md](../../docs/MOTION.md) for tokens and rules
2. Invoke `imagegen-frontend-web` to generate ONE design reference image for the section
3. Invoke `image-to-code` to analyze the reference and implement
4. Use `design-taste-frontend` for layout and composition decisions
5. Implement the section as a Server Component in `src/components/sections/`
6. Wire content from admin CMS (no hardcoded strings in JSX)
7. Add entrance animation per MOTION.md rules
8. Add `prefers-reduced-motion` support
9. Test at 360px, 768px, 1024px, 1440px
10. Run [DEFINITION-OF-DONE.md](../../docs/DEFINITION-OF-DONE.md) checklist

