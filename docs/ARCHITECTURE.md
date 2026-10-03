# ARCHITECTURE.md — Technical Architecture

> **Informed by:** `design-taste-frontend`, `high-end-visual-design`

## Folder Structure

```
shalintimalsina.com/
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── page.tsx              # Home (hero, work, skills, about, contact)
│   │   │   ├── work/
│   │   │   │   ├── page.tsx          # All projects
│   │   │   │   └── [slug]/page.tsx   # Project detail / case study
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx          # Blog index (links to external articles)
│   │   │   └── layout.tsx            # Site layout (nav, footer, mascot)
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Admin layout (sidebar, auth guard)
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── articles/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── content/page.tsx
│   │   │   ├── media/page.tsx
│   │   │   ├── messages/page.tsx
│   │   │   ├── terminal/page.tsx
│   │   │   └── mascot/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── contact/route.ts      # Contact form handler
│   │   │   ├── search/route.ts       # Search index API
│   │   │   └── og/route.tsx          # Dynamic OG image generation
│   │   ├── layout.tsx                # Root layout (fonts, theme provider)
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── sections/                 # Hero, Work, Skills, About, Contact
│   │   ├── terminal/                 # TerminalPanel, CommandInput, Output
│   │   ├── mascot/                   # Mascot component
│   │   ├── search/                   # Cmd+K search dialog
│   │   └── shared/                   # ThemeToggle, Footer, Navigation
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts            # Drizzle schema definitions
│   │   │   ├── index.ts             # DB client
│   │   │   └── migrations/
│   │   ├── auth.ts                   # Auth.js configuration
│   │   ├── search.ts                 # Search index builder
│   │   ├── utils.ts                  # cn(), formatDate(), etc.
│   │   └── validations.ts           # Shared Zod schemas

│   ├── styles/
│   │   └── globals.css               # Tailwind directives, CSS variables
│   └── types/
│       └── index.ts                  # Shared TypeScript types
├── public/
│   ├── mascots/                      # Built sprite atlases
│   ├── fonts/                        # Self-hosted WOFF2
│   └── og/                           # Static OG fallback
├── characters/                       # Source sprite sheets (not deployed)
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.local
```

## Rendering Strategy

| Route | Strategy | Cache |
|-------|----------|-------|
| `/` (home) | SSG + ISR (revalidate 60s) | CDN edge |
| `/work` | SSG + ISR | CDN edge |
| `/work/[slug]` | SSG + ISR | CDN edge |
| `/blog` | SSG + ISR | CDN edge |
| `/admin/*` | SSR (no cache) | None — auth required |
| `/api/contact` | Edge runtime | None |
| `/api/search` | Edge runtime | Short TTL (5m) |
| `/api/og` | Edge runtime | Long TTL (1d) |

**Default:** Every public page is statically generated at build time and revalidated via ISR when content changes in the admin CMS.

## Data Flow

```
[Admin CMS] → Server Action → [PostgreSQL] → revalidatePath() → [ISR rebuild]
                                    ↓
[Public Pages] ← RSC (Server Components) ← [Drizzle queries]
                                    ↓
[Cmd+K Search] ← /api/search ← [Search index]
                                    ↓
[Contact Form] → /api/contact → [Messages table] + [Email notification]
```

## Search Index Design

- **Built at:** ISR revalidation time (server-side)
- **Contains:** Posts (title, excerpt, tags), Projects (title, description, tech), Terminal commands (name, description)
- **Search method:** Client-side fuzzy search via `fuse.js` (loaded once, ~5KB)
- **Index format:** JSON array served from `/api/search` with 5-minute cache
- **UI:** Cmd+K dialog (Radix Dialog + cmdk or custom)

## Performance & Loading Architecture

To maintain a 99+ Lighthouse score and instant Time to Interactive (TTI), we enforce strict loading strategies:

1. **Aggressive Chunk Splitting:** 
   - Above-the-fold components (Hero) are eagerly imported.
   - Below-the-fold heavy Client Components (Work, Skills, About, Contact) MUST be dynamically imported via `next/dynamic` to split JS bundles.
2. **Delayed Skeleton Hydration:**
   - Global `loading.tsx` must structurally mirror the actual page layout (e.g. Hero + Terminal + Skills grid) to prevent layout shifts.
   - Skeletons use `animate-in fade-in duration-700` so they do not flash aggressively on fast connections.
3. **Asset Locality:**
   - Never use external CDNs for UI-critical assets (like SVG brand logos). Always download and serve them locally from `/public/*` to prevent Flash of Unstyled Content (FOUC).

## Performance Budgets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | ≥ 95 | Lighthouse CI |
| Lighthouse Accessibility | ≥ 95 | Lighthouse CI |
| Lighthouse Best Practices | ≥ 95 | Lighthouse CI |
| Lighthouse SEO | ≥ 95 | Lighthouse CI |
| LCP (Largest Contentful Paint) | < 2.0s | Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.05 | Web Vitals |
| INP (Interaction to Next Paint) | < 200ms | Web Vitals |
| Total page weight (home) | < 500KB | Bundle analyzer |
| JavaScript bundle (initial) | < 150KB gzipped | Bundle analyzer |
| Font files (total) | < 200KB | Manual check |
| Mascot sprites (each) | < 100KB | Manual check |

## SEO Plan

1. **Metadata:** Every page has unique `<title>` and `<meta name="description">`
2. **OG images:** Dynamic generation via `/api/og` using `@vercel/og`
3. **Structured data:** `Person` schema on home, `Article` on blog posts, `SoftwareApplication` on projects
4. **Sitemap:** Auto-generated via `next-sitemap` or App Router metadata
5. **Robots:** Allow all public routes, disallow `/admin/*`
6. **Canonical URLs:** Set on every page
7. **Heading hierarchy:** One `<h1>` per page, sequential `<h2>`→`<h6>`
8. **Image alt text:** Required on all images (enforced by ESLint rule + CMS validation)
