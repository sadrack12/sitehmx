'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatDateTime } from '@/utils'
import { toast } from '@/components/ui/Toast'
import { Plus, Search, Calendar, Clock, User, Stethoscope, Edit, Trash2, Filter, Eye, ChevronUp, ChevronDown, CheckCircle, XCircle, ClipboardList, Globe, FlaskConical, Building2, ChevronLeft, ChevronRight, FileText, Pill, FileCheck, Receipt, MoreVertical, ArrowRightLeft, Video, AlertTriangle, X } from 'lucide-react'
import ConsultaModal from './ConsultaModal'
import ConsultaDetailsModal from './ConsultaDetailsModal'
import AnamneseForm from './AnamneseForm'
import SolicitarExameModal from './SolicitarExameModal'
import PrescricaoForm from './PrescricaoForm'
import TransferirVagaModal from './TransferirVagaModal'
import VideoconferenciaModal from './VideoconferenciaModal'
import DailyVideoModal from './DailyVideoModal'
import VideoconferenciaPropriaModal from './VideoconferenciaPropriaModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Select from '@/components/ui/Select'

interface Consulta {
  id: number
  paciente_id: number
  medico_id: number
  sala_id?: number
  data_consulta: string
  hora_consulta: string
  tipo_consulta: string
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada'
  agendada_online?: boolean
  consulta_online?: boolean
  link_videoconferencia?: string
  sala_videoconferencia?: string
  observacoes?: string
  prescricao?: any
  paciente?: {
    id: number
    nome: string
    nif: string
  }
  medico?: {
    id: number
    nome: string
    especialidade?: string
  }
  sala?: {
    id: number
    numero: string
    nome?: string
  }
}

export default function ConsultasTab() {
  const { token } = useAuth()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    data: '',
    medico_id: '',
  })
  const [medicos, setMedicos] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'data_consulta',
    direction: 'desc',
  })
  const [showModal, setShowModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showAnamnese, setShowAnamnese] = useState(false)
  const [showSolicitarExame, setShowSolicitarExame] = useState(false)
  const [showPrescricao, setShowPrescricao] = useState(false)
  const [exameConsulta, setExameConsulta] = useState<Consulta | null>(null)
  const [editingConsulta, setEditingConsulta] = useState<Consulta | null>(null)
  const [viewingConsulta, setViewingConsulta] = useState<Consulta | null>(null)
  const [anamneseConsulta, setAnamneseConsulta] = useState<Consulta | null>(null)
  const [prescricaoConsulta, setPrescricaoConsulta] = useState<Consulta | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  })
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 5
  const [documentosDropdown, setDocumentosDropdown] = useState<number | null>(null)
  const [showAtestadoModal, setShowAtestadoModal] = useState(false)
  const [consultaAtestado, setConsultaAtestado] = useState<Consulta | null>(null)
  const [atestadoData, setAtestadoData] = useState({
    tipo_atestado: 'saude',
    dias_afastamento: '',
    cid: '',
    observacoes: '',
  })
  const [showTransferirVaga, setShowTransferirVaga] = useState(false)
  const [consultaTransferir, setConsultaTransferir] = useState<Consulta | null>(null)
  const [showVideoconferencia, setShowVideoconferencia] = useState(false)
  const [videoconferenciaData, setVideoconferenciaData] = useState<{ salaId: string; nomeUsuario: string; consultaId: number } | null>(null)
  const [useDaily, setUseDaily] = useState(true) // Usar Daily.co por padrão
  const [showVideoconferenciaPropria, setShowVideoconferenciaPropria] = useState(false)
  const [consultaVideoconferencia, setConsultaVideoconferencia] = useState<Consulta | null>(null)

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicos`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          // Backend retorna array direto ou dentro de data
          const medicosList = Array.isArray(data) ? data : (data.data || [])
          console.log('Médicos carregados:', medicosList)
          setMedicos(medicosList)
          if (medicosList.length === 0) {
            console.warn('Nenhum médico encontrado no banco de dados')
          }
        } else {
          const errorText = await response.text()
          console.error('Erro ao buscar médicos:', response.status, errorText)
          toast.error('Erro ao carregar lista de médicos')
        }
      } catch (error: any) {
        console.error('Erro ao buscar médicos:', error)
        // Verificar se é erro de certificado SSL
        if (error.message?.includes('CERT') || error.message?.includes('certificate') || error.name === 'TypeError' && error.message?.includes('Failed to fetch')) {
          toast.error('Erro de certificado SSL. Por favor, aceite o certificado no navegador (clique em "Avançado" → "Continuar") e recarregue a página.')
        } else {
          toast.error('Erro ao carregar lista de médicos')
        }
      }
    }
    if (token) {
      fetchMedicos()
    }
  }, [token])

  const fetchConsultas = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filters.status) params.append('status', filters.status)
      if (filters.data) params.append('data', filters.data)
      if (filters.medico_id) params.append('medico_id', filters.medico_id)

      const url = `${process.env.NEXT_PUBLIC_API_URL}/consultas${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setConsultas(data.data || data || [])
      } else if (response.status === 403) {
        toast.error('Acesso negado. Você não tem permissão para ver consultas.')
      } else if (response.status === 422) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.errors 
          ? Object.values(errorData.errors).flat().join(', ')
          : 'Erro de validação ao carregar consultas'
        toast.error(errorMessage)
      } else {
        toast.error('Erro ao carregar consultas')
      }
    } catch (error: any) {
      console.error('Erro ao buscar consultas:', error)
      // Verificar se é erro de certificado SSL
      if (error.message?.includes('CERT') || error.message?.includes('certificate') || (error.name === 'TypeError' && error.message?.includes('Failed to fetch'))) {
        toast.error('Erro de certificado SSL. Por favor, aceite o certificado no navegador (clique em "Avançado" → "Continuar") e recarregue a página.')
      } else {
        toast.error('Erro ao carregar consultas')
      }
    } finally {
      setLoading(false)
    }
  }, [token, searchTerm, filters])

  useEffect(() => {
    fetchConsultas()
    setPaginaAtual(1) // Resetar para primeira página ao mudar filtros
  }, [fetchConsultas])

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

  const handleDelete = async () => {
    if (!deleteConfirm.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Consulta excluída com sucesso!')
        fetchConsultas()
      } else {
        toast.error('Erro ao excluir consulta')
      }
    } catch (error) {
      toast.error('Erro ao excluir consulta')
    } finally {
      setDeleteConfirm({ isOpen: false, id: null })
    }
  }

  const handleDeleteAll = async () => {
    if (!deleteAllConfirm) {
      setDeleteAllConfirm(true)
      return
    }

    try {
      setDeletingAll(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas/all?confirm=true`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message || 'Todas as consultas foram excluídas com sucesso!')
        fetchConsultas()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erro ao excluir consultas')
      }
    } catch (error) {
      toast.error('Erro ao excluir consultas')
    } finally {
      setDeletingAll(false)
      setDeleteAllConfirm(false)
    }
  }

  const handleStatusChange = async (consultaId: number, newStatus: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas/${consultaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Status atualizado com sucesso!')
        fetchConsultas()
      } else {
        toast.error('Erro ao atualizar status')
      }
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const handleIniciarConsultaOnline = async (consultaId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas/${consultaId}/iniciar-online`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Consulta online iniciada!')
        fetchConsultas()
        
        // Abrir modal de videoconferência
        const consultaAtualizada = consultas.find(c => c.id === consultaId) || data.consulta
        setVideoconferenciaData({
          salaId: data.sala_id || '',
          nomeUsuario: consultaAtualizada?.medico?.nome || 'Médico',
          consultaId: consultaId
        })
        setShowVideoconferencia(true)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erro ao iniciar consulta online')
      }
    } catch (error) {
      toast.error('Erro ao iniciar consulta online')
    }
  }

  const handleSort = (field: string) => {
    setSortBy({
      field,
      direction: sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  const sortedConsultas = [...consultas].sort((a, b) => {
    let aValue: any = a[sortBy.field as keyof Consulta]
    let bValue: any = b[sortBy.field as keyof Consulta]

    if (sortBy.field === 'data_consulta') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    } else if (sortBy.field === 'tipo_consulta' || sortBy.field === 'status') {
      aValue = aValue?.toLowerCase() || ''
      bValue = bValue?.toLowerCase() || ''
    } else if (sortBy.field === 'paciente') {
      aValue = a.paciente?.nome?.toLowerCase() || ''
      bValue = b.paciente?.nome?.toLowerCase() || ''
    } else if (sortBy.field === 'medico') {
      aValue = a.medico?.nome?.toLowerCase() || ''
      bValue = b.medico?.nome?.toLowerCase() || ''
    }

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy.field !== field) return null
    return sortBy.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
  }

  const stats = {
    total: consultas.length,
    agendadas: consultas.filter(c => c.status === 'agendada').length,
    confirmadas: consultas.filter(c => c.status === 'confirmada').length,
    realizadas: consultas.filter(c => c.status === 'realizada').length,
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      agendada: 'bg-yellow-100 text-yellow-700',
      confirmada: 'bg-blue-100 text-blue-700',
      realizada: 'bg-green-100 text-green-700',
      cancelada: 'bg-red-100 text-red-700',
    }

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultas Externas</h1>
            <p className="text-gray-600 mt-1">Gerencie todas as consultas agendadas</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Total</div>
          <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-xs text-yellow-700 mb-1">Agendadas</div>
          <div className="text-lg font-semibold text-yellow-900">{stats.agendadas}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-700 mb-1">Confirmadas</div>
          <div className="text-lg font-semibold text-blue-900">{stats.confirmadas}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-700 mb-1">Realizadas</div>
          <div className="text-lg font-semibold text-green-900">{stats.realizadas}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por paciente, médico ou tipo..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            icon={<Filter className="w-4 h-4" />}
          >
            <option value="">Todos os status</option>
            <option value="agendada">Agendada</option>
            <option value="confirmada">Confirmada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </Select>
          <Select
            value={filters.medico_id}
            onChange={(e) => setFilters({ ...filters, medico_id: e.target.value })}
            icon={<Stethoscope className="w-4 h-4" />}
          >
            <option value="">Todos os médicos</option>
            {medicos.length > 0 ? (
              medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} {m.especialidade ? `- ${m.especialidade}` : ''}
                </option>
              ))
            ) : (
              <option value="" disabled>Nenhum médico cadastrado</option>
            )}
          </Select>
          <input
            type="date"
            value={filters.data}
            onChange={(e) => setFilters({ ...filters, data: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
          />
          <button
            onClick={() => {
              setEditingConsulta(null)
              setShowModal(true)
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Nova
          </button>
          {consultas.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Apagar todas as consultas"
            >
              {deletingAll ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Apagando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Apagar Todas
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Table List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando...</p>
        </div>
      ) : consultas.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-600">
            {searchTerm || filters.status || filters.data || filters.medico_id
              ? 'Nenhuma consulta encontrada'
              : 'Nenhuma consulta cadastrada'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('data_consulta')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase hover:text-gray-900 transition-colors"
                    >
                      Data/Hora
                      <SortIcon field="data_consulta" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('tipo_consulta')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase hover:text-gray-900 transition-colors"
                    >
                      Tipo
                      <SortIcon field="tipo_consulta" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('paciente')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase hover:text-gray-900 transition-colors"
                    >
                      Paciente
                      <SortIcon field="paciente" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('medico')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase hover:text-gray-900 transition-colors"
                    >
                      Médico
                      <SortIcon field="medico" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Sala
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase hover:text-gray-900 transition-colors"
                    >
                      Status
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(() => {
                  // Calcular paginação
                  const totalPaginas = Math.ceil(sortedConsultas.length / itensPorPagina)
                  const inicio = (paginaAtual - 1) * itensPorPagina
                  const fim = inicio + itensPorPagina
                  const consultasPaginaAtual = sortedConsultas.slice(inicio, fim)
                  
                  return consultasPaginaAtual.map((consulta) => (
                  <tr
                    key={consulta.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{formatDate(consulta.data_consulta, 'dd/MM/yyyy')}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {consulta.hora_consulta}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{consulta.tipo_consulta}</span>
                    </td>
                    <td className="px-4 py-3">
                      {consulta.paciente ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{consulta.paciente.nome}</div>
                            <div className="text-xs text-gray-500">NIF: {consulta.paciente.nif}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {consulta.medico ? (
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-900">{consulta.medico.nome}</div>
                            {consulta.medico.especialidade && (
                              <div className="text-xs text-gray-500">{consulta.medico.especialidade}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {consulta.sala ? (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{consulta.sala.numero}</div>
                            {consulta.sala.nome && (
                              <div className="text-xs text-gray-500">{consulta.sala.nome}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(consulta.status)}
                        {consulta.agendada_online && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700" title="Agendada Online">
                            <Globe className="w-3 h-3" />
                            Online
                          </span>
                        )}
                        {consulta.consulta_online && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700" title="Consulta Online">
                            <Video className="w-3 h-3" />
                            Video
                          </span>
                        )}
                        {consulta.consulta_online && (consulta.status === 'agendada' || consulta.status === 'confirmada') && !consulta.link_videoconferencia && (
                          <button
                            onClick={() => handleIniciarConsultaOnline(consulta.id)}
                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                            title="Iniciar consulta online"
                          >
                            <Video className="w-4 h-4" />
                          </button>
                        )}
                        {consulta.sala_videoconferencia && consulta.consulta_online && (
                          <button
                            onClick={() => {
                              setVideoconferenciaData({
                                salaId: consulta.sala_videoconferencia || '',
                                nomeUsuario: consulta.medico?.nome || 'Médico',
                                consultaId: consulta.id
                              })
                              setShowVideoconferencia(true)
                            }}
                            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                            title="Acessar videoconferência (como anfitrião)"
                          >
                            <Video className="w-4 h-4" />
                          </button>
                        )}
                        {consulta.status !== 'realizada' && (
                          <>
                            {consulta.status === 'agendada' && (
                              <button
                                onClick={() => handleStatusChange(consulta.id, 'confirmada')}
                                className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title="Confirmar"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {consulta.status === 'confirmada' && (
                              <button
                                onClick={() => handleStatusChange(consulta.id, 'realizada')}
                                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                                title="Marcar como realizada"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {(consulta.status === 'agendada' || consulta.status === 'confirmada') && (
                              <button
                                onClick={() => handleStatusChange(consulta.id, 'cancelada')}
                                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Cancelar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        <button
                          onClick={() => {
                            setViewingConsulta(consulta)
                            setShowDetails(true)
                          }}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Botão de Transferir Vaga */}
                        {consulta.status !== 'realizada' && consulta.status !== 'cancelada' && (
                          <button
                            onClick={() => {
                              setConsultaTransferir(consulta)
                              setShowTransferirVaga(true)
                            }}
                            className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Transferir Vaga"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                        )}
                        
                        {/* Botão de Recibo - Sempre visível na listagem */}
                        <button
                          onClick={async () => {
                            try {
                              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                              const url = `${apiUrl}/consultas/${consulta.id}/recibo`
                              const response = await fetch(url, {
                                method: 'GET',
                                headers: { 'Authorization': `Bearer ${token}` },
                              })
                              if (response.ok) {
                                const blob = await response.blob()
                                const blobUrl = window.URL.createObjectURL(blob)
                                window.open(blobUrl, '_blank')
                                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                                toast.success('Recibo gerado!')
                              } else {
                                toast.error('Erro ao gerar recibo')
                              }
                            } catch (error) {
                              console.error('Erro ao gerar recibo:', error)
                              toast.error('Erro ao gerar recibo')
                            }
                          }}
                          className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Gerar Recibo"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                        
                        {/* Botões que aparecem apenas quando consulta está confirmada ou realizada */}
                        {(consulta.status === 'confirmada' || consulta.status === 'realizada') && (
                          <>
                            {/* Botões de Prescrição */}
                            <button
                              onClick={() => {
                                setPrescricaoConsulta(consulta)
                                setShowPrescricao(true)
                              }}
                              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Emitir Prescrição Médica"
                            >
                              <Pill className="w-4 h-4" />
                            </button>
                            {consulta.prescricao && (
                              <button
                                onClick={async () => {
                                  try {
                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                                    const url = `${apiUrl}/consultas/${consulta.id}/prescricao`
                                    const response = await fetch(url, {
                                      method: 'GET',
                                      headers: { 'Authorization': `Bearer ${token}` },
                                    })
                                    if (response.ok) {
                                      const blob = await response.blob()
                                      const blobUrl = window.URL.createObjectURL(blob)
                                      window.open(blobUrl, '_blank')
                                      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                                      toast.success('Prescrição gerada!')
                                    } else {
                                      const errorData = await response.json().catch(() => ({ message: 'Erro ao gerar prescrição' }))
                                      toast.error(errorData.message || 'Erro ao gerar prescrição')
                                    }
                                  } catch (error) {
                                    console.error('Erro ao gerar prescrição:', error)
                                    toast.error('Erro ao gerar prescrição')
                                  }
                                }}
                                className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Visualizar Prescrição PDF"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            )}
                            
                            {/* Botão de Atestado */}
                            <button
                              onClick={() => {
                                setConsultaAtestado(consulta)
                                setShowAtestadoModal(true)
                              }}
                              className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Emitir Atestado Médico"
                            >
                              <FileCheck className="w-4 h-4" />
                            </button>
                            
                            {/* Botão de Anamnese */}
                            {consulta.status !== 'realizada' && (
                              <button
                                onClick={() => {
                                  setAnamneseConsulta(consulta)
                                  setShowAnamnese(true)
                                }}
                                className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="Anamnese"
                              >
                                <ClipboardList className="w-4 h-4" />
                              </button>
                            )}
                            
                            {/* Botão de Solicitar Exame */}
                            {consulta.status !== 'realizada' && (
                              <button
                                onClick={() => {
                                  setExameConsulta(consulta)
                                  setShowSolicitarExame(true)
                                }}
                                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Solicitar Exame"
                              >
                                <FlaskConical className="w-4 h-4" />
                              </button>
                            )}
                            
                            {/* Botão de Gerar Requisição de Exames */}
                            {(consulta.status === 'confirmada' || consulta.status === 'realizada') && (
                              <button
                                onClick={async () => {
                                  try {
                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                                    const url = `${apiUrl}/consultas/${consulta.id}/requisicao-exames`
                                    const response = await fetch(url, {
                                      method: 'GET',
                                      headers: { 'Authorization': `Bearer ${token}` },
                                    })
                                    if (response.ok) {
                                      const blob = await response.blob()
                                      const blobUrl = window.URL.createObjectURL(blob)
                                      window.open(blobUrl, '_blank')
                                      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                                      toast.success('Requisição de exames gerada!')
                                    } else {
                                      const errorData = await response.json().catch(() => ({ message: 'Erro ao gerar requisição de exames' }))
                                      toast.error(errorData.message || 'Erro ao gerar requisição de exames')
                                    }
                                  } catch (error) {
                                    console.error('Erro ao gerar requisição de exames:', error)
                                    toast.error('Erro ao gerar requisição de exames')
                                  }
                                }}
                                className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                title="Gerar Requisição de Exames"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                        
                        {/* Botão de Editar */}
                        {consulta.status !== 'realizada' && (
                          <button
                            onClick={() => {
                              setEditingConsulta(consulta)
                              setShowModal(true)
                            }}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        
                        {/* Botão de Excluir - Sempre visível */}
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: consulta.id })}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        {/* Dropdown de Documentos */}
                        <div className="relative">
                          <button
                            onClick={() => setDocumentosDropdown(documentosDropdown === consulta.id ? null : consulta.id)}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors relative"
                            title="Mais Documentos"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {documentosDropdown === consulta.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                              <div className="py-1">
                                <button
                                  onClick={async () => {
                                    try {
                                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                                      const url = `${apiUrl}/consultas/${consulta.id}/recibo`
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
                                        toast.success('Recibo gerado!')
                                      }
                                    } catch (error) {
                                      console.error('Erro ao gerar recibo:', error)
                                      toast.error('Erro ao gerar recibo')
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  Recibo
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setConsultaAtestado(consulta)
                                    setShowAtestadoModal(true)
                                    setDocumentosDropdown(null)
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                  Atestado
                                </button>
                                
                                <button
                                  onClick={async () => {
                                    try {
                                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                                      const url = `${apiUrl}/consultas/${consulta.id}/relatorio`
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
                                        toast.success('Relatório gerado!')
                                      }
                                    } catch (error) {
                                      console.error('Erro ao gerar relatório:', error)
                                      toast.error('Erro ao gerar relatório')
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <ClipboardList className="w-3.5 h-3.5" />
                                  Relatório
                                </button>
                                
                                <button
                                  onClick={async () => {
                                    try {
                                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                                      const url = `${apiUrl}/consultas/${consulta.id}/comprovante`
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
                                        toast.success('Comprovante gerado!')
                                      }
                                    } catch (error) {
                                      console.error('Erro ao gerar comprovante:', error)
                                      toast.error('Erro ao gerar comprovante')
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                  Comprovante
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  ))
                })()}
              </tbody>
            </table>
          </div>
          
          {/* Summary e Paginação */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">
                Mostrando <span className="font-medium text-gray-900">
                  {Math.min((paginaAtual - 1) * itensPorPagina + 1, sortedConsultas.length)}
                </span> - <span className="font-medium text-gray-900">
                  {Math.min(paginaAtual * itensPorPagina, sortedConsultas.length)}
                </span> de <span className="font-medium text-gray-900">{sortedConsultas.length}</span> consulta{sortedConsultas.length !== 1 ? 's' : ''}
              </p>
              
              {/* Controles de Paginação */}
              {(() => {
                const totalPaginas = Math.ceil(sortedConsultas.length / itensPorPagina)
                
                if (totalPaginas <= 1) return null
                
                return (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                      disabled={paginaAtual === 1}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        paginaAtual === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPaginas, 7) }, (_, i) => {
                        let pageNum
                        if (totalPaginas <= 7) {
                          pageNum = i + 1
                        } else if (paginaAtual <= 4) {
                          pageNum = i + 1
                        } else if (paginaAtual >= totalPaginas - 3) {
                          pageNum = totalPaginas - 6 + i
                        } else {
                          pageNum = paginaAtual - 3 + i
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPaginaAtual(pageNum)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              paginaAtual === pageNum
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    
                    <span className="text-sm text-gray-600 px-2">
                      de {totalPaginas}
                    </span>
                    
                    <button
                      onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                      disabled={paginaAtual === totalPaginas}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        paginaAtual === totalPaginas
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Próxima
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Modals */}
      {showModal && (
        <ConsultaModal
          consulta={editingConsulta}
          onClose={() => {
            setShowModal(false)
            setEditingConsulta(null)
          }}
          onSuccess={() => {
            setShowModal(false)
            setEditingConsulta(null)
            fetchConsultas()
          }}
        />
      )}

      {showDetails && viewingConsulta && (
        <ConsultaDetailsModal
          consulta={viewingConsulta}
          onClose={() => {
            setShowDetails(false)
            setViewingConsulta(null)
          }}
          onEdit={() => {
            setShowDetails(false)
            setEditingConsulta(viewingConsulta)
            setShowModal(true)
          }}
          onStatusChange={(newStatus) => {
            handleStatusChange(viewingConsulta.id, newStatus)
            setShowDetails(false)
            setViewingConsulta(null)
          }}
        />
      )}

      {showAnamnese && anamneseConsulta && (
        <AnamneseForm
          consulta={anamneseConsulta}
          onClose={() => {
            setShowAnamnese(false)
            setAnamneseConsulta(null)
          }}
          onSuccess={() => {
            setShowAnamnese(false)
            setAnamneseConsulta(null)
            fetchConsultas()
          }}
        />
      )}

      {showSolicitarExame && exameConsulta && (
        <SolicitarExameModal
          consulta={exameConsulta}
          onClose={() => {
            setShowSolicitarExame(false)
            setExameConsulta(null)
          }}
          onSuccess={() => {
            setShowSolicitarExame(false)
            setExameConsulta(null)
            fetchConsultas()
          }}
        />
      )}

      {showPrescricao && prescricaoConsulta && (
        <PrescricaoForm
          consulta={prescricaoConsulta}
          onClose={() => {
            setShowPrescricao(false)
            setPrescricaoConsulta(null)
          }}
          onSuccess={() => {
            setShowPrescricao(false)
            setPrescricaoConsulta(null)
            fetchConsultas()
          }}
        />
      )}

      {showTransferirVaga && consultaTransferir && (
        <TransferirVagaModal
          consulta={consultaTransferir}
          onClose={() => {
            setShowTransferirVaga(false)
            setConsultaTransferir(null)
          }}
          onSuccess={() => {
            setShowTransferirVaga(false)
            setConsultaTransferir(null)
            fetchConsultas()
          }}
        />
      )}

      {/* Modal de Videoconferência - Daily.co */}
      {showVideoconferencia && videoconferenciaData && useDaily && (
        <DailyVideoModal
          isOpen={showVideoconferencia}
          onClose={() => {
            setShowVideoconferencia(false)
            setVideoconferenciaData(null)
          }}
          consultaId={videoconferenciaData.consultaId}
          nomeUsuario={videoconferenciaData.nomeUsuario}
          isMedico={true}
        />
      )}
      
      {/* Modal de Videoconferência - Jitsi (fallback) */}
      {showVideoconferencia && videoconferenciaData && !useDaily && (
        <VideoconferenciaModal
          isOpen={showVideoconferencia}
          onClose={() => {
            setShowVideoconferencia(false)
            setVideoconferenciaData(null)
          }}
          salaId={videoconferenciaData.salaId}
          nomeUsuario={videoconferenciaData.nomeUsuario}
          isMedico={true}
        />
      )}

      {/* Modal de Videoconferência Própria (com Anamnese) */}
      {showVideoconferenciaPropria && consultaVideoconferencia && (
        <VideoconferenciaPropriaModal
          isOpen={showVideoconferenciaPropria}
          onClose={() => {
            setShowVideoconferenciaPropria(false)
            setConsultaVideoconferencia(null)
          }}
          consultaId={consultaVideoconferencia.id}
          pacienteNome={consultaVideoconferencia.paciente?.nome || 'Paciente'}
          medicoNome={consultaVideoconferencia.medico?.nome || 'Médico'}
          salaVideoconferencia={consultaVideoconferencia.sala_videoconferencia}
          onAnamneseSaved={() => {
            fetchConsultas()
          }}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta consulta? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
      />

      {/* Delete All Confirm Modal */}
      {deleteAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-red-200">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ⚠️ Confirmar Exclusão de TODAS as Consultas
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-red-600">
                      ATENÇÃO: Esta ação irá apagar TODAS as {consultas.length} consultas do sistema!
                    </p>
                    <p className="text-gray-600">
                      Esta ação é irreversível e não pode ser desfeita. Todas as consultas, incluindo históricos médicos, serão permanentemente removidas.
                    </p>
                    <p className="text-gray-800 font-medium mt-4">
                      Tem certeza que deseja continuar?
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteAllConfirm(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteAllConfirm(false)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={deletingAll}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deletingAll ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Apagando...
                    </>
                  ) : (
                    'Confirmar e Apagar Tudo'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Atestado */}
      {showAtestadoModal && consultaAtestado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerar Atestado Médico</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Atestado</label>
                <select
                  value={atestadoData.tipo_atestado}
                  onChange={(e) => setAtestadoData({ ...atestadoData, tipo_atestado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                >
                  <option value="saude">Atestado de Saúde</option>
                  <option value="doenca">Atestado de Doença</option>
                  <option value="comparecimento">Atestado de Comparecimento</option>
                </select>
              </div>
              
              {atestadoData.tipo_atestado === 'doenca' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dias de Afastamento</label>
                  <input
                    type="number"
                    value={atestadoData.dias_afastamento}
                    onChange={(e) => setAtestadoData({ ...atestadoData, dias_afastamento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                    min="0"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CID (Opcional)</label>
                <input
                  type="text"
                  value={atestadoData.cid}
                  onChange={(e) => setAtestadoData({ ...atestadoData, cid: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="Ex: A00.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações (Opcional)</label>
                <textarea
                  value={atestadoData.observacoes}
                  onChange={(e) => setAtestadoData({ ...atestadoData, observacoes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  rows={3}
                  placeholder="Observações adicionais..."
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={async () => {
                  try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                    const url = `${apiUrl}/consultas/${consultaAtestado.id}/atestado`
                    
                    // Preparar dados para envio
                    const dataToSend: any = {
                      tipo_atestado: atestadoData.tipo_atestado,
                    }
                    
                    // Adicionar dias_afastamento apenas se não estiver vazio
                    if (atestadoData.dias_afastamento && atestadoData.dias_afastamento.trim() !== '') {
                      dataToSend.dias_afastamento = atestadoData.dias_afastamento
                    }
                    
                    // Adicionar CID apenas se não estiver vazio
                    if (atestadoData.cid && atestadoData.cid.trim() !== '') {
                      dataToSend.cid = atestadoData.cid.trim()
                    }
                    
                    // Adicionar observações apenas se não estiver vazio
                    if (atestadoData.observacoes && atestadoData.observacoes.trim() !== '') {
                      dataToSend.observacoes = atestadoData.observacoes.trim()
                    }
                    
                    const response = await fetch(url, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(dataToSend),
                    })
                    
                    if (response.ok) {
                      const blob = await response.blob()
                      const blobUrl = window.URL.createObjectURL(blob)
                      window.open(blobUrl, '_blank')
                      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                      setShowAtestadoModal(false)
                      setConsultaAtestado(null)
                      setAtestadoData({
                        tipo_atestado: 'saude',
                        dias_afastamento: '',
                        cid: '',
                        observacoes: '',
                      })
                      toast.success('Atestado gerado!')
                    } else {
                      const errorData = await response.json().catch(() => ({ message: 'Erro ao gerar atestado' }))
                      toast.error(errorData.message || 'Erro ao gerar atestado')
                    }
                  } catch (error) {
                    console.error('Erro ao gerar atestado:', error)
                    toast.error('Erro ao gerar atestado')
                  }
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Gerar Atestado
              </button>
              <button
                onClick={() => {
                  setShowAtestadoModal(false)
                  setConsultaAtestado(null)
                  setAtestadoData({
                    tipo_atestado: 'saude',
                    dias_afastamento: '',
                    cid: '',
                    observacoes: '',
                  })
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

