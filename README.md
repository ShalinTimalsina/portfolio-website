<div align="center">

# Shalin Timalsina — Portfolio & Terminal Playground

**Personal portfolio, interactive terminal, and blog for a Cloud & DevOps engineer.**

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)

[Live Website](https://shalintimalsina.com.np) • [LinkedIn](https://www.linkedin.com/in/shalin-timalsina11) • [GitHub](https://github.com/ShalinTimalsina)

</div>

---

## Overview

This is my personal portfolio website. I built it to showcase my Cloud and DevOps projects, share what I learn, and create a fun experience for visitors.

The site is fast, simple to read, and works smoothly on both computers and mobile phones. It features a working terminal simulator, a quick command search bar, an animated mascot, and a private admin panel to manage content.

---

## Core Features

### 1. Simulated Linux Terminal
A built-in command line that runs directly in your browser:
* **File commands:** `ls`, `cat`, `cd`, `pwd`, `tree`, `clear`, `whoami`.
* **System commands:** `theme dark`, `theme light`, `curl`, `help`.
* **Useful features:** Command history using the up and down arrow keys (`↑`/`↓`), tab auto-complete, colored text output, and a full-screen view.

### 2. Fast Command Search (`Ctrl + K`)
A quick search bar to jump anywhere on the site:
* **On computers:** Press `Ctrl + K` (or `Cmd + K` on Mac) to search and navigate with your keyboard.
* **On phones:** Tap the search icon to open. It uses finger-friendly buttons and simple touch controls.
* **Smooth navigation:** Selecting a page scrolls directly to that section without cluttering your screen.

### 3. Interactive Mascot Companion
A small chibi character that reacts to how you use the site:
* **Follows your cursor:** Turns its head to look at your mouse pointer in 8 directions.
* **Reacts to actions:** Shows funny comments and expressions when you toggle themes, open the terminal, or send a message.
* **Fast and light:** Built with optimized images so it never slows down page loading.

### 4. Honest Skills List
My skills are grouped by how often I use them:
* **Daily:** Tools I use every day (Linux, Docker, AWS, Next.js, TypeScript).
* **Working:** Tools I know well and use in my projects (Terraform, Kubernetes, Python, PostgreSQL, CI/CD).
* **Learning:** Topics and tools I am currently studying (Cloud Architecture, SRE, Rust).

### 5. Admin Dashboard
A private area where I can manage site content:
* **Secure login:** Protected with password authentication using Auth.js.
* **Manage content:** Add new projects, update terminal commands, and read messages sent from the contact form.
* **Database:** Saves all data in a serverless PostgreSQL database using Drizzle ORM.

---

## Tech Stack

| Part | Tool | Why It Was Used |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16** | Fast page loading and server-side rendering |
| **Language** | **TypeScript** | Catch errors early with strict type safety |
| **Styling** | **Tailwind CSS 4** | Clean, modern design with dark mode support |
| **Animations** | **Motion (Framer)** | Smooth transitions and button press effects |
| **Database** | **PostgreSQL (Neon)** | Reliable cloud database |
| **Database Tool** | **Drizzle ORM** | Simple and safe database queries |
| **Icons** | **Phosphor Icons** | Clean and lightweight icons |
| **Validation** | **Zod** | Checks form inputs before saving |

---

## Project Structure

```text
├── characters/             # Source art and sprite sheets for the mascot
├── docs/                   # Design notes, terminal specs, and guidelines
├── public/                 # Static files (WebP sprites, resume PDF, icons)
├── scripts/                # Helper scripts (sprite conversion, DB checks)
└── src/
    ├── app/                # Next.js App Router
    │   ├── admin/          # Admin dashboard (projects, messages, settings)
    │   ├── api/            # Backend endpoints (contact form, authentication)
    │   ├── globals.css     # Global styles and Tailwind tokens
    │   ├── layout.tsx      # Root layout, theme setup, and header actions
    │   └── page.tsx        # Main portfolio home page
    ├── components/         # UI components
    │   ├── admin/          # Admin sidebar and controls
    │   ├── mascot/         # Chibi mascot canvas and speech bubbles
    │   ├── sections/       # Hero, Work, Skills, About, Contact
    │   ├── shared/         # Search bar, theme button, header actions
    │   └── terminal/       # Interactive terminal window and tabs
    ├── db/                 # Database schema and PostgreSQL connection
    ├── lib/                # Logic and utilities
    │   ├── terminal/       # Simulated filesystem and Unix commands
    │   └── utils.ts        # Helper functions
    └── auth.ts             # Admin authentication setup (Auth.js)
```

---

## Getting Started

Follow these steps to run the project on your computer.

### Prerequisites
* **Node.js** version 20 or higher installed
* **npm** or **pnpm** installed
* A free **PostgreSQL database** (like [Neon](https://neon.tech))

### 1. Download the code
```bash
git clone https://github.com/ShalinTimalsina/portfolio-website.git
cd portfolio-website
```

### 2. Set up environment variables
Create a new file named `.env.local` in the root folder and add your settings:
```env
# Database connection string
DATABASE_URL="postgresql://user:password@your-db.neon.tech/neondb?sslmode=require"

# Secret key for admin login
AUTH_SECRET="your-random-secret-key"
ADMIN_PASSWORD_HASH="your-hashed-password"

# Site address
NEXT_PUBLIC_SITE_URL="https://shalintimalsina.com.np"
```

### 3. Install packages
```bash
npm install
```

### 4. Set up the database
Push the database tables to your PostgreSQL database:
```bash
npm run db:push
```

### 5. Start the website
Run the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser to see the site.

---

## Design and Quality

* **Mobile Friendly:** Looks clean on all screen sizes, from small phones to large desktop screens.
* **Easy to Read:** Uses clear fonts and strong color contrast for readability.
* **Fast:** Uses modern image formats and clean code so pages open quickly.
* **Dark and Light Mode:** You can toggle between dark and light themes anytime.

---

## Useful Commands

| Command | What It Does |
| :--- | :--- |
| `npm run dev` | Starts the website on your computer |
| `npm run build` | Creates a production build |
| `npm run start` | Runs the production build |
| `npm run lint` | Checks the code for syntax issues |
| `npm run db:push` | Updates your database tables |
| `npm run db:studio` | Opens a web page to view and edit your database |

---

## Author

**Shalin Timalsina**  
*Cloud & DevOps Engineer in the making*

* **Website:** [shalintimalsina.com.np](https://shalintimalsina.com.np)
* **GitHub:** [@ShalinTimalsina](https://github.com/ShalinTimalsina)
* **LinkedIn:** [Shalin Timalsina](https://www.linkedin.com/in/shalin-timalsina11)
* **Email:** [salintimalsina01@gmail.com](mailto:salintimalsina01@gmail.com)

---

## License

This project is licensed under the [MIT License](LICENSE).
