'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Loader2, UserPlus, Shield, User, Mail, Lock } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Select from '@/components/ui/Select'
import { User as UserType } from '@/types'

export default function UsuariosPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<UserType[]>([])
  const [medicos, setMedicos] = useState<{ id: number; nome: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'atendente' as 'admin' | 'gestor' | 'atendente' | 'medico',
    medico_id: '',
  })
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
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
      fetchUsuarios()
      fetchMedicos()
    }
  }, [token])

  const fetchMedicos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/medicos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setMedicos((data.data || data || []).map((m: any) => ({ id: m.id, nome: m.nome })))
      }
    } catch (error) {
      console.error('Erro ao buscar médicos:', error)
    }
  }

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter) params.append('role', roleFilter)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.ok) {
        const data = await response.json()
        setUsuarios(data.data || data || [])
      } else {
        toast.error('Erro ao carregar usuários')
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }, [token, searchTerm, roleFilter])

  useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }

      if (formData.password) {
        payload.password = formData.password
      }

      if (formData.role === 'medico' && formData.medico_id) {
        payload.medico_id = parseInt(formData.medico_id)
      }

      const url = editingUser
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${editingUser.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/users`

      const method = editingUser ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!')
        setShowForm(false)
        resetForm()
        fetchUsuarios()
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.errors
          ? Object.values(errorData.errors).flat().join(', ')
          : errorData.message || 'Erro ao salvar usuário'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      toast.error('Erro ao salvar usuário')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (user: UserType) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      medico_id: user.medico_id?.toString() || '',
    })
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteConfirm.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Usuário deletado com sucesso!')
        fetchUsuarios()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erro ao deletar usuário')
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      toast.error('Erro ao deletar usuário')
    } finally {
      setDeleteConfirm({ isOpen: false, id: null })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'atendente',
      medico_id: '',
    })
    setEditingUser(null)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'gestor':
        return 'bg-blue-100 text-blue-800'
      case 'medico':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'gestor':
        return 'Gestor'
      case 'medico':
        return 'Médico'
      default:
        return 'Atendente'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                Gestão de Usuários
              </h1>
              <p className="mt-2 text-gray-600">Gerencie usuários do sistema</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Novo Usuário
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome ou email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Perfil</label>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'admin', label: 'Administrador' },
                  { value: 'gestor', label: 'Gestor' },
                  { value: 'atendente', label: 'Atendente' },
                  { value: 'medico', label: 'Médico' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médico Vinculado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{usuario.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{usuario.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(usuario.role)}`}>
                          {getRoleLabel(usuario.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.medico ? usuario.medico.nome : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usuario.created_at
                          ? new Date(usuario.created_at).toLocaleDateString('pt-AO')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(usuario)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {usuario.id !== user?.id && (
                            <button
                              onClick={() => setDeleteConfirm({ isOpen: true, id: usuario.id })}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-green-600" />
                    {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha {!editingUser && '*'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={editingUser ? 'Deixe em branco para manter a senha atual' : 'Mínimo 6 caracteres'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perfil *
                  </label>
                  <Select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'admin' | 'gestor' | 'atendente' | 'medico',
                        medico_id: e.target.value !== 'medico' ? '' : formData.medico_id,
                      })
                    }
                    options={[
                      { value: 'admin', label: 'Administrador' },
                      { value: 'gestor', label: 'Gestor' },
                      { value: 'atendente', label: 'Atendente' },
                      { value: 'medico', label: 'Médico' },
                    ]}
                  />
                </div>

                {formData.role === 'medico' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Médico Vinculado *
                    </label>
                    <Select
                      value={formData.medico_id}
                      onChange={(e) => setFormData({ ...formData, medico_id: e.target.value })}
                      options={[
                        { value: '', label: 'Selecione um médico...' },
                        ...medicos.map((m) => ({ value: m.id.toString(), label: m.nome })),
                      ]}
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        {editingUser ? 'Atualizar' : 'Criar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dialog de Confirmação */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
          onConfirm={handleDelete}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita."
          type="danger"
        />
      </div>
    </div>
  )
}

