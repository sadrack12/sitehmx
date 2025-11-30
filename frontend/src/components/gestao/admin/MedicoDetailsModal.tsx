'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { X, Edit, Stethoscope, Mail, Phone, Calendar, Clock, User, FileText, Loader2 } from 'lucide-react'
import { formatDate } from '@/utils'

interface MedicoDetailsModalProps {
  medicoId: number
  onClose: () => void
  onEdit: () => void
}

interface Medico {
  id: number
  nome: string
  crm: string
  especialidade: string
  email?: string
  telefone?: string
  created_at?: string
}

interface Consulta {
  id: number
  paciente_id: number
  data_consulta: string
  hora_consulta: string
  tipo_consulta: string
  status: string
  paciente?: {
    id: number
    nome: string
    nif: string
  }
}

export default function MedicoDetailsModal({ medicoId, onClose, onEdit }: MedicoDetailsModalProps) {
  const { token } = useAuth()
  const [medico, setMedico] = useState<Medico | null>(null)
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMedicoDetails = async () => {
      try {
        setLoading(true)
        
        // Buscar dados do médico
        const medicoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/medicos/${medicoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        if (medicoResponse.ok) {
          const medicoData = await medicoResponse.json()
          setMedico(medicoData.data || medicoData)
        }

        // Buscar consultas do médico
        const consultasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas?medico_id=${medicoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        if (consultasResponse.ok) {
          const consultasData = await consultasResponse.json()
          setConsultas(consultasData.data || consultasData || [])
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do médico:', error)
      } finally {
        setLoading(false)
      }
    }

    if (medicoId && token) {
      fetchMedicoDetails()
    }
  }, [medicoId, token])

  const getStatusBadge = (status: string) => {
    const styles = {
      agendada: 'bg-yellow-100 text-yellow-700',
      confirmada: 'bg-blue-100 text-blue-700',
      realizada: 'bg-green-100 text-green-700',
      cancelada: 'bg-red-100 text-red-700',
    }

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        </div>
      </div>
    )
  }

  if (!medico) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Perfil do Médico</h2>
            <p className="text-sm text-gray-500 mt-0.5">{medico.especialidade}</p>
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

        <div className="p-6 space-y-4">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Stethoscope className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Nome</p>
                <p className="text-sm font-medium text-gray-900">{medico.nome}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Nº Ordem</p>
                <p className="text-sm font-medium text-gray-900">{medico.crm}</p>
              </div>
            </div>
            {medico.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{medico.email}</p>
                </div>
              </div>
            )}
            {medico.telefone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="text-sm text-gray-900">{medico.telefone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Total Consultas</div>
              <div className="text-lg font-semibold text-gray-900">{consultas.length}</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-xs text-yellow-700 mb-1">Agendadas</div>
              <div className="text-lg font-semibold text-yellow-900">
                {consultas.filter(c => c.status === 'agendada').length}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-700 mb-1">Confirmadas</div>
              <div className="text-lg font-semibold text-blue-900">
                {consultas.filter(c => c.status === 'confirmada').length}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-xs text-green-700 mb-1">Realizadas</div>
              <div className="text-lg font-semibold text-green-900">
                {consultas.filter(c => c.status === 'realizada').length}
              </div>
            </div>
          </div>

          {/* Histórico de Consultas */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <p className="text-sm font-semibold text-gray-700">Histórico de Consultas</p>
            </div>
            {consultas.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhuma consulta registrada</p>
            ) : (
              <div className="space-y-2">
                {consultas.slice(0, 10).map((consulta) => (
                  <div
                    key={consulta.id}
                    className="bg-white rounded-lg p-3 border border-gray-200 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{consulta.tipo_consulta}</span>
                          {getStatusBadge(consulta.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(consulta.data_consulta, 'EEEE, dd/MM/yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {consulta.hora_consulta}
                          </span>
                        </div>
                        {consulta.paciente && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{consulta.paciente.nome}</span>
                            <span className="text-gray-400">•</span>
                            <span>NIF: {consulta.paciente.nif}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {consultas.length > 10 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    Mostrando 10 de {consultas.length} consultas
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

