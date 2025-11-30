'use client'

import { AuthProvider } from '@/hooks/useAuth'
import LocalStorageCleanup from '@/components/LocalStorageCleanup'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocalStorageCleanup />
      <AuthProvider>{children}</AuthProvider>
    </>
  )
}

