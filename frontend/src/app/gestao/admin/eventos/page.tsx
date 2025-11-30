'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api'
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Star } from 'lucide-react'
import Image from 'next/image'

interface Evento {
  id: number
  title: string
  date: string
  featured: boolean
  image?: string
  color?: string
  description?: string
  published: boolean
  order: number
}

export default function EventosPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    featured: false,
    color: '',
    description: '',
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

  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get('/admin/eventos', token || undefined)
      setEventos(data)
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
      alert('Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchEventos()
    }
  }, [user, fetchEventos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('date', formData.date)
      formDataToSend.append('featured', formData.featured ? '1' : '0')
      formDataToSend.append('color', formData.color)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('published', formData.published ? '1' : '0')
      formDataToSend.append('order', formData.order.toString())

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      if (editingEvento) {
        await api.putFormData(`/admin/eventos/${editingEvento.id}`, formDataToSend, token || undefined)
      } else {
        await api.postFormData('/admin/eventos', formDataToSend, token || undefined)
      }

      await fetchEventos()
      resetForm()
      alert(editingEvento ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar evento:', error)
      alert(error.message || 'Erro ao salvar evento')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return

    try {
      await api.delete(`/admin/eventos/${id}`, token || undefined)
      await fetchEventos()
      alert('Evento deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar evento:', error)
      alert('Erro ao deletar evento')
    }
  }

  const handleEdit = (evento: Evento) => {
    setEditingEvento(evento)
    setFormData({
      title: evento.title,
      date: evento.date.split('T')[0],
      featured: evento.featured,
      color: evento.color || '',
      description: evento.description || '',
      published: evento.published,
      order: evento.order,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      featured: false,
      color: '',
      description: '',
      published: true,
      order: 0,
    })
    setImageFile(null)
    setEditingEvento(null)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600 mt-1">Gerencie os eventos e galeria do site</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Novo Evento
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingEvento ? 'Editar Evento' : 'Novo Evento'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Destaque
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold">Publicado</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : editingEvento ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Destaque</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {eventos.map((evento) => (
                <tr key={evento.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {evento.image && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${evento.image}`}
                          alt={evento.title}
                          width={50}
                          height={50}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-semibold">{evento.title}</div>
                        {evento.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">{evento.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(evento.date).toLocaleDateString('pt-AO')}</td>
                  <td className="px-6 py-4">
                    {evento.published ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <Eye className="w-3 h-3" />
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        <EyeOff className="w-3 h-3" />
                        Rascunho
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {evento.featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(evento)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(evento.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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

