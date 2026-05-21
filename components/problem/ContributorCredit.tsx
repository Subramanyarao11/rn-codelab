import type { ProblemContributor } from '@/lib/types'
import { githubProfileUrl } from '@/lib/github'
import { cn } from '@/lib/cn'

interface ContributorCreditProps {
  contributor: ProblemContributor
  origin?: 'core' | 'community'
  className?: string
}

export function ContributorCredit({ contributor, origin = 'community', className }: ContributorCreditProps) {
  const href =
    contributor.url ??
    (contributor.github ? githubProfileUrl(contributor.github) : undefined)

  return (
    <div
      className={cn(
        'mb-4 rounded-md border border-teal-200 bg-teal-50 px-3 py-2.5 dark:border-teal-500/25 dark:bg-teal-950/20',
        className
      )}
    >
      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400/90">
        {origin === 'community' ? 'Community challenge' : 'Contributed by'}
      </p>
      <p className="text-sm text-app-fg-secondary">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-300"
          >
            {contributor.name}
          </a>
        ) : (
          <span className="font-medium text-teal-700 dark:text-teal-300">{contributor.name}</span>
        )}
      </p>
    </div>
  )
}
