'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { FileText, Calendar, FlaskConical, BarChart3, TrendingUp, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/Toast'

interface Medico {
  id: number
  nome: string
  especialidade: string
}

interface Exame {
  id: number
  nome: string
}

interface Especialidade {
  id: number
  nome: string
}

export default function RelatoriosPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [exames, setExames] = useState<Exame[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/gestao/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (token) {
      fetchMedicos()
      fetchExames()
      fetchEspecialidades()
    }
  }, [token])

  const fetchMedicos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setMedicos(data.data || [])
      }
    } catch (error) {
      console.error('Erro ao carregar médicos:', error)
    }
  }

  const fetchExames = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/exames`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setExames(data.data || [])
      }
    } catch (error) {
      console.error('Erro ao carregar exames:', error)
    }
  }

  const fetchEspecialidades = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/especialidades`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setEspecialidades(data.data || [])
      }
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error)
    }
  }

  const gerarRelatorio = async (tipo: string, params: Record<string, any>) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value)
        }
      })

      const url = `${process.env.NEXT_PUBLIC_API_URL}/relatorios/${tipo}?${queryParams.toString()}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        window.open(blobUrl, '_blank')
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
        toast.success('Relatório gerado com sucesso!')
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao gerar relatório' }))
        toast.error(errorData.message || 'Erro ao gerar relatório')
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      toast.error('Erro ao gerar relatório')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
              <p className="text-gray-600 mt-1">Gere relatórios detalhados em PDF do sistema</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Relatório de Consultas por Período */}
          <RelatorioCard
            icon={Calendar}
            title="Consultas por Período"
            description="Relatório detalhado de consultas com filtros por médico, especialidade e status"
            loading={loading}
            onGerar={(params) => gerarRelatorio('consultas-periodo', params)}
            medicos={medicos}
            especialidades={especialidades}
          />

          {/* Relatório de Exames Solicitados */}
          <RelatorioCard
            icon={FlaskConical}
            title="Exames Solicitados"
            description="Relatório de exames solicitados com estatísticas e filtros"
            loading={loading}
            onGerar={(params) => gerarRelatorio('exames-solicitados', params)}
            medicos={medicos}
            exames={exames}
            tipo="exames"
          />

          {/* Relatório Estatístico Geral */}
          <RelatorioCard
            icon={BarChart3}
            title="Estatístico Geral"
            description="Visão geral das estatísticas do sistema"
            loading={loading}
            onGerar={(params) => gerarRelatorio('estatistico-geral', params)}
            tipo="estatistico"
          />

          {/* Relatório de Produtividade Médica */}
          <RelatorioCard
            icon={TrendingUp}
            title="Produtividade Médica"
            description="Análise de produtividade e desempenho dos médicos"
            loading={loading}
            onGerar={(params) => gerarRelatorio('produtividade-medica', params)}
            medicos={medicos}
            tipo="produtividade"
          />
        </div>
      </div>
    </div>
  )
}

interface RelatorioCardProps {
  icon: any
  title: string
  description: string
  loading: boolean
  onGerar: (params: Record<string, any>) => void
  medicos?: Medico[]
  especialidades?: Especialidade[]
  exames?: Exame[]
  tipo?: 'consultas' | 'exames' | 'estatistico' | 'produtividade'
}

function RelatorioCard({ icon: Icon, title, description, loading, onGerar, medicos = [], especialidades = [], exames = [], tipo = 'consultas' }: RelatorioCardProps) {
  const [formData, setFormData] = useState({
    data_inicio: '',
    data_fim: '',
    medico_id: '',
    especialidade: '',
    exame_id: '',
    status: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (tipo === 'consultas' || tipo === 'produtividade') {
      if (!formData.data_inicio || !formData.data_fim) {
        toast.error('Por favor, preencha as datas de início e fim')
        return
      }
    }

    const params: Record<string, any> = {}
    
    if (formData.data_inicio) params.data_inicio = formData.data_inicio
    if (formData.data_fim) params.data_fim = formData.data_fim
    if (formData.medico_id) params.medico_id = formData.medico_id
    if (formData.especialidade) params.especialidade = formData.especialidade
    if (formData.exame_id) params.exame_id = formData.exame_id
    if (formData.status) params.status = formData.status

    onGerar(params)
  }

  const getCardColors = () => {
    switch (tipo) {
      case 'consultas':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700'
        }
      case 'exames':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
          iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
          border: 'border-purple-200',
          button: 'bg-purple-600 hover:bg-purple-700'
        }
      case 'estatistico':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-green-100',
          iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
          border: 'border-green-200',
          button: 'bg-green-600 hover:bg-green-700'
        }
      case 'produtividade':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
          iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
          border: 'border-orange-200',
          button: 'bg-orange-600 hover:bg-orange-700'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          iconBg: 'bg-gradient-to-br from-gray-500 to-gray-600',
          border: 'border-gray-200',
          button: 'bg-gray-600 hover:bg-gray-700'
        }
    }
  }

  const colors = getCardColors()

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 ${colors.border} overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      {/* Header */}
      <div className={`${colors.bg} p-5 border-b-2 ${colors.border}`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
        {(tipo === 'consultas' || tipo === 'exames' || tipo === 'produtividade') && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">
                  Data Início {(tipo === 'consultas' || tipo === 'produtividade') && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  required={tipo === 'consultas' || tipo === 'produtividade'}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-blue-500 outline-none text-sm transition-all duration-200 hover:border-gray-300"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">
                  Data Fim {(tipo === 'consultas' || tipo === 'produtividade') && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                  required={tipo === 'consultas' || tipo === 'produtividade'}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-blue-500 outline-none text-sm transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </>
        )}

        {tipo === 'estatistico' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Data Início (opcional)</label>
              <input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-green-500 outline-none text-sm transition-all duration-200 hover:border-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Data Fim (opcional)</label>
              <input
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-green-500 outline-none text-sm transition-all duration-200 hover:border-gray-300"
              />
            </div>
          </div>
        )}

        {(tipo === 'consultas' || tipo === 'produtividade') && (
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">Médico (opcional)</label>
            <select
              value={formData.medico_id}
              onChange={(e) => setFormData({ ...formData, medico_id: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-blue-500 outline-none text-sm transition-all duration-200 hover:border-gray-300 bg-white"
            >
              <option value="">Todos os médicos</option>
              {medicos.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nome} - {medico.especialidade}
                </option>
              ))}
            </select>
          </div>
        )}

        {tipo === 'consultas' && (
          <>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Especialidade (opcional)</label>
              <select
                value={formData.especialidade}
                onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-blue-500 outline-none text-sm transition-all duration-200 hover:border-gray-300 bg-white"
              >
                <option value="">Todas as especialidades</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.nome}>
                    {esp.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Status (opcional)</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-blue-500 outline-none text-sm transition-all duration-200 hover:border-gray-300 bg-white"
              >
                <option value="">Todos os status</option>
                <option value="agendada">Agendada</option>
                <option value="confirmada">Confirmada</option>
                <option value="realizada">Realizada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </>
        )}

        {tipo === 'exames' && (
          <>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Médico (opcional)</label>
              <select
                value={formData.medico_id}
                onChange={(e) => setFormData({ ...formData, medico_id: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-purple-500 outline-none text-sm transition-all duration-200 hover:border-gray-300 bg-white"
              >
                <option value="">Todos os médicos</option>
                {medicos.map((medico) => (
                  <option key={medico.id} value={medico.id}>
                    {medico.nome} - {medico.especialidade}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Exame (opcional)</label>
              <select
                value={formData.exame_id}
                onChange={(e) => setFormData({ ...formData, exame_id: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-purple-500 outline-none text-sm transition-all duration-200 hover:border-gray-300 bg-white"
              >
                <option value="">Todos os exames</option>
                {exames.map((exame) => (
                  <option key={exame.id} value={exame.id}>
                    {exame.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Status (opcional)</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-purple-500 outline-none text-sm transition-all duration-200 hover:border-gray-300 bg-white"
              >
                <option value="">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${colors.button} text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Gerando relatório...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Gerar Relatório PDF</span>
              </>
            )}
          </button>
        </div>
        </form>
      </div>
    </div>
  )
}

