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

### Next Up: Phase 4 (Admin Panel & Integration)
1. **Auth.js Setup:** Configure Auth.js v5 for the protected `/admin` routes.
2. **Admin Dashboard:** Build the admin CMS layout based on `docs/ADMIN-CMS.md`.
3. **Database Integration:** Connect the frontend components (Work/Skills) to the PostgreSQL database via Drizzle queries instead of hardcoded data.
