'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api'
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Noticia {
  id: number
  title: string
  description: string
  date: string
  image?: string
  color?: string
  published: boolean
  order: number
}

export default function NoticiasPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    color: '',
    published: true,
    order: 0,
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

  const fetchNoticias = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get('/admin/noticias', token || undefined)
      setNoticias(data)
    } catch (error) {
      console.error('Erro ao buscar notícias:', error)
      alert('Erro ao carregar notícias')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchNoticias()
    }
  }, [user, fetchNoticias])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('date', formData.date)
      formDataToSend.append('color', formData.color)
      formDataToSend.append('published', formData.published ? '1' : '0')
      formDataToSend.append('order', formData.order.toString())

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      if (editingNoticia) {
        await api.putFormData(`/admin/noticias/${editingNoticia.id}`, formDataToSend, token || undefined)
      } else {
        await api.postFormData('/admin/noticias', formDataToSend, token || undefined)
      }

      await fetchNoticias()
      resetForm()
      alert(editingNoticia ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar notícia:', error)
      alert(error.message || 'Erro ao salvar notícia')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta notícia?')) return

    try {
      await api.delete(`/admin/noticias/${id}`, token || undefined)
      await fetchNoticias()
      alert('Notícia deletada com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar notícia:', error)
      alert('Erro ao deletar notícia')
    }
  }

  const handleEdit = (noticia: Noticia) => {
    setEditingNoticia(noticia)
    setFormData({
      title: noticia.title,
      description: noticia.description,
      date: noticia.date.split('T')[0],
      color: noticia.color || '',
      published: noticia.published,
      order: noticia.order,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      color: '',
      published: true,
      order: 0,
    })
    setImageFile(null)
    setEditingNoticia(null)
    setShowForm(false)
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notícias</h1>
          <p className="text-sm text-gray-600 mt-0.5">Gerencie as notícias do site</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nova Notícia
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            {editingNoticia ? 'Editar Notícia' : 'Nova Notícia'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Cor (Tailwind)</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="from-green-100 to-green-200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ordem</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Publicado
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
              >
                {saving ? 'Salvando...' : editingNoticia ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Título</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ordem</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {noticias.map((noticia) => (
                <tr key={noticia.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {noticia.image && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${noticia.image}`}
                          alt={noticia.title}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-sm text-gray-900">{noticia.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{noticia.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(noticia.date).toLocaleDateString('pt-AO')}</td>
                  <td className="px-4 py-3">
                    {noticia.published ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        <Eye className="w-3 h-3" />
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        <EyeOff className="w-3 h-3" />
                        Rascunho
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{noticia.order}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(noticia)}
                        className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(noticia.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

