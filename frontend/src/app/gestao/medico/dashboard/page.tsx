'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Users, FileText, Loader2, Eye, ClipboardList } from 'lucide-react'
import { formatDate } from '@/utils'
import { toast } from '@/components/ui/Toast'
import ConsultaDetailsModal from '@/components/gestao/atendimento/ConsultaDetailsModal'
import AnamneseForm from '@/components/gestao/atendimento/AnamneseForm'

interface Consulta {
  id: number
  paciente_id: number
  medico_id: number
  data_consulta: string
  hora_consulta: string
  tipo_consulta: string
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada'
  observacoes?: string
  queixa_principal?: string
  paciente?: {
    id: number
    nome: string
    nif: string
    email?: string
    telefone?: string
  }
}

export default function MedicoDashboardPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
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
  }, [token, user])

  const fetchConsultas = async () => {
    try {
      setLoading(true)
      // Buscar o médico_id do usuário logado
      const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (!meResponse.ok) {
        throw new Error('Erro ao buscar dados do médico')
      }

      const meData = await meResponse.json()
      const medicoId = meData.medico_id

      if (!medicoId) {
        toast.error('Usuário não está vinculado a um médico')
        return
      }

      // Buscar consultas do médico
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas?medico_id=${medicoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setConsultas(data.data || data || [])
      } else {
        throw new Error('Erro ao carregar consultas')
      }
    } catch (error) {
      console.error('Erro ao buscar consultas:', error)
      toast.error('Erro ao carregar consultas')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: consultas.length,
    hoje: consultas.filter(c => {
      const hoje = new Date().toISOString().split('T')[0]
      return c.data_consulta === hoje
    }).length,
    agendadas: consultas.filter(c => c.status === 'agendada').length,
    confirmadas: consultas.filter(c => c.status === 'confirmada').length,
    realizadas: consultas.filter(c => c.status === 'realizada').length,
  }

  const consultasHoje = consultas
    .filter(c => {
      const hoje = new Date().toISOString().split('T')[0]
      return c.data_consulta === hoje
    })
    .sort((a, b) => a.hora_consulta.localeCompare(b.hora_consulta))

  const proximasConsultas = consultas
    .filter(c => {
      const hoje = new Date()
      const dataConsulta = new Date(c.data_consulta)
      return dataConsulta >= hoje && (c.status === 'agendada' || c.status === 'confirmada')
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.data_consulta} ${a.hora_consulta}`)
      const dateB = new Date(`${b.data_consulta} ${b.hora_consulta}`)
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, 5)

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
          <h1 className="text-3xl font-bold text-gray-900">Painel do Médico</h1>
          <p className="text-gray-600 mt-1">Bem-vindo, {user?.name}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Total</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 mb-1">Hoje</div>
          <div className="text-2xl font-semibold text-blue-900">{stats.hoje}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-xs text-yellow-700 mb-1">Agendadas</div>
          <div className="text-2xl font-semibold text-yellow-900">{stats.agendadas}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 mb-1">Confirmadas</div>
          <div className="text-2xl font-semibold text-blue-900">{stats.confirmadas}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-700 mb-1">Realizadas</div>
          <div className="text-2xl font-semibold text-green-900">{stats.realizadas}</div>
        </div>
      </div>

      {/* Consultas de Hoje */}
      {consultasHoje.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Consultas de Hoje
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {consultasHoje.map((consulta) => (
              <div
                key={consulta.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedConsulta(consulta)
                  setShowDetails(true)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{consulta.hora_consulta}</span>
                      <span className="text-sm text-gray-600">-</span>
                      <span className="text-sm font-medium text-gray-900">{consulta.paciente?.nome}</span>
                      <span className="text-xs text-gray-500">({consulta.paciente?.nif})</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">{consulta.tipo_consulta}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(consulta.status)}
                    {!consulta.queixa_principal && consulta.status === 'realizada' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedConsulta(consulta)
                          setShowAnamnese(true)
                        }}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors flex items-center gap-1"
                      >
                        <ClipboardList className="w-3 h-3" />
                        Anamnese
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Próximas Consultas */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Próximas Consultas
          </h2>
        </div>
        {proximasConsultas.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Nenhuma consulta agendada</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {proximasConsultas.map((consulta) => (
              <div
                key={consulta.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedConsulta(consulta)
                  setShowDetails(true)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{formatDate(consulta.data_consulta, 'EEEE, dd/MM/yyyy')}</span>
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{consulta.hora_consulta}</span>
                      <span className="text-sm text-gray-600">-</span>
                      <span className="text-sm font-medium text-gray-900">{consulta.paciente?.nome}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">{consulta.tipo_consulta}</div>
                  </div>
                  {getStatusBadge(consulta.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

