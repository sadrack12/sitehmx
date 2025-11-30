'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import ConsultasTab from '@/components/gestao/atendimento/ConsultasTab'
import { Loader2 } from 'lucide-react'

export default function ConsultasPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/gestao/login')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConsultasTab />
      </div>
    </div>
  )
}

