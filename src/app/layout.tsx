import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { HeaderActions } from "@/components/shared/header-actions";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const CommandPalette = dynamic(
  () => import("@/components/shared/command-palette").then(mod => mod.CommandPalette)
);
const MascotCompanion = dynamic(
  () => import("@/components/mascot/mascot-companion").then(mod => mod.MascotCompanion)
);

// Primary heading font
const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

// Primary body font
const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Terminal / Code font
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shalintimalsina.com.np'),
  title: {
    template: "%s | Shalin Timalsina",
    default: "Shalin Timalsina | Cloud & DevOps Engineer",
  },
  description: "AWS Certified Solutions Architect building cloud-native infrastructure, automated CI/CD pipelines, and secure, scalable applications.",
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: "Shalin Timalsina | Cloud & DevOps Engineer",
    description: "AWS Certified Solutions Architect building cloud-native infrastructure, automated CI/CD pipelines, and secure, scalable applications.",
    url: 'https://shalintimalsina.com.np',
    siteName: 'Shalin Timalsina',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shalin Timalsina | Cloud & DevOps Engineer",
    description: "AWS Certified Solutions Architect building cloud-native infrastructure, automated CI/CD pipelines, and secure, scalable applications.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

import { db } from "@/db";
import { mascotLines } from "@/db/schema";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allMascotLines = await db.select().from(mascotLines);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shalin Timalsina",
    jobTitle: "Cloud & DevOps Engineer",
    url: "https://shalintimalsina.com.np",
    sameAs: [
      "https://github.com/ShalinTimalsina",
      "https://www.linkedin.com/in/shalin-timalsina11"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head />
      <body
        suppressHydrationWarning
        className={`${fontHeading.variable} ${fontBody.variable} ${fontMono.variable} antialiased selection:bg-primary/20 selection:text-primary min-h-screen bg-background text-foreground transition-colors duration-300`}
      >
        <Script id="person-schema" type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <HeaderActions />
          <ScrollProgress />
          {children}
          <CommandPalette />
          <MascotCompanion customLines={allMascotLines} />
          <Toaster
            position="bottom-right"
            theme="system"
            toastOptions={{
              className: "!bg-surface !border-border !text-foreground",
              style: {
                background: "var(--color-surface, hsl(var(--surface)))",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
              },
            }}
          />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
