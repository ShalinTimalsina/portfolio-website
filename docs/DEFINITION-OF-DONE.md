# DEFINITION-OF-DONE.md — Task Completion Checklist

> Every PR and every task must pass ALL of these before it can be considered done.

## Checklist

| # | Category | Check | Command / Method | Pass |
|---|----------|-------|-----------------|------|
| 1 | **Lint** | ESLint passes with zero warnings | `pnpm lint` | ☐ |
| 2 | **Typecheck** | TypeScript compiles with no errors | `pnpm typecheck` | ☐ |
| 3 | **Tests** | All unit/integration tests pass | `pnpm test` | ☐ |
| 4 | **Build** | Production build succeeds | `pnpm build` | ☐ |
| 5 | **Lighthouse** | All scores ≥ 95 | Lighthouse CI or manual | ☐ |
| 6 | **Accessibility** | Zero axe-core violations | `pnpm test:e2e` (axe integration) or browser extension | ☐ |
| 7 | **Banned patterns** | No items from [DESIGN.md banned list](./DESIGN.md#banned-cheap-ai-patterns) present | Visual review | ☐ |
| 8 | **Motion audit** | All items on [MOTION.md checklist](./MOTION.md#audit-checklist) pass | Code review | ☐ |
| 9 | **Reduced motion** | `prefers-reduced-motion: reduce` — transforms collapse, fades OK, mascot static | Manual toggle in OS settings | ☐ |
| 10 | **Responsive** | Tested at 360px, 768px, 1024px, 1440px, 1920px | Browser DevTools or real devices | ☐ |
| 11 | **No hardcoded content** | User-facing text comes from admin CMS or content files, not JSX literals | Code review — search for English strings in JSX | ☐ |
| 12 | **Dark + Light** | Both themes tested, no broken contrast or invisible elements | Toggle theme manually | ☐ |
| 13 | **Keyboard nav** | Complete the flow using only keyboard | Manual test | ☐ |
| 14 | **No TODOs in prod** | No `TODO(Shalin)` markers visible in production build | `grep -r "TODO(" src/` | ☐ |
| 15 | **Focus visible** | Every interactive element has a visible focus ring | Tab through the page | ☐ |

## When to Skip

- Items 3/6 can be skipped for pure-docs or config-only changes
- Item 5 can be skipped if no UI was changed
- Item 11 can be skipped for admin-only pages (admin content is hardcoded by design)
- Nothing else is skippable
