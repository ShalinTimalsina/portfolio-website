"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { EnvelopeSimple, GithubLogo, LinkedinLogo, Phone, PaperPlaneRight } from "@phosphor-icons/react"
import Link from "next/link"
import { toast } from "sonner"

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    // Fake a network request for the form simulation
    setTimeout(() => {
      setStatus("success")
      toast.success("200 OK: Payload delivered. I'll deploy a response soon!")
      setTimeout(() => setStatus("idle"), 3000)
    }, 1500)
  }

  return (
    <section id="contact" className="py-24 md:py-32 relative min-h-[100dvh] flex flex-col">
      <div className="container px-6 mx-auto max-w-7xl w-full my-auto">
        <div className="flex flex-col gap-4 mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-border bg-muted/50 w-fit">
            <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-foreground">
              Contact
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-semibold tracking-tight text-foreground">
            Let's build together.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Contact Info Bento */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col gap-6"
          >
            <div 
              className="flex flex-col p-8 rounded-[24px] bg-[#111111] border border-[#27272A] overflow-hidden relative"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
                Connect
              </h3>
              <p className="text-muted-foreground mb-8">
                I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
              
              <div className="flex flex-col gap-4">
                <Link 
                  href="mailto:salintimalsina01@gmail.com" 
                  onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "wave", message: "Shoot me an email!" } }))}
                  onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background/50 hover:bg-muted transition-all active:scale-[0.98] group"
                >
                  <div className="p-3 bg-muted rounded-lg text-foreground group-hover:text-primary transition-colors">
                    <EnvelopeSimple className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">salintimalsina01@gmail.com</p>
                  </div>
                </Link>

                <Link 
                  href="tel:+9779862448516" 
                  onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "wave", message: "Ring ring!" } }))}
                  onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background/50 hover:bg-muted transition-all active:scale-[0.98] group"
                >
                  <div className="p-3 bg-muted rounded-lg text-foreground group-hover:text-primary transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">+977-9862448516</p>
                  </div>
                </Link>
                
                <div className="flex gap-4 mt-2">
                  <Link 
                    href="https://github.com/ShalinTimalsina" 
                    target="_blank"
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "starstruck", message: "Code!" } }))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-border bg-background/50 hover:bg-muted transition-all active:scale-[0.98] text-foreground"
                  >
                    <GithubLogo className="w-5 h-5" />
                    <span className="text-sm font-medium">GitHub</span>
                  </Link>
                  <Link 
                    href="https://linkedin.com/in/shalin-timalsina" 
                    target="_blank"
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "heart", message: "Connect with me!" } }))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-border bg-background/50 hover:bg-muted transition-all active:scale-[0.98] text-foreground"
                  >
                    <LinkedinLogo className="w-5 h-5" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          >
            <form 
              onSubmit={handleSubmit}
              className="flex flex-col p-8 rounded-[24px] bg-[#111111] border border-[#27272A] overflow-hidden relative h-full"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
                Send a Message
              </h3>

              <div className="flex flex-col gap-5 flex-1">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required
                    onFocus={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching", message: "Who are you?" } }))}
                    onBlur={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
                    className="px-4 py-3 rounded-lg border border-border bg-[#1A1A1A] text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    onFocus={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching", message: "Where can I reach you?" } }))}
                    onBlur={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
                    className="px-4 py-3 rounded-lg border border-border bg-[#1A1A1A] text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                  <textarea 
                    id="message" 
                    required
                    rows={4}
                    onFocus={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "thinking", message: "Take your time!" } }))}
                    onBlur={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
                    className="px-4 py-3 rounded-lg border border-border bg-[#1A1A1A] text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none placeholder:text-muted-foreground flex-1"
                    placeholder="How can I help you?"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "starstruck", message: "Send it!" } }))}
                  onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
                  onClick={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "success", message: "Whoosh!" } }))}
                  className="group mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {status === "idle" && (
                    <>
                      Send Message
                      <PaperPlaneRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" weight="bold" />
                    </>
                  )}
                  {status === "loading" && (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  )}
                  {status === "success" && "Transmission Acknowledged"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
