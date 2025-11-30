'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'

interface Valor {
  id: number
  icon: string
  title: string
  description?: string
  published: boolean
  order: number
}

export default function ValoresPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [valores, setValores] = useState<Valor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingValor, setEditingValor] = useState<Valor | null>(null)
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    description: '',
    published: true,
    order: 0,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/gestao/login')
    } else if (user && user.role !== 'admin') {
      router.push('/gestao/dashboard')
    }
  }, [user, authLoading, router])

  const fetchValores = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get('/admin/valores', token || undefined)
      setValores(data)
    } catch (error) {
      console.error('Erro ao buscar valores:', error)
      alert('Erro ao carregar valores')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchValores()
    }
  }, [user, fetchValores])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingValor) {
        await api.put(`/admin/valores/${editingValor.id}`, formData, token || undefined)
      } else {
        await api.post('/admin/valores', formData, token || undefined)
      }

      await fetchValores()
      resetForm()
      alert(editingValor ? 'Valor atualizado com sucesso!' : 'Valor criado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar valor:', error)
      alert(error.message || 'Erro ao salvar valor')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este valor?')) return

    try {
      await api.delete(`/admin/valores/${id}`, token || undefined)
      await fetchValores()
      alert('Valor deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar valor:', error)
      alert('Erro ao deletar valor')
    }
  }

  const handleEdit = (valor: Valor) => {
    setEditingValor(valor)
    setFormData({
      icon: valor.icon,
      title: valor.title,
      description: valor.description || '',
      published: valor.published,
      order: valor.order,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      icon: '',
      title: '',
      description: '',
      published: true,
      order: 0,
    })
    setEditingValor(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Valores</h1>
          <p className="text-gray-600 mt-1">Gerencie os valores do hospital</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Novo Valor
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingValor ? 'Editar Valor' : 'Novo Valor'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Ícone (emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  required
                  placeholder="❤"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                {saving ? 'Salvando...' : editingValor ? 'Atualizar' : 'Criar'}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ícone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {valores.map((valor) => (
                <tr key={valor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-2xl">{valor.icon}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{valor.title}</div>
                    {valor.description && (
                      <div className="text-sm text-gray-500 line-clamp-1">{valor.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {valor.published ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Publicado</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Rascunho</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(valor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(valor.id)}
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

