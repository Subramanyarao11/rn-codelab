'use client'

import { useEffect, useState } from 'react'
import { MobileBlocker } from './MobileBlocker'

const DESKTOP_MIN_PX = 1024

interface DesktopGateProps {
  children: React.ReactNode
}

export function DesktopGate({ children }: DesktopGateProps) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_PX}px)`)
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (isDesktop === null) {
    return <div className="min-h-screen bg-zinc-950" />
  }

  if (!isDesktop) {
    return <MobileBlocker />
  }

  return <>{children}</>
}
