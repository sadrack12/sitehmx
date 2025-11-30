'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Loader2, FlaskConical } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Select from '@/components/ui/Select'

interface Exame {
  id: number
  codigo: string
  nome: string
  descricao?: string
  tipo: 'laboratorio' | 'imagem' | 'clinico' | 'outro'
  valor?: number
  prazo_resultado?: number
  preparo?: string
  requer_jejum: boolean
  ativo: boolean
}

export default function ExamesPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [exames, setExames] = useState<Exame[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExame, setEditingExame] = useState<Exame | null>(null)
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    tipo: 'laboratorio' as Exame['tipo'],
    valor: '',
    prazo_resultado: '',
    preparo: '',
    requer_jejum: false,
    ativo: true,
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
      fetchExames()
    }
  }, [token])

  const fetchExames = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/exames`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setExames(data.data || [])
      }
    } catch (error) {
      toast.error('Erro ao carregar exames')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingExame
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/exames/${editingExame.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/exames`
      const method = editingExame ? 'PUT' : 'POST'

      const dataToSend = {
        ...formData,
        valor: formData.valor ? parseFloat(formData.valor) : null,
        prazo_resultado: formData.prazo_resultado ? parseInt(formData.prazo_resultado) : null,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao salvar exame')
      }

      toast.success(editingExame ? 'Exame atualizado!' : 'Exame criado!')
      resetForm()
      fetchExames()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar exame')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (exame: Exame) => {
    setEditingExame(exame)
    setFormData({
      codigo: exame.codigo,
      nome: exame.nome,
      descricao: exame.descricao || '',
      tipo: exame.tipo,
      valor: exame.valor?.toString() || '',
      prazo_resultado: exame.prazo_resultado?.toString() || '',
      preparo: exame.preparo || '',
      requer_jejum: exame.requer_jejum,
      ativo: exame.ativo,
    })
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteConfirm.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/exames/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Exame removido!')
        fetchExames()
      } else {
        throw new Error('Erro ao remover exame')
      }
    } catch (error) {
      toast.error('Erro ao remover exame')
    } finally {
      setDeleteConfirm({ isOpen: false, id: null })
    }
  }

  const resetForm = () => {
    setFormData({
      codigo: '',
      nome: '',
      descricao: '',
      tipo: 'laboratorio',
      valor: '',
      prazo_resultado: '',
      preparo: '',
      requer_jejum: false,
      ativo: true,
    })
    setEditingExame(null)
    setShowForm(false)
  }

  const getTipoLabel = (tipo: string) => {
    const labels = {
      laboratorio: 'Laboratório',
      imagem: 'Imagem',
      clinico: 'Clínico',
      outro: 'Outro',
    }
    return labels[tipo as keyof typeof labels] || tipo
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
          <h1 className="text-3xl font-bold text-gray-900">Exames</h1>
          <p className="text-gray-600 mt-1">Gerencie os exames disponíveis no hospital</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Exame
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingExame ? 'Editar Exame' : 'Novo Exame'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="Ex: LAB001, IMG001"
                />
              </div>
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
                  placeholder="Nome do exame"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none text-sm"
                placeholder="Descrição do exame..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Exame['tipo'] })}
                required
              >
                <option value="laboratorio">Laboratório</option>
                <option value="imagem">Imagem</option>
                <option value="clinico">Clínico</option>
                <option value="outro">Outro</option>
              </Select>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (Kz)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prazo (dias)</label>
                <input
                  type="number"
                  value={formData.prazo_resultado}
                  onChange={(e) => setFormData({ ...formData, prazo_resultado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="Ex: 3"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preparo</label>
              <textarea
                value={formData.preparo}
                onChange={(e) => setFormData({ ...formData, preparo: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none text-sm"
                placeholder="Instruções de preparo para o paciente..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requer_jejum"
                  checked={formData.requer_jejum}
                  onChange={(e) => setFormData({ ...formData, requer_jejum: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="requer_jejum" className="text-sm font-medium text-gray-700">
                  Requer jejum
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="ativo" className="text-sm font-medium text-gray-700">
                  Exame ativo
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
                    {editingExame ? 'Atualizar' : 'Salvar'}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Prazo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exames.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    <FlaskConical className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Nenhum exame cadastrado</p>
                  </td>
                </tr>
              ) : (
                exames.map((exame) => (
                  <tr key={exame.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{exame.codigo}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{exame.nome}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{getTipoLabel(exame.tipo)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">
                        {exame.valor ? `Kz ${Number(exame.valor).toFixed(2)}` : '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">
                        {exame.prazo_resultado ? `${exame.prazo_resultado} dias` : '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {exame.ativo ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Ativo</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">Inativo</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(exame)}
                          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: exame.id })}
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
        message="Tem certeza que deseja excluir este exame? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}

