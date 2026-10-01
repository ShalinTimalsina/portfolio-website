# TERMINAL.md — Interactive Simulated Terminal

> **Informed by:** `design-taste-frontend`, `emil-design-eng`

## Purpose

A fully client-side terminal emulator that lets visitors explore Shalin's portfolio through a familiar CLI metaphor. It is a **toy** — an easter egg and engagement tool — not a real shell.

## Security Rules (Non-Negotiable)

1. **No real shell access.** The terminal is a React component with a command registry. It does not execute code.
2. **No `eval()`.** No `new Function()`. No `Function.constructor`.
3. **No `dangerouslySetInnerHTML`.** Terminal output is rendered via React components, never injected HTML.
4. **No network requests from user input.** Commands do not `fetch()` based on user-typed arguments.
5. **No `localStorage`/`sessionStorage` writes from user input.** History is stored in React state only.
6. **Input is sanitized** before display. HTML entities are escaped.

## Command Registry Spec

```typescript
interface TerminalCommand {
  name: string;                    // e.g. "help"
  aliases?: string[];              // e.g. ["h", "?"]
  description: string;             // Shown in `help` output
  category: "navigation" | "info" | "fun" | "admin";
  usage?: string;                  // e.g. "cat <filename>"
  execute: (args: string[]) => TerminalOutput;
}

interface TerminalOutput {
  type: "text" | "table" | "link" | "error" | "ascii" | "component";
  content: string | React.ReactNode;
}
```

Commands are registered in a flat array. Adding a command means adding one object — no routing, no middleware.

## Command List

| Command | Aliases | Category | Output |
|---------|---------|----------|--------|
| `help` | `h`, `?` | navigation | List all commands with descriptions |
| `help <cmd>` | — | navigation | Show usage for specific command |
| `about` | `whoami` | info | Bio paragraph + positioning line |
| `skills` | — | info | Skill tiers table (Daily/Working/Learning) |
| `projects` | `work`, `ls projects` | info | Project list with one-line descriptions |
| `cat <project>` | — | info | Detailed project view |
| `contact` | `email` | info | Contact methods with clickable links |
| `resume` | `cv` | info | Opens résumé PDF in new tab |
| `blog` | `posts` | info | Recent blog post titles with dates |
| `cat <post>` | — | info | Blog post preview (first 3 lines + link) |
| `github` | `gh` | info | Opens GitHub profile in new tab |
| `linkedin` | `li` | info | Opens LinkedIn profile in new tab |
| `clear` | `cls` | navigation | Clears terminal output |
| `history` | — | navigation | Shows command history |
| `theme` | — | fun | Toggles dark/light theme |
| `mascot` | — | fun | Triggers mascot wave animation |
| `neofetch` | — | fun | System info card (name, stack, uptime) |
| `matrix` | — | fun | Brief matrix rain effect (3 seconds max) |
| `sudo` | — | fun | "Nice try." |
| `exit` | `quit` | navigation | Closes terminal panel |

## Virtual Filesystem

```
~/
├── about.md
├── resume.pdf
├── projects/
│   ├── cloudway-lms.md
│   ├── nrb-redesign.md
│   ├── terraform-cicd.md
│   ├── vote-app.md
│   └── ...
├── blog/
│   └── (dynamic from CMS)
└── .env
    └── "Nice try. 😏"
```

- `ls` lists current directory
- `cd` changes directory
- `cat` reads a file
- `pwd` prints working directory
- Paths are virtual — no real filesystem access

## Autocomplete Behavior

- **Tab** autocompletes the current command or filename
- If multiple matches, show all options (like bash)
- Autocomplete is case-insensitive
- Only registered commands and virtual filenames are suggested

## History Behavior

- **Up/Down arrows** cycle through command history
- History persists for the session (React state, not localStorage)
- Maximum 50 entries
- Duplicate consecutive commands are collapsed

## Visual Design

- Font: `--font-mono` (JetBrains Mono)
- Prompt: `shalin@portfolio:~$` in `--accent` color
- Output: `--fg-primary`
- Errors: `--destructive`
- Background: `--bg-primary` with slight transparency when overlaid
- Border: `--border-default`
- Corner radius: `--radius-lg`

## Accessibility

- Terminal container has `role="log"` and `aria-live="polite"`
- Input has `aria-label="Terminal input"`
- Output is announced to screen readers as it appears
- Keyboard: all navigation via standard key bindings (Tab, Up, Down, Enter, Escape)
- Escape closes the terminal if it's in an overlay/modal

## Admin-Editable Content

The following terminal content is managed via the admin CMS:
- Project list and descriptions (from projects table)
- Blog post titles and previews (from posts table)
- `about` command output (from site content table)
- `skills` command output (from site content table)
- `contact` command output (from site content table)

Static commands (`help`, `clear`, `history`, `theme`, `neofetch`, `sudo`) are hardcoded.
