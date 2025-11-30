'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, LogOut, Stethoscope } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

type MenuItem = 
  | { href: string; icon: LucideIcon; label: string }
  | { type: 'divider' }

export default function MedicoSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/gestao/login')
  }

  const menuItems: MenuItem[] = [
    { href: '/gestao/medico/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/gestao/medico/consultas', icon: Calendar, label: 'Minhas Consultas' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <Link href="/gestao/medico/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Painel Médico</span>
        </Link>
      </div>
      <nav className="p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        <ul className="space-y-1">
          {menuItems.map((item) => {
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

