import { notFound } from 'next/navigation'
import { getProblem, TOTAL_PROBLEMS } from '@/lib/problems'
import { ChallengeWorkspace } from '@/components/ChallengeWorkspace'

export function generateStaticParams() {
  return Array.from({ length: TOTAL_PROBLEMS }, (_, i) => ({
    id: String(i + 1),
  }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProblemPage({ params }: PageProps) {
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) notFound()

  const problem = getProblem(id)
  if (!problem) notFound()

  return <ChallengeWorkspace problem={problem} />
}
