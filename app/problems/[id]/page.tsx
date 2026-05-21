import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProblem, TOTAL_PROBLEMS } from '@/lib/problems'
import { ChallengeWorkspace } from '@/components/ChallengeWorkspace'
import { SITE_NAME } from '@/lib/site'

export function generateStaticParams() {
  return Array.from({ length: TOTAL_PROBLEMS }, (_, i) => ({
    id: String(i + 1),
  }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  const problem = Number.isNaN(id) ? undefined : getProblem(id)

  if (!problem) {
    return { title: 'Challenge not found' }
  }

  const title = `Fix the Bug #${problem.id}: ${problem.title}`
  const description = `${problem.subtitle} Hands-on React Native debugging challenge with live preview and automated tests.`

  return {
    title,
    description,
    keywords: [...problem.tags, 'React Native', 'debugging challenge', 'Fix the Bug'],
    alternates: {
      canonical: `/problems/${problem.id}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `/problems/${problem.id}`,
    },
    twitter: {
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  }
}

export default async function ProblemPage({ params }: PageProps) {
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) notFound()

  const problem = getProblem(id)
  if (!problem) notFound()

  return <ChallengeWorkspace problem={problem} />
}
