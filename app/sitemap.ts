import type { MetadataRoute } from 'next'
import { TOTAL_PROBLEMS } from '@/lib/problems'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const problemPages = Array.from({ length: TOTAL_PROBLEMS }, (_, index) => ({
    url: `${SITE_URL}/problems/${index + 1}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/contribute`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contribute/submit`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...problemPages,
  ]
}
