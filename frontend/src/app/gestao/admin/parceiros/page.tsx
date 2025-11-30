'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'

interface Parceiro {
  id: number
  name: string
  logo?: string
  url?: string
  published: boolean
  order: number
}

export default function ParceirosPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [parceiros, setParceiros] = useState<Parceiro[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingParceiro, setEditingParceiro] = useState<Parceiro | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    published: true,
    order: 0,
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/gestao/login')
    } else if (user && user.role !== 'admin') {
      router.push('/gestao/dashboard')
    }
  }, [user, authLoading, router])

  const fetchParceiros = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get('/admin/parceiros', token || undefined)
      setParceiros(data)
    } catch (error) {
      console.error('Erro ao buscar parceiros:', error)
      alert('Erro ao carregar parceiros')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchParceiros()
    }
  }, [user, fetchParceiros])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('url', formData.url)
      formDataToSend.append('published', formData.published ? '1' : '0')
      formDataToSend.append('order', formData.order.toString())

      if (logoFile) {
        formDataToSend.append('logo', logoFile)
      }

      if (editingParceiro) {
        await api.putFormData(`/admin/parceiros/${editingParceiro.id}`, formDataToSend, token || undefined)
      } else {
        await api.postFormData('/admin/parceiros', formDataToSend, token || undefined)
      }

      await fetchParceiros()
      resetForm()
      alert(editingParceiro ? 'Parceiro atualizado com sucesso!' : 'Parceiro criado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar parceiro:', error)
      alert(error.message || 'Erro ao salvar parceiro')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este parceiro?')) return

    try {
      await api.delete(`/admin/parceiros/${id}`, token || undefined)
      await fetchParceiros()
      alert('Parceiro deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar parceiro:', error)
      alert('Erro ao deletar parceiro')
    }
  }

  const handleEdit = (parceiro: Parceiro) => {
    setEditingParceiro(parceiro)
    setFormData({
      name: parceiro.name,
      url: parceiro.url || '',
      published: parceiro.published,
      order: parceiro.order,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      published: true,
      order: 0,
    })
    setLogoFile(null)
    setEditingParceiro(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Parceiros</h1>
          <p className="text-gray-600 mt-1">Gerencie os parceiros do hospital</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Novo Parceiro
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingParceiro ? 'Editar Parceiro' : 'Novo Parceiro'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
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
                {saving ? 'Salvando...' : editingParceiro ? 'Atualizar' : 'Criar'}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parceiros.map((parceiro) => (
                <tr key={parceiro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{parceiro.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">
                    {parceiro.url ? (
                      <a href={parceiro.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {parceiro.url}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {parceiro.published ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Publicado</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Rascunho</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(parceiro)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(parceiro.id)}
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

