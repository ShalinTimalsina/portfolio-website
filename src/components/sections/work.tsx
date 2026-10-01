"use client"

import React from "react"
import { motion } from "motion/react"
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react"
import Link from "next/link"

type DBProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
};

export function WorkSection({ projects }: { projects: DBProject[] }) {
  return (
    <section id="work" className="py-24 md:py-32 relative min-h-[100dvh] flex flex-col">
      <div className="container px-6 mx-auto max-w-7xl w-full">
        
        <div className="flex flex-col gap-4 mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-border bg-muted/50 w-fit">
            <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-foreground">
              Selected Work
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-semibold tracking-tight text-foreground">
            Infrastructure & Code.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              id={`project-${project.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
              onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "starstruck", message: `Looking at ${project.title}!` } }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
              className={`group relative flex flex-col z-10 p-6 md:p-8 rounded-[24px] bg-muted border border-border overflow-hidden ${
                i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1"
              }`}
              style={{
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex flex-col z-10 h-full">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-2xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <div className="flex gap-3 shrink-0">
                    {project.liveUrl && (
                      <Link href={project.liveUrl} target="_blank" className="group/btn active:scale-95 text-muted-foreground hover:text-foreground transition-all duration-200 bg-surface border border-border p-2 rounded-full hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,200,150,0.1)]">
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                    {project.repoUrl && (
                      <Link href={project.repoUrl} target="_blank" className="group/btn active:scale-95 text-muted-foreground hover:text-foreground transition-all duration-200 bg-surface border border-border p-2 rounded-full hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,200,150,0.1)]">
                        <GithubLogo className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" weight="fill" />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed max-w-lg mb-8">
                  {project.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  {project.techStack.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-mono rounded-md bg-surface border border-border text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
