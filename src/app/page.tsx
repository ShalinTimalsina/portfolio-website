import { HeroSection } from "@/components/sections/hero"
import { WorkSection } from "@/components/sections/work"
import { SkillsSection } from "@/components/sections/skills"
import { AboutSection } from "@/components/sections/about"
import { ContactSection } from "@/components/sections/contact"
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
