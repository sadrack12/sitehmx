'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DailyVideoModalPaciente from '@/components/public/DailyVideoModalPaciente'
import { Loader2, AlertCircle } from 'lucide-react'

export default function VideoconferenciaPacientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nif, setNif] = useState('')
  const [nifInput, setNifInput] = useState('')
  const [consultaData, setConsultaData] = useState<any>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [consultaId, setConsultaId] = useState<number | null>(null)

  useEffect(() => {
    // Ler ID da URL no cliente (para build estático)
    if (typeof window !== 'undefined') {
      // Tentar pegar o ID de diferentes formas da URL
      const pathParts = window.location.pathname.split('/')
      let idFromPath: number | null = null
      
      // Procurar por padrão /consulta/[id]/videoconferencia ou /consulta-videoconferencia?id=X
      const consultaIndex = pathParts.indexOf('consulta')
      if (consultaIndex >= 0 && consultaIndex < pathParts.length - 1) {
        const possibleId = parseInt(pathParts[consultaIndex + 1])
        if (!isNaN(possibleId)) {
          idFromPath = possibleId
        }
      }
      
      // Ou pegar do query string: ?id=X
      const urlParams = new URLSearchParams(window.location.search)
      const idFromQuery = urlParams.get('id')
      if (idFromQuery && !idFromPath) {
        idFromPath = parseInt(idFromQuery)
      }
      
      // Ou pegar de hash: #id=X (caso seja redirecionado)
      const hashMatch = window.location.hash.match(/id=(\d+)/)
      if (hashMatch && !idFromPath) {
        idFromPath = parseInt(hashMatch[1])
      }

      if (!idFromPath || isNaN(idFromPath)) {
        setError('ID da consulta inválido ou não encontrado na URL')
        setLoading(false)
        return
      }

      setConsultaId(idFromPath)

      // Verificar se o NIF foi passado como parâmetro na URL
      const nifParam = urlParams.get('nif')
      if (nifParam) {
        setNifInput(nifParam)
        // Tentar validar automaticamente se o NIF foi passado
        setTimeout(() => {
          handleNifSubmit(null, nifParam, idFromPath)
        }, 100)
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const handleNifSubmit = async (e: React.FormEvent | null, nifValue?: string, consultaIdParam?: number) => {
    if (e) {
      e.preventDefault()
    }
    
    const idToUse = consultaIdParam || consultaId
    const nifToUse = nifValue || nifInput.trim()
    
    if (!idToUse) {
      setError('ID da consulta não encontrado')
      return
    }
    
    if (!nifToUse) {
      setError('Por favor, insira o seu NIF')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
      const response = await fetch(`${apiUrl}/consultas/${idToUse}/documentos?nif=${encodeURIComponent(nifToUse)}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Consulta não encontrada ou NIF incorreto')
        } else if (response.status === 403) {
          setError('Acesso negado. Verifique se o NIF está correto.')
        } else {
          setError('Erro ao verificar consulta. Tente novamente.')
        }
        setLoading(false)
        return
      }

      const data = await response.json()
      
      if (data.validado) {
        setNif(nifToUse)
        setConsultaData(data.consulta)
        setShowVideo(true)
        setLoading(false)
      } else {
        setError('NIF incorreto ou consulta não encontrada')
        setLoading(false)
      }
    } catch (err) {
      console.error('Erro ao validar NIF:', err)
      setError('Erro ao conectar com o servidor. Tente novamente.')
      setLoading(false)
    }
  }

  if (loading && !showVideo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error && !showVideo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Erro</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          {consultaId && (
            <form onSubmit={(e) => handleNifSubmit(e)} className="space-y-4">
              <div>
                <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-2">
                  Digite o seu NIF para acessar a videoconferência:
                </label>
                <input
                  id="nif"
                  type="text"
                  value={nifInput}
                  onChange={(e) => setNifInput(e.target.value)}
                  placeholder="NIF"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Acessar Videoconferência
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  if (!consultaId && !showVideo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">ID da Consulta Necessário</h1>
          <p className="text-gray-600 mb-6">
            Por favor, acesse esta página com um ID de consulta válido na URL.
            <br />
            Formato: <code className="text-sm bg-gray-100 px-2 py-1 rounded">/consulta-videoconferencia?id=123</code>
          </p>
        </div>
      </div>
    )
  }

  if (showVideo && consultaId && consultaData) {
    return (
      <div className="min-h-screen bg-gray-900">
        <DailyVideoModalPaciente
          consultaId={consultaId}
          consulta={consultaData}
          isOpen={showVideo}
          onClose={() => {
            setShowVideo(false)
            router.push('/')
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Acessar Videoconferência
        </h1>
        <form onSubmit={(e) => handleNifSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-2">
              Digite o seu NIF:
            </label>
            <input
              id="nif"
              type="text"
              value={nifInput}
              onChange={(e) => setNifInput(e.target.value)}
              placeholder="NIF"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Acessar Videoconferência
          </button>
        </form>
      </div>
    </div>
  )
}
