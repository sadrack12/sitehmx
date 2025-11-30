'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Loader2, FileText, Download, Eye, FlaskConical, User, Calendar, Filter, AlertCircle, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, Layers, MoreVertical, ClipboardList } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Select from '@/components/ui/Select'
import { formatDate } from '@/utils'
import InserirResultadoModal from '@/components/gestao/laboratorio/InserirResultadoModal'

interface SolicitacaoExameLaboratorio {
  id: number
  bulk_group_id?: string
  consulta_id?: number
  paciente_id: number
  exame_id: number
  medico_solicitante_id: number
  data_solicitacao: string
  data_prevista_realizacao?: string
  data_realizacao?: string
  data_resultado?: string
  status: 'solicitado' | 'agendado' | 'em_andamento' | 'concluido' | 'cancelado'
  observacoes?: string
  resultado?: string
  arquivo_resultado?: string
  urgente: boolean
  paciente?: any
  exame?: any
  medico_solicitante?: any
  consulta?: any
  created_at?: string
}

export default function LaboratorioPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoExameLaboratorio[]>([])
  const [solicitacoesAgrupadas, setSolicitacoesAgrupadas] = useState<any[]>([])
  const [gruposExpandidos, setGruposExpandidos] = useState<Set<string>>(new Set())
  const [pacientes, setPacientes] = useState<any[]>([])
  const [exames, setExames] = useState<any[]>([])
  const [medicos, setMedicos] = useState<any[]>([])
  const [consultas, setConsultas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSolicitacao, setEditingSolicitacao] = useState<SolicitacaoExameLaboratorio | null>(null)
  const [formData, setFormData] = useState({
    consulta_id: '',
    paciente_id: '',
    exame_id: '',
    medico_solicitante_id: '',
    data_solicitacao: new Date().toISOString().split('T')[0],
    data_prevista_realizacao: '',
    data_realizacao: '',
    data_resultado: '',
    status: 'solicitado' as 'solicitado' | 'agendado' | 'em_andamento' | 'concluido' | 'cancelado',
    observacoes: '',
    resultado: '',
    arquivo_resultado: null as File | null,
    urgente: false,
  })
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [pacienteFilter, setPacienteFilter] = useState<string>('')
  const [urgenteFilter, setUrgenteFilter] = useState<string>('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  })
  const [documentosDropdown, setDocumentosDropdown] = useState<number | null>(null)
  const [showInserirResultado, setShowInserirResultado] = useState(false)
  const [solicitacaoResultado, setSolicitacaoResultado] = useState<SolicitacaoExameLaboratorio | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/gestao/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (token) {
      fetchSolicitacoes()
      fetchPacientes()
      fetchExames()
      fetchMedicos()
      fetchConsultas()
    }
  }, [token])

  const fetchPacientes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setPacientes(data.data || data || [])
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
    }
  }

  const fetchExames = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/exames`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        const examesAtivos = (data.data || data || []).filter((e: any) => e.ativo && e.tipo === 'laboratorio')
        setExames(examesAtivos)
      }
    } catch (error) {
      console.error('Erro ao buscar exames:', error)
    }
  }

  const fetchMedicos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/medicos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setMedicos((data.data || data || []).map((m: any) => ({ id: m.id, nome: m.nome })))
      }
    } catch (error) {
      console.error('Erro ao buscar médicos:', error)
    }
  }

  const fetchConsultas = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setConsultas(data.data || data || [])
      }
    } catch (error) {
      console.error('Erro ao buscar consultas:', error)
    }
  }

  const fetchSolicitacoes = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      if (pacienteFilter) params.append('paciente_id', pacienteFilter)
      if (urgenteFilter) params.append('urgente', urgenteFilter)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/laboratorio?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.ok) {
        const data = await response.json()
        const solicitacoesList = data.data || data || []
        setSolicitacoes(solicitacoesList)
        
        // Agrupar solicitações que foram criadas em massa usando bulk_group_id ou timestamp
        const grupos = new Map<string, SolicitacaoExameLaboratorio[]>()
        
        solicitacoesList.forEach((solicitacao: SolicitacaoExameLaboratorio) => {
          // Priorizar bulk_group_id se existir
          let chave: string
          
          if (solicitacao.bulk_group_id) {
            // Usar bulk_group_id para agrupar
            chave = `bulk_${solicitacao.bulk_group_id}`
          } else {
            // Fallback: agrupar por consulta_id e timestamp (agrupa por minuto)
            const timestamp = solicitacao.created_at 
              ? new Date(solicitacao.created_at).getTime()
              : Date.now()
            const minuto = Math.floor(timestamp / 60000) // Agrupa por minuto
            
            chave = solicitacao.consulta_id 
              ? `consulta_${solicitacao.consulta_id}_${minuto}`
              : `paciente_${solicitacao.paciente_id}_medico_${solicitacao.medico_solicitante_id}_${minuto}`
          }
          
          if (!grupos.has(chave)) {
            grupos.set(chave, [])
          }
          grupos.get(chave)!.push(solicitacao)
        })
        
        // Converter grupos em array
        const gruposArray = Array.from(grupos.entries()).map(([chave, solicitacoes]) => ({
          chave,
          solicitacoes,
          isGrupo: solicitacoes.length > 1,
          paciente: solicitacoes[0].paciente,
          medico: solicitacoes[0].medico_solicitante,
          data_solicitacao: solicitacoes[0].data_solicitacao,
          consulta_id: solicitacoes[0].consulta_id,
        }))
        
        setSolicitacoesAgrupadas(gruposArray)
        
        // Expandir todos os grupos por padrão
        const todosGrupos = new Set(gruposArray.filter(g => g.isGrupo).map(g => g.chave))
        setGruposExpandidos(todosGrupos)
      } else {
        toast.error('Erro ao carregar solicitações de exames')
      }
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error)
      toast.error('Erro ao carregar solicitações de exames')
    } finally {
      setLoading(false)
    }
  }, [token, searchTerm, statusFilter, pacienteFilter, urgenteFilter])

  useEffect(() => {
    fetchSolicitacoes()
  }, [fetchSolicitacoes])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.relative')) {
        setDocumentosDropdown(null)
      }
    }
    
    if (documentosDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [documentosDropdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof typeof formData]
        if (value !== null && value !== '' && key !== 'arquivo_resultado') {
          formDataToSend.append(key, value.toString())
        }
      })

      if (formData.arquivo_resultado) {
        formDataToSend.append('arquivo_resultado', formData.arquivo_resultado)
      }

      const url = editingSolicitacao
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/laboratorio/${editingSolicitacao.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/laboratorio`

      const method = editingSolicitacao ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success(
          editingSolicitacao
            ? 'Solicitação atualizada com sucesso!'
            : 'Solicitação criada com sucesso!'
        )
        setShowForm(false)
        setEditingSolicitacao(null)
        resetForm()
        fetchSolicitacoes()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erro ao salvar solicitação')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar solicitação')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (solicitacao: SolicitacaoExameLaboratorio) => {
    setEditingSolicitacao(solicitacao)
    setFormData({
      consulta_id: solicitacao.consulta_id?.toString() || '',
      paciente_id: solicitacao.paciente_id.toString(),
      exame_id: solicitacao.exame_id.toString(),
      medico_solicitante_id: solicitacao.medico_solicitante_id.toString(),
      data_solicitacao: solicitacao.data_solicitacao,
      data_prevista_realizacao: solicitacao.data_prevista_realizacao || '',
      data_realizacao: solicitacao.data_realizacao || '',
      data_resultado: solicitacao.data_resultado || '',
      status: solicitacao.status,
      observacoes: solicitacao.observacoes || '',
      resultado: solicitacao.resultado || '',
      arquivo_resultado: null,
      urgente: solicitacao.urgente,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/laboratorio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Solicitação excluída com sucesso!')
        fetchSolicitacoes()
      } else {
        toast.error('Erro ao excluir solicitação')
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      toast.error('Erro ao excluir solicitação')
    }
  }

  const handleDownload = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/laboratorio/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `resultado-exame-${id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        toast.error('Erro ao baixar arquivo')
      }
    } catch (error) {
      console.error('Erro ao baixar:', error)
      toast.error('Erro ao baixar arquivo')
    }
  }

  const resetForm = () => {
    setFormData({
      consulta_id: '',
      paciente_id: '',
      exame_id: '',
      medico_solicitante_id: '',
      data_solicitacao: new Date().toISOString().split('T')[0],
      data_prevista_realizacao: '',
      data_realizacao: '',
      data_resultado: '',
      status: 'solicitado',
      observacoes: '',
      resultado: '',
      arquivo_resultado: null,
      urgente: false,
    })
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      solicitado: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock, label: 'Solicitado' },
      agendado: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Calendar, label: 'Agendado' },
      em_andamento: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Loader2, label: 'Em Andamento' },
      concluido: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Concluído' },
      cancelado: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Cancelado' },
    }
    const badge = badges[status as keyof typeof badges] || badges.solicitado
    const Icon = badge.icon
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Laboratório</h1>
          </div>
          <button
            onClick={() => {
              resetForm()
              setEditingSolicitacao(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Solicitação
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Paciente, exame, médico..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'solicitado', label: 'Solicitado' },
                  { value: 'agendado', label: 'Agendado' },
                  { value: 'em_andamento', label: 'Em Andamento' },
                  { value: 'concluido', label: 'Concluído' },
                  { value: 'cancelado', label: 'Cancelado' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paciente</label>
              <Select
                value={pacienteFilter}
                onChange={(e) => setPacienteFilter(e.target.value)}
                options={[
                  { value: '', label: 'Todos' },
                  ...pacientes.map((p) => ({ value: p.id.toString(), label: p.nome })),
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgente</label>
              <Select
                value={urgenteFilter}
                onChange={(e) => setUrgenteFilter(e.target.value)}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'true', label: 'Sim' },
                  { value: 'false', label: 'Não' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Solicitações */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exame</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médico</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Solicitação</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solicitacoesAgrupadas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Nenhuma solicitação encontrada
                  </td>
                </tr>
              ) : (
                solicitacoesAgrupadas.map((grupo) => {
                  if (!grupo.isGrupo) {
                    // Exame único - exibir normalmente
                    const solicitacao = grupo.solicitacoes[0]
                    return (
                      <tr key={solicitacao.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{solicitacao.paciente?.nome}</div>
                          <div className="text-xs text-gray-500">{solicitacao.paciente?.nif}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{solicitacao.exame?.nome}</div>
                          <div className="text-xs text-gray-500">{solicitacao.exame?.codigo}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{solicitacao.medico_solicitante?.nome}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{formatDate(solicitacao.data_solicitacao, 'EEEE, dd/MM/yyyy')}</div>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(solicitacao.status)}</td>
                        <td className="px-4 py-3">
                          {solicitacao.urgente ? (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                              <AlertCircle className="w-3 h-3" />
                              Urgente
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {solicitacao.status !== 'concluido' && (
                              <button
                                onClick={() => {
                                  setSolicitacaoResultado(solicitacao)
                                  setShowInserirResultado(true)
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Inserir Resultado"
                              >
                                <ClipboardList className="w-4 h-4" />
                              </button>
                            )}
                            <div className="relative">
                              <button
                                onClick={() => setDocumentosDropdown(documentosDropdown === solicitacao.id ? null : solicitacao.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors relative"
                                title="Documentos"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              
                              {documentosDropdown === solicitacao.id && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                                  <div className="py-1">
                                    <button
                                      onClick={async () => {
                                        try {
                                          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                                          const url = `${apiUrl}/solicitacoes-exames/${solicitacao.id}/requisicao`
                                          const response = await fetch(url, {
                                            method: 'GET',
                                            headers: { 'Authorization': `Bearer ${token}` },
                                          })
                                          if (response.ok) {
                                            const blob = await response.blob()
                                            const blobUrl = window.URL.createObjectURL(blob)
                                            window.open(blobUrl, '_blank')
                                            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                                            setDocumentosDropdown(null)
                                            toast.success('Requisição gerada!')
                                          }
                                        } catch (error) {
                                          console.error('Erro ao gerar requisição:', error)
                                          toast.error('Erro ao gerar requisição')
                                        }
                                      }}
                                      className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      Requisição
                                    </button>
                                    
                                    {solicitacao.status === 'concluido' && solicitacao.resultado && (
                                      <button
                                        onClick={async () => {
                                          try {
                                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                                            const url = `${apiUrl}/solicitacoes-exames/${solicitacao.id}/resultado`
                                            const response = await fetch(url, {
                                              method: 'GET',
                                              headers: { 'Authorization': `Bearer ${token}` },
                                            })
                                            if (response.ok) {
                                              const blob = await response.blob()
                                              const blobUrl = window.URL.createObjectURL(blob)
                                              window.open(blobUrl, '_blank')
                                              setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                                              setDocumentosDropdown(null)
                                              toast.success('Resultado gerado!')
                                            }
                                          } catch (error) {
                                            console.error('Erro ao gerar resultado:', error)
                                            toast.error('Erro ao gerar resultado')
                                          }
                                        }}
                                        className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <ClipboardList className="w-3.5 h-3.5" />
                                        Resultado
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleEdit(solicitacao)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {solicitacao.arquivo_resultado && (
                              <button
                                onClick={() => handleDownload(solicitacao.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Baixar Resultado"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteConfirm({ isOpen: true, id: solicitacao.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  } else {
                    // Grupo de exames - exibir agrupado
                    const isExpanded = gruposExpandidos.has(grupo.chave)
                    const primeiraSolicitacao = grupo.solicitacoes[0]
                    
                    return (
                      <React.Fragment key={grupo.chave}>
                        {/* Linha do grupo (cabeçalho) */}
                        <tr 
                          className="bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors border-l-4 border-blue-600"
                          onClick={() => {
                            const novosExpandidos = new Set(gruposExpandidos)
                            if (isExpanded) {
                              novosExpandidos.delete(grupo.chave)
                            } else {
                              novosExpandidos.add(grupo.chave)
                            }
                            setGruposExpandidos(novosExpandidos)
                          }}
                        >
                          <td className="px-4 py-3" colSpan={7}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-blue-600" />
                                )}
                                <Layers className="w-4 h-4 text-blue-600" />
                                <div>
                                  <div className="text-sm font-semibold text-blue-900">
                                    {grupo.solicitacoes.length} Exame(s) Solicitado(s) em Massa
                                  </div>
                                  <div className="text-xs text-blue-700 mt-0.5">
                                    Paciente: {primeiraSolicitacao.paciente?.nome} | 
                                    Médico: {primeiraSolicitacao.medico_solicitante?.nome} | 
                                    Data: {formatDate(primeiraSolicitacao.data_solicitacao, 'dd/MM/yyyy')}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {grupo.solicitacoes.some((s: SolicitacaoExameLaboratorio) => s.urgente) && (
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Urgente
                                  </span>
                                )}
                                <button
                                  onClick={async () => {
                                    try {
                                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                                      const ids = grupo.solicitacoes.map((s: SolicitacaoExameLaboratorio) => s.id)
                                      const url = `${apiUrl}/solicitacoes-exames/requisicao-massa`
                                      const response = await fetch(url, {
                                        method: 'POST',
                                        headers: { 
                                          'Authorization': `Bearer ${token}`,
                                          'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ ids })
                                      })
                                      if (response.ok) {
                                        const blob = await response.blob()
                                        const blobUrl = window.URL.createObjectURL(blob)
                                        window.open(blobUrl, '_blank')
                                        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                                        toast.success('Requisição em massa gerada!')
                                      } else {
                                        const errorData = await response.json()
                                        toast.error(errorData.message || 'Erro ao gerar requisição em massa')
                                      }
                                    } catch (error) {
                                      console.error('Erro ao gerar requisição em massa:', error)
                                      toast.error('Erro ao gerar requisição em massa')
                                    }
                                  }}
                                  className="px-2 py-1 rounded text-xs font-medium bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 transition-colors"
                                  title="Gerar Requisição em Massa"
                                >
                                  <FileText className="w-3 h-3" />
                                  Gerar Requisição
                                </button>
                                <span className="text-xs text-blue-700">
                                  {isExpanded ? 'Ocultar' : 'Expandir'}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Linhas dos exames do grupo (quando expandido) */}
                        {isExpanded && grupo.solicitacoes.map((solicitacao: SolicitacaoExameLaboratorio) => (
                          <tr key={solicitacao.id} className="bg-blue-25 hover:bg-blue-50 border-l-4 border-blue-300">
                            <td className="px-4 py-2 pl-8">
                              <div className="text-sm text-gray-900">{solicitacao.paciente?.nome}</div>
                              <div className="text-xs text-gray-500">{solicitacao.paciente?.nif}</div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-sm text-gray-900">{solicitacao.exame?.nome}</div>
                              <div className="text-xs text-gray-500">{solicitacao.exame?.codigo}</div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-sm text-gray-900">{solicitacao.medico_solicitante?.nome}</div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-sm text-gray-900">{formatDate(solicitacao.data_solicitacao, 'EEEE, dd/MM/yyyy')}</div>
                            </td>
                            <td className="px-4 py-2">{getStatusBadge(solicitacao.status)}</td>
                            <td className="px-4 py-2">
                              {solicitacao.urgente ? (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                                  <AlertCircle className="w-3 h-3" />
                                  Urgente
                                </span>
                              ) : (
                                <span className="text-xs text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                {solicitacao.status !== 'concluido' && (
                                  <button
                                    onClick={() => {
                                      setSolicitacaoResultado(solicitacao)
                                      setShowInserirResultado(true)
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Inserir Resultado"
                                  >
                                    <ClipboardList className="w-4 h-4" />
                                  </button>
                                )}
                                <div className="relative">
                                  <button
                                    onClick={() => setDocumentosDropdown(documentosDropdown === solicitacao.id ? null : solicitacao.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors relative"
                                    title="Documentos"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  
                                  {documentosDropdown === solicitacao.id && (
                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                                      <div className="py-1">
                                        <button
                                          onClick={async () => {
                                            try {
                                              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                                              const url = `${apiUrl}/solicitacoes-exames/${solicitacao.id}/requisicao`
                                              const response = await fetch(url, {
                                                method: 'GET',
                                                headers: { 'Authorization': `Bearer ${token}` },
                                              })
                                              if (response.ok) {
                                                const blob = await response.blob()
                                                const blobUrl = window.URL.createObjectURL(blob)
                                                window.open(blobUrl, '_blank')
                                                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                                                setDocumentosDropdown(null)
                                                toast.success('Requisição gerada!')
                                              }
                                            } catch (error) {
                                              console.error('Erro ao gerar requisição:', error)
                                              toast.error('Erro ao gerar requisição')
                                            }
                                          }}
                                          className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                          <FileText className="w-3.5 h-3.5" />
                                          Requisição
                                        </button>
                                        
                                        {solicitacao.status === 'concluido' && solicitacao.resultado && (
                                          <button
                                            onClick={async () => {
                                              try {
                                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                                                const url = `${apiUrl}/solicitacoes-exames/${solicitacao.id}/resultado`
                                                const response = await fetch(url, {
                                                  method: 'GET',
                                                  headers: { 'Authorization': `Bearer ${token}` },
                                                })
                                                if (response.ok) {
                                                  const blob = await response.blob()
                                                  const blobUrl = window.URL.createObjectURL(blob)
                                                  window.open(blobUrl, '_blank')
                                                  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                                                  setDocumentosDropdown(null)
                                                  toast.success('Resultado gerado!')
                                                }
                                              } catch (error) {
                                                console.error('Erro ao gerar resultado:', error)
                                                toast.error('Erro ao gerar resultado')
                                              }
                                            }}
                                            className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                          >
                                            <ClipboardList className="w-3.5 h-3.5" />
                                            Resultado
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <button
                                  onClick={() => handleEdit(solicitacao)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {solicitacao.arquivo_resultado && (
                                  <button
                                    onClick={() => handleDownload(solicitacao.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                    title="Baixar Resultado"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => setDeleteConfirm({ isOpen: true, id: solicitacao.id })}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )
                  }
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSolicitacao ? 'Editar Solicitação' : 'Nova Solicitação'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consulta (Opcional)</label>
                  <Select
                    value={formData.consulta_id}
                    onChange={(e) => setFormData({ ...formData, consulta_id: e.target.value })}
                    options={[
                      { value: '', label: 'Selecione uma consulta' },
                      ...consultas.map((c) => ({
                        value: c.id.toString(),
                        label: `${formatDate(c.data_consulta, 'dd/MM/yyyy')} - ${c.paciente?.nome}`,
                      })),
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paciente *</label>
                  <Select
                    value={formData.paciente_id}
                    onChange={(e) => setFormData({ ...formData, paciente_id: e.target.value })}
                    options={[
                      { value: '', label: 'Selecione um paciente' },
                      ...pacientes.map((p) => ({ value: p.id.toString(), label: `${p.nome} - ${p.nif}` })),
                    ]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exame *</label>
                  <Select
                    value={formData.exame_id}
                    onChange={(e) => setFormData({ ...formData, exame_id: e.target.value })}
                    options={[
                      { value: '', label: 'Selecione um exame' },
                      ...exames.map((e) => ({ value: e.id.toString(), label: `${e.nome} (${e.codigo})` })),
                    ]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Médico Solicitante *</label>
                  <Select
                    value={formData.medico_solicitante_id}
                    onChange={(e) => setFormData({ ...formData, medico_solicitante_id: e.target.value })}
                    options={[
                      { value: '', label: 'Selecione um médico' },
                      ...medicos.map((m) => ({ value: m.id.toString(), label: m.nome })),
                    ]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Solicitação *</label>
                  <input
                    type="date"
                    value={formData.data_solicitacao}
                    onChange={(e) => setFormData({ ...formData, data_solicitacao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Prevista Realização</label>
                  <input
                    type="date"
                    value={formData.data_prevista_realizacao}
                    onChange={(e) => setFormData({ ...formData, data_prevista_realizacao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                {formData.status !== 'solicitado' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Realização</label>
                      <input
                        type="date"
                        value={formData.data_realizacao}
                        onChange={(e) => setFormData({ ...formData, data_realizacao: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    {formData.status === 'concluido' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Resultado</label>
                        <input
                          type="date"
                          value={formData.data_resultado}
                          onChange={(e) => setFormData({ ...formData, data_resultado: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    )}
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    options={[
                      { value: 'solicitado', label: 'Solicitado' },
                      { value: 'agendado', label: 'Agendado' },
                      { value: 'em_andamento', label: 'Em Andamento' },
                      { value: 'concluido', label: 'Concluído' },
                      { value: 'cancelado', label: 'Cancelado' },
                    ]}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="urgente"
                    checked={formData.urgente}
                    onChange={(e) => setFormData({ ...formData, urgente: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="urgente" className="text-sm font-medium text-gray-700">
                    Urgente
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              {formData.status === 'concluido' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resultado</label>
                    <textarea
                      value={formData.resultado}
                      onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Digite o resultado do exame..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Arquivo de Resultado</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          arquivo_resultado: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    {editingSolicitacao?.arquivo_resultado && (
                      <p className="text-xs text-gray-500 mt-1">
                        Arquivo atual: {editingSolicitacao.arquivo_resultado}
                      </p>
                    )}
                  </div>
                </>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingSolicitacao(null)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita."
        onConfirm={() => {
          if (deleteConfirm.id) {
            handleDelete(deleteConfirm.id)
          }
          setDeleteConfirm({ isOpen: false, id: null })
        }}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
      />

      {/* Modal de Inserir Resultado */}
      {showInserirResultado && solicitacaoResultado && (
        <InserirResultadoModal
          solicitacao={solicitacaoResultado}
          onClose={() => {
            setShowInserirResultado(false)
            setSolicitacaoResultado(null)
          }}
          onSuccess={() => {
            fetchSolicitacoes()
          }}
        />
      )}
    </div>
  )
}

