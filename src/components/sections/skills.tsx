"use client"

import React, { useRef, useState } from "react"
import { motion } from "motion/react"

import { Cloud, HardDrives, ShareNetwork, Cpu, ChartLineUp, TreeStructure } from "@phosphor-icons/react"

const skillCategories = [
  {
    title: "Daily",
    description: "Active personal projects and core stack.",
    skills: ["Terraform", "Docker", "EC2 & S3", "VPC & Route53", "Git", "GitHub Actions"],
    delay: 0.1,
  },
  {
    title: "Working",
    description: "Competent, have shipped projects with.",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "FastAPI", "SQL", "Linux", "Nginx"],
    delay: 0.2,
  },
  {
    title: "Learning",
    description: "Actively studying, not yet shipped.",
    skills: ["Ansible", "Kubernetes", "System Design", "Monitoring"],
    delay: 0.3,
  }
]

const skillIcons: Record<string, string | React.ReactNode> = {
  "Terraform": "terraform",
  "Docker": "docker",
  "AWS Core": <Cloud weight="duotone" className="w-4 h-4 transition-transform duration-300 group-hover/skill:scale-110 group-hover/skill:-rotate-6" />,
  "EC2 & S3": <HardDrives weight="duotone" className="w-4 h-4 transition-transform duration-300 group-hover/skill:scale-110 group-hover/skill:-rotate-6" />,
  "VPC & Route53": <ShareNetwork weight="duotone" className="w-4 h-4 transition-transform duration-300 group-hover/skill:scale-110 group-hover/skill:-rotate-6" />,
  "Git": "git",
  "GitHub Actions": "githubactions",
  "React": "react",
  "Python": "python",
  "SQL": "postgresql",
  "Linux": "linux",
  "FastAPI": "fastapi",
  "Node.js": "nodedotjs",
  "Nginx": "nginx",
  "Next.js": "nextdotjs",
  "TypeScript": "typescript",
  "Ansible": "ansible",
  "Kubernetes": "kubernetes",
  "System Design": <TreeStructure weight="duotone" className="w-4 h-4 transition-transform duration-300 group-hover/skill:scale-110 group-hover/skill:-rotate-6" />,
  "Monitoring": "grafana"
}

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 md:py-32 bg-background min-h-[100dvh] flex flex-col">
      <div className="container px-6 mx-auto max-w-7xl w-full my-auto">
        
        <div className="flex flex-col gap-4 mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-border bg-muted/50 w-fit">
            <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-foreground">
              Skills & Stack
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-semibold tracking-tight text-foreground">
            Tools of the Trade.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}>
          {skillCategories.map((category, i) => (
            <SkillCard key={category.title} category={category} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillCard({ category, index: i }: { category: typeof skillCategories[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: category.delay, ease: [0.32, 0.72, 0, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "thinking", message: `Ah, ${category.title} tools...` } }))}
      className="group flex flex-col gap-6 p-6 md:p-8 rounded-[24px] bg-muted border border-border overflow-hidden relative hover:-translate-y-[2px] hover:border-primary/20 transition-all duration-150 ease-out"
      style={{
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)"
      }}
    >
      {/* Dynamic Hover Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 200, 150, 0.08), transparent 40%)`,
        }}
      />
      
      <div className="flex flex-col gap-2 relative z-10 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-primary animate-pulse shadow-[0_0_10px_rgba(0,200,150,0.5)]" : "bg-muted-foreground"}`} />
          <h3 className="text-xl font-heading font-semibold text-foreground">
            {category.title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground pl-5">
          {category.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 mt-auto relative z-10 pointer-events-auto">
        {category.skills.map((skill, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.3, delay: category.delay + 0.2 + (idx * 0.05), ease: [0.32, 0.72, 0, 1] }}
            key={skill}
            whileHover={{ y: -3, scale: 1.05 }}
            className="group/skill flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-wide rounded-md bg-surface border border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-default shadow-sm"
          >
            {skillIcons[skill] && typeof skillIcons[skill] === "string" && (
              <span 
                className="w-3.5 h-3.5 bg-current transition-transform duration-300 group-hover/skill:scale-110 group-hover/skill:-rotate-6"
                style={{
                  maskImage: `url(/icons/${skillIcons[skill]}.svg)`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: `url(/icons/${skillIcons[skill]}.svg)`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center'
                }}
              />
            )}
            {skillIcons[skill] && typeof skillIcons[skill] !== "string" && (
              skillIcons[skill]
            )}
            {skill}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
