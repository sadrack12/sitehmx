'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, CalendarDays, Save, Loader2, Check, X } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import Select from '@/components/ui/Select'
import { Stethoscope } from 'lucide-react'

interface MedicoHorario {
  id: number
  medico_id: number
  data: string
  hora_inicio?: string
  hora_fim?: string
  disponivel: boolean
  observacoes?: string
  medico?: {
    id: number
    nome: string
    especialidade?: string
  }
}

export default function HorariosMedicoPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [medicos, setMedicos] = useState<any[]>([])
  const [selectedMedico, setSelectedMedico] = useState<string>('')
  const [horarios, setHorarios] = useState<MedicoHorario[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set())

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

  const fetchHorarios = useCallback(async () => {
    if (!selectedMedico) {
      setHorarios([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // Usar primeiro dia do mês para buscar
      const primeiroDiaMes = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const mesStr = primeiroDiaMes.toISOString().split('T')[0] // YYYY-MM-DD
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/medico-horarios?medico_id=${selectedMedico}&mes=${mesStr}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.ok) {
        const data = await response.json()
        const horariosList = data.data || []
        
        // Normalizar datas para formato YYYY-MM-DD
        const horariosNormalizados = horariosList.map((h: any) => {
          let dataNormalizada = h.data
          // Se a data vier como objeto ou string em formato diferente, normalizar
          if (typeof dataNormalizada === 'string' && dataNormalizada.includes('T')) {
            dataNormalizada = dataNormalizada.split('T')[0]
          } else if (dataNormalizada instanceof Date) {
            dataNormalizada = dataNormalizada.toISOString().split('T')[0]
          }
          
          return {
            ...h,
            data: dataNormalizada,
          }
        })
        
        setHorarios(horariosNormalizados)
        
        // Preencher selectedDays com os dias que têm horários disponíveis
        const daysSet = new Set<string>()
        horariosNormalizados.forEach((h: MedicoHorario) => {
          if (h.disponivel && h.data) {
            daysSet.add(h.data)
          }
        })
        setSelectedDays(daysSet)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Erro ao buscar horários:', response.status, errorData)
        toast.error('Erro ao carregar horários')
      }
    } catch (error) {
      console.error('Erro ao buscar horários:', error)
      toast.error('Erro ao carregar horários')
    } finally {
      setLoading(false)
    }
  }, [token, selectedMedico, currentDate])

  useEffect(() => {
    if (token && selectedMedico) {
      fetchHorarios()
    }
  }, [fetchHorarios])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const toggleDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const newSelectedDays = new Set(selectedDays)
    
    if (newSelectedDays.has(dateStr)) {
      // Remover do selecionado
      newSelectedDays.delete(dateStr)
    } else {
      // Adicionar ao selecionado
      newSelectedDays.add(dateStr)
    }
    
    setSelectedDays(newSelectedDays)
  }

  const handleSave = async () => {
    if (!selectedMedico) {
      toast.error('Selecione um médico')
      return
    }

    if (selectedDays.size === 0) {
      toast.error('Selecione pelo menos um dia')
      return
    }


    setSaving(true)

    try {
      // Converter para array e garantir formato YYYY-MM-DD
      const datas = Array.from(selectedDays).map(dateStr => {
        // Garantir que está no formato correto
        if (dateStr.includes('T')) {
          return dateStr.split('T')[0]
        }
        return dateStr
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/medico-horarios/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
              body: JSON.stringify({
                medico_id: parseInt(selectedMedico),
                datas,
                hora_inicio: null,
                hora_fim: null,
                disponivel: true,
              }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.errors 
          ? Object.values(errorData.errors).flat().join(', ')
          : (errorData.message || 'Erro ao salvar horários')
        throw new Error(errorMessage)
      }

      const result = await response.json()
      const horariosSalvos = result.data || []
      
      toast.success(`${horariosSalvos.length} horário(s) salvo(s) com sucesso!`)
      
      // Recarregar horários após salvar
      await fetchHorarios()
    } catch (error: any) {
      console.error('Erro ao salvar horários:', error)
      toast.error(error.message || 'Erro ao salvar horários')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveDay = async (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const horario = horarios.find(h => h.data === dateStr)

    if (!horario) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/medico-horarios/${horario.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Dia removido com sucesso!')
        fetchHorarios()
      } else {
        toast.error('Erro ao remover dia')
      }
    } catch (error) {
      toast.error('Erro ao remover dia')
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const getHorarioForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    // Buscar horário que corresponde exatamente à data
    const horario = horarios.find(h => {
      const hData = typeof h.data === 'string' 
        ? h.data.split('T')[0] 
        : String(h.data).split('T')[0]
      return hData === dateStr
    })
    return horario
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Dias de Trabalho</h1>
          <p className="text-gray-600 mt-1">Defina os dias de trabalho dos médicos</p>
        </div>
      </div>

      {/* Médico Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select
              label="Selecione o Médico"
              value={selectedMedico}
              onChange={(e) => {
                setSelectedMedico(e.target.value)
                setSelectedDays(new Set())
              }}
              icon={<Stethoscope className="w-4 h-4" />}
            >
              <option value="">Selecione um médico</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} {m.especialidade ? `- ${m.especialidade}` : ''}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {selectedMedico && (
        <>
          {/* Calendar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
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
              <button
                onClick={handleSave}
                disabled={saving || selectedDays.size === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Dias Selecionados
                  </>
                )}
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => (
                <div key={index} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((day, index) => {
                if (!day) {
                  return <div key={index} className="min-h-[80px]"></div>
                }

                const dateStr = day.toISOString().split('T')[0]
                const horario = getHorarioForDate(day)
                // Se já tem horário salvo, considerar como selecionado
                const isSelected = selectedDays.has(dateStr) || (horario && horario.disponivel)
                const isPast = isPastDate(day)
                const isToday = day.toDateString() === new Date().toDateString()

                return (
                  <div
                    key={index}
                    className={`min-h-[80px] border rounded-lg p-2 transition-colors ${
                      isPast
                        ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                        : isSelected || (horario && horario.disponivel)
                        ? 'bg-green-50 border-green-400 cursor-pointer hover:bg-green-100'
                        : 'bg-white border-gray-200 cursor-pointer hover:bg-gray-50'
                    } ${isToday ? 'ring-2 ring-green-500' : ''}`}
                    onClick={() => {
                      if (!isPast) {
                        toggleDay(day)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? 'text-green-700' : 'text-gray-700'
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {horario && !isPast && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveDay(day)
                          }}
                          className="p-0.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Remover"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {horario && horario.disponivel && (
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <Check className="w-3 h-3" />
                        <span>Disponível</span>
                      </div>
                    )}
                    {isSelected && !horario && (
                      <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Selecionado</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border border-green-400 rounded"></div>
                  <span className="text-gray-600">Dia selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded opacity-50"></div>
                  <span className="text-gray-600">Dia passado (não editável)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border-2 border-green-500 rounded"></div>
                  <span className="text-gray-600">Hoje</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

