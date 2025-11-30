'use client'

import { ChevronDown } from 'lucide-react'
import { ReactNode } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  children?: ReactNode
  label?: string
  error?: string
  icon?: ReactNode
  options?: SelectOption[]
}

export default function Select({ children, label, error, icon, className = '', options, ...props }: SelectProps) {
  return (
    <div className={label ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {icon}
          </div>
        )}
        <select
          {...props}
          className={`
            ${label ? 'w-full' : 'min-w-[140px]'} 
            ${icon ? 'pl-10' : 'pl-3'} 
            pr-10 
            py-2.5 
            border 
            border-gray-300 
            rounded-lg 
            bg-white
            text-sm
            text-gray-900
            font-medium
            appearance-none
            cursor-pointer
            transition-all
            duration-200
            focus:ring-2 
            focus:ring-green-500/50
            focus:border-green-500 
            outline-none
            hover:border-gray-400
            hover:bg-gray-50
            disabled:bg-gray-100 
            disabled:cursor-not-allowed
            disabled:text-gray-500
            disabled:border-gray-200
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
            ${className}
          `}
        >
          {options ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}

