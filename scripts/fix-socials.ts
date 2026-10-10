import { db } from "../src/db";
import { siteContent } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Updating socials...");
  
  await db.update(siteContent)
    .set({ value: "https://github.com/ShalinTimalsina" })
    .where(eq(siteContent.key, "contact.github"));
    
  await db.update(siteContent)
    .set({ value: "https://www.linkedin.com/in/shalin-timalsina11" })
    .where(eq(siteContent.key, "contact.linkedin"));

  const aboutLinks = [
    { label: "GitHub", href: "https://github.com/ShalinTimalsina", icon: "GithubLogo", mascotState: "success", mascotMessage: "Show me the code!" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/shalin-timalsina11", icon: "LinkedinLogo", mascotState: "heart", mascotMessage: "Let's connect!" },
    { label: "salintimalsina01@gmail.com", href: "mailto:salintimalsina01@gmail.com", icon: "EnvelopeSimple", mascotState: "wave", mascotMessage: "Write me an email!" }
  ];

  await db.update(siteContent)
    .set({ value: JSON.stringify(aboutLinks, null, 2) })
    .where(eq(siteContent.key, "about.links"));

  console.log("Socials updated!");
  process.exit(0);
}

main().catch(console.error);
