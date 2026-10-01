import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CommandPalette } from "@/components/shared/command-palette";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { Toaster } from "sonner";
import { MascotCompanion } from "@/components/mascot/mascot-companion";
import { Analytics } from "@vercel/analytics/next";

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
  title: {
    template: "%s | Shalin Timalsina",
    default: "Shalin Timalsina",
  },
  description: "AWS Certified Solutions Architect building cloud-native infrastructure, automated CI/CD pipelines, and secure, scalable applications.",
  icons: {
    icon: '/icon.png',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preload" href="/mascots/character_0_directions.png" as="image" />
        <link rel="preload" href="/mascots/character_0_reactions.png" as="image" />
      </head>
      <body
        className={`${fontHeading.variable} ${fontBody.variable} ${fontMono.variable} antialiased selection:bg-primary/20 selection:text-primary min-h-screen bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeToggle />
          <ScrollProgress />
          {children}
          <CommandPalette />
          <MascotCompanion />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "bg-surface border-border text-foreground",
            }}
          />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
