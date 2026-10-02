# Shalin Timalsina — Portfolio

A premium portfolio, living résumé, and interactive playground for a Cloud & DevOps engineer. Designed to feel like infrastructure itself: precise, reliable, and beautifully engineered.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui + Radix primitives
- **Motion:** Motion (formerly Framer Motion)
- **Database:** PostgreSQL + Drizzle ORM
- **Content:** MDX
- **Validation:** Zod
- **Auth:** Auth.js v5

## Features
- **Interactive Terminal:** An integrated, mouse-free simulated terminal (try `help`, `theme dark`, `alias`).
- **Command Palette:** Global search and navigation via `Cmd/Ctrl + K`.
- **Dynamic Mascot:** A custom cursor-tracking Shalin chibi mascot that reacts to interactions.
- **Premium Design System:** Dark-first, high-end visual design with subtle micro-animations and physics-based interactions.
- **MDX Blog & Admin Panel:** Built-in CMS for managing content and messages.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

3. **Database Operations (Drizzle):**
   - Push schema to DB: `npm run db:push`
   - Open Drizzle Studio: `npm run db:studio`

## Architecture Highlights
- Fully responsive from 360px up to 1920px.
- 100/100 Lighthouse performance and accessibility scores.
- Adheres to WCAG 2.2 AA compliance standards.
- Custom WebP-based sprite animation engine for the mascot.
