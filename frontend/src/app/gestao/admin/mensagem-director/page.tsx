'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api'
import { Edit, Loader2, Save } from 'lucide-react'
import Image from 'next/image'

interface MensagemDirector {
  id: number
  director_name: string
  message: string
  image?: string
  published: boolean
}

export default function MensagemDirectorPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [mensagem, setMensagem] = useState<MensagemDirector | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    director_name: '',
    message: '',
    published: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/gestao/login')
    } else if (user && user.role !== 'admin') {
      router.push('/gestao/dashboard')
    }
  }, [user, authLoading, router])

  const fetchMensagem = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get('/admin/mensagem-director', token || undefined)
      if (data) {
        setMensagem(data)
        setFormData({
          director_name: data.director_name,
          message: data.message,
          published: data.published,
        })
      }
    } catch (error) {
      console.error('Erro ao buscar mensagem:', error)
      // Não mostrar erro se não existir mensagem ainda
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchMensagem()
    }
  }, [user, fetchMensagem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('director_name', formData.director_name)
      formDataToSend.append('message', formData.message)
      formDataToSend.append('published', formData.published ? '1' : '0')

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      if (mensagem) {
        await api.putFormData(`/admin/mensagem-director/${mensagem.id}`, formDataToSend, token || undefined)
      } else {
        await api.postFormData('/admin/mensagem-director', formDataToSend, token || undefined)
      }

      await fetchMensagem()
      setShowForm(false)
      alert('Mensagem salva com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar mensagem:', error)
      alert(error.message || 'Erro ao salvar mensagem')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mensagem do Director Geral</h1>
          <p className="text-gray-600 mt-1">Gerencie a mensagem do director geral</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {mensagem ? (
              <>
                <Edit className="w-5 h-5" />
                Editar Mensagem
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Criar Mensagem
              </>
            )}
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {mensagem ? 'Editar Mensagem' : 'Nova Mensagem'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Nome do Director</label>
              <input
                type="text"
                value={formData.director_name}
                onChange={(e) => setFormData({ ...formData, director_name: e.target.value })}
                required
                placeholder="Dr. Nome do Director"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 focus:bg-white outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Mensagem</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={10}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 focus:bg-white outline-none text-sm resize-y"
                placeholder="Escreva a mensagem do director aqui..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Foto do Director</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 focus:bg-white outline-none text-sm file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm font-semibold">Publicado</label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  if (mensagem) {
                    setFormData({
                      director_name: mensagem.director_name,
                      message: mensagem.message,
                      published: mensagem.published,
                    })
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          {mensagem ? (
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                {mensagem.image && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${mensagem.image}`}
                    alt={mensagem.director_name}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{mensagem.director_name}</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{mensagem.message}</p>
                  </div>
                  <div className="mt-4">
                    {mensagem.published ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Publicado
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                        Rascunho
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma mensagem cadastrada ainda.</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-5 h-5" />
                Criar Mensagem
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

