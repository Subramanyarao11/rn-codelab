import { notFound } from 'next/navigation'
import { getProblem, TOTAL_PROBLEMS } from '@/lib/problems'
import { ChallengeWorkspace } from '@/components/ChallengeWorkspace'

export function generateStaticParams() {
  return Array.from({ length: TOTAL_PROBLEMS }, (_, i) => ({
    id: String(i + 1),
  }))
}

interface PageProps {
  params: { id: string }
}

export default function ProblemPage({ params }: PageProps) {
  const id = parseInt(params.id, 10)
  if (isNaN(id)) notFound()

  const problem = getProblem(id)
  if (!problem) notFound()

  return <ChallengeWorkspace problem={problem} />
}
