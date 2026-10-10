import dynamic from "next/dynamic"

// Eagerly load Hero as it is above the fold
import { HeroSection } from "@/components/sections/hero"

// Lazy load below-the-fold sections to split JS chunks and improve initial TTI (Time to Interactive)
const WorkSection = dynamic(() => import("@/components/sections/work").then(mod => mod.WorkSection))
const SkillsSection = dynamic(() => import("@/components/sections/skills").then(mod => mod.SkillsSection))
const AboutSection = dynamic(() => import("@/components/sections/about").then(mod => mod.AboutSection))
const ContactSection = dynamic(() => import("@/components/sections/contact").then(mod => mod.ContactSection))

import { db } from "@/db"
import { projects, siteContent, terminalContent } from "@/db/schema"
import { eq, desc, isNotNull } from "drizzle-orm"

export default async function Home() {
  // Only fetch published & featured projects, sorted by sortOrder
  const featuredProjects = await db
    .select()
    .from(projects)
    .where(isNotNull(projects.publishedAt)) // Must be published
    .orderBy(desc(projects.sortOrder), desc(projects.createdAt))
    .limit(4);

  // Fetch all site content
  const contentRows = await db.select().from(siteContent);
  const content = contentRows.reduce((acc, curr) => {
    try {
      acc[curr.key] = curr.type === 'json' ? JSON.parse(curr.value) : curr.value;
    } catch (e) {
      acc[curr.key] = curr.value; // Fallback
    }
    return acc;
  }, {} as Record<string, any>);

  // Fetch custom terminal commands
  const customTerminalCommands = await db.select().from(terminalContent);

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection content={content} customCommands={customTerminalCommands} />
      <WorkSection projects={featuredProjects} content={content} />
      <SkillsSection content={content} />
      <AboutSection content={content} />
      <ContactSection content={content} />
      
      <footer className="py-8">
      </footer>
    </main>
  )
}
