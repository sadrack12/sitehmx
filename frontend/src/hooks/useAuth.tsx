'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { API_URL } from '@/config/api'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Limpar dados inválidos primeiro
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      // Verificar se os valores são válidos
      if (!storedToken || !storedUser) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setLoading(false)
        return
      }

      // Verificar se são strings inválidas
      if (
        storedToken === 'undefined' ||
        storedToken === 'null' ||
        storedUser === 'undefined' ||
        storedUser === 'null' ||
        storedToken.trim() === '' ||
        storedUser.trim() === ''
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setLoading(false)
        return
      }

      // Tentar fazer parse
      try {
        const parsedUser = JSON.parse(storedUser)
        // Verificar se o objeto parseado é válido
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
          setToken(storedToken)
          setUser(parsedUser)
        } else {
          throw new Error('User object invalid')
        }
      } catch (parseError) {
        console.error('Erro ao fazer parse do usuário do localStorage:', parseError)
        // Limpar dados inválidos
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.error('Erro ao acessar localStorage:', error)
      // Limpar tudo em caso de erro
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch (e) {
        // Ignorar erros ao limpar
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )

      const { token: newToken, user: newUser } = response.data
      setToken(newToken)
      setUser(newUser)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login'
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    if (token) {
      try {
        await axios.post(
          `${API_URL}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      }
    }

    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

