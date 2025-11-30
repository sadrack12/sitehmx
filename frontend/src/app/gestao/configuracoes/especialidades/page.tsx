'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Loader2, GraduationCap } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface Especialidade {
  id: number
  nome: string
  descricao?: string
  ativa: boolean
  capacidade_diaria?: number
}

export default function EspecialidadesPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEspecialidade, setEditingEspecialidade] = useState<Especialidade | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ativa: true,
    capacidade_diaria: 10,
  })
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/gestao/login')
    } else if (user && user.role !== 'admin') {
      router.push('/gestao/dashboard')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (token) {
      fetchEspecialidades()
    }
  }, [token])

  const fetchEspecialidades = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/especialidades`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setEspecialidades(data.data || [])
      }
    } catch (error) {
      toast.error('Erro ao carregar especialidades')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingEspecialidade
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/especialidades/${editingEspecialidade.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/especialidades`
      const method = editingEspecialidade ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao salvar especialidade')
      }

      toast.success(editingEspecialidade ? 'Especialidade atualizada!' : 'Especialidade criada!')
      resetForm()
      fetchEspecialidades()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar especialidade')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (especialidade: Especialidade) => {
    setEditingEspecialidade(especialidade)
    setFormData({
      nome: especialidade.nome,
      descricao: especialidade.descricao || '',
      ativa: especialidade.ativa,
      capacidade_diaria: especialidade.capacidade_diaria || 10,
    })
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteConfirm.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/especialidades/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Especialidade removida!')
        fetchEspecialidades()
      } else {
        throw new Error('Erro ao remover especialidade')
      }
    } catch (error) {
      toast.error('Erro ao remover especialidade')
    } finally {
      setDeleteConfirm({ isOpen: false, id: null })
    }
  }

  const resetForm = () => {
    setFormData({ nome: '', descricao: '', ativa: true, capacidade_diaria: 10 })
    setEditingEspecialidade(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Especialidades</h1>
          <p className="text-gray-600 mt-1">Gerencie as especialidades médicas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          Nova Especialidade
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingEspecialidade ? 'Editar Especialidade' : 'Nova Especialidade'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                placeholder="Ex: Cardiologia, Pediatria, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none text-sm"
                placeholder="Descrição da especialidade..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidade Diária (vagas por médico)
                </label>
                <input
                  type="number"
                  value={formData.capacidade_diaria}
                  onChange={(e) => setFormData({ ...formData, capacidade_diaria: parseInt(e.target.value) || 10 })}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="10"
                />
                <p className="text-xs text-gray-500 mt-1">Número máximo de consultas por médico por dia</p>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="ativa"
                  checked={formData.ativa}
                  onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="ativa" className="text-sm font-medium text-gray-700">
                  Especialidade ativa
                </label>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    {editingEspecialidade ? 'Atualizar' : 'Salvar'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Capacidade Diária</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {especialidades.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Nenhuma especialidade cadastrada</p>
                  </td>
                </tr>
              ) : (
                especialidades.map((especialidade) => (
                  <tr key={especialidade.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{especialidade.nome}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{especialidade.descricao || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {especialidade.capacidade_diaria || 10} vagas/médico
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {especialidade.ativa ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Ativa</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">Inativa</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(especialidade)}
                          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: especialidade.id })}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta especialidade? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}

