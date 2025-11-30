'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, LogOut, Newspaper, Briefcase, Heart, UserCircle, Image, MessageSquare, Globe, ChevronDown, ChevronRight, Stethoscope, Settings, GraduationCap, Building2, FlaskConical, FileText, BarChart3 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import { useState } from 'react'

type MenuItem = 
  | { href: string; icon: LucideIcon; label: string }
  | { type: 'divider' }

export default function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()
  const [conteudoExpanded, setConteudoExpanded] = useState(true)
  const [configuracoesExpanded, setConfiguracoesExpanded] = useState(true)

  const handleLogout = async () => {
    await logout()
    router.push('/gestao/login')
  }

  const operacionalItems: MenuItem[] = [
    { href: '/gestao/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/gestao/consultas', icon: Calendar, label: 'Consultas' },
    { href: '/gestao/pacientes', icon: Users, label: 'Pacientes' },
    { href: '/gestao/laboratorio', icon: FlaskConical, label: 'Laboratório' },
    { href: '/gestao/relatorios', icon: BarChart3, label: 'Relatórios' },
  ]

  const configuracoesItems: MenuItem[] = [
    { href: '/gestao/configuracoes/usuarios', icon: Settings, label: 'Usuários' },
    { href: '/gestao/configuracoes/medicos', icon: Stethoscope, label: 'Médicos' },
    { href: '/gestao/configuracoes/especialidades', icon: GraduationCap, label: 'Especialidades' },
    { href: '/gestao/configuracoes/salas', icon: Building2, label: 'Salas de Consultas' },
    { href: '/gestao/configuracoes/exames', icon: FlaskConical, label: 'Exames' },
    { href: '/gestao/configuracoes/cabecalho-pdf', icon: FileText, label: 'Cabeçalho PDF' },
  ]

  const conteudoItems: MenuItem[] = [
    { href: '/gestao/admin/noticias', icon: Newspaper, label: 'Notícias' },
    { href: '/gestao/admin/eventos', icon: Calendar, label: 'Eventos' },
    { href: '/gestao/admin/servicos', icon: Briefcase, label: 'Serviços' },
    { href: '/gestao/admin/valores', icon: Heart, label: 'Valores' },
    { href: '/gestao/admin/parceiros', icon: Globe, label: 'Parceiros' },
    { href: '/gestao/admin/corpo-diretivo', icon: UserCircle, label: 'Corpo Diretivo' },
    { href: '/gestao/admin/hero-slides', icon: Image, label: 'Hero Slides' },
    { href: '/gestao/admin/mensagem-director', icon: MessageSquare, label: 'Mensagem Director Geral' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <Link href="/gestao/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="font-semibold text-gray-900">Hospital Moxico</span>
        </Link>
      </div>
      <nav className="p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        <ul className="space-y-1">
          {/* Itens Operacionais */}
          {operacionalItems.map((item) => {
            if ('type' in item && item.type === 'divider') {
              return <li key={`divider-${Math.random()}`} className="my-2"><hr className="border-gray-300" /></li>
            }
            if (!('href' in item)) return null
            const menuItem = item as { href: string; icon: LucideIcon; label: string }
            const Icon = menuItem.icon
            const isActive = pathname === menuItem.href || pathname?.startsWith(menuItem.href + '/')
            return (
              <li key={menuItem.href}>
                <Link
                  href={menuItem.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                  {menuItem.label}
                </Link>
              </li>
            )
          })}

          {/* Divisor e Seção de Configurações Colapsável */}
          <li className="my-3">
            <button
              onClick={() => setConfiguracoesExpanded(!configuracoesExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 uppercase hover:bg-gray-50 transition-colors group"
            >
              <span>Configurações</span>
              {configuracoesExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              )}
            </button>
          </li>

          {/* Itens de Configurações (Colapsáveis) */}
          {configuracoesExpanded && configuracoesItems.map((item) => {
            if ('type' in item && item.type === 'divider') {
              return <li key={`divider-${Math.random()}`} className="my-2"><hr className="border-gray-300" /></li>
            }
            if (!('href' in item)) return null
            const menuItem = item as { href: string; icon: LucideIcon; label: string }
            const Icon = menuItem.icon
            const isActive = pathname === menuItem.href || pathname?.startsWith(menuItem.href + '/')
            return (
              <li key={menuItem.href}>
                <Link
                  href={menuItem.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                  {menuItem.label}
                </Link>
              </li>
            )
          })}

          {/* Divisor e Seção de Conteúdo Colapsável */}
          <li className="my-3">
            <button
              onClick={() => setConteudoExpanded(!conteudoExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 uppercase hover:bg-gray-50 transition-colors group"
            >
              <span>Conteúdo</span>
              {conteudoExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              )}
            </button>
          </li>

          {/* Itens de Conteúdo (Colapsáveis) */}
          {conteudoExpanded && conteudoItems.map((item) => {
            if ('type' in item && item.type === 'divider') {
              return <li key={`divider-${Math.random()}`} className="my-2"><hr className="border-gray-300" /></li>
            }
            if (!('href' in item)) return null
            const menuItem = item as { href: string; icon: LucideIcon; label: string }
            const Icon = menuItem.icon
            const isActive = pathname === menuItem.href || pathname?.startsWith(menuItem.href + '/')
            return (
              <li key={menuItem.href}>
                <Link
                  href={menuItem.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                  {menuItem.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full p-3 border-t border-gray-200 bg-white">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 w-full transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}

