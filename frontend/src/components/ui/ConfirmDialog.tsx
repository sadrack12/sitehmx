'use client'

import { X, AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          button: 'bg-red-600 hover:bg-red-700 text-white',
          icon: 'text-red-600',
          border: 'border-red-200',
        }
      case 'warning':
        return {
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          icon: 'text-yellow-600',
          border: 'border-yellow-200',
        }
      default:
        return {
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: 'text-blue-600',
          border: 'border-blue-200',
        }
    }
  }

  const colors = getColors()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-gray-200 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`flex-shrink-0 ${colors.icon}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg transition-colors font-semibold shadow-sm ${colors.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

