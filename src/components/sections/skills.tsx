"use client"

import React, { useRef, useState } from "react"
import { motion } from "motion/react"
import { HardDrives, ShareNetwork, TreeStructure, Sparkle, CheckCircle, Compass } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const defaultSkillCategories = [
  {
    title: "Daily",
    badge: "Active Labs & Prod",
    description: "Core infrastructure, automation pipelines, and tools used on an everyday basis.",
    skills: ["Terraform", "Docker", "AWS (EC2 & S3)", "AWS (VPC & Route53)", "Git", "GitHub Actions"],
    delay: 0.1,
  },
  {
    title: "Working",
    badge: "Shipped in Projects",
    description: "Competent stack with production and full-stack project implementations delivered.",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "FastAPI", "PostgreSQL & SQL", "Linux", "Nginx"],
    delay: 0.2,
  },
  {
    title: "Learning",
    badge: "Deepening & Labs",
    description: "Actively studying, configuring in lab environments, and mastering architecture patterns.",
    skills: ["Ansible", "Kubernetes", "System Design", "Grafana & Prometheus"],
    delay: 0.3,
  }
]

const skillIcons: Record<string, string | React.ReactNode> = {
  "Terraform": "terraform",
  "Docker": "docker",
  "AWS (EC2 & S3)": <HardDrives weight="duotone" className="w-3.5 h-3.5 text-primary/90 shrink-0 transition-transform duration-150 group-hover/skill:-translate-y-0.5" />,
  "EC2 & S3": <HardDrives weight="duotone" className="w-3.5 h-3.5 text-primary/90 shrink-0 transition-transform duration-150 group-hover/skill:-translate-y-0.5" />,
  "AWS (VPC & Route53)": <ShareNetwork weight="duotone" className="w-3.5 h-3.5 text-primary/90 shrink-0 transition-transform duration-150 group-hover/skill:-translate-y-0.5" />,
  "VPC & Route53": <ShareNetwork weight="duotone" className="w-3.5 h-3.5 text-primary/90 shrink-0 transition-transform duration-150 group-hover/skill:-translate-y-0.5" />,
  "Git": "git",
  "GitHub Actions": "githubactions",
  "React": "react",
  "Python": "python",
  "PostgreSQL & SQL": "postgresql",
  "SQL": "postgresql",
  "Linux": "linux",
  "FastAPI": "fastapi",
  "Node.js": "nodedotjs",
  "Nginx": "nginx",
  "Next.js": "nextdotjs",
  "TypeScript": "typescript",
  "Ansible": "ansible",
  "Kubernetes": "kubernetes",
  "System Design": <TreeStructure weight="duotone" className="w-3.5 h-3.5 text-primary/90 shrink-0 transition-transform duration-150 group-hover/skill:-translate-y-0.5" />,
  "Grafana & Prometheus": "grafana",
  "Monitoring": "grafana"
}

export function SkillsSection({ content = {} }: { content?: Record<string, any> }) {
  const categories = content["skills.list"] || defaultSkillCategories

  return (
    <section id="skills" className="py-24 md:py-32 bg-background min-h-[100dvh] flex flex-col justify-center">
      <div className="container px-6 mx-auto max-w-7xl w-full">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-border bg-muted/50 w-fit">
            <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-foreground">
              {content["skills.chip"] || "Skills & Stack"}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl md:text-5xl font-heading font-semibold tracking-tight text-foreground">
              {content["skills.heading"] || "Tools of the Trade."}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {content["skills.subheading"] || "Grouped strictly by production usage: what runs in daily infrastructure, what has shipped in real projects, and what is actively being mastered."}
            </p>
          </div>
        </div>

        {/* 3-Tier Categorized Stack Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6" 
          onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
        >
          {categories.map((category: any, i: number) => (
            <SkillCard 
              key={category.title} 
              category={{
                ...category, 
                badge: category.badge || (i === 0 ? "Active Labs & Prod" : i === 1 ? "Shipped in Projects" : "Deepening & Labs"),
                delay: category.delay || (i * 0.1 + 0.1)
              }} 
              index={i} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillCard({ 
  category, 
  index: i 
}: { 
  category: { 
    title: string; 
    badge?: string; 
    description: string; 
    skills: string[]; 
    delay: number 
  }; 
  index: number 
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const isDaily = i === 0

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: category.delay, ease: [0.32, 0.72, 0, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { 
        detail: { 
          state: isDaily ? "excited" : "thinking", 
          message: isDaily ? "Core DevOps tools!" : `Exploring ${category.title} stack...` 
        } 
      }))}
      className={cn(
        "group flex flex-col justify-between p-6 md:p-8 rounded-[24px] bg-muted border overflow-hidden relative transition-all duration-200 ease-out",
        isDaily 
          ? "border-primary/30 hover:border-primary/50 shadow-[0_4px_24px_rgba(0,200,150,0.05)] bg-gradient-to-b from-primary/[0.03] to-muted" 
          : "border-border hover:border-border/80"
      )}
      style={{
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)"
      }}
    >
      {/* Dynamic Cursor Radial Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 200, 150, 0.09), transparent 45%)`,
        }}
      />
      
      {/* Header & Badges */}
      <div className="flex flex-col gap-4 relative z-10 pointer-events-auto">
        <div className="flex items-center justify-between gap-2">
          {/* Status Indicator & Category Name */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              {isDaily && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              )}
              <span className={cn(
                "relative inline-flex rounded-full h-2.5 w-2.5",
                isDaily ? "bg-primary shadow-[0_0_8px_rgba(0,200,150,0.6)]" : "bg-muted-foreground/60"
              )} />
            </span>
            <h3 className="text-xl font-heading font-semibold text-foreground tracking-tight">
              {category.title}
            </h3>
          </div>

          {/* Status Pill Badge */}
          <span className={cn(
            "text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 shrink-0",
            isDaily 
              ? "text-primary bg-primary/10 border-primary/25" 
              : "text-muted-foreground bg-surface border-border"
          )}>
            {isDaily && <Sparkle weight="fill" className="w-2.5 h-2.5 text-primary" />}
            {i === 1 && <CheckCircle weight="bold" className="w-2.5 h-2.5 text-muted-foreground" />}
            {i === 2 && <Compass weight="bold" className="w-2.5 h-2.5 text-muted-foreground" />}
            <span>{category.badge}</span>
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Skill Tags List */}
      <div className="flex flex-wrap gap-2 pt-8 mt-auto relative z-10 pointer-events-auto">
        {category.skills.map((skill, idx) => {
          const icon = skillIcons[skill]
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.25, delay: category.delay + 0.15 + (idx * 0.03), ease: [0.32, 0.72, 0, 1] }}
              key={skill}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { 
                detail: { state: "thinking", message: `Using ${skill}...` } 
              }))}
              className="group/skill flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-wide rounded-md bg-surface border border-border text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-primary/[0.04] transition-[transform,color,border-color,background-color] duration-150 ease-out cursor-default select-none shadow-sm"
            >
              {icon && typeof icon === "string" && (
                <span 
                  className="w-3.5 h-3.5 shrink-0 bg-current transition-transform duration-150 group-hover/skill:-translate-y-0.5"
                  style={{
                    maskImage: `url(/icons/${icon}.svg)`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: `url(/icons/${icon}.svg)`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center'
                  }}
                />
              )}
              {icon && typeof icon !== "string" && icon}
              <span>{skill}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
