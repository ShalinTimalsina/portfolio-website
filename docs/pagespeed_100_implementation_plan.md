# PageSpeed Insights 100% Optimization Plan
**Target Website:** `https://www.shalintimalsina.com.np/`  
**Objective:** Achieve **100/100** across Performance, Accessibility, Best Practices, and SEO by fixing *only* the exact bottlenecks identified in the Lighthouse audit.

---

## 🚨 STRICT AGENT GUARDRAILS (READ FIRST)
When executing this implementation plan, the AI agent **MUST** obey the following constraints at all times:
1. **Zero Visual Changes:** Do NOT alter colors, typography, spacing, animations, layout geometry, or visual styling. The site must look 100% identical before and after.
2. **Zero Feature Removal:** Do NOT delete the terminal component, typing effects, background effects, floating bottom-right avatar widget, or any text/links.
3. **No Overengineering:** Do NOT rewrite the state management, change the routing architecture, or install third-party npm packages unless strictly necessary for WebP image optimization.
4. **Surgical Edits Only:** Modify only the specific lines of code responsible for the flagged Lighthouse audits in each phase below.
5. **Sequential Execution:** Execute one phase at a time, verify that the build succeeds with zero errors, and proceed to the next phase.

---

## 📊 Current Audit Baseline & Target Metrics

| Category / Metric | Current Value | Target Value | Root Cause Identified in Audit |
| :--- | :--- | :--- | :--- |
| **Performance Score** | `53 / 100` | `100 / 100` | High TBT, Main-thread lockup, 4MB payload, Legacy JS |
| **Accessibility Score** | `96 / 100` | `100 / 100` | Touch targets do not have sufficient size or spacing |
| **Best Practices Score** | `100 / 100` | `100 / 100` | Already passing (Preserve current state) |
| **SEO Score** | `100 / 100` | `100 / 100` | Already passing (Preserve current state) |
| **Total Blocking Time (TBT)** | `16,590 ms` | `< 50 ms` | Continuous main-thread loops/timers during load (20 long tasks) |
| **Main-Thread Work** | `28.9 s` | `< 2.0 s` | Unthrottled JS execution (1.9s JS execution) on initial mount |
| **Largest Contentful Paint (LCP)** | `2.1 s` | `< 1.2 s` | Render-blocking requests & 4,087 KiB network payload |
| **Network Payload** | `4,087 KiB` | `< 500 KiB` | Uncompressed raster images / avatar / unsubsetted fonts |
| **Legacy JavaScript** | `13.7 KiB wasted` | `0 KiB` | Unnecessary ES6+ polyfills in `chunks/2ytz7lzbvsr39.js` |
| **Unused JavaScript** | `45 KiB wasted` | `0 KiB` | Eager loading of below-the-fold and floating widget scripts |
| **Non-Composited Animations** | `1 element` | `0 elements` | CSS animation triggering layout/paint instead of GPU composite |

---

## Phase 1: Accessibility Fix (96 → 100)
### Pinpointed Problem
* **Audit Failed:** `Touch targets do not have sufficient size or spacing.`

### Step-by-Step Implementation
1. **Audit Interactive Elements:** Scan the navigation bar, hero CTA buttons (`Explore Infrastructure`, `View Case Studies`), social links, footer links, and the bottom-right floating avatar button.
2. **Expand Hit Targets Invisibly:**
   * Identify any `<button>`, `<a>`, or interactive icon whose computed bounding box is smaller than `48px × 48px`.
   * Apply `min-w-[48px] min-h-[48px] inline-flex items-center justify-center` (or transparent padding with negative margin compensation if needed to preserve exact visual alignment) so the clickable area is at least `48px × 48px` without changing the visual size of the icon or text.
3. **Enforce Minimum Spacing:**
   * Ensure adjacent interactive elements have at least `8px` (`gap-2`) of non-overlapping space between their clickable boxes.

### Phase 1 Verification Checklist
- [ ] Every `<a>` and `<button>` has a computed hit area $\ge 48\text{px} \times 48\text{px}$.
- [ ] Visual layout and spacing look 100% unchanged.

---

## Phase 2: Eliminate Legacy JavaScript Polyfills (Save 13.7 KiB)
### Pinpointed Problem
* **Audit Failed:** `Legacy JavaScript (Est savings of 14 KiB)` in `...chunks/2ytz7lzbvsr39.js`.
* **Polyfills Flagged:**
  * `Array.prototype.at`
  * `Array.prototype.flat`
  * `Array.prototype.flatMap`
  * `Object.fromEntries`
  * `Object.hasOwn`
  * `String.prototype.trimEnd`
  * `String.prototype.trimStart`

### Step-by-Step Implementation
1. **Update Browser Targets in `package.json`:**
   * Add or update the `browserslist` field in `package.json` so the bundler targets modern baseline browsers that natively support ES2022+:
     ```json
     "browserslist": [
       "last 2 Chrome versions",
       "last 2 Firefox versions",
       "last 2 Safari versions",
       "last 2 Edge versions"
     ]
     ```
2. **Update TypeScript Target in `tsconfig.json`:**
   * Set `"target": "ES2022"` (or `"ESNext"`) and `"module": "ESNext"` under `compilerOptions`.
3. **Check Bundler Config (`next.config.mjs` / `vite.config.ts`):**
   * If using Next.js, ensure no custom Babel config (`.babelrc`) is forcing legacy transpilation, and keep SWC enabled.
   * If using Vite, ensure `build.target` is set to `'es2022'` or `'esnext'`.

### Phase 2 Verification Checklist
- [ ] Production build succeeds without shipping polyfills for `Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries`, `Object.hasOwn`, `trimStart`, or `trimEnd`.

---

## Phase 3: Fix Non-Composited Animation (1 Animated Element → 0)
### Pinpointed Problem
* **Audit Failed:** `Avoid non-composited animations (1 animated element found)`.

### Step-by-Step Implementation
1. **Locate the Flagged Animation:**
   * Search global CSS files (`globals.css`, `index.css`), `tailwind.config.*`, and component styles for `@keyframes`, `transition`, or Framer Motion props.
   * Specifically inspect:
     * The green status indicator dot pulse in the hero badge (`CLOUD & DEVOPS ENGINEER`).
     * The blinking cursor or status dots inside the terminal window.
     * Any floating/bobbing animation on the bottom-right avatar widget or background glow.
2. **Refactor to GPU-Composited Properties Only:**
   * Replace any keyframe or transition animating `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `border-color`, `background-color`, or `box-shadow` with **`transform`** (`translate3d()`, `scale()`) and **`opacity`**.
   * If `box-shadow` or `background-color` is being pulsed, move the static style to a `::before` or `::after` pseudo-element and animate *only* `opacity` and `transform: scale()` on that pseudo-element.

### Phase 3 Verification Checklist
- [ ] All `@keyframes` only mutate `transform` and/or `opacity`.
- [ ] The animation looks visually identical to the original.

---

## Phase 4: Eliminate 28.9s Main-Thread Work, 16,590ms TBT & 45 KiB Unused JS
### Pinpointed Problem
* **Audits Failed:**
  * `Total Blocking Time: 16,590 ms`
  * `Minimize main-thread work: 28.9 s`
  * `Avoid long main-thread tasks: 20 long tasks found`
  * `Reduce JavaScript execution time: 1.9 s`
  * `Reduce unused JavaScript: Est savings of 45 KiB`

### Step-by-Step Implementation
1. **Defer Continuous Timers & Animation Loops Until Idle:**
   * Locate all `useEffect` hooks running `setInterval`, `setTimeout` chains, or `requestAnimationFrame` loops (such as the terminal auto-typing effect, background canvas/grid/particles, or status polling).
   * Render the initial static frame immediately for instant FCP/LCP, and defer starting the continuous animation/typing loop until after the page settles using `requestIdleCallback` (with a `setTimeout(..., 1500)` fallback):
     ```javascript
     const startWhenIdle = (callback) => {
       if ('requestIdleCallback' in window) {
         return window.requestIdleCallback(callback, { timeout: 2000 });
       }
       return window.setTimeout(callback, 1500);
     };
     ```
2. **Pause Offscreen Loops with `IntersectionObserver`:**
   * Wrap any continuous animation (`requestAnimationFrame` or `setInterval`) in an `IntersectionObserver` so it automatically pauses when scrolled out of the viewport and resumes when visible.
   * Ensure every `useEffect` properly clears intervals/timeouts/animation frames on cleanup.
3. **Code-Split / Lazy-Load Non-Critical UI (Fix 45 KiB Unused JS):**
   * Dynamically import (`next/dynamic` with `{ ssr: false }` or `React.lazy` + `<Suspense>`) all below-the-fold sections and the bottom-right floating avatar interactive widget so their JS chunks are not parsed or executed on initial hero load.

### Phase 4 Verification Checklist
- [ ] Zero `requestAnimationFrame` or rapid `setInterval` loops run during the first 1.5 seconds of page load.
- [ ] Below-the-fold sections and the floating avatar widget are lazy-loaded.
- [ ] All terminal typing and visual effects still work seamlessly once initialized.

---

## Phase 5: Fix 4,087 KiB Network Payload & Render-Blocking Requests (LCP 2.1s → <1.2s)
### Pinpointed Problem
* **Audits Failed:**
  * `Avoid enormous network payloads: Total size was 4,087 KiB`
  * `Largest Contentful Paint: 2.1 s`
  * `Render-blocking requests`

### Step-by-Step Implementation
1. **Audit & Compress Heavy Static Assets:**
   * Scan `public/` and `src/assets/` for all files over `100 KiB` (especially the bottom-right 3D avatar PNG/image, project screenshots, or background textures).
   * Convert uncompressed `.png` and `.jpg` files to `.webp` (or `.avif`) resized to their maximum rendered display dimensions (e.g., if the floating avatar renders at `80x80px`, serve a `160x160px` 2x Retina WebP under `15 KiB` instead of a multi-megabyte full-resolution PNG).
2. **Optimize Image Delivery Attributes:**
   * Add explicit `width` and `height` attributes to every `<img>` / `<Image>` element to maintain `0` CLS.
   * Add `loading="lazy"` and `decoding="async"` to the bottom-right avatar image and all below-the-fold images.
3. **Eliminate Render-Blocking Fonts & CSS:**
   * Ensure custom fonts use `font-display: swap` and only load the specific weights used on the page in `.woff2` format.
   * Remove any unused external `@import` font stylesheets in CSS that block the initial render of the hero `<h1>` (`Shalin Timalsina`).

### Phase 5 Verification Checklist
- [ ] Total initial network transfer size is reduced from `4,087 KiB` to `< 500 KiB`.
- [ ] No render-blocking external font requests delay the hero text paint.
- [ ] All images render sharply with zero layout shift.