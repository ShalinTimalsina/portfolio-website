import { db } from "../src/db"
import { siteContent } from "../src/db/schema"
import { eq } from "drizzle-orm"

async function main() {
  const result = await db.select().from(siteContent).where(eq(siteContent.key, "skills.list"))
  console.log(JSON.stringify(result, null, 2))
}

main().catch(console.error)
