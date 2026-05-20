'use client'

import { useEffect } from 'react'

export default function ProblemsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    document.documentElement.classList.add('layout-locked')
    return () => {
      document.documentElement.classList.remove('layout-locked')
    }
  }, [])

  return <>{children}</>
}
