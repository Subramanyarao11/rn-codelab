'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

const COLORS = ['#f59e0b', '#14b8a6', '#22c55e', '#a78bfa', '#f472b6', '#38bdf8']

interface Particle {
  id: number
  x: number
  delay: number
  color: string
  size: number
  rotate: number
  drift: number
}

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * 60,
    delay: Math.random() * 0.12,
    color: COLORS[i % COLORS.length]!,
    size: 4 + Math.random() * 5,
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 120,
  }))
}

interface ConfettiBurstProps {
  active: boolean
  onDone?: () => void
}

export function ConfettiBurst({ active, onDone }: ConfettiBurstProps) {
  const [mounted, setMounted] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const particles = useMemo(() => buildParticles(48), [burstKey])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!active) return
    setBurstKey((k) => k + 1)
    const timer = window.setTimeout(() => onDone?.(), 2200)
    return () => window.clearTimeout(timer)
  }, [active, onDone])

  if (!mounted || !active) return null

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[250] overflow-hidden"
      aria-hidden
    >
      {particles.map((p) => (
        <motion.span
          key={`${burstKey}-${p.id}`}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '38%',
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
          }}
          initial={{ opacity: 1, y: 0, rotate: p.rotate, scale: 1 }}
          animate={{
            opacity: [1, 1, 0],
            y: [0, -40, 140 + Math.random() * 80],
            x: [0, p.drift * 0.4, p.drift],
            rotate: p.rotate + 180 + Math.random() * 180,
            scale: [1, 1.1, 0.6],
          }}
          transition={{
            duration: 1.6 + Math.random() * 0.5,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>,
    document.body
  )
}
