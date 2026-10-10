import { NextResponse } from "next/server"
import { db } from "@/db"
import { siteContent } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const result = await db.select().from(siteContent).where(eq(siteContent.key, "skills.list"))
    return NextResponse.json({ result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
