'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Loader2, Building2, GraduationCap } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Select from '@/components/ui/Select'

interface Sala {
  id: number
  numero: string
  nome?: string
  descricao?: string
  tipo: 'consulta' | 'exame' | 'cirurgia' | 'outro'
  disponivel: boolean
  equipamentos?: string
  especialidades?: Array<{ id: number; nome: string }>
}

interface Especialidade {
  id: number
  nome: string
  descricao?: string
  ativa: boolean
}

export default function SalasPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [salas, setSalas] = useState<Sala[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSala, setEditingSala] = useState<Sala | null>(null)
  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    descricao: '',
    tipo: 'consulta' as Sala['tipo'],
    disponivel: true,
    equipamentos: '',
    especialidades: [] as number[],
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
      fetchSalas()
      fetchEspecialidades()
    }
  }, [token])

  const fetchSalas = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/salas-consultas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setSalas(data.data || [])
      }
    } catch (error) {
      toast.error('Erro ao carregar salas')
    } finally {
      setLoading(false)
    }
  }

  const fetchEspecialidades = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/especialidades`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        const especialidadesList = Array.isArray(data) ? data : (data.data || [])
        setEspecialidades(especialidadesList.filter((e: Especialidade) => e.ativa !== false))
      }
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingSala
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/salas-consultas/${editingSala.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/salas-consultas`
      const method = editingSala ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        especialidades: formData.especialidades,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao salvar sala')
      }

      toast.success(editingSala ? 'Sala atualizada!' : 'Sala criada!')
      resetForm()
      fetchSalas()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar sala')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (sala: Sala) => {
    setEditingSala(sala)
    setFormData({
      numero: sala.numero,
      nome: sala.nome || '',
      descricao: sala.descricao || '',
      tipo: sala.tipo,
      disponivel: sala.disponivel,
      equipamentos: sala.equipamentos || '',
      especialidades: sala.especialidades?.map(e => e.id) || [],
    })
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteConfirm.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/salas-consultas/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Sala removida!')
        fetchSalas()
      } else {
        throw new Error('Erro ao remover sala')
      }
    } catch (error) {
      toast.error('Erro ao remover sala')
    } finally {
      setDeleteConfirm({ isOpen: false, id: null })
    }
  }

  const resetForm = () => {
    setFormData({ 
      numero: '', 
      nome: '', 
      descricao: '', 
      tipo: 'consulta', 
      disponivel: true, 
      equipamentos: '',
      especialidades: []
    })
    setEditingSala(null)
    setShowForm(false)
  }

  const getTipoLabel = (tipo: string) => {
    const labels = {
      consulta: 'Consulta',
      exame: 'Exame',
      cirurgia: 'Cirurgia',
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
          <h1 className="text-3xl font-bold text-gray-900">Salas de Consultas</h1>
          <p className="text-gray-600 mt-1">Gerencie as salas e ambientes do hospital</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          Nova Sala
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingSala ? 'Editar Sala' : 'Nova Sala'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="Ex: 101, 2A, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="Nome da sala (opcional)"
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
                placeholder="Descrição da sala..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Sala['tipo'] })}
                required
              >
                <option value="consulta">Consulta</option>
                <option value="exame">Exame</option>
                <option value="cirurgia">Cirurgia</option>
                <option value="outro">Outro</option>
              </Select>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="disponivel"
                  checked={formData.disponivel}
                  onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="disponivel" className="text-sm font-medium text-gray-700">
                  Sala disponível
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipamentos</label>
              <textarea
                value={formData.equipamentos}
                onChange={(e) => setFormData({ ...formData, equipamentos: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none text-sm"
                placeholder="Lista de equipamentos disponíveis..."
              />
            </div>
            
            {/* Especialidades */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-1" />
                Especialidades Associadas
              </label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                {especialidades.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhuma especialidade cadastrada</p>
                ) : (
                  <div className="space-y-2">
                    {especialidades.map((esp) => (
                      <label
                        key={esp.id}
                        className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.especialidades.includes(esp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                especialidades: [...formData.especialidades, esp.id],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                especialidades: formData.especialidades.filter((id) => id !== esp.id),
                              })
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{esp.nome}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {formData.especialidades.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {formData.especialidades.length} especialidade{formData.especialidades.length !== 1 ? 's' : ''} selecionada{formData.especialidades.length !== 1 ? 's' : ''}
                </p>
              )}
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
                    {editingSala ? 'Atualizar' : 'Salvar'}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Número</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Nenhuma sala cadastrada</p>
                  </td>
                </tr>
              ) : (
                salas.map((sala) => (
                  <tr key={sala.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{sala.numero}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{sala.nome || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{getTipoLabel(sala.tipo)}</span>
                    </td>
                    <td className="px-4 py-3">
                      {sala.especialidades && sala.especialidades.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {sala.especialidades.map((esp) => (
                            <span
                              key={esp.id}
                              className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                            >
                              {esp.nome}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Nenhuma</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {sala.disponivel ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Disponível</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Indisponível</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(sala)}
                          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: sala.id })}
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
        message="Tem certeza que deseja excluir esta sala? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}

