"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { siteContent } from "@/db/schema"
import { revalidatePath } from "next/cache"

const defaultContent = [
  { key: "hero.statusChip", value: "Open to Opportunities", type: "text" },
  { key: "hero.heading", value: "Shalin Timalsina.", type: "text" },
  { key: "hero.subheading", value: "Cloud & DevOps Engineer in the making building resilient infrastructure and the interfaces to understand it.", type: "text" },
  { key: "hero.cta", value: "Let's build together", type: "text" },
  { key: "hero.secondaryCta", value: "View Case Studies", type: "text" },
  
  { key: "work.chip", value: "Selected Work", type: "text" },
  { key: "work.heading", value: "Infrastructure & Code.", type: "text" },
  
  { key: "skills.chip", value: "Skills & Stack", type: "text" },
  { key: "skills.heading", value: "Tools of the Trade.", type: "text" },
  { key: "skills.list", value: JSON.stringify([
    { title: "Daily", description: "Active personal projects and core stack.", skills: ["Terraform", "Docker", "EC2 & S3", "VPC & Route53", "Git", "GitHub Actions"] },
    { title: "Working", description: "Competent, have shipped projects with.", skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "FastAPI", "SQL", "Linux", "Nginx"] },
    { title: "Learning", description: "Actively studying, not yet shipped.", skills: ["Ansible", "Kubernetes", "System Design", "Monitoring"] }
  ], null, 2), type: "json" },
  
  { key: "about.chip", value: "About", type: "text" },
  { key: "about.heading", value: "Behind the Terminal.", type: "text" },
  { key: "about.location", value: "Kathmandu, Nepal", type: "text" },
  { key: "about.bio", value: "I build cloud infrastructure and the tooling around it. My days revolve around Terraform plans, Docker containers, and AWS services — turning architecture diagrams into running systems.\n\nI earned the AWS Solutions Architect – Associate certification to validate what I was already doing: designing secure, scalable, cost-optimized architectures. Right now I am pursuing my BSc IT at Techspire College while shipping real projects — from CI/CD pipelines with GitHub Actions to Kubernetes-orchestrated microservices.\n\nWhen I am not staring at YAML, I am probably debugging a Dockerfile or automating something that should have been automated months ago.", type: "richtext" },
  { key: "about.links", value: JSON.stringify([
    { label: "GitHub", href: "https://github.com/ShalinTimalsina", icon: "GithubLogo", mascotState: "success", mascotMessage: "Show me the code!" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/shalin-timalsina11", icon: "LinkedinLogo", mascotState: "heart", mascotMessage: "Let's connect!" },
    { label: "salintimalsina01@gmail.com", href: "mailto:salintimalsina01@gmail.com", icon: "EnvelopeSimple", mascotState: "wave", mascotMessage: "Write me an email!" }
  ], null, 2), type: "json" },
  { key: "about.stats", value: JSON.stringify([
    { value: "22+", label: "Public Repos" },
    { value: "AWS", label: "Certified" },
    { value: "5+", label: "Stacks Shipped" }
  ], null, 2), type: "json" },
  { key: "about.timeline", value: JSON.stringify([
    { year: "2024", title: "AWS Solutions Architect – Associate", subtitle: "Amazon Web Services", type: "cert" },
    { year: "2024", title: "Docker Certified", subtitle: "Kode Kloud", type: "cert" },
    { year: "2024", title: "GitHub Foundations", subtitle: "Datacamp", type: "cert" },
    { year: "Present", title: "BSc IT", subtitle: "Techspire College, Kathmandu", type: "education" },
    { year: "Completed", title: "SEE & +2", subtitle: "Skyrider English Boarding School", type: "education" }
  ], null, 2), type: "json" },
  
  { key: "contact.chip", value: "Contact", type: "text" },
  { key: "contact.heading", value: "Let's build together.", type: "text" },
  { key: "contact.description", value: "I'm currently open to new opportunities...", type: "text" },
  { key: "contact.email", value: "salintimalsina01@gmail.com", type: "text" },
  { key: "contact.phone", value: "+977-9862448516", type: "text" },
  { key: "contact.github", value: "https://github.com/ShalinTimalsina", type: "url" },
  { key: "contact.linkedin", value: "https://www.linkedin.com/in/shalin-timalsina11", type: "url" },
  
  { key: "terminal.greeting", value: "Welcome to ShalinOS v3.0. Type 'help' to see available commands.", type: "text" }
]

export async function seedSiteContent() {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    for (const item of defaultContent) {
      await db.insert(siteContent).values(item).onConflictDoNothing({ target: siteContent.key })
    }
    revalidatePath("/")
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to seed content" }
  }
}

export async function upsertSiteContent(key: string, value: string, type: string) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    await db.insert(siteContent)
      .values({ key, value, type })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: { value, type, updatedAt: new Date() }
      })
    
    revalidatePath("/")
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to save content" }
  }
}

export async function deleteSiteContent(key: string) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const { eq } = await import("drizzle-orm")
    await db.delete(siteContent).where(eq(siteContent.key, key))
    
    revalidatePath("/")
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to delete content" }
  }
}
