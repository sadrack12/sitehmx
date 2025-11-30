import { ReactNode, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'
import { cn } from '@/utils'

interface BaseButtonProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

type ButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>

type LinkButtonProps = BaseButtonProps & {
  href: string
  as?: 'a' | typeof Link
}

const buttonVariants = {
  primary: 'bg-green-600 text-white hover:bg-green-700',
  secondary: 'bg-black text-white hover:bg-gray-900',
  outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
  ghost: 'text-green-600 hover:bg-green-50',
}

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export function LinkButton({ 
  children, 
  href, 
  className, 
  variant = 'primary', 
  size = 'md',
  as = Link,
  ...props 
}: LinkButtonProps) {
  const Component = as
  
  return (
    <Component
      href={href}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-lg transition-all transform hover:scale-105',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

