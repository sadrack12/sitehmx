'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

let toastIdCounter = 0
let toastListeners: ((toasts: Toast[]) => void)[] = []
let toastState: Toast[] = []

const notifyListeners = () => {
  toastListeners.forEach(listener => listener([...toastState]))
}

export const toast = {
  show: (message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = `toast-${++toastIdCounter}`
    toastState.push({ id, message, type, duration })
    notifyListeners()
    
    if (duration > 0) {
      setTimeout(() => {
        toast.remove(id)
      }, duration)
    }
    
    return id
  },
  success: (message: string, duration?: number) => toast.show(message, 'success', duration),
  error: (message: string, duration?: number) => toast.show(message, 'error', duration),
  info: (message: string, duration?: number) => toast.show(message, 'info', duration),
  warning: (message: string, duration?: number) => toast.show(message, 'warning', duration),
  remove: (id: string) => {
    toastState = toastState.filter(t => t.id !== id)
    notifyListeners()
  },
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToasts(newToasts)
    }
    toastListeners.push(listener)
    setToasts([...toastState])

    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${getStyles(toast.type)}
            border-2 rounded-xl shadow-lg p-4 flex items-start gap-3
            animate-in slide-in-from-right-full duration-300
            backdrop-blur-sm
          `}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold break-words">{toast.message}</p>
          </div>
          <button
            onClick={() => toast.remove(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

