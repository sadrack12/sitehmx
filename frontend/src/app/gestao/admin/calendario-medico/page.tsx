'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Stethoscope, Loader2 } from 'lucide-react'
import { formatDate } from '@/utils'
import { toast } from '@/components/ui/Toast'
import Select from '@/components/ui/Select'
import ConsultaDetailsModal from '@/components/gestao/atendimento/ConsultaDetailsModal'

interface Consulta {
  id: number
  paciente_id: number
  medico_id: number
  data_consulta: string
  hora_consulta: string
  tipo_consulta: string
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada'
  observacoes?: string
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
}

export default function CalendarioMedicoPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [medicos, setMedicos] = useState<any[]>([])
  const [selectedMedico, setSelectedMedico] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/gestao/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicos`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          const medicosList = Array.isArray(data) ? data : (data.data || [])
          setMedicos(medicosList)
        }
      } catch (error) {
        console.error('Erro ao buscar médicos:', error)
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
      if (selectedMedico) {
        params.append('medico_id', selectedMedico)
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/consultas${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setConsultas(data.data || data || [])
      }
    } catch (error) {
      toast.error('Erro ao carregar consultas')
    } finally {
      setLoading(false)
    }
  }, [token, selectedMedico])

  useEffect(() => {
    if (token) {
      fetchConsultas()
    }
  }, [fetchConsultas])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    
    // Dias vazios no início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getWeekDays = (date: Date) => {
    const weekStart = new Date(date)
    const day = weekStart.getDay()
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1) // Segunda-feira
    weekStart.setDate(diff)
    
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getConsultasForDate = (date: Date | null) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return consultas.filter(c => {
      const consultaDate = new Date(c.data_consulta).toISOString().split('T')[0]
      return consultaDate === dateStr
    }).sort((a, b) => a.hora_consulta.localeCompare(b.hora_consulta))
  }

  const getStatusColor = (status: string) => {
    const colors = {
      agendada: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      confirmada: 'bg-blue-100 border-blue-300 text-blue-800',
      realizada: 'bg-green-100 border-green-300 text-green-800',
      cancelada: 'bg-red-100 border-red-300 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 border-gray-300 text-gray-800'
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendário de Consultas</h1>
          <p className="text-gray-600 mt-1">Visualize e gerencie as consultas dos médicos</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedMedico}
            onChange={(e) => setSelectedMedico(e.target.value)}
            icon={<Stethoscope className="w-4 h-4" />}
          >
            <option value="">Todos os médicos</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} {m.especialidade ? `- ${m.especialidade}` : ''}
              </option>
            ))}
          </Select>
          <div className="flex gap-1 border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Mês
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {viewMode === 'week' ? (
                <>
                  {formatDate(getWeekDays(currentDate)[0].toISOString())} -{' '}
                  {formatDate(getWeekDays(currentDate)[6].toISOString())}
                </>
              ) : (
                `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              )}
            </h2>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="ml-4 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Hoje
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        {viewMode === 'week' ? (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {getWeekDays(currentDate).map((day, index) => {
              const dayConsultas = getConsultasForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] border border-gray-200 rounded-lg p-2 ${
                    isToday ? 'bg-green-50 border-green-300' : 'bg-white'
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${isToday ? 'text-green-700' : 'text-gray-700'}`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayConsultas.slice(0, 3).map((consulta) => (
                      <button
                        key={consulta.id}
                        onClick={() => {
                          setSelectedConsulta(consulta)
                          setShowDetails(true)
                        }}
                        className={`w-full text-left p-1.5 rounded text-xs border ${getStatusColor(consulta.status)} hover:opacity-80 transition-opacity cursor-pointer`}
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <Clock className="w-3 h-3" />
                          <span className="font-medium">{consulta.hora_consulta}</span>
                        </div>
                        <div className="truncate">{consulta.paciente?.nome || 'Sem paciente'}</div>
                        <div className="text-xs opacity-75 truncate">{consulta.tipo_consulta}</div>
                      </button>
                    ))}
                    {dayConsultas.length > 3 && (
                      <div className="text-xs text-gray-500 text-center pt-1">
                        +{dayConsultas.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {getDaysInMonth(currentDate).map((day, index) => {
              if (!day) {
                return <div key={index} className="min-h-[100px]"></div>
              }
              
              const dayConsultas = getConsultasForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] border border-gray-200 rounded-lg p-2 ${
                    isToday ? 'bg-green-50 border-green-300' : 'bg-white'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-green-700' : 'text-gray-700'}`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayConsultas.slice(0, 2).map((consulta) => (
                      <button
                        key={consulta.id}
                        onClick={() => {
                          setSelectedConsulta(consulta)
                          setShowDetails(true)
                        }}
                        className={`w-full text-left p-1 rounded text-xs border ${getStatusColor(consulta.status)} hover:opacity-80 transition-opacity cursor-pointer`}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span className="font-medium">{consulta.hora_consulta}</span>
                        </div>
                        <div className="truncate text-xs">{consulta.paciente?.nome || 'Sem paciente'}</div>
                      </button>
                    ))}
                    {dayConsultas.length > 2 && (
                      <div className="text-xs text-gray-500 text-center pt-0.5">
                        +{dayConsultas.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legenda de Status</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-xs text-gray-600">Agendada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-xs text-gray-600">Confirmada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-xs text-gray-600">Realizada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-xs text-gray-600">Cancelada</span>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedConsulta && (
        <ConsultaDetailsModal
          consulta={selectedConsulta}
          onClose={() => {
            setShowDetails(false)
            setSelectedConsulta(null)
          }}
          onEdit={() => {
            setShowDetails(false)
            router.push(`/gestao/consultas`)
          }}
          onStatusChange={() => {
            fetchConsultas()
            setShowDetails(false)
            setSelectedConsulta(null)
          }}
        />
      )}
    </div>
  )
}

