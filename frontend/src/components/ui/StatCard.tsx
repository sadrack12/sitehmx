import { LucideIcon, TrendingUp } from 'lucide-react'
import { StatCard as StatCardType } from '@/types'
import { cn } from '@/utils'

interface StatCardProps {
  stat: StatCardType
  className?: string
}

export default function StatCard({ stat, className }: StatCardProps) {
  const Icon = stat.icon as LucideIcon
  
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 overflow-hidden',
        className
      )}
    >
      <div className={cn('bg-gradient-to-br', stat.color, 'p-6 text-white')}>
        <div className="flex items-center justify-between mb-4">
          <div className={cn(stat.bgColor, 'rounded-xl p-3')}>
            <Icon className={cn('w-6 h-6', stat.iconColor)} />
          </div>
          <TrendingUp className="w-5 h-5 opacity-50" />
        </div>
        <div className="text-3xl font-bold mb-1">{stat.value}</div>
        <div className="text-sm opacity-90">{stat.title}</div>
      </div>
    </div>
  )
}

