'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { X, Loader2, User, Search, ArrowRight } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { formatDate } from '@/utils'

interface Consulta {
  id: number
  paciente_id: number
  medico_id: number
  data_consulta: string
  hora_consulta: string
  tipo_consulta: string
  status: string
  paciente?: {
    id: number
    nome: string
    nif: string
  }
  medico?: {
    id: number
    nome: string
  }
}

interface Paciente {
  id: number
  nome: string
  nif: string
}

interface TransferirVagaModalProps {
  consulta: Consulta
  onClose: () => void
  onSuccess: () => void
}

export default function TransferirVagaModal({
  consulta,
  onClose,
  onSuccess,
}: TransferirVagaModalProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [pacientesFiltrados, setPacientesFiltrados] = useState<Paciente[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null)

  useEffect(() => {
    fetchPacientes()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setPacientesFiltrados(pacientes)
    } else {
      const termo = searchTerm.toLowerCase()
      const filtrados = pacientes.filter(
        (paciente) =>
          paciente.nome.toLowerCase().includes(termo) ||
          paciente.nif.toLowerCase().includes(termo)
      )
      setPacientesFiltrados(filtrados)
    }
  }, [searchTerm, pacientes])

  const fetchPacientes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        const pacientesList = data.data || data || []
        // Filtrar o paciente atual da consulta
        const pacientesDisponiveis = pacientesList.filter(
          (p: Paciente) => p.id !== consulta.paciente_id
        )
        setPacientes(pacientesDisponiveis)
        setPacientesFiltrados(pacientesDisponiveis)
      } else {
        toast.error('Erro ao carregar pacientes')
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
      toast.error('Erro ao carregar pacientes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pacienteSelecionado) {
      toast.error('Selecione um paciente')
      return
    }

    setSaving(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
      const response = await fetch(`${apiUrl}/consultas/${consulta.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paciente_id: pacienteSelecionado.id,
        }),
      })

      if (response.ok) {
        toast.success('Vaga transferida com sucesso!')
        onSuccess()
        onClose()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erro ao transferir vaga')
      }
    } catch (error) {
      console.error('Erro ao transferir vaga:', error)
      toast.error('Erro ao transferir vaga')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Transferir Vaga</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações da Consulta Atual */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="text-sm space-y-1">
            <div>
              <span className="text-gray-600 font-medium">Paciente Atual:</span>
              <span className="ml-2 text-gray-900">{consulta.paciente?.nome}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Data/Hora:</span>
              <span className="ml-2 text-gray-900">
                {formatDate(consulta.data_consulta, 'dd/MM/yyyy')} às {consulta.hora_consulta}
              </span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Médico:</span>
              <span className="ml-2 text-gray-900">{consulta.medico?.nome}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Busca de Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Novo Paciente *
            </label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nome ou NIF..."
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {pacientesFiltrados.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente disponível'}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {pacientesFiltrados.map((paciente) => {
                        const isSelected = pacienteSelecionado?.id === paciente.id
                        return (
                          <div
                            key={paciente.id}
                            className={`p-2 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-green-50 border-l-4 border-green-600'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setPacienteSelecionado(paciente)}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => setPacienteSelecionado(paciente)}
                                className="w-3.5 h-3.5 text-green-600 border-gray-300 focus:ring-green-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">
                                  {paciente.nome}
                                </div>
                                <div className="text-xs text-gray-500">NIF: {paciente.nif}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !pacienteSelecionado}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Transferindo...
                </>
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5" />
                  Transferir
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

