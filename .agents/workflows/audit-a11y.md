---
name: audit-a11y
description: Run a comprehensive accessibility audit on a page.
---

# Workflow: Audit A11y

1. Read [HCI-A11Y.md](../../docs/HCI-A11Y.md)
2. Run axe-core via Playwright or browser extension
3. Perform manual keyboard navigation check (Tab order, Focus visible)
4. Verify color contrast (≥ 4.5:1)
5. Verify screen reader announcements for dynamic content (Terminal, Toasts)
6. Implement fixes
7. Ensure zero axe violations

