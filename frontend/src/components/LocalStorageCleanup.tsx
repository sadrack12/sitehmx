'use client'

import { useEffect } from 'react'

/**
 * Componente que limpa dados inválidos do localStorage antes de qualquer outra coisa
 * Previne erros de JSON.parse("undefined")
 */
export default function LocalStorageCleanup() {
  useEffect(() => {
    try {
      // Verificar e limpar token
      const token = localStorage.getItem('token')
      if (
        token === null ||
        token === 'undefined' ||
        token === 'null' ||
        token.trim() === '' ||
        token === undefined
      ) {
        localStorage.removeItem('token')
      }

      // Verificar e limpar user
      const user = localStorage.getItem('user')
      if (
        user === null ||
        user === 'undefined' ||
        user === 'null' ||
        user.trim() === '' ||
        user === undefined
      ) {
        localStorage.removeItem('user')
      } else {
        // Tentar validar JSON
        try {
          const parsed = JSON.parse(user)
          if (!parsed || typeof parsed !== 'object' || !parsed.id) {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
          }
        } catch (e) {
          // JSON inválido, limpar tudo
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      // Se der erro ao acessar localStorage, apenas logar
      console.warn('Erro ao limpar localStorage:', error)
    }
  }, [])

  return null // Este componente não renderiza nada
}

