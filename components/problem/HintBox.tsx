'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'

interface HintBoxProps {
  hint: string
}

export function HintBox({ hint }: HintBoxProps) {
  return (
    <motion.div
      className="rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-500/10"
      {...fadeInUp}
    >
      <p className="text-sm text-amber-950 dark:text-amber-200">
        <span className="font-semibold text-amber-700 dark:text-amber-400">Think about it: </span>
        {hint}
      </p>
    </motion.div>
  )
}
