'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'

interface Servico {
  id: number
  title: string
  description: string
  tipo: 'especializado' | 'apoio'
  icon?: string
  image?: string
  href?: string
  published: boolean
  order: number
}

export default function ServicosPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingServico, setEditingServico] = useState<Servico | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tipo: 'especializado' as 'especializado' | 'apoio',
    icon: '',
    href: '/servicos',
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

  const fetchServicos = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get('/admin/servicos', token || undefined)
      setServicos(data)
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
      alert('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchServicos()
    }
  }, [user, fetchServicos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('tipo', formData.tipo)
      formDataToSend.append('icon', formData.icon)
      formDataToSend.append('href', formData.href)
      formDataToSend.append('published', formData.published ? '1' : '0')
      formDataToSend.append('order', formData.order.toString())

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      if (editingServico) {
        await api.putFormData(`/admin/servicos/${editingServico.id}`, formDataToSend, token || undefined)
      } else {
        await api.postFormData('/admin/servicos', formDataToSend, token || undefined)
      }

      await fetchServicos()
      resetForm()
      alert(editingServico ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar serviço:', error)
      alert(error.message || 'Erro ao salvar serviço')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este serviço?')) return

    try {
      await api.delete(`/admin/servicos/${id}`, token || undefined)
      await fetchServicos()
      alert('Serviço deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar serviço:', error)
      alert('Erro ao deletar serviço')
    }
  }

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico)
    setFormData({
      title: servico.title,
      description: servico.description,
      tipo: servico.tipo,
      icon: servico.icon || '',
      href: servico.href || '/servicos',
      published: servico.published,
      order: servico.order,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tipo: 'especializado',
      icon: '',
      href: '/servicos',
      published: true,
      order: 0,
    })
    setImageFile(null)
    setEditingServico(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600 mt-1">Gerencie os serviços do hospital</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Novo Serviço
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
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
                <label className="block text-sm font-semibold mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'especializado' | 'apoio' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="especializado">Especializado</option>
                  <option value="apoio">Apoio</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Ícone (lucide-react)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Stethoscope"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Link</label>
                <input
                  type="text"
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm font-semibold">Publicado</label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : editingServico ? 'Atualizar' : 'Criar'}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {servicos.map((servico) => (
                <tr key={servico.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{servico.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{servico.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      servico.tipo === 'especializado' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {servico.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {servico.published ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Publicado</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Rascunho</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(servico)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(servico.id)}
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

