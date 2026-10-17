/**
 * Convert mascot sprite sheets from PNG to WebP
 * Run: npx tsx scripts/convert-sprites-to-webp.ts
 * 
 * Requires: npm install -D sharp (or just npx tsx with sharp available)
 */

import { existsSync } from "fs"
import { join } from "path"

const PUBLIC_DIR = join(process.cwd(), "public", "characters", "shalin")
const files = ["directions", "reactions"]

async function convertWithSharp() {
  // Dynamic import to avoid build-time dependency
  const sharp = (await import("sharp")).default

  for (const name of files) {
    const inputPath = join(PUBLIC_DIR, `${name}.png`)
    const outputPath = join(PUBLIC_DIR, `${name}.webp`)
    
    if (!existsSync(inputPath)) {
      console.error(`File not found: ${inputPath}`)
      continue
    }

    const info = await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)

    console.log(`${name}.png -> ${name}.webp (${(info.size / 1024).toFixed(0)} KiB)`)
  }
}

convertWithSharp().catch(err => {
  console.error("Failed to convert:", err.message)
  console.log("\nTo install sharp: npm install -D sharp")
  process.exit(1)
})
