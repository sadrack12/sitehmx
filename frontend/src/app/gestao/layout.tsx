'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Sidebar from '@/components/gestao/Sidebar'
import MedicoSidebar from '@/components/gestao/MedicoSidebar'

export default function GestaoLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const isLoginPage = pathname === '/gestao/login'
  
  if (isLoginPage) {
    return <>{children}</>
  }

  // Se o usuário for médico, usa sidebar específica
  const isMedico = user?.role === 'medico'
  const SidebarComponent = isMedico ? MedicoSidebar : Sidebar

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SidebarComponent />
        <div className="flex-1 ml-64">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

