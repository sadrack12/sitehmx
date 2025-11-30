'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, Clock, CheckCircle, Activity, 
  Newspaper, Briefcase, Heart, UserCircle, Image, MessageSquare,
  ArrowRight, Plus, ChevronRight, Users, FileText
} from 'lucide-react'

interface DashboardStats {
  noticias: number
  eventos: number
  servicos: number
  valores: number
  parceiros: number
  corpo_diretivo: number
  hero_slides: number
  mensagem_director: number
}

interface MenuItem {
  title: string
  icon: string
  route: string
  count: number
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirecionar médicos para seu dashboard específico
  useEffect(() => {
    if (!loading && user?.role === 'medico') {
      router.push('/gestao/medico/dashboard')
    }
  }, [user, loading, router])
  const [adminStats, setAdminStats] = useState<DashboardStats | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [consultasStats, setConsultasStats] = useState({
    totalConsultas: 0,
    consultasHoje: 0,
    consultasPendentes: 0,
    consultasRealizadas: 0,
  })
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/gestao/login')
    } else if (user && user.role === 'medico') {
      // Redirecionar médicos para seu dashboard específico
      router.push('/gestao/medico/dashboard')
    } else if (user && user.role !== 'admin') {
      // Usuários não-admin não podem acessar dashboard admin
      router.push('/gestao/consultas')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminStats()
      fetchConsultasStats()
    }
  }, [user])

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.status === 403) {
        console.error('Acesso negado: usuário não é admin')
        router.push('/gestao/consultas')
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        setAdminStats(data.stats)
        setMenuItems(data.menu)
        setDashboardData(data)
      } else {
        console.error('Erro ao buscar estatísticas do admin:', response.status)
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas do admin:', error)
    }
  }

  const fetchConsultasStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      
      const hoje = new Date().toISOString().split('T')[0]
      const consultasHoje = data.data?.filter((c: any) => c.data_consulta === hoje).length || 0
      const consultasPendentes = data.data?.filter((c: any) => c.status === 'agendada' || c.status === 'confirmada').length || 0
      const consultasRealizadas = data.data?.filter((c: any) => c.status === 'realizada').length || 0

      setConsultasStats({
        totalConsultas: data.data?.length || 0,
        consultasHoje,
        consultasPendentes,
        consultasRealizadas,
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas de consultas:', error)
    }
  }

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      newspaper: Newspaper,
      calendar: Calendar,
      briefcase: Briefcase,
      heart: Heart,
      users: Users,
      'user-circle': UserCircle,
      image: Image,
      'message-square': MessageSquare,
    }
    return icons[iconName] || FileText
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const consultasCards = [
    {
      title: 'Total',
      value: consultasStats.totalConsultas,
      icon: Calendar,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Hoje',
      value: consultasStats.consultasHoje,
      icon: Clock,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Pendentes',
      value: consultasStats.consultasPendentes,
      icon: Activity,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Realizadas',
      value: consultasStats.consultasRealizadas,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo, {user?.name}</p>
      </div>

      {/* Stats Cards - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {consultasCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:border-green-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.bgColor} rounded-lg p-2.5`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          )
        })}
      </div>

      {/* Estatísticas Adicionais */}
      {dashboardData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-50 rounded-lg p-2.5">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{dashboardData.pacientes?.total || 0}</div>
              <div className="text-sm text-gray-600">Total de Pacientes</div>
              <div className="text-xs text-green-600 mt-2">
                +{dashboardData.pacientes?.novos_mes || 0} este mês
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-50 rounded-lg p-2.5">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{dashboardData.medicos?.total || 0}</div>
              <div className="text-sm text-gray-600">Total de Médicos</div>
              <div className="text-xs text-green-600 mt-2">
                {dashboardData.medicos?.ativos || 0} com agenda ativa
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-orange-50 rounded-lg p-2.5">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{dashboardData.exames?.total || 0}</div>
              <div className="text-sm text-gray-600">Total de Exames</div>
              <div className="text-xs text-yellow-600 mt-2">
                {dashboardData.exames?.pendentes || 0} pendentes
              </div>
            </div>
          </div>

          {/* Gráfico de Consultas por Mês */}
          {dashboardData.consultas?.ultimos_meses && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultas dos Últimos 6 Meses</h2>
              <div className="space-y-3">
                {dashboardData.consultas.ultimos_meses.map((item: any, index: number) => {
                  const maxValue = Math.max(...dashboardData.consultas.ultimos_meses.map((m: any) => m.total), 1)
                  const percentage = maxValue > 0 ? (item.total / maxValue) * 100 : 0
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-gray-600">{item.mes}</div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-green-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            {item.total > 0 && (
                              <span className="text-xs text-white font-medium">{item.total}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-12 text-right text-sm font-medium text-gray-900">{item.total}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Gráfico de Status de Consultas */}
          {dashboardData.consultas?.por_status && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultas por Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(dashboardData.consultas.por_status).map(([status, total]: [string, any]) => {
                  const statusLabels: { [key: string]: string } = {
                    agendada: 'Agendadas',
                    confirmada: 'Confirmadas',
                    realizada: 'Realizadas',
                    cancelada: 'Canceladas',
                  }
                  const statusColors: { [key: string]: string } = {
                    agendada: 'bg-yellow-100 text-yellow-800',
                    confirmada: 'bg-blue-100 text-blue-800',
                    realizada: 'bg-green-100 text-green-800',
                    cancelada: 'bg-red-100 text-red-800',
                  }
                  return (
                    <div key={status} className="text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[status] || status}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{total}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Content Management - Simplified */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestão de Conteúdo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {menuItems.map((item, index) => {
            const Icon = getIcon(item.icon)
            return (
              <Link
                key={index}
                href={`/gestao${item.route}`}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-green-500 hover:bg-green-50 transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 group-hover:bg-green-100 rounded-lg p-2 transition-colors">
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.count} itens</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/gestao/consultas"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-500 hover:bg-green-50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultas</h3>
              <p className="text-sm text-gray-600">Gerencie todas as consultas agendadas</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          href="/gestao/pacientes"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-500 hover:bg-green-50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pacientes</h3>
              <p className="text-sm text-gray-600">Gerencie o cadastro de pacientes</p>
            </div>
            <Users className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  )
}
