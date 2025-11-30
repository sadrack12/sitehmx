// Utilitários e funções auxiliares

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formata uma data para o formato brasileiro
 */
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatStr, { locale: ptBR })
  } catch (error) {
    return date.toString()
  }
}

/**
 * Formata uma data e hora
 */
export const formatDateTime = (date: string, time: string): string => {
  try {
    const dateObj = new Date(`${date}T${time}`)
    return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch (error) {
    return `${date} ${time}`
  }
}

/**
 * Valida formato de email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida formato de telefone (formato angolano básico)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?244\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Trunca texto com ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Gera classes CSS condicionais
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Obtém cor do status de consulta
 */
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    agendada: 'bg-green-100 text-green-800',
    confirmada: 'bg-green-200 text-green-900',
    realizada: 'bg-green-600 text-white',
    cancelada: 'bg-black text-white',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Obtém label do status em português
 */
export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    agendada: 'Agendada',
    confirmada: 'Confirmada',
    realizada: 'Realizada',
    cancelada: 'Cancelada',
  }
  return labels[status] || status
}

