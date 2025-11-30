'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const tokenParam = searchParams.get('token')
    
    if (emailParam) setEmail(emailParam)
    if (tokenParam) setToken(tokenParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirmation) {
      setError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/gestao/login')
        }, 3000)
      } else {
        setError(data.message || 'Erro ao redefinir senha. Token inválido ou expirado.')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {!success ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Redefinir Senha</h1>
                <p className="text-gray-600">Digite sua nova senha</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                    Token
                  </label>
                  <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    placeholder="Token recebido por email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    id="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Digite a senha novamente"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/gestao/login"
                  className="text-sm text-green-600 hover:text-green-700 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Senha redefinida!</h2>
              <p className="text-gray-600 mb-6">
                Sua senha foi redefinida com sucesso. Você será redirecionado para o login...
              </p>
              <Link
                href="/gestao/login"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Ir para o login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

