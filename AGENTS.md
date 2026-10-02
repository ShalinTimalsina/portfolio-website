# AGENTS.md — Project Governance

> **Informed by:** `design-taste-frontend`, `high-end-visual-design`, `emil-design-eng`, `animate`, `page-mascot`

## Goal

Build **shalintimalsina.com.np** — a premium portfolio for a Cloud & DevOps engineer in the making that doubles as a living résumé, blog, and interactive playground. The site must feel like infrastructure itself: precise, quiet, reliable, beautifully engineered.

## Feature List

| # | Feature | Status |
|---|---------|--------|
| 1 | Hero with positioning line, mascot, and single CTA | Planned |
| 2 | Work / Case Studies (filterable, detail pages) | Planned |
| 3 | Skills grid (Daily / Working / Learning tiers) | Planned |
| 4 | About section (photo, bio, timeline) | Planned |
| 5 | Blog (MDX, syntax highlighting, reading time) | Planned |
| 6 | Contact form + CTAs (email, LinkedIn, GitHub, call link) | Planned |
| 7 | Cmd/Ctrl+K search (posts, projects, commands) | Planned |
| 8 | Interactive simulated terminal | Planned |
| 9 | Cursor-following mascot (Shalin chibi) | Planned |
| 10 | Admin CMS (posts, projects, site content, media) | Planned |

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 App Router | RSC, ISR, API routes, middleware |
| Language | TypeScript (strict) | Non-negotiable |
| Styling | Tailwind CSS 4 | Utility-first, design-token friendly |
| Components | shadcn/ui + Radix primitives | Accessible, unstyled, composable |
| Motion | Motion (formerly Framer Motion) | Layout animations, springs, gestures |
| Database | PostgreSQL + Drizzle ORM | Type-safe, migration-friendly |
| Content | MDX + next-mdx-remote | Blog posts, rich content |
| Validation | Zod | Runtime schema validation |
| Auth | Auth.js v5 | Admin-only, OAuth or credentials |
| Hosting | Vercel | Edge, ISR, analytics |

## Folder Map

```
src/
├── app/                  # App Router pages and layouts
│   ├── (site)/           # Public-facing routes
│   ├── admin/            # Protected admin routes
│   └── api/              # API route handlers
├── components/
│   ├── ui/               # shadcn/ui primitives (Button, Dialog, etc.)
│   ├── sections/         # Page sections (Hero, Work, About, etc.)
│   ├── terminal/         # Terminal emulator components
│   └── mascot/           # Mascot component and sprites
├── lib/                  # Shared utilities, db client, auth config
├── content/              # MDX blog posts (filesystem)
├── styles/               # Global CSS, Tailwind config extensions
└── types/                # Shared TypeScript types
public/
├── mascots/              # Built mascot sprite atlases
├── fonts/                # Self-hosted font files
└── og/                   # Generated OG images
characters/               # Source mascot sprite sheets (not deployed)
```

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint + Prettier check |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest unit + integration |
| `pnpm test:e2e` | Playwright E2E |
| `pnpm db:push` | Push Drizzle schema to DB |
| `pnpm db:studio` | Open Drizzle Studio |

## Coding Conventions

1. **One component per file.** Named export matching filename.
2. **Server Components by default.** Add `"use client"` only when hooks/events are needed.
3. **Zod schemas co-located with forms.** Schema file lives next to the form component.
4. **No barrel exports** (`index.ts` re-exports). Import directly.
5. **Absolute imports** via `@/` alias.
6. **Error boundaries** wrap every route segment.
7. **All user-facing strings** come from admin CMS or content files — never hardcoded in JSX.

## NEVER Do

- ❌ Use `any` or `as unknown as T` — fix the type
- ❌ Use `dangerouslySetInnerHTML` — ever (see [TERMINAL.md](./docs/TERMINAL.md))
- ❌ Animate `width`, `height`, `top`, `left` — transform/opacity only (see [MOTION.md](./docs/MOTION.md))
- ❌ Use `window.addEventListener('scroll')` — use IntersectionObserver
- ❌ Use `ease-in-out` or `linear` as default — see motion tokens
- ❌ Hardcode content that belongs in admin — see [ADMIN-CMS.md](./docs/ADMIN-CMS.md)
- ❌ Ship a feature without reduced-motion support
- ❌ Use generic fonts (Inter, Roboto, Arial, Open Sans) — see [DESIGN.md](./docs/DESIGN.md)
- ❌ Place `backdrop-blur` on scrolling containers
- ❌ Skip the Definition of Done checklist — see [DEFINITION-OF-DONE.md](./docs/DEFINITION-OF-DONE.md)

## Skill Routing Table

| Task Type | Invoke Skill |
|-----------|-------------|
| Build/add an animation | `animate` |
| Audit existing animations | `improve-animations` |
| Review a motion diff | `review-animations` |
| Find animation opportunities | `find-animation-opportunities` |
| Design a new section/page | `design-taste-frontend` + `high-end-visual-design` |
| Redesign existing component | `redesign-existing-projects` |
| Apple-style fluid interaction | `apple-design` |
| Generate section design image | `imagegen-frontend-web` |
| Image → code implementation | `image-to-code` |
| Build/debug the mascot | `page-mascot` |
| Add toast notifications | `ask-sonner` |
| Mobile-native web feel | `mobile-native` |
| Polish pass (general) | `emil-design-eng` |
| Brand identity / logo work | `brandkit` |
| Minimalist aesthetic | `minimalist-ui` |
| Brutalist aesthetic | `industrial-brutalist-ui` |
| Design system for Stitch | `stitch-design-taste` |

## Linked Documents

- [DESIGN.md](./docs/DESIGN.md) — Visual design system and tokens
- [MOTION.md](./docs/MOTION.md) — Animation rules, durations, easings
- [CONTENT.md](./docs/CONTENT.md) — Copy, tone, verified facts
- [HCI-A11Y.md](./docs/HCI-A11Y.md) — UX heuristics and accessibility
- [TERMINAL.md](./docs/TERMINAL.md) — Simulated terminal spec
- [MASCOT.md](./docs/MASCOT.md) — Cursor-following mascot spec
- [ADMIN-CMS.md](./docs/ADMIN-CMS.md) — Admin panel and data model
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Rendering, data flow, performance
- [DEFINITION-OF-DONE.md](./docs/DEFINITION-OF-DONE.md) — Task completion checklist
- [CREDITS.md](./docs/CREDITS.md) — Attribution and licenses

