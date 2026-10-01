---
trigger: always_on
---

# Security Rules

Key security rules from [TERMINAL.md](../../docs/TERMINAL.md) and [ADMIN-CMS.md](../../docs/ADMIN-CMS.md):
- No `eval()`, `new Function()`, `dangerouslySetInnerHTML`. Ever.
- Terminal is simulation only — no real shell, no network requests from user input.
- Admin routes protected by Auth.js middleware.
- All user input sanitized (HTML entities escaped).
- Rate limiting on auth endpoints.
- No secrets in client bundles. Check with `NEXT_PUBLIC_` prefix audit.

