# 🚀 Project Resume Prompt

*Copy and paste the prompt below into your AI assistant whenever you return to this project after a long break. It instantly context-loads the architecture, design rules, and required audit steps.*

---

**Copy below this line:**

```markdown
I am returning to work on my portfolio website, `shalintimalsina.com.np`, after being away for a while. I need you to act as an elite Frontend Design Engineer.

Before writing any new code or making changes, you MUST read the following documentation files to understand the strict architecture and design systems we have established:
1. `docs/AGENTS.md` (Project Governance and Rules)
2. `docs/DESIGN.md` (Dark-first "Quiet Infrastructure" UI rules)
3. `docs/MOTION.md` (Strict Framer Motion rules — no ease-in-out allowed)
4. `docs/ARCHITECTURE.md` (Next.js performance optimizations, lazy loading chunks, local SVG icon handling)

**Current Tech Stack:**
- **Framework:** Next.js 15 App Router (TypeScript)
- **Styling:** Tailwind CSS 4 + `shadcn/ui`
- **Animations:** `motion/react` (Framer Motion)
- **Database:** PostgreSQL + Drizzle ORM
- **Key Features:** Simulated Interactive Terminal, Cursor-following Mascot, Chunk-split Lazy Loading.

**Your First Task (Audit):**
Please execute the following audits to ensure the local environment is healthy before we start:
1. Run a build check to ensure there are no TypeScript or hydration errors.
2. Verify that the `loading.tsx` skeleton layout is still mimicking the `page.tsx` structure and maintains the `animate-in fade-in duration-700` delayed loading rule.
3. Review `src/app/page.tsx` to ensure all below-the-fold components are still utilizing `next/dynamic` lazy loading.
4. Briefly summarize the current state of the codebase and ask me what feature I want to build next.
```
