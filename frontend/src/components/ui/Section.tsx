import { ReactNode } from 'react'
import { cn } from '@/utils'

interface SectionProps {
  children: ReactNode
  className?: string
  bg?: 'white' | 'gray' | 'green' | 'gradient'
  py?: 'sm' | 'md' | 'lg' | 'xl'
  id?: string
}

const bgClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  green: 'bg-green-50',
  gradient: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
}

const pyClasses = {
  sm: 'py-10',
  md: 'py-16',
  lg: 'py-20',
  xl: 'py-24',
}

export default function Section({ children, className, bg = 'white', py = 'lg', id }: SectionProps) {
  return (
    <section id={id} className={cn(bgClasses[bg], pyClasses[py], className)}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  badge?: string
  title: ReactNode
  description?: string
  className?: string
  badgeColor?: 'green' | 'black'
}

export function SectionHeader({ badge, title, description, className, badgeColor = 'green' }: SectionHeaderProps) {
  return (
    <div className={cn('text-center mb-12', className)}>
      {badge && (
        <div className={cn(
          'text-sm uppercase font-semibold mb-4',
          badgeColor === 'green' ? 'text-green-600' : 'text-black'
        )}>
          {badge}
        </div>
      )}
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
        {title}
      </h2>
      {description && (
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}

