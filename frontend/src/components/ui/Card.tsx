import { ReactNode } from 'react'
import { cn } from '@/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className, hover = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl overflow-hidden shadow-lg transition-all',
        hover && 'hover:shadow-xl transform hover:-translate-y-2',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardImageProps {
  children: ReactNode
  className?: string
  gradient?: string
}

export function CardImage({ children, className, gradient = 'from-green-100 to-green-200' }: CardImageProps) {
  return (
    <div className={cn(`bg-gradient-to-br ${gradient} flex items-center justify-center relative`, className || 'h-64')}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-2xl font-bold mb-4 text-gray-900', className)}>
      {children}
    </h3>
  )
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-gray-600 mb-4 leading-relaxed', className)}>
      {children}
    </p>
  )
}

