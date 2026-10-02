import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/'],
      },
      // Allow AI Search Engines (Citability)
      {
        userAgent: ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'],
        allow: '/',
      },
      // Block AI Scrapers (Model Training)
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'anthropic-ai', 'Applebot-Extended'],
        disallow: '/',
      }
    ],
    sitemap: 'https://shalintimalsina.com.np/sitemap.xml',
  }
}
