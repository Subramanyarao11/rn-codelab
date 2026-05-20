'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function resetDocumentScroll() {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export default function ProblemsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.classList.add('layout-locked')
    resetDocumentScroll()
    return () => {
      document.documentElement.classList.remove('layout-locked')
      resetDocumentScroll()
    }
  }, [])

  useEffect(() => {
    resetDocumentScroll()
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [pathname])

  return <>{children}</>
}
