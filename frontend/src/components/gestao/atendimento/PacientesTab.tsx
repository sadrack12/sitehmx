'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils'
import { toast } from '@/components/ui/Toast'
import { Plus, Search, User, Mail, Phone, MapPin, Calendar, Edit, Trash2, Eye, ChevronUp, ChevronDown, FileText, MapPin as MapPinIcon } from 'lucide-react'
import PacienteModal from './PacienteModal'
import PacienteDetailsModal from './PacienteDetailsModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Select from '@/components/ui/Select'

interface Paciente {
  id: number
  nome: string
  nif: string
  email?: string
  telefone?: string
  data_nascimento?: string
  endereco?: string
  cidade?: string
  estado?: string
  created_at?: string
  consultas_count?: number
}

export default function PacientesTab() {
  const { token } = useAuth()
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    estado: '',
  })
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'nome',
    direction: 'asc',
  })
  const [showModal, setShowModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null)
  const [viewingPaciente, setViewingPaciente] = useState<Paciente | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  })

  const fetchPacientes = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filters.estado) params.append('estado', filters.estado)

      const url = `${process.env.NEXT_PUBLIC_API_URL}/pacientes${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setPacientes(data.data || data || [])
      }
    } catch (error) {
      toast.error('Erro ao carregar pacientes')
    } finally {
      setLoading(false)
    }
  }, [token, searchTerm, filters])

  useEffect(() => {
    fetchPacientes()
  }, [fetchPacientes])

  const calculateAge = (dataNascimento?: string) => {
    if (!dataNascimento) return null
    const today = new Date()
    const birth = new Date(dataNascimento)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleSort = (field: string) => {
    setSortBy({
      field,
      direction: sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  const sortedPacientes = [...pacientes].sort((a, b) => {
    let aValue: any = a[sortBy.field as keyof Paciente]
    let bValue: any = b[sortBy.field as keyof Paciente]

    if (sortBy.field === 'nome') {
      aValue = aValue?.toLowerCase() || ''
      bValue = bValue?.toLowerCase() || ''
    }

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy.field !== field) return null
    return sortBy.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
  }

  const handleDelete = async () => {
    if (!deleteConfirm.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success('Paciente excluído com sucesso!')
        fetchPacientes()
      } else {
        toast.error('Erro ao excluir paciente')
      }
    } catch (error) {
      toast.error('Erro ao excluir paciente')
    } finally {
      setDeleteConfirm({ isOpen: false, id: null })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
            <p className="text-gray-600 mt-1">Gerencie o cadastro de pacientes</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              icon={<MapPinIcon className="w-4 h-4" />}
            >
              <option value="">Todos os estados</option>
              <option value="LU">Luanda</option>
              <option value="MO">Moxico</option>
              <option value="HU">Huambo</option>
              <option value="BI">Bié</option>
              <option value="BE">Benguela</option>
              <option value="CU">Cunene</option>
              <option value="CN">Cuando Cubango</option>
              <option value="CC">Cuanza Norte</option>
              <option value="CS">Cuanza Sul</option>
              <option value="ML">Malanje</option>
              <option value="UI">Uíge</option>
              <option value="ZA">Zaire</option>
              <option value="CB">Cabinda</option>
              <option value="LN">Lunda Norte</option>
              <option value="LS">Lunda Sul</option>
              <option value="HG">Huíla</option>
              <option value="NM">Namibe</option>
            </Select>
            <button
              onClick={() => {
                setEditingPaciente(null)
                setShowModal(true)
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Novo
            </button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando...</p>
        </div>
      ) : pacientes.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-600">
            {searchTerm || filters.estado
              ? 'Nenhum paciente encontrado'
              : 'Nenhum paciente cadastrado'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('nome')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase hover:text-gray-900 transition-colors"
                    >
                      Nome
                      <SortIcon field="nome" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('nif')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase hover:text-gray-900 transition-colors"
                    >
                      NIF
                      <SortIcon field="nif" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Contato</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Idade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Localização</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Consultas</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedPacientes.map((paciente) => {
                  const age = calculateAge(paciente.data_nascimento)
                  return (
                    <tr
                      key={paciente.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-900">{paciente.nome}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{paciente.nif}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {paciente.email && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <span className="truncate max-w-[200px]">{paciente.email}</span>
                            </div>
                          )}
                          {paciente.telefone && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span>{paciente.telefone}</span>
                            </div>
                          )}
                          {!paciente.email && !paciente.telefone && (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {paciente.data_nascimento ? (
                          <div className="text-sm text-gray-700">
                            <div>{age !== null ? `${age} anos` : '-'}</div>
                            <div className="text-xs text-gray-500">
                              {formatDate(paciente.data_nascimento)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {(paciente.cidade || paciente.estado) ? (
                          <div className="flex items-center gap-1.5 text-sm text-gray-700">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>
                              {paciente.cidade}
                              {paciente.estado && `, ${paciente.estado}`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {paciente.consultas_count || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setViewingPaciente(paciente)
                              setShowDetails(true)
                            }}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingPaciente(paciente)
                              setShowModal(true)
                            }}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, id: paciente.id })}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {/* Summary */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Total: <span className="font-medium text-gray-900">{pacientes.length}</span> paciente{pacientes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </>
      )}
      </div>

      {/* Modals */}
      {showModal && (
        <PacienteModal
          paciente={editingPaciente}
          onClose={() => {
            setShowModal(false)
            setEditingPaciente(null)
          }}
          onSuccess={() => {
            setShowModal(false)
            setEditingPaciente(null)
            fetchPacientes()
          }}
        />
      )}

      {showDetails && viewingPaciente && (
        <PacienteDetailsModal
          pacienteId={viewingPaciente.id}
          onClose={() => {
            setShowDetails(false)
            setViewingPaciente(null)
          }}
          onEdit={() => {
            setShowDetails(false)
            setEditingPaciente(viewingPaciente)
            setShowModal(true)
          }}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita e o paciente pode ter consultas associadas."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}

