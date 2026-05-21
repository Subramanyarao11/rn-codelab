import type { Metadata } from 'next'
import { ContributeContent } from '@/components/contribute/ContributeContent'

export const metadata: Metadata = {
  title: 'Contribute a challenge',
  description:
    'Submit a React Native bug-fixing challenge to RN Debug Labs. Share real bugs from the wild — we review every proposal and credit accepted authors.',
  alternates: {
    canonical: '/contribute',
  },
  openGraph: {
    title: 'Contribute a challenge',
    description:
      'Submit a React Native bug-fixing challenge. No git required — or open a pull request on GitHub.',
    url: '/contribute',
  },
}

export default function ContributePage() {
  return <ContributeContent />
}
