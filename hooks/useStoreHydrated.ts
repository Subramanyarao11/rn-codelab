'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'

/** True after zustand persist has rehydrated from localStorage. */
export function useStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useStore.persist.hasHydrated())

  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true))
    if (useStore.persist.hasHydrated()) setHydrated(true)
    return unsub
  }, [])

  return hydrated
}
