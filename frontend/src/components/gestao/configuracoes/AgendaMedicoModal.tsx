'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/Toast'
import { X, Save, Loader, Calendar } from 'lucide-react'

interface AgendaMedicoModalProps {
  medico: {
    id: number
    nome: string
  }
  onClose: () => void
  onSuccess: () => void
}

interface DiaSemana {
  id: number
  nome: string
  sigla: string
  ativo: boolean
}

export default function AgendaMedicoModal({ medico, onClose, onSuccess }: AgendaMedicoModalProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mesAplicacao, setMesAplicacao] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1))
  const [diasSemana, setDiasSemana] = useState<DiaSemana[]>([
    { id: 1, nome: 'Segunda-feira', sigla: 'Seg', ativo: false },
    { id: 2, nome: 'Terça-feira', sigla: 'Ter', ativo: false },
    { id: 3, nome: 'Quarta-feira', sigla: 'Qua', ativo: false },
    { id: 4, nome: 'Quinta-feira', sigla: 'Qui', ativo: false },
    { id: 5, nome: 'Sexta-feira', sigla: 'Sex', ativo: false },
    { id: 6, nome: 'Sábado', sigla: 'Sáb', ativo: false },
    { id: 0, nome: 'Domingo', sigla: 'Dom', ativo: false },
  ])

  useEffect(() => {
    fetchHorarios()
  }, [medico.id, mesAplicacao])

  const fetchHorarios = async () => {
    try {
      setLoading(true)
      
      // Definir estrutura base dos dias da semana
      const estruturaDias: DiaSemana[] = [
        { id: 1, nome: 'Segunda-feira', sigla: 'Seg', ativo: false },
        { id: 2, nome: 'Terça-feira', sigla: 'Ter', ativo: false },
        { id: 3, nome: 'Quarta-feira', sigla: 'Qua', ativo: false },
        { id: 4, nome: 'Quinta-feira', sigla: 'Qui', ativo: false },
        { id: 5, nome: 'Sexta-feira', sigla: 'Sex', ativo: false },
        { id: 6, nome: 'Sábado', sigla: 'Sáb', ativo: false },
        { id: 0, nome: 'Domingo', sigla: 'Dom', ativo: false },
      ]
      
      // Buscar horários do mês selecionado e meses próximos para identificar padrão semanal completo
      const mesSelecionado = new Date(mesAplicacao.getFullYear(), mesAplicacao.getMonth(), 1)
      let horarios: any[] = []
      
      // Buscar horários do mês selecionado e dos 2 meses seguintes para ter mais dados
      for (let i = 0; i < 3; i++) {
        const mesBusca = new Date(mesSelecionado.getFullYear(), mesSelecionado.getMonth() + i, 1)
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/medico-horarios?medico_id=${medico.id}&mes=${mesBusca.toISOString().split('T')[0]}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          
          if (response.ok) {
            const data = await response.json()
            const horariosMes = data.data || []
            horarios.push(...horariosMes)
          }
        } catch (error) {
          console.error(`Erro ao buscar horários do mês ${i + 1}:`, error)
        }
      }
      
      console.log('Total de horários recebidos:', horarios.length)
      console.log('Horários recebidos do backend:', horarios)
      
      // Identificar padrão semanal baseado nos dias disponíveis
      // Considerar apenas dias que têm disponivel = true
      const diasDisponiveis = new Set<number>()
      
      if (horarios.length > 0) {
        horarios.forEach((h: any) => {
          // IMPORTANTE: Só considerar horários com disponivel = true
          if (h.disponivel === true) {
            try {
              // Garantir que a data seja parseada corretamente
              let dataObj: Date
              if (typeof h.data === 'string') {
                // Se vier como string, pode ter ou não hora
                const dataStr = h.data.includes('T') ? h.data.split('T')[0] : h.data
                // Criar data no formato YYYY-MM-DD para evitar problemas de timezone
                const [year, month, day] = dataStr.split('-').map(Number)
                if (year && month && day) {
                  dataObj = new Date(year, month - 1, day)
                  const diaSemana = dataObj.getDay()
                  diasDisponiveis.add(diaSemana)
                }
              } else if (h.data instanceof Date) {
                dataObj = h.data
                const diaSemana = dataObj.getDay()
                diasDisponiveis.add(diaSemana)
              }
            } catch (error) {
              console.error('Erro ao processar data:', h.data, error)
            }
          }
        })
      }
      
      console.log('Dias disponíveis identificados (disponivel=true):', Array.from(diasDisponiveis))
      
      // Atualizar estrutura com os dias disponíveis encontrados
      const diasAtualizados = estruturaDias.map(dia => {
        const estaAtivo = diasDisponiveis.has(dia.id)
        return {
          ...dia,
          ativo: estaAtivo,
        }
      })
      
      console.log('Dias atualizados:', diasAtualizados.map(d => ({ nome: d.nome, id: d.id, ativo: d.ativo })))
      
      setDiasSemana(diasAtualizados)
    } catch (error) {
      console.error('Erro ao buscar horários:', error)
      toast.error('Erro ao carregar horários existentes')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleDia = (id: number) => {
    setDiasSemana(diasSemana.map(dia => 
      dia.id === id ? { ...dia, ativo: !dia.ativo } : dia
    ))
  }


  const aplicarMesInteiro = (mesEscolhido?: Date) => {
    const hoje = new Date()
    // Se não especificar mês, usar próximo mês (comportamento padrão)
    // Se especificar, usar o mês escolhido
    const mesBase = mesEscolhido || new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1)
    const primeiroDiaMes = new Date(mesBase.getFullYear(), mesBase.getMonth(), 1)
    const ultimoDiaMes = new Date(mesBase.getFullYear(), mesBase.getMonth() + 1, 0)
    
    const datas: string[] = []
    const diasAtivos = diasSemana.filter(d => d.ativo)
    
    for (let data = new Date(primeiroDiaMes); data <= ultimoDiaMes; data.setDate(data.getDate() + 1)) {
      const diaSemana = data.getDay()
      const diaConfig = diasAtivos.find(d => d.id === diaSemana)
      
      if (diaConfig) {
        datas.push(data.toISOString().split('T')[0])
      }
    }

    return datas
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const diasAtivos = diasSemana.filter(d => d.ativo)
      
      if (diasAtivos.length === 0) {
        toast.error('Selecione pelo menos um dia da semana')
        setSaving(false)
        return
      }


      // Gerar todas as datas do mês (para identificar quais devem ser removidas)
      const primeiroDiaMes = new Date(mesAplicacao.getFullYear(), mesAplicacao.getMonth(), 1)
      const ultimoDiaMes = new Date(mesAplicacao.getFullYear(), mesAplicacao.getMonth() + 1, 0)
      const todasDatasMes: string[] = []
      
      for (let data = new Date(primeiroDiaMes); data <= ultimoDiaMes; data.setDate(data.getDate() + 1)) {
        todasDatasMes.push(data.toISOString().split('T')[0])
      }
      
      // Gerar datas para os dias ATIVOS (marcados)
      const datasAtivas = aplicarMesInteiro(mesAplicacao)
      
      // Identificar datas que devem ser DESATIVADAS (dias desmarcados)
      const diasDesmarcados = diasSemana.filter(d => !d.ativo)
      const datasParaDesativar: string[] = []
      
      for (const diaDesmarcado of diasDesmarcados) {
        todasDatasMes.forEach(data => {
          const dataObj = new Date(data)
          if (dataObj.getDay() === diaDesmarcado.id) {
            datasParaDesativar.push(data)
          }
        })
      }
      
      const horariosCriados = []
      const horariosDesativados = []
      const erros: string[] = []
      
      // 1. Criar/Atualizar dias ATIVOS (marcados)
      if (datasAtivas.length > 0) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/medico-horarios/bulk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              medico_id: medico.id,
              datas: datasAtivas,
              hora_inicio: null,
              hora_fim: null,
              disponivel: true,
            }),
          })
          
          if (response.ok) {
            const data = await response.json()
            horariosCriados.push(...(data.data || []))
          } else {
            const errorData = await response.json().catch(() => ({}))
            erros.push(`Erro ao salvar dias ativos: ${errorData.message || 'Erro desconhecido'}`)
          }
        } catch (error: any) {
          erros.push(`Erro ao salvar dias ativos: ${error.message}`)
        }
      }
      
      // 2. Desativar dias DESMARCADOS
      if (datasParaDesativar.length > 0) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/medico-horarios/bulk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              medico_id: medico.id,
              datas: datasParaDesativar,
              hora_inicio: null,
              hora_fim: null,
              disponivel: false, // DESATIVAR
            }),
          })
          
          if (response.ok) {
            const data = await response.json()
            horariosDesativados.push(...(data.data || []))
          } else {
            const errorData = await response.json().catch(() => ({}))
            erros.push(`Erro ao desativar dias: ${errorData.message || 'Erro desconhecido'}`)
          }
        } catch (error: any) {
          erros.push(`Erro ao desativar dias: ${error.message}`)
        }
      }

      if (erros.length > 0) {
        console.error('Erros ao salvar agenda:', erros)
        toast.error(`Alguns horários não puderam ser salvos: ${erros.join(', ')}`)
      } else {
        const totalAtualizados = horariosCriados.length + horariosDesativados.length
        toast.success(`Agenda de trabalho salva com sucesso! ${horariosCriados.length} dia(s) ativado(s) e ${horariosDesativados.length} dia(s) desativado(s).`)
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 500)
      }
    } catch (error: any) {
      console.error('Erro ao salvar agenda:', error)
      toast.error(`Erro ao salvar agenda de trabalho: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Agenda de Trabalho</h2>
            <p className="text-sm text-gray-500 mt-0.5">{medico.nome}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 animate-spin text-green-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-600">Carregando horários...</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Selecione os dias da semana e defina os horários de trabalho.
                </p>
                
                {/* Seletor de Mês */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aplicar agenda para o mês:
                  </label>
                  <input
                    type="month"
                    value={`${mesAplicacao.getFullYear()}-${String(mesAplicacao.getMonth() + 1).padStart(2, '0')}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-').map(Number)
                      setMesAplicacao(new Date(year, month - 1, 1))
                    }}
                    min={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Os horários serão aplicados/atualizados para todos os dias selecionados neste mês.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {diasSemana.map((dia) => (
                  <div
                    key={dia.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      dia.ativo
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`dia-${dia.id}`}
                          checked={dia.ativo}
                          onChange={() => handleToggleDia(dia.id)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label
                          htmlFor={`dia-${dia.id}`}
                          className={`text-sm font-medium cursor-pointer ${
                            dia.ativo ? 'text-green-900' : 'text-gray-700'
                          }`}
                        >
                          {dia.nome}
                        </label>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Informação</p>
                    <p>A agenda será aplicada/atualizada para o mês selecionado. Os dias selecionados serão marcados como disponíveis para o médico.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Agenda
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

