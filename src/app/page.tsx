import dynamic from "next/dynamic"

// Eagerly load Hero as it is above the fold
import { HeroSection } from "@/components/sections/hero"

// Lazy load below-the-fold sections to split JS chunks and improve initial TTI (Time to Interactive)
const WorkSection = dynamic(() => import("@/components/sections/work").then(mod => mod.WorkSection))
const SkillsSection = dynamic(() => import("@/components/sections/skills").then(mod => mod.SkillsSection))
const AboutSection = dynamic(() => import("@/components/sections/about").then(mod => mod.AboutSection))
const ContactSection = dynamic(() => import("@/components/sections/contact").then(mod => mod.ContactSection))

import { db } from "@/db"
import { projects } from "@/db/schema"
import { eq, desc, isNotNull } from "drizzle-orm"

export default async function Home() {
  // Only fetch published & featured projects, sorted by sortOrder
  const featuredProjects = await db
    .select()
    .from(projects)
    .where(isNotNull(projects.publishedAt)) // Must be published
    // We can filter by featured if we want, or just show top 4
    .orderBy(desc(projects.sortOrder), desc(projects.createdAt))
    .limit(4);

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <WorkSection projects={featuredProjects} />
      <SkillsSection />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
