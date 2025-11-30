'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import DailyVideoModalPaciente from '@/components/public/DailyVideoModalPaciente'
import { Loader2, AlertCircle } from 'lucide-react'

export const dynamicParams = false

export default function VideoconferenciaPacientePage() {
  const router = useRouter()
  const pathname = usePathname()
  // Extrair ID da URL no cliente (para build estático)
  const consultaId = typeof window !== 'undefined' 
    ? parseInt(pathname?.split('/')[2] || '0')
    : 0
  const [nifFromUrl, setNifFromUrl] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nif, setNif] = useState('')
  const [nifInput, setNifInput] = useState('')
  const [consultaData, setConsultaData] = useState<any>(null)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    if (!consultaId || isNaN(consultaId)) {
      setError('ID da consulta inválido')
      setLoading(false)
      return
    }

    // Verificar se o NIF foi passado como parâmetro na URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const nifParam = urlParams.get('nif')
      if (nifParam) {
        setNifFromUrl(nifParam)
        setNifInput(nifParam)
        // Tentar validar automaticamente se o NIF foi passado
        handleNifSubmit(new Event('submit') as any, nifParam)
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [consultaId])

  const handleNifSubmit = async (e: React.FormEvent | null, nifValue?: string) => {
    if (e) {
      e.preventDefault()
    }
    
    const nifToUse = nifValue || nifInput.trim()
    
    if (!nifToUse) {
      setError('Por favor, insira o seu NIF')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Buscar informações da consulta e validar NIF
      console.log('Buscando token para paciente:', { consultaId, nif: nifToUse })
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/public/daily/${consultaId}/token?nif=${encodeURIComponent(nifToUse)}`
      console.log('URL da API:', apiUrl)
      
      const response = await fetch(apiUrl)

      console.log('Resposta da API:', { status: response.status, ok: response.ok })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao validar acesso' }))
        console.error('Erro ao obter token:', errorData)
        throw new Error(errorData.message || `Erro ${response.status}: NIF não corresponde à consulta ou consulta não encontrada`)
      }

      const data = await response.json()
      console.log('Dados recebidos:', { hasToken: !!data.token, hasRoom: !!data.room, roomUrl: data.room?.url })
      
      if (!data.token || !data.room) {
        console.error('Dados incompletos:', data)
        throw new Error('Token ou URL da sala não recebidos do servidor')
      }
      
      setConsultaData(data)
      setNif(nifToUse)
      setShowVideo(true)
    } catch (err: any) {
      setError(err.message || 'Erro ao validar acesso')
    } finally {
      setLoading(false)
    }
  }

  if (showVideo && consultaData && consultaData.token && consultaData.room) {
    // Usar o componente DailyVideoModal com os dados do paciente
    // Precisamos passar o token e URL diretamente
    const roomUrl = consultaData.room.url
    const token = consultaData.token
    const userName = consultaData.room.user_name || 'Paciente'
    
    console.log('Renderizando DailyVideoModalPaciente:', {
      consultaId,
      roomUrl,
      hasToken: !!token,
      tokenLength: token?.length,
      userName,
    })
    
    if (!roomUrl || !token) {
      console.error('Dados incompletos para renderizar:', { roomUrl, hasToken: !!token })
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
            <div className="text-center">
              <p className="text-red-600">Erro: Dados incompletos para acessar a videoconferência</p>
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <DailyVideoModalPaciente
        isOpen={true}
        onClose={() => {
          setShowVideo(false)
          router.push('/')
        }}
        consultaId={consultaId}
        nomeUsuario={userName}
        roomUrl={roomUrl}
        token={token}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso à Videoconferência
          </h1>
          <p className="text-gray-600">
            Digite o seu NIF para acessar a consulta online
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleNifSubmit} className="space-y-6">
          <div>
            <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-2">
              NIF (Número de Identificação Fiscal)
            </label>
            <input
              type="text"
              id="nif"
              value={nifInput}
              onChange={(e) => setNifInput(e.target.value)}
              placeholder="Digite o seu NIF"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              O NIF deve corresponder ao paciente da consulta
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !nifInput.trim()}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Validando...
              </>
            ) : (
              'Acessar Videoconferência'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Precisa de ajuda? Entre em contato com o hospital.
          </p>
        </div>
      </div>
    </div>
  )
}

