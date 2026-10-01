import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { CommandPalette } from "@/components/shared/command-palette";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { Toaster } from "sonner";

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
    default: "Shalin Timalsina | Cloud & DevOps Engineer",
  },
  description: "AWS Certified Solutions Architect building cloud-native infrastructure, automated CI/CD pipelines, and secure, scalable applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontHeading.variable} ${fontBody.variable} ${fontMono.variable} antialiased selection:bg-primary/20 selection:text-primary min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollProgress />
          {children}
          <CommandPalette />
          <Toaster 
            theme="dark" 
            position="bottom-right" 
            toastOptions={{
              style: { background: "#111111", border: "1px solid #27272A", color: "#F4F4F5" },
            }} 
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
