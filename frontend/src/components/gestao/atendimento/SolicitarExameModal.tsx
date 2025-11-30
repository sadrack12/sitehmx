'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { FlaskConical, X, Loader2, AlertCircle, Search, Clock, CheckCircle } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import Select from '@/components/ui/Select'
import { formatDate } from '@/utils'

interface Consulta {
  id: number
  paciente_id: number
  medico_id: number
  paciente?: {
    id: number
    nome: string
    nif: string
  }
  medico?: {
    id: number
    nome: string
  }
}

interface SolicitarExameModalProps {
  consulta: Consulta
  onClose: () => void
  onSuccess: () => void
  inline?: boolean
}

export default function SolicitarExameModal({ consulta, onClose, onSuccess, inline = false }: SolicitarExameModalProps) {
  const { token } = useAuth()
  const [exames, setExames] = useState<any[]>([])
  const [examesFiltrados, setExamesFiltrados] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [examesSelecionados, setExamesSelecionados] = useState<number[]>([])
  const [historicoSolicitacoes, setHistoricoSolicitacoes] = useState<any[]>([])
  const [loadingHistorico, setLoadingHistorico] = useState(true)
  const [formData, setFormData] = useState({
    observacoes: '',
    urgente: false,
  })

  useEffect(() => {
    fetchExames()
    fetchHistorico()
  }, [consulta.id])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setExamesFiltrados(exames)
    } else {
      const termo = searchTerm.toLowerCase()
      const filtrados = exames.filter(
        (exame) =>
          exame.nome.toLowerCase().includes(termo) ||
          exame.codigo?.toLowerCase().includes(termo) ||
          exame.descricao?.toLowerCase().includes(termo)
      )
      setExamesFiltrados(filtrados)
    }
  }, [searchTerm, exames])

  const fetchExames = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/exames`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        const examesAtivos = (data.data || data || []).filter(
          (e: any) => e.ativo && e.tipo === 'laboratorio'
        )
        setExames(examesAtivos)
        setExamesFiltrados(examesAtivos)
      } else {
        toast.error('Erro ao carregar exames')
      }
    } catch (error) {
      console.error('Erro ao buscar exames:', error)
      toast.error('Erro ao carregar exames')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistorico = async () => {
    try {
      setLoadingHistorico(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/laboratorio?consulta_id=${consulta.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.ok) {
        const data = await response.json()
        const solicitacoes = data.data || data || []
        setHistoricoSolicitacoes(solicitacoes)
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
    } finally {
      setLoadingHistorico(false)
    }
  }

  const handleToggleExame = (exameId: number) => {
    setExamesSelecionados((prev) => {
      if (prev.includes(exameId)) {
        return prev.filter((id) => id !== exameId)
      } else {
        return [...prev, exameId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (examesSelecionados.length === 0) {
      toast.error('Selecione pelo menos um exame')
      return
    }

    // Verificar se consulta.id existe
    if (!consulta?.id) {
      console.error('Consulta ID não encontrado:', consulta)
      toast.error('Erro: ID da consulta não encontrado')
      return
    }

    setSaving(true)

    try {
      // Se houver múltiplos exames, usar formato bulk
      if (examesSelecionados.length > 1) {
        const bulkData = {
          consulta_id: consulta.id,
          paciente_id: consulta.paciente_id || consulta.paciente?.id,
          medico_solicitante_id: consulta.medico_id || consulta.medico?.id,
          data_solicitacao: new Date().toISOString().split('T')[0],
          data_prevista_realizacao: null,
          observacoes: formData.observacoes,
          urgente: formData.urgente,
          exames: examesSelecionados, // Array de IDs dos exames
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/laboratorio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bulkData),
        })

        if (response.ok) {
          const result = await response.json()
          toast.success(`${examesSelecionados.length} exame(s) solicitado(s) em massa com sucesso!`)
          // Atualizar histórico após sucesso
          await fetchHistorico()
          onSuccess()
          onClose()
        } else {
          const errorData = await response.json()
          toast.error(errorData.message || 'Erro ao solicitar exames em massa')
        }
      } else {
        // Se for apenas um exame, usar formato normal
        const solicitacao = {
          consulta_id: consulta.id,
          paciente_id: consulta.paciente_id || consulta.paciente?.id,
          exame_id: examesSelecionados[0],
          medico_solicitante_id: consulta.medico_id || consulta.medico?.id,
          data_solicitacao: new Date().toISOString().split('T')[0],
          data_prevista_realizacao: null,
          observacoes: formData.observacoes,
          urgente: formData.urgente,
          status: 'solicitado',
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/laboratorio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(solicitacao),
        })

        if (response.ok) {
          toast.success('Exame solicitado com sucesso!')
          // Atualizar histórico após sucesso
          await fetchHistorico()
          onSuccess()
          onClose()
        } else {
          const errorData = await response.json()
          toast.error(errorData.message || 'Erro ao solicitar exame')
        }
      }
    } catch (error) {
      console.error('Erro ao solicitar exames:', error)
      toast.error('Erro ao solicitar exames')
    } finally {
      setSaving(false)
    }
  }

  const content = (
    <div className={`${inline ? 'w-full h-full' : 'bg-white rounded-lg max-w-2xl w-full max-h-[90vh]'} overflow-y-auto`}>
      {!inline && (
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlaskConical className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Solicitar Exames Laboratoriais</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`${inline ? 'p-4' : 'p-6'} space-y-4`}>
          {/* Informações da Consulta */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Informações da Consulta</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Paciente:</span>
                <span className="ml-2 text-blue-900">{consulta.paciente?.nome}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Médico:</span>
                <span className="ml-2 text-blue-900">{consulta.medico?.nome}</span>
              </div>
            </div>
          </div>

          {/* Histórico de Exames Solicitados */}
          {historicoSolicitacoes.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Histórico de Exames Solicitados ({historicoSolicitacoes.length})
                </h3>
              </div>
              {loadingHistorico ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {historicoSolicitacoes.map((solicitacao) => (
                    <div
                      key={solicitacao.id}
                      className="flex items-start justify-between bg-white border border-gray-200 rounded p-2 text-xs"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {solicitacao.exame?.nome || 'Exame'}
                          </span>
                          {solicitacao.urgente && (
                            <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                              <AlertCircle className="w-2.5 h-2.5" />
                              Urgente
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 mt-0.5">
                          {formatDate(solicitacao.data_solicitacao, 'dd/MM/yyyy')} •{' '}
                          <span className="capitalize">{solicitacao.status}</span>
                        </div>
                      </div>
                      <div className="ml-2">
                        {solicitacao.status === 'concluido' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Seleção de Exames */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exames Laboratoriais * (Selecione um ou mais)
            </label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {/* Campo de Busca */}
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nome, código ou descrição..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {examesFiltrados.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      {searchTerm ? 'Nenhum exame encontrado' : 'Nenhum exame laboratorial disponível'}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {examesFiltrados.map((exame) => {
                        const isSelected = examesSelecionados.includes(exame.id)
                        const jaSolicitado = historicoSolicitacoes.some(
                          (s) => s.exame_id === exame.id
                        )
                        return (
                          <div
                            key={exame.id}
                            className={`p-2 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50 border-l-4 border-blue-600'
                                : jaSolicitado
                                ? 'bg-yellow-50 border-l-4 border-yellow-400'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleToggleExame(exame.id)}
                          >
                            <div className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleExame(exame.id)}
                                className="mt-0.5 w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-gray-900 text-sm">{exame.nome}</span>
                                  {exame.codigo && (
                                    <span className="text-xs text-gray-500">({exame.codigo})</span>
                                  )}
                                  {jaSolicitado && (
                                    <span className="text-xs text-yellow-700 font-medium flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Já solicitado
                                    </span>
                                  )}
                                </div>
                                {exame.descricao && (
                                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{exame.descricao}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                  {exame.requer_jejum && (
                                    <div className="flex items-center gap-0.5 text-orange-600">
                                      <AlertCircle className="w-2.5 h-2.5" />
                                      <span>Requer jejum</span>
                                    </div>
                                  )}
                                  {exame.prazo_resultado && (
                                    <span>Prazo: {exame.prazo_resultado} dia(s)</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                {searchTerm && examesFiltrados.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Mostrando {examesFiltrados.length} de {exames.length} exames
                  </div>
                )}
              </>
            )}
            {examesSelecionados.length > 0 && (
              <div className="mt-2 text-sm text-gray-600 font-medium">
                {examesSelecionados.length} exame(s) selecionado(s)
              </div>
            )}
          </div>

          {/* Urgente */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="urgente"
              checked={formData.urgente}
              onChange={(e) => setFormData({ ...formData, urgente: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="urgente" className="text-sm font-medium text-gray-700">
              Marcar como urgente
            </label>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={4}
              placeholder="Adicione observações sobre a solicitação do exame..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          {!inline && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={saving || examesSelecionados.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Solicitando...
              </>
            ) : (
              <>
                <FlaskConical className="w-4 h-4" />
                Solicitar {examesSelecionados.length > 0 ? `${examesSelecionados.length} ` : ''}Exame{examesSelecionados.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )

  if (inline) {
    return content
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {content}
    </div>
  )
}

