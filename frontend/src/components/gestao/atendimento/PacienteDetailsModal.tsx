'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils'
import { X, Edit, User, Mail, Phone, MapPin, Calendar, FileText, Clock } from 'lucide-react'

interface PacienteDetailsModalProps {
  pacienteId: number
  onClose: () => void
  onEdit: () => void
}

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
  consultas?: Consulta[]
}

interface Consulta {
  id: number
  data_consulta: string
  hora_consulta: string
  tipo_consulta: string
  status: string
  observacoes?: string
  medico?: {
    id: number
    nome: string
    especialidade?: string
  }
}

export default function PacienteDetailsModal({ pacienteId, onClose, onEdit }: PacienteDetailsModalProps) {
  const { token } = useAuth()
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes/${pacienteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setPaciente(data)
        }
      } catch (error) {
        console.error('Erro ao buscar paciente:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPaciente()
  }, [pacienteId, token])

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      agendada: 'bg-yellow-100 text-yellow-800',
      confirmada: 'bg-blue-100 text-blue-800',
      realizada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
          <p className="mt-3 text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!paciente) return null

  const age = calculateAge(paciente.data_nascimento)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{paciente.nome}</h2>
            <p className="text-sm text-gray-500">NIF: {paciente.nif}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            {paciente.data_nascimento && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Data de Nascimento</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(paciente.data_nascimento)}
                    {age !== null && ` (${age} anos)`}
                  </p>
                </div>
              </div>
            )}
            {paciente.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{paciente.email}</p>
                </div>
              </div>
            )}
            {paciente.telefone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="text-sm font-medium text-gray-900">{paciente.telefone}</p>
                </div>
              </div>
            )}
            {(paciente.cidade || paciente.estado) && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Localização</p>
                  <p className="text-sm font-medium text-gray-900">
                    {paciente.cidade}
                    {paciente.estado && `, ${paciente.estado}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {paciente.consultas && paciente.consultas.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Histórico de Consultas ({paciente.consultas.length})
              </h3>
              <div className="space-y-2">
                {paciente.consultas.map((consulta) => (
                  <div
                    key={consulta.id}
                    className="border border-gray-200 rounded-lg p-3 hover:border-green-500 hover:bg-green-50/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{consulta.tipo_consulta}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          <span>{formatDate(consulta.data_consulta, 'EEEE, dd/MM/yyyy')}</span>
                          <span>{consulta.hora_consulta}</span>
                        </div>
                        {consulta.medico && (
                          <p className="text-xs text-gray-500 mt-1">
                            {consulta.medico.nome}
                            {consulta.medico.especialidade && ` - ${consulta.medico.especialidade}`}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(consulta.status)}`}>
                        {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1)}
                      </span>
                    </div>
                    {consulta.observacoes && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Observações:</p>
                        <p className="text-xs text-gray-700">{consulta.observacoes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

