'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Loader2, Stethoscope, Eye } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Select from '@/components/ui/Select'
import MedicoDetailsModal from '@/components/gestao/admin/MedicoDetailsModal'

interface Medico {
  id: number
  nome: string
  crm: string
  especialidade: string
  email?: string
  telefone?: string
  user?: {
    id: number
    email: string
  }
}

export default function MedicosPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [editingMedico, setEditingMedico] = useState<Medico | null>(null)
  const [viewingMedico, setViewingMedico] = useState<Medico | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
    especialidade: '',
    email: '',
    telefone: '',
    criar_login: false,
    login_email: '',
    login_password: '',
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

  const fetchMedicos = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/medicos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setMedicos(data.data || data || [])
      } else {
        toast.error('Erro ao carregar médicos')
      }
    } catch (error) {
      console.error('Erro ao buscar médicos:', error)
      toast.error('Erro ao carregar médicos')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchMedicos()
    }
  }, [user, fetchMedicos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingMedico
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/medicos/${editingMedico.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/medicos`
      const method = editingMedico ? 'PUT' : 'POST'

      const dataToSend = {
        nome: formData.nome,
        crm: formData.crm,
        especialidade: formData.especialidade,
        email: formData.email,
        telefone: formData.telefone,
        criar_login: formData.criar_login,
        login_email: formData.login_email,
        login_password: formData.login_password,
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
        throw new Error(data.message || 'Erro ao salvar médico')
      }

      toast.success(editingMedico ? 'Médico atualizado com sucesso!' : 'Médico criado com sucesso!')
      await fetchMedicos()
      resetForm()
    } catch (error: any) {
      console.error('Erro ao salvar médico:', error)
      toast.error(error.message || 'Erro ao salvar médico')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/medicos/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Médico excluído com sucesso!')
        fetchMedicos()
      } else {
        toast.error('Erro ao excluir médico')
      }
    } catch (error) {
      toast.error('Erro ao excluir médico')
    } finally {
      setDeleteConfirm({ isOpen: false, id: null })
    }
  }

  const handleEdit = (medico: Medico) => {
    setEditingMedico(medico)
    setFormData({
      nome: medico.nome,
      crm: medico.crm,
      especialidade: medico.especialidade,
      email: medico.email || '',
      telefone: medico.telefone || '',
      criar_login: false,
      login_email: medico.user?.email || '',
      login_password: '',
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      crm: '',
      especialidade: '',
      email: '',
      telefone: '',
      criar_login: false,
      login_email: '',
      login_password: '',
    })
    setEditingMedico(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Médicos</h1>
          <p className="text-gray-600 mt-1">Gerencie os médicos do hospital</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Médico
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingMedico ? 'Editar Médico' : 'Novo Médico'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nº Ordem <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.crm}
                  onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="Número da Ordem"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.especialidade}
                  onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="Ex: Cardiologia, Pediatria, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="+244 923 456 789"
                />
              </div>
            </div>

            {/* Seção de Login */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="criar_login"
                  checked={formData.criar_login}
                  onChange={(e) => setFormData({ ...formData, criar_login: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="criar_login" className="text-sm font-medium text-gray-700">
                  Criar perfil de acesso (login)
                </label>
              </div>

              {formData.criar_login && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email para Login <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.login_email}
                      onChange={(e) => setFormData({ ...formData, login_email: e.target.value })}
                      required={formData.criar_login}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha {!editingMedico && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="password"
                      value={formData.login_password}
                      onChange={(e) => setFormData({ ...formData, login_password: e.target.value })}
                      required={formData.criar_login && !editingMedico}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                      placeholder={editingMedico ? "Deixe em branco para manter" : "Senha"}
                    />
                    {editingMedico && (
                      <p className="text-xs text-gray-500 mt-1">Deixe em branco para manter a senha atual</p>
                    )}
                  </div>
                </div>
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
                    {editingMedico ? 'Atualizar' : 'Salvar'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Médicos */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nº Ordem</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Especialidade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Contato</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Acesso</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    <Stethoscope className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Nenhum médico cadastrado</p>
                  </td>
                </tr>
              ) : (
                medicos.map((medico) => (
                  <tr key={medico.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{medico.nome}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{medico.crm}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{medico.especialidade}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">
                        {medico.email && <div>{medico.email}</div>}
                        {medico.telefone && <div>{medico.telefone}</div>}
                        {!medico.email && !medico.telefone && <span className="text-gray-400">-</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {medico.user ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-700 font-medium">Ativo</span>
                          <span className="text-xs text-gray-500">({medico.user.email})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Sem acesso</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setViewingMedico(medico)
                            setShowDetails(true)
                          }}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(medico)}
                          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: medico.id })}
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
        {medicos.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Total: <span className="font-medium text-gray-900">{medicos.length}</span> médico{medicos.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && viewingMedico && (
        <MedicoDetailsModal
          medicoId={viewingMedico.id}
          onClose={() => {
            setShowDetails(false)
            setViewingMedico(null)
          }}
          onEdit={() => {
            setShowDetails(false)
            setEditingMedico(viewingMedico)
            setShowForm(true)
          }}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este médico? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}

