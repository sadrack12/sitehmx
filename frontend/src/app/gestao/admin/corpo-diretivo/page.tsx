'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Membro {
  id: number
  name: string
  cargo: string
  bio?: string
  image?: string
  published: boolean
  order: number
  parent_id?: number | null
  nivel: number
}

export default function CorpoDiretivoPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [membros, setMembros] = useState<Membro[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMembro, setEditingMembro] = useState<Membro | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    cargo: '',
    bio: '',
    published: true,
    order: 0,
    parent_id: null as number | null,
    nivel: 1,
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

  const fetchMembros = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get('/admin/corpo-diretivo', token || undefined)
      setMembros(data)
    } catch (error) {
      console.error('Erro ao buscar membros:', error)
      alert('Erro ao carregar membros do corpo diretivo')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchMembros()
    }
  }, [user, fetchMembros])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('cargo', formData.cargo)
      formDataToSend.append('bio', formData.bio)
      formDataToSend.append('published', formData.published ? '1' : '0')
      formDataToSend.append('order', formData.order.toString())
      if (formData.parent_id) {
        formDataToSend.append('parent_id', formData.parent_id.toString())
      }
      formDataToSend.append('nivel', formData.nivel.toString())

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      if (editingMembro) {
        await api.putFormData(`/admin/corpo-diretivo/${editingMembro.id}`, formDataToSend, token || undefined)
      } else {
        await api.postFormData('/admin/corpo-diretivo', formDataToSend, token || undefined)
      }

      await fetchMembros()
      resetForm()
      alert(editingMembro ? 'Membro atualizado com sucesso!' : 'Membro criado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar membro:', error)
      alert(error.message || 'Erro ao salvar membro')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este membro?')) return

    try {
      await api.delete(`/admin/corpo-diretivo/${id}`, token || undefined)
      await fetchMembros()
      alert('Membro deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar membro:', error)
      alert('Erro ao deletar membro')
    }
  }

  const handleEdit = (membro: Membro) => {
    setEditingMembro(membro)
    setFormData({
      name: membro.name,
      cargo: membro.cargo,
      bio: membro.bio || '',
      published: membro.published,
      order: membro.order,
      parent_id: membro.parent_id || null,
      nivel: membro.nivel || 1,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      cargo: '',
      bio: '',
      published: true,
      order: 0,
      parent_id: null,
      nivel: 1,
    })
    setImageFile(null)
    setEditingMembro(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Corpo Diretivo</h1>
          <p className="text-gray-600 mt-1">Gerencie os membros do corpo diretivo</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Novo Membro
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingMembro ? 'Editar Membro' : 'Novo Membro'}
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
                <label className="block text-sm font-semibold mb-1">Cargo</label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  required
                  placeholder="Director Geral"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Biografia</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Superior Hierárquico (Parent)</label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Nenhum (Topo da hierarquia)</option>
                  {membros
                    .filter(m => !editingMembro || m.id !== editingMembro.id)
                    .map((membro) => (
                      <option key={membro.id} value={membro.id}>
                        {membro.name} - {membro.cargo}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Nível Hierárquico</label>
                <input
                  type="number"
                  min="1"
                  value={formData.nivel}
                  onChange={(e) => setFormData({ ...formData, nivel: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="1 = Topo, 2 = Segundo nível, etc."
                />
                <p className="text-xs text-gray-500 mt-1">1 = Topo da hierarquia, números maiores = níveis inferiores</p>
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
                {saving ? 'Salvando...' : editingMembro ? 'Atualizar' : 'Criar'}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Foto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nível</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {membros.map((membro) => (
                <tr key={membro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {membro.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${membro.image}`}
                        alt={membro.name}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                        {membro.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">{membro.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{membro.cargo}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Nível {membro.nivel || 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {membro.published ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Publicado</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Rascunho</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(membro)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(membro.id)}
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

