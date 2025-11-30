'use client'

import { useState, useEffect } from 'react'
import { X, Edit, Calendar, Clock, User, Stethoscope, FileText, CheckCircle, XCircle, History, ChevronDown, ChevronUp, Download, Pill, FileCheck, ClipboardList, Receipt } from 'lucide-react'
import { formatDate } from '@/utils'
import { useAuth } from '@/hooks/useAuth'
import PrescricaoForm from './PrescricaoForm'

interface ConsultaDetailsModalProps {
  consulta: any
  onClose: () => void
  onEdit: () => void
  onStatusChange: (status: string) => void
}

export default function ConsultaDetailsModal({ consulta, onClose, onEdit, onStatusChange }: ConsultaDetailsModalProps) {
  const { token } = useAuth()
  const [historicoConsultas, setHistoricoConsultas] = useState<any[]>([])
  const [loadingHistorico, setLoadingHistorico] = useState(false)
  const [showHistorico, setShowHistorico] = useState(false)
  const [showAtestadoModal, setShowAtestadoModal] = useState(false)
  const [showPrescricao, setShowPrescricao] = useState(false)
  const [atestadoData, setAtestadoData] = useState({
    tipo_atestado: 'saude',
    dias_afastamento: '',
    cid: '',
    observacoes: '',
  })

  useEffect(() => {
    if (consulta?.paciente_id) {
      fetchHistoricoConsultas()
    }
  }, [consulta])

  const fetchHistoricoConsultas = async () => {
    try {
      setLoadingHistorico(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/consultas?paciente_id=${consulta.paciente_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.ok) {
        const data = await response.json()
        const todasConsultas = data.data || data || []
        // Se consulta atual está realizada, mostrar todas as consultas realizadas do paciente
        // Caso contrário, mostrar apenas consultas anteriores realizadas
        const consultasFiltradas = consulta.status === 'realizada'
          ? todasConsultas
              .filter((c: any) => c.status === 'realizada')
              .sort((a: any, b: any) => 
                new Date(b.data_consulta).getTime() - new Date(a.data_consulta).getTime()
              )
          : todasConsultas
              .filter((c: any) => 
                c.id !== consulta.id && 
                c.status === 'realizada' &&
                new Date(c.data_consulta) < new Date(consulta.data_consulta)
              )
              .sort((a: any, b: any) => 
                new Date(b.data_consulta).getTime() - new Date(a.data_consulta).getTime()
              )
        setHistoricoConsultas(consultasFiltradas)
      }
    } catch (error) {
      console.error('Erro ao buscar histórico de consultas:', error)
    } finally {
      setLoadingHistorico(false)
    }
  }

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Detalhes da Consulta</h2>
            <p className="text-xs text-gray-500 mt-0.5">{consulta.tipo_consulta}</p>
          </div>
          <div className="flex items-center gap-2">
            {consulta.status !== 'realizada' && (
              <button
                onClick={onEdit}
                className="px-2 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                Editar
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Status e Ações */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                {getStatusBadge(consulta.status)}
              </div>
            </div>
            {consulta.status !== 'realizada' && (
              <div className="flex gap-1.5">
                {consulta.status === 'agendada' && (
                  <button
                    onClick={() => onStatusChange('confirmada')}
                    className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Confirmar
                  </button>
                )}
                {consulta.status === 'confirmada' && (
                  <button
                    onClick={() => onStatusChange('realizada')}
                    className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Realizada
                  </button>
                )}
                {(consulta.status === 'agendada' || consulta.status === 'confirmada') && (
                  <button
                    onClick={() => onStatusChange('cancelada')}
                    className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancelar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Data e Hora */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-50 rounded-lg p-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Data da Consulta</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(consulta.data_consulta, 'dd/MM/yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                <div className="bg-purple-50 rounded-lg p-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Hora</p>
                  <p className="text-sm font-semibold text-gray-900">{consulta.hora_consulta}</p>
                </div>
              </div>
            </div>

            {/* Tipo de Consulta */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-2">
                <div className="bg-green-50 rounded-lg p-1.5">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Tipo de Consulta</p>
                  <p className="text-sm font-semibold text-gray-900">{consulta.tipo_consulta}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Paciente e Médico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Paciente */}
            {consulta.paciente && (
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-50 rounded-lg p-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900">Paciente</p>
                </div>
                <div className="space-y-1.5 text-sm pl-11">
                  <p className="font-medium text-gray-900 text-sm">{consulta.paciente.nome}</p>
                  <div className="space-y-0.5">
                    <p className="text-gray-600 text-xs">NIF: <span className="font-medium">{consulta.paciente.nif}</span></p>
                    {consulta.paciente.email && (
                      <p className="text-gray-600 text-xs">Email: <span className="font-medium">{consulta.paciente.email}</span></p>
                    )}
                    {consulta.paciente.telefone && (
                      <p className="text-gray-600 text-xs">Telefone: <span className="font-medium">{consulta.paciente.telefone}</span></p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Médico */}
            {consulta.medico && (
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-50 rounded-lg p-1.5">
                    <Stethoscope className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900">Médico</p>
                </div>
                <div className="space-y-1.5 text-sm pl-11">
                  <p className="font-medium text-gray-900 text-sm">{consulta.medico.nome}</p>
                  <div className="space-y-0.5">
                    {consulta.medico.especialidade && (
                      <p className="text-gray-600 text-xs">Especialidade: <span className="font-medium">{consulta.medico.especialidade}</span></p>
                    )}
                    {consulta.medico.crm && (
                      <p className="text-gray-600 text-xs">Nº Ordem: <span className="font-medium">{consulta.medico.crm}</span></p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          {consulta.observacoes && (
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gray-50 rounded-lg p-1.5">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-xs font-semibold text-gray-900">Observações</p>
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-wrap pl-11">{consulta.observacoes}</p>
            </div>
          )}

          {/* Documentos */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Documentos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <button
                onClick={async () => {
                  try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                    const url = `${apiUrl}/consultas/${consulta.id}/recibo`
                    const response = await fetch(url, {
                      method: 'GET',
                      headers: { 'Authorization': `Bearer ${token}` },
                    })
                    if (response.ok) {
                      const blob = await response.blob()
                      const blobUrl = window.URL.createObjectURL(blob)
                      window.open(blobUrl, '_blank')
                      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                    }
                  } catch (error) {
                    console.error('Erro ao gerar recibo:', error)
                  }
                }}
                className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs font-medium flex items-center gap-1.5 justify-center"
                title="Recibo de Marcação"
              >
                <FileText className="w-3.5 h-3.5" />
                Recibo
              </button>
              
              <button
                onClick={() => setShowPrescricao(true)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-1.5 justify-center"
                title="Editar Prescrição Médica"
              >
                <Pill className="w-3.5 h-3.5" />
                Prescrição
              </button>
              
              {consulta.prescricao && (
                <button
                  onClick={async () => {
                    try {
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                      const url = `${apiUrl}/consultas/${consulta.id}/prescricao`
                      const response = await fetch(url, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` },
                      })
                      if (response.ok) {
                        const blob = await response.blob()
                        const blobUrl = window.URL.createObjectURL(blob)
                        window.open(blobUrl, '_blank')
                        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                      }
                    } catch (error) {
                      console.error('Erro ao gerar prescrição:', error)
                    }
                  }}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center gap-1.5 justify-center"
                  title="Visualizar Prescrição PDF"
                >
                  <FileText className="w-3.5 h-3.5" />
                  PDF
                </button>
              )}
              
              <button
                onClick={() => setShowAtestadoModal(true)}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex items-center gap-1.5 justify-center"
                title="Atestado Médico"
              >
                <FileCheck className="w-3.5 h-3.5" />
                Atestado
              </button>
              
              <button
                onClick={async () => {
                  try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                    const url = `${apiUrl}/consultas/${consulta.id}/relatorio`
                    const response = await fetch(url, {
                      method: 'GET',
                      headers: { 'Authorization': `Bearer ${token}` },
                    })
                    if (response.ok) {
                      const blob = await response.blob()
                      const blobUrl = window.URL.createObjectURL(blob)
                      window.open(blobUrl, '_blank')
                      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                    }
                  } catch (error) {
                    console.error('Erro ao gerar relatório:', error)
                  }
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium flex items-center gap-1.5 justify-center"
                title="Relatório de Consulta"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Relatório
              </button>
              
              <button
                onClick={async () => {
                  try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                    const url = `${apiUrl}/consultas/${consulta.id}/comprovante`
                    const response = await fetch(url, {
                      method: 'GET',
                      headers: { 'Authorization': `Bearer ${token}` },
                    })
                    if (response.ok) {
                      const blob = await response.blob()
                      const blobUrl = window.URL.createObjectURL(blob)
                      window.open(blobUrl, '_blank')
                      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                    }
                  } catch (error) {
                    console.error('Erro ao gerar comprovante:', error)
                  }
                }}
                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs font-medium flex items-center gap-1.5 justify-center"
                title="Comprovante de Atendimento"
              >
                <Receipt className="w-3.5 h-3.5" />
                Comprovante
              </button>
            </div>
          </div>
          
          {/* Modal de Atestado */}
          {showAtestadoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerar Atestado Médico</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Atestado</label>
                    <select
                      value={atestadoData.tipo_atestado}
                      onChange={(e) => setAtestadoData({ ...atestadoData, tipo_atestado: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                    >
                      <option value="saude">Atestado de Saúde</option>
                      <option value="doenca">Atestado de Doença</option>
                      <option value="comparecimento">Atestado de Comparecimento</option>
                    </select>
                  </div>
                  
                  {atestadoData.tipo_atestado === 'doenca' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dias de Afastamento</label>
                      <input
                        type="number"
                        value={atestadoData.dias_afastamento}
                        onChange={(e) => setAtestadoData({ ...atestadoData, dias_afastamento: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                        min="0"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CID (Opcional)</label>
                    <input
                      type="text"
                      value={atestadoData.cid}
                      onChange={(e) => setAtestadoData({ ...atestadoData, cid: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                      placeholder="Ex: A00.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações (Opcional)</label>
                    <textarea
                      value={atestadoData.observacoes}
                      onChange={(e) => setAtestadoData({ ...atestadoData, observacoes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                      rows={3}
                      placeholder="Observações adicionais..."
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={async () => {
                      try {
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
                        const url = `${apiUrl}/consultas/${consulta.id}/atestado`
                        
                        // Preparar dados para envio
                        const dataToSend: any = {
                          tipo_atestado: atestadoData.tipo_atestado,
                        }
                        
                        // Adicionar dias_afastamento apenas se não estiver vazio
                        if (atestadoData.dias_afastamento && atestadoData.dias_afastamento.trim() !== '') {
                          dataToSend.dias_afastamento = atestadoData.dias_afastamento
                        }
                        
                        // Adicionar CID apenas se não estiver vazio
                        if (atestadoData.cid && atestadoData.cid.trim() !== '') {
                          dataToSend.cid = atestadoData.cid.trim()
                        }
                        
                        // Adicionar observações apenas se não estiver vazio
                        if (atestadoData.observacoes && atestadoData.observacoes.trim() !== '') {
                          dataToSend.observacoes = atestadoData.observacoes.trim()
                        }
                        
                        const response = await fetch(url, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(dataToSend),
                        })
                        
                        if (response.ok) {
                          const blob = await response.blob()
                          const blobUrl = window.URL.createObjectURL(blob)
                          window.open(blobUrl, '_blank')
                          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
                          setShowAtestadoModal(false)
                          setAtestadoData({
                            tipo_atestado: 'saude',
                            dias_afastamento: '',
                            cid: '',
                            observacoes: '',
                          })
                        } else {
                          const errorData = await response.json().catch(() => ({ message: 'Erro ao gerar atestado' }))
                          console.error('Erro ao gerar atestado:', errorData)
                        }
                      } catch (error) {
                        console.error('Erro ao gerar atestado:', error)
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Gerar Atestado
                  </button>
                  <button
                    onClick={() => {
                      setShowAtestadoModal(false)
                      setAtestadoData({
                        tipo_atestado: 'saude',
                        dias_afastamento: '',
                        cid: '',
                        observacoes: '',
                      })
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Histórico de Consultas */}
          {consulta.paciente_id && (
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <button
                onClick={() => setShowHistorico(!showHistorico)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-blue-50 rounded-lg p-1.5">
                    <History className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900">
                      {consulta.status === 'realizada' ? 'Histórico Completo' : 'Histórico Anterior'}
                    </p>
                    {historicoConsultas.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">{historicoConsultas.length} consulta{historicoConsultas.length !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
                {showHistorico ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showHistorico && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {loadingHistorico ? (
                    <div className="text-center py-6">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                      <p className="text-xs text-gray-600 mt-2">Carregando...</p>
                    </div>
                  ) : historicoConsultas.length === 0 ? (
                    <div className="text-center py-4">
                      <History className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs text-gray-500">Nenhuma consulta anterior encontrada.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {historicoConsultas.map((consultaAnterior: any) => (
                        <div
                          key={consultaAnterior.id}
                          className="bg-gray-50 rounded-lg border border-gray-200 p-3 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-100 rounded-lg p-1">
                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-900">
                                  {formatDate(consultaAnterior.data_consulta, 'dd/MM/yyyy')}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  {consultaAnterior.hora_consulta}
                                </p>
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                              Realizada
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mb-2">
                            {consultaAnterior.tipo_consulta && (
                              <div className="text-xs">
                                <span className="text-gray-500">Tipo: </span>
                                <span className="font-medium text-gray-900">{consultaAnterior.tipo_consulta}</span>
                              </div>
                            )}
                            {consultaAnterior.medico && (
                              <div className="text-xs">
                                <span className="text-gray-500">Médico: </span>
                                <span className="font-medium text-gray-900">{consultaAnterior.medico.nome}</span>
                                {consultaAnterior.medico.especialidade && (
                                  <span className="text-gray-500"> - {consultaAnterior.medico.especialidade}</span>
                                )}
                              </div>
                            )}
                            {consultaAnterior.sala && (
                              <div className="text-xs">
                                <span className="text-gray-500">Sala: </span>
                                <span className="font-medium text-gray-900">{consultaAnterior.sala.numero}</span>
                                {consultaAnterior.sala.nome && (
                                  <span className="text-gray-500"> - {consultaAnterior.sala.nome}</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Anamnese resumida */}
                          {(consultaAnterior.queixa_principal || consultaAnterior.diagnostico || consultaAnterior.prescricao) && (
                            <div className="mt-2 pt-2 border-t border-gray-200 space-y-1.5">
                              {consultaAnterior.queixa_principal && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-700 mb-0.5">Queixa Principal:</p>
                                  <p className="text-xs text-gray-600 line-clamp-2 pl-1.5">
                                    {consultaAnterior.queixa_principal}
                                  </p>
                                </div>
                              )}
                              {consultaAnterior.diagnostico && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-700 mb-0.5">Diagnóstico:</p>
                                  <p className="text-xs text-gray-600 line-clamp-2 pl-1.5">
                                    {consultaAnterior.diagnostico}
                                  </p>
                                </div>
                              )}
                              {consultaAnterior.prescricao && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-700 mb-0.5">Prescrição:</p>
                                  <p className="text-xs text-gray-600 line-clamp-3 pl-1.5">
                                    {consultaAnterior.prescricao}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {consultaAnterior.observacoes && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-700 mb-0.5">Observações:</p>
                              <p className="text-xs text-gray-600 line-clamp-2 pl-1.5">
                                {consultaAnterior.observacoes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

      {/* Modal de Prescrição */}
      {showPrescricao && (
        <PrescricaoForm
          consulta={consulta}
          onClose={() => {
            setShowPrescricao(false)
          }}
          onSuccess={() => {
            setShowPrescricao(false)
            // Recarregar dados da consulta
            window.location.reload()
          }}
        />
      )}

        </div>
      </div>
    </div>
  )
}

