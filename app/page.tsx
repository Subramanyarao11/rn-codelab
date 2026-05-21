import type { Metadata } from 'next'
import { HomeContent } from '@/components/home/HomeContent'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: `${SITE_NAME} — Fix broken React Native code`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_NAME} — Fix broken React Native code`,
    description: SITE_DESCRIPTION,
    url: '/',
  },
}

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <HomeContent />
    </>
  )
}
