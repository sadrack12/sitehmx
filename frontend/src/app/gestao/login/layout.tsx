'use client'

import { ReactNode } from 'react'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ marginLeft: 0 }}>
      {children}
    </div>
  )
}

