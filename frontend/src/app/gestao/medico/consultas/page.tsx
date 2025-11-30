'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Users, Search, Filter, Eye, ClipboardList, Loader2, Globe } from 'lucide-react'
import { formatDate } from '@/utils'
import { toast } from '@/components/ui/Toast'
import ConsultaDetailsModal from '@/components/gestao/atendimento/ConsultaDetailsModal'
import AnamneseForm from '@/components/gestao/atendimento/AnamneseForm'
import Select from '@/components/ui/Select'

interface Consulta {
  id: number
  paciente_id: number
  medico_id: number
  data_consulta: string
  hora_consulta: string
  tipo_consulta: string
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada'
  agendada_online?: boolean
  observacoes?: string
  queixa_principal?: string
  paciente?: {
    id: number
    nome: string
    nif: string
  }
}

export default function MedicoConsultasPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterData, setFilterData] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [showAnamnese, setShowAnamnese] = useState(false)
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/gestao/login')
    } else if (user && user.role !== 'medico') {
      router.push('/gestao/dashboard')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (token && user?.role === 'medico') {
      fetchConsultas()
    }
  }, [token, user, filterStatus, filterData, searchTerm])

  const fetchConsultas = async () => {
    try {
      setLoading(true)
      const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (!meResponse.ok) {
        const errorData = await meResponse.json().catch(() => ({}))
        console.error('Erro ao buscar dados do usuário:', meResponse.status, errorData)
        toast.error('Erro ao buscar dados do usuário')
        return
      }

      const meData = await meResponse.json()
      
      // Tenta obter o medico_id diretamente ou através do relacionamento
      const medicoId = meData.medico_id || meData.medico?.id

      if (!medicoId) {
        toast.error('Usuário não está vinculado a um médico')
        setConsultas([])
        return
      }

      const params = new URLSearchParams()
      params.append('medico_id', medicoId.toString())
      if (filterStatus) params.append('status', filterStatus)
      if (filterData) params.append('data', filterData)
      if (searchTerm) params.append('search', searchTerm)

      const url = `${process.env.NEXT_PUBLIC_API_URL}/consultas?${params.toString()}`
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        const consultasData = data.data || data || []
        setConsultas(Array.isArray(consultasData) ? consultasData : [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || 'Erro ao carregar consultas'
        toast.error(errorMessage)
        setConsultas([])
      }
    } catch (error: any) {
      console.error('Erro ao buscar consultas:', error)
      toast.error(error.message || 'Erro ao carregar consultas')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      agendada: 'bg-yellow-100 text-yellow-700',
      confirmada: 'bg-blue-100 text-blue-700',
      realizada: 'bg-green-100 text-green-700',
      cancelada: 'bg-red-100 text-red-700',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const filteredConsultas = consultas.filter(consulta => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        consulta.paciente?.nome.toLowerCase().includes(search) ||
        consulta.paciente?.nif.includes(search) ||
        consulta.tipo_consulta.toLowerCase().includes(search)
      )
    }
    return true
  })

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Consultas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas consultas e pacientes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por paciente ou tipo..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
              />
            </div>
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            icon={<Filter className="w-4 h-4" />}
          >
            <option value="">Todos os status</option>
            <option value="agendada">Agendada</option>
            <option value="confirmada">Confirmada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </Select>
          <input
            type="date"
            value={filterData}
            onChange={(e) => setFilterData(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* List */}
      {filteredConsultas.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-600">
            {searchTerm || filterStatus || filterData
              ? 'Nenhuma consulta encontrada'
              : 'Nenhuma consulta cadastrada'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredConsultas.map((consulta) => (
              <div
                key={consulta.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{formatDate(consulta.data_consulta, 'EEEE, dd/MM/yyyy')}</span>
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{consulta.hora_consulta}</span>
                      <span className="text-sm text-gray-600">-</span>
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{consulta.paciente?.nome}</span>
                      <span className="text-xs text-gray-500">({consulta.paciente?.nif})</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">{consulta.tipo_consulta}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(consulta.status)}
                    {consulta.agendada_online && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700" title="Agendada Online">
                        <Globe className="w-3 h-3" />
                        Online
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedConsulta(consulta)
                        setShowDetails(true)
                      }}
                      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {consulta.status === 'realizada' && (
                      <button
                        onClick={() => {
                          setSelectedConsulta(consulta)
                          setShowAnamnese(true)
                        }}
                        className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="Anamnese"
                      >
                        <ClipboardList className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showDetails && selectedConsulta && (
        <ConsultaDetailsModal
          consulta={selectedConsulta}
          onClose={() => {
            setShowDetails(false)
            setSelectedConsulta(null)
          }}
          onEdit={() => {
            setShowDetails(false)
            toast.info('Edição de consultas deve ser feita pelo administrador')
          }}
          onStatusChange={() => {
            fetchConsultas()
            setShowDetails(false)
            setSelectedConsulta(null)
          }}
        />
      )}

      {showAnamnese && selectedConsulta && (
        <AnamneseForm
          consulta={selectedConsulta}
          onClose={() => {
            setShowAnamnese(false)
            setSelectedConsulta(null)
          }}
          onSuccess={() => {
            setShowAnamnese(false)
            setSelectedConsulta(null)
            fetchConsultas()
          }}
        />
      )}
    </div>
  )
}

