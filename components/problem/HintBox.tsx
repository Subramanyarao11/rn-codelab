'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'

interface HintBoxProps {
  hint: string
}

export function HintBox({ hint }: HintBoxProps) {
  return (
    <motion.div
      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3"
      {...fadeInUp}
    >
      <p className="text-sm text-amber-200">
        <span className="font-semibold text-amber-400">Think about it: </span>
        {hint}
      </p>
    </motion.div>
  )
}
