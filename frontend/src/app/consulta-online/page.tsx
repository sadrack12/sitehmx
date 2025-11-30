'use client'

import { useState, useEffect } from 'react'
import { Video, Search, Calendar, User, Stethoscope, Loader, AlertCircle, FileText, Download } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { formatDate } from '@/utils'
import { useRouter } from 'next/navigation'

export default function ConsultaOnlinePage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Buscar por NIF, 2: Lista de consultas
  const [nif, setNif] = useState('')
  const [loading, setLoading] = useState(false)
  const [consultas, setConsultas] = useState<any[]>([])
  const [documentosPorConsulta, setDocumentosPorConsulta] = useState<Record<number, any[]>>({})
  const [loadingDocumentos, setLoadingDocumentos] = useState<Record<number, boolean>>({})

  const formatNIF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.slice(0, 9)
  }

  const buscarConsultas = async () => {
    if (!nif || nif.length < 9) {
      toast.error('Por favor, digite um NIF válido (9 dígitos)')
      return
    }

    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
      const response = await fetch(`${apiUrl}/consulta-online/buscar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nif }),
      })

      if (response.ok) {
        const data = await response.json()
        setConsultas(data.consultas || [])
        if (data.consultas && data.consultas.length > 0) {
          setStep(2)
          // Buscar documentos para cada consulta
          data.consultas.forEach((consulta: any) => {
            buscarDocumentos(consulta.id)
          })
        } else {
          toast.info('Nenhuma consulta online encontrada para este NIF')
        }
      } else {
        toast.error('Erro ao buscar consultas')
      }
    } catch (error) {
      console.error('Erro ao buscar consultas:', error)
      toast.error('Erro ao buscar consultas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const buscarDocumentos = async (consultaId: number) => {
    setLoadingDocumentos(prev => ({ ...prev, [consultaId]: true }))
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'}/consultas/${consultaId}/documentos?nif=${encodeURIComponent(nif)}`
      )

      if (response.ok) {
        const data = await response.json()
        setDocumentosPorConsulta(prev => ({
          ...prev,
          [consultaId]: data.documentos || []
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
    } finally {
      setLoadingDocumentos(prev => ({ ...prev, [consultaId]: false }))
    }
  }

  const abrirDocumento = (url: string) => {
    // Se a URL já começa com /api/, usar diretamente sem adicionar API_URL
    // Se começa com http, usar diretamente
    // Caso contrário, adicionar API_URL
    let fullUrl: string
    if (url.startsWith('http')) {
      fullUrl = url
    } else if (url.startsWith('/api/')) {
      // URL já tem /api/, usar diretamente com o domínio
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
      const baseUrl = apiUrl.replace('/api', '') // Remove /api para não duplicar
      fullUrl = `${baseUrl}${url}`
    } else {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
      fullUrl = `${apiUrl}${url}`
    }
    window.open(fullUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Video className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Consultas Online</h1>
          <p className="text-gray-600">Acesse suas consultas por videoconferência</p>
        </div>

        {/* Step 1: Buscar por NIF */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Buscar Consultas</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digite seu NIF *
                </label>
                <input
                  type="text"
                  value={nif}
                  onChange={(e) => setNif(formatNIF(e.target.value))}
                  maxLength={9}
                  placeholder="000000000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center text-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      buscarConsultas()
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Digite seu NIF para encontrar suas consultas online
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={buscarConsultas}
                  disabled={loading || !nif || nif.length < 9}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      Buscar Consultas
                      <Search className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Lista de Consultas */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Suas Consultas Online</h2>
              </div>
              <button
                onClick={() => {
                  setStep(1)
                  setConsultas([])
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Buscar outra
              </button>
            </div>

            {consultas.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma consulta online encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {consultas.map((consulta) => (
                  <div
                    key={consulta.id}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Stethoscope className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-bold text-gray-900">
                            {consulta.medico?.nome || 'Médico não atribuído'}
                          </h3>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              <strong>Data:</strong> {formatDate(consulta.data_consulta, 'EEEE, dd/MM/yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>
                              <strong>Paciente:</strong> {consulta.paciente?.nome}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              consulta.status === 'realizada'
                                ? 'bg-green-100 text-green-800'
                                : consulta.status === 'confirmada'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {consulta.status === 'realizada' ? 'Em andamento' : consulta.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <button
                          onClick={() => {
                            if (consulta.sala_videoconferencia) {
                              // Redirecionar para a página de videoconferência com o ID da consulta e NIF
                              router.push(`/consulta-videoconferencia?id=${consulta.id}&nif=${encodeURIComponent(nif)}`)
                            }
                          }}
                          disabled={loading || !consulta.sala_videoconferencia}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {consulta.sala_videoconferencia ? (
                            <>
                              Entrar na Videoconferência
                              <Video className="w-4 h-4" />
                            </>
                          ) : (
                            'Aguardando início'
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Seção de Documentos */}
                    {(documentosPorConsulta[consulta.id]?.length > 0 || loadingDocumentos[consulta.id]) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-gray-900">Documentos Disponíveis</h4>
                        </div>
                        {loadingDocumentos[consulta.id] ? (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Loader className="w-4 h-4 animate-spin" />
                            Carregando documentos...
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {documentosPorConsulta[consulta.id]?.map((doc: any, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => abrirDocumento(doc.url)}
                                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                              >
                                <Download className="w-4 h-4" />
                                {doc.nome}
                                {doc.quantidade && (
                                  <span className="px-1.5 py-0.5 bg-blue-200 rounded text-xs">
                                    {doc.quantidade}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  )
}

