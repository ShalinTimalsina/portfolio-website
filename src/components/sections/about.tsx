"use client"

import React from "react"
import { motion } from "motion/react"
import { MapPin, GraduationCap, Certificate, Briefcase, Calendar, GithubLogo, LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react"

const timeline = [
  {
    year: "2024",
    title: "AWS Solutions Architect – Associate",
    subtitle: "Amazon Web Services",
    type: "cert" as const,
  },
  {
    year: "2024",
    title: "Docker Certified",
    subtitle: "Kode Kloud",
    type: "cert" as const,
  },
  {
    year: "2024",
    title: "GitHub Foundations",
    subtitle: "Datacamp",
    type: "cert" as const,
  },
  {
    year: "Present",
    title: "BSc IT",
    subtitle: "Techspire College, Kathmandu",
    type: "education" as const,
  },
  {
    year: "Completed",
    title: "SEE & +2",
    subtitle: "Skyrider English Boarding School",
    type: "education" as const,
  },
]

const links = [
  { label: "GitHub", href: "https://github.com/ShalinTimalsina", icon: GithubLogo },
  { label: "LinkedIn", href: "https://linkedin.com/in/shalin-timalsina", icon: LinkedinLogo },
  { label: "salintimalsina01@gmail.com", href: "mailto:salintimalsina01@gmail.com", icon: EnvelopeSimple },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="container px-6 mx-auto max-w-7xl w-full">

        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-border bg-muted/50 w-fit">
            <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-foreground">
              About
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-semibold tracking-tight text-foreground">
            Behind the Terminal.
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left: Bio Card (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-3 flex flex-col gap-8"
          >
            {/* Bio block */}
            <div
              className="p-6 md:p-8 rounded-[24px] bg-muted border border-border overflow-hidden relative"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              <div className="flex flex-col gap-6">
                {/* Location badge */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin weight="bold" className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Kathmandu, Nepal</span>
                </div>

                {/* Bio paragraphs — first person, active voice, per CONTENT.md */}
                <div className="flex flex-col gap-4 text-foreground/90 leading-relaxed">
                  <p>
                    I build cloud infrastructure and the tooling around it. My days revolve around 
                    Terraform plans, Docker containers, and AWS services — turning architecture 
                    diagrams into running systems.
                  </p>
                  <p>
                    I earned the AWS Solutions Architect – Associate certification to validate what 
                    I was already doing: designing secure, scalable, cost-optimized architectures. 
                    Right now I am pursuing my BSc IT at Techspire College while shipping real 
                    projects — from CI/CD pipelines with GitHub Actions to Kubernetes-orchestrated 
                    microservices.
                  </p>
                  <p className="text-muted-foreground">
                    When I am not staring at YAML, I am probably debugging a Dockerfile or 
                    automating something that should have been automated months ago.
                  </p>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "heart" } }))}
                      onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-200"
                    >
                      <link.icon weight="bold" className="w-4 h-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "22+", label: "Public Repos" },
                { value: "AWS", label: "Certified" },
                { value: "5+", label: "Stacks Shipped" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
                  className="flex flex-col items-center gap-1 p-4 rounded-[16px] bg-muted border border-border"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
                >
                  <span className="text-2xl md:text-3xl font-heading font-semibold text-primary">{stat.value}</span>
                  <span className="text-xs text-muted-foreground tracking-wide">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Timeline (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-2"
          >
            <div
              className="p-6 md:p-8 rounded-[24px] bg-muted border border-border overflow-hidden relative h-full"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
                Timeline
              </h3>

              <div className="flex flex-col gap-0 relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

                {timeline.map((item, i) => (
                  <motion.div
                    key={`${item.title}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] }}
                    className="flex gap-4 py-4 relative group"
                  >
                    {/* Dot */}
                    <div className="relative z-10 mt-1 shrink-0">
                      <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center ${
                        item.type === "cert" 
                          ? "border-primary/50 bg-primary/10" 
                          : "border-border bg-surface"
                      }`}>
                        {item.type === "cert" ? (
                          <Certificate weight="bold" className="w-3 h-3 text-primary" />
                        ) : (
                          <GraduationCap weight="bold" className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] uppercase tracking-[0.1em] font-mono text-muted-foreground">
                          {item.year}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground leading-snug">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
