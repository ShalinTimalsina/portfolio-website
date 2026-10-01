# ADMIN-CMS.md — Admin Panel & Data Model

> **Informed by:** `design-taste-frontend`, `emil-design-eng`

## Data Model

### External Articles (Blog)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✅ | Primary key |
| `title` | text | ✅ | |
| `url` | text | ✅ | Link to Medium/Hashnode |
| `publisher` | text | ✅ | e.g., "Medium", "Dev.to" |
| `publishedAt` | timestamp | ✅ | For sorting |
| `createdAt` | timestamp | ✅ | Auto |
| `updatedAt` | timestamp | ✅ | Auto |
| `updatedAt` | timestamp | ✅ | Auto |

### Projects

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✅ | Primary key |
| `slug` | text | ✅ | URL-safe, unique |
| `title` | text | ✅ | |
| `description` | text | ✅ | One-line summary |
| `longDescription` | text | — | Full case study (MDX) |
| `coverImage` | text | — | Screenshot/hero image |
| `techStack` | text[] | ✅ | Technologies used |
| `liveUrl` | text | — | Deployed URL |
| `repoUrl` | text | — | GitHub link |
| `featured` | boolean | ✅ | Show on home page |
| `sortOrder` | integer | ✅ | Display order |
| `publishedAt` | timestamp | — | Null = draft |
| `createdAt` | timestamp | ✅ | Auto |
| `updatedAt` | timestamp | ✅ | Auto |

### Site Content (Key-Value)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✅ | Primary key |
| `key` | text | ✅ | Unique identifier (e.g. `hero.heading`) |
| `value` | text | ✅ | Content string or JSON |
| `type` | enum | ✅ | `text`, `richtext`, `json`, `url` |
| `updatedAt` | timestamp | ✅ | Auto |

**Predefined keys:** `hero.heading`, `hero.subheading`, `hero.cta`, `about.bio`, `about.timeline`, `contact.email`, `contact.linkedin`, `contact.github`, `contact.callLink`, `skills.list`, `terminal.greeting`, `footer.text`

### Media

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✅ | Primary key |
| `filename` | text | ✅ | Original filename |
| `url` | text | ✅ | CDN/storage URL |
| `alt` | text | ✅ | Always required for accessibility |
| `mimeType` | text | ✅ | |
| `sizeBytes` | integer | ✅ | |
| `uploadedAt` | timestamp | ✅ | Auto |

### Messages (Contact Form)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✅ | Primary key |
| `name` | text | ✅ | |
| `email` | text | ✅ | Validated with Zod |
| `message` | text | ✅ | Max 2000 chars |
| `read` | boolean | ✅ | Default false |
| `createdAt` | timestamp | ✅ | Auto |

### Terminal Content

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✅ | Primary key |
| `command` | text | ✅ | Command name |
| `output` | text | ✅ | Response content |
| `updatedAt` | timestamp | ✅ | Auto |

### Mascot Lines

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✅ | Primary key |
| `trigger` | text | ✅ | State name or event |
| `line` | text | ✅ | What the mascot "says" (tooltip) |
| `updatedAt` | timestamp | ✅ | Auto |

## Admin Screens

| Screen | Purpose |
|--------|---------|
| Dashboard | Overview: draft count, message count, pending TODOs |
| Articles | CRUD for external article links |
| Projects | CRUD for projects, drag-to-reorder, featured toggle |
| Site Content | Key-value editor for all site strings |
| Media | Upload, browse, delete media assets |
| Messages | Read/archive incoming contact form submissions |
| Terminal | Edit dynamic terminal command outputs |
| Mascot | Edit mascot tooltip lines per trigger |

## UX Rules

1. **Autosave drafts** every 30 seconds
2. **Optimistic UI** — mutations update the UI immediately, revert on error
3. **MDX preview** — for Projects only (side-by-side editor and rendered preview)
4. **Image upload** — drag-and-drop with progress indicator
5. **Confirmation dialogs** on all destructive actions (delete, unpublish)
6. **Toast notifications** via Sonner for all mutations
7. **No pagination hell** — virtual scrolling for long lists

## Auth & Security

- **Auth.js v5** with a single admin account
- **OAuth provider** (GitHub) or email/password credentials
- **Protected routes:** All `/admin/*` routes require authentication
- **Middleware:** Check session server-side before rendering admin pages
- **CSRF protection:** Built into Auth.js
- **Rate limiting:** On login endpoint (5 attempts / 15 minutes)
- **No public registration.** Admin account is seeded, not created via UI

## Revalidation Flow

1. Admin saves content via the CMS
2. Server action writes to database
3. Server action calls `revalidatePath()` or `revalidateTag()` for affected pages
4. Next.js ISR regenerates the page on next request
5. User sees updated content without a full rebuild

**No manual "publish and rebuild" step.** Content goes live within seconds of saving.
