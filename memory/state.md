# Long-Term Project Memory

> **Purpose:** This document tracks the exact state of the project across sessions. Read this file first when resuming work to understand what has been built, what is pending, and any architectural decisions made.

## Current Phase: Phase 2 Completed (Ready for Phase 3)

---

### Phase 1: Discover & Plan (COMPLETED)
- **Content Strategy:** Outcome-focused, cut generic filler. Title: "Cloud & DevOps Engineer in the making". Verified AWS SAA certification.
- **Design Tokens:** "Quiet Infrastructure" theme. Near-black (`--bg-primary`), single Emerald/Mint accent (`--accent`). Fonts: Clash Display/Outfit (Heading), Plus Jakarta Sans (Body), JetBrains Mono (Terminal).
- **Blog Strategy:** Decided to use external links (Medium/Hashnode) instead of self-hosted MDX, significantly simplifying the CMS and database schema.
- **Documentation:** All governance rules, workflows, and specs are written and stored in `docs/` and `.agents/`.

### Phase 2: Prototype (COMPLETED)
- **Next.js App:** Scaffolded with Tailwind v4, TypeScript, and ESLint.
- **Bypassed npm Naming Issue:** Scaffolded as `tmp-app` and moved to root, updating `package.json` to `shalin-portfolio`.
- **UI Libraries:** Installed Motion, Phosphor Icons, next-themes, Sonner, clsx, tailwind-merge.
- **Global Styles (`src/app/globals.css`):** Implemented our dark/light tokens and strict reduced-motion rules.
- **Typography (`src/app/layout.tsx`):** Wired up Google Fonts.
- **Hero Section (`src/components/sections/hero.tsx`):** Built with the status chip, positioning line, and layout grid.
- **Terminal Panel (`src/components/terminal/terminal-panel.tsx`):** Built interactive simulation. Added framer-motion `layout="position"` to fix stretching. Dispatches `mascot-action` custom events on key presses and commands to drive mascot reactions. Added easter eggs (`sudo love`, `sudo amaze`, `sudo compliment`).
- **Mascot (`src/components/mascot/mascot-companion.tsx`):** Built cursor-tracking state machine. 
  - **Dynamic Chroma Keying:** Wrote HTML5 `<canvas>` hook to manually despill and strip the green screen (`#02F902`) in-browser on mount (bypassing python/disk limits).
  - **Fluid Physics:** Applied Apple-style soft spring physics (`stiffness: 100`, `damping: 12`), hover/tap interactions, and a subtle breathing loop.
  - **Reactivity:** Listens to `mascot-action` events to trigger 9 distinct expressions mapped on the `reactions.png` sprite sheet, with automatic timeout recovery.
- **Assets:** Mascot assets manually copied to `public/characters/shalin/`.

---

### Phase 3: Build Public Pages & Components (COMPLETED)
1. **Database:** Neon DB PostgreSQL connection string set up in `.env.local` and `drizzle.config.ts` configured to load it via `dotenv`.
2. **Components:** Built the Bento grids for Work (`work.tsx`) and Skills (`skills.tsx`) matching `CONTENT.md` specifications. Built the About section (`about.tsx`) with the timeline.
3. **Cmd+K Search:** Implemented the global command palette using `cmdk` in `command-palette.tsx` and mounted it at `layout.tsx`.
4. **Contact:** Built the contact bento cards and form in `contact.tsx` with a mock loading state simulation.

---

### Phase 3.5: SEO & Final UI Polish (COMPLETED)
1. **SEO Framework:** Integrated `claude-seo` agentic framework into `.agents/skills`.
2. **Technical SEO:** Fixed Semantic HTML in Hero (H1->H2), injected dynamic JSON-LD Person schema (using `next/script` to avoid `dangerouslySetInnerHTML`), added `metadataBase`, OpenGraph tags, and Twitter Cards to `layout.tsx`.
3. **Agentic Crawlers:** Configured `robots.ts` to allow AI search bots (Perplexity, ChatGPT Search) for citability, while blocking raw model-training scrapers. Fixed sitemap URL domain to `shalintimalsina.com.np`.
4. **Terminal Polish:** Refactored Terminal fullscreen mode to use `createPortal` (bypassing layout constraints). Improved argument autocomplete (`sudo`, `theme`) and fixed mascot error handling for invalid commands.

---

### Phase 4: Performance & Visual Polish (COMPLETED)

1. **Terminal Autocomplete Fix:** Fixed bug in `terminal-panel.tsx` where pressing Tab on empty input would repeatedly insert `../`. Now defaults to showing all available commands instead.
2. **Hero Section Animations:** Added staggered entry animations (opacity + translateY) for all hero text/buttons using Motion's `variants` system. Added ambient background glows (two blurred circles with breathing opacity animation) for atmosphere.
3. **Skills Section — Brand Logos:**
   - Integrated high-fidelity SVG brand logos for all tools using CSS masks (`maskImage` / `WebkitMaskImage`).
   - AWS/Amazon logos are NOT available on SimpleIcons (Amazon forced removal). AWS skills (AWS Core, EC2 & S3, VPC & Route53) use Phosphor Duotone icons (`Cloud`, `HardDrives`, `ShareNetwork`) instead.
   - System Design uses `TreeStructure` (Phosphor), Monitoring uses `grafana` (SimpleIcons).
   - Added `whileHover` spring bounce effect and subtle rotation/scale on logo icons.
4. **Skills List Refinement:**
   - Removed redundant "AWS Core" from Daily tier (EC2/S3 and VPC/Route53 already represent AWS).
   - Added "React" to Working tier (critical for ATS/recruiter discoverability).
   - Reorganized Working tier in frontend-to-backend flow: `React → Next.js → TypeScript → Node.js → Python → FastAPI → SQL → Linux → Nginx`.
   - Changed `cursor-pointer` to `cursor-default` on skill pills (they are not clickable links).
5. **Local Asset Rendering (Performance):**
   - Downloaded all 16 SimpleIcons SVGs to `public/icons/` via `scripts/download-icons.mjs`.
   - Updated `skills.tsx` mask URLs from `cdn.simpleicons.org` to local `/icons/*.svg` paths — eliminates external network requests and prevents FOUC.
6. **Skeleton Loading Overhaul:**
   - Rewrote `skeleton.tsx`: replaced banned `ease-in-out` shimmer with `linear` 2-second shimmer sweep. Updated `SkeletonCard` to match real card architecture (`rounded-[24px]`, `bg-muted`, `p-6 md:p-8`, inset double-bezel shadow).
   - Rewrote `loading.tsx`: skeleton now structurally mirrors actual page layout (2-column Hero with terminal placeholder, section title + 3-card grid). Added `animate-in fade-in duration-700` to prevent flash on fast connections.
7. **Lazy Loading (Chunk Splitting):**
   - `page.tsx` now uses `next/dynamic` for all below-the-fold sections (Work, Skills, About, Contact). Hero remains eagerly imported as above-the-fold.
8. **Hydration Fix:** Added `suppressHydrationWarning` to `<body>` tag in `layout.tsx` to prevent Grammarly browser extension from causing React hydration mismatches.
9. **Documentation Updates:**
   - Added "Performance & Loading Architecture" section to `docs/ARCHITECTURE.md` (lazy loading rules, skeleton design rules, asset locality rules).
   - Created `docs/RESUME_PROMPT.md` — a ready-to-copy prompt for context-loading the project after a long break.

**Key Conventions Established This Phase:**
- **Icon Strategy:** SimpleIcons SVGs served locally from `/public/icons/`. AWS-related icons use Phosphor Duotone as fallback. Icon map lives in `skillIcons` object in `skills.tsx`.
- **Skeleton Rule:** `loading.tsx` must always mirror the structure of `page.tsx`. Uses `duration-700` fade-in.
- **Lazy Loading Rule:** Only above-the-fold components (Hero) are statically imported. Everything else uses `next/dynamic`.
- **Shimmer Animation:** Uses `linear` easing (allowed for progress indicators per MOTION.md). Never `ease-in-out`.

---

### Next Up: Phase 5 (Admin Panel & Integration)
1. **Auth.js Setup:** Configure Auth.js v5 for the protected `/admin` routes.
2. **Admin Dashboard:** Build the admin CMS layout based on `docs/ADMIN-CMS.md`.
3. **Database Integration:** Connect the frontend components (Work/Skills) to the PostgreSQL database via Drizzle queries instead of hardcoded data.
4. **Blog Integration:** Wire up external blog links from the admin CMS.
5. **Contact Form Backend:** Connect the contact form to the `/api/contact` route and the messages database table.
