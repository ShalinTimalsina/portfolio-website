import { HeroSection } from "@/components/sections/hero"
import { WorkSection } from "@/components/sections/work"
import { SkillsSection } from "@/components/sections/skills"
import { ContactSection } from "@/components/sections/contact"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <WorkSection />
      <SkillsSection />
      <ContactSection />
    </main>
  )
}
