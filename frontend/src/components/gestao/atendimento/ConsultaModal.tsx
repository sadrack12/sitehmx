'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/Toast'
import { X, Save, Loader, User, Stethoscope, Calendar, CheckCircle, AlertCircle, GraduationCap, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Select from '@/components/ui/Select'
import { formatDate } from '@/utils'

interface ConsultaModalProps {
  consulta?: any
  onClose: () => void
  onSuccess: () => void
}

export default function ConsultaModal({ consulta, onClose, onSuccess }: ConsultaModalProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [pacientes, setPacientes] = useState<any[]>([])
  const [medicos, setMedicos] = useState<any[]>([])
  const [especialidades, setEspecialidades] = useState<any[]>([])
  const [salas, setSalas] = useState<any[]>([])
  const [disponibilidade, setDisponibilidade] = useState<any[]>([])
  const [loadingDisponibilidade, setLoadingDisponibilidade] = useState(false)
  const [medicoSelecionadoData, setMedicoSelecionadoData] = useState<any>(null)
  const [salaAtribuida, setSalaAtribuida] = useState<any>(null)
  const [searchPaciente, setSearchPaciente] = useState('')
  const [pacientesFiltrados, setPacientesFiltrados] = useState<any[]>([])
  const [showPacientesDropdown, setShowPacientesDropdown] = useState(false)
  const [paginaDatas, setPaginaDatas] = useState(1)
  const datasPorPagina = 5
  const [consultasEmAberto, setConsultasEmAberto] = useState<any[]>([])
  const [loadingConsultasAberto, setLoadingConsultasAberto] = useState(false)
  const [formData, setFormData] = useState({
    paciente_id: '',
    especialidade: '',
    medico_id: '',
    sala_id: '',
    data_consulta: '',
    hora_consulta: '',
    tipo_consulta: '',
    observacoes: '',
  })

  useEffect(() => {
    fetchPacientes()
    fetchMedicos()
    fetchEspecialidades()
    // fetchSalas() - será chamado quando especialidade for selecionada
  }, [])

  useEffect(() => {
    // Filtrar pacientes baseado na busca
    if (searchPaciente.trim() === '') {
      setPacientesFiltrados(pacientes)
    } else {
      const termo = searchPaciente.toLowerCase()
      const filtrados = pacientes.filter((p) =>
        p.nome?.toLowerCase().includes(termo) ||
        p.nif?.toLowerCase().includes(termo) ||
        p.email?.toLowerCase().includes(termo) ||
        p.telefone?.toLowerCase().includes(termo)
      )
      setPacientesFiltrados(filtrados)
    }
  }, [searchPaciente, pacientes])

  useEffect(() => {
    if (consulta) {
      // Buscar especialidade do médico se existir
      const medico = medicos.find(m => m.id === consulta.medico_id)
      const paciente = pacientes.find(p => p.id === consulta.paciente_id)
      
      setFormData({
        paciente_id: consulta.paciente_id?.toString() || '',
        especialidade: medico?.especialidade || '',
        medico_id: consulta.medico_id?.toString() || '',
        sala_id: consulta.sala_id?.toString() || '',
        data_consulta: consulta.data_consulta || '',
        hora_consulta: consulta.hora_consulta || '',
        tipo_consulta: consulta.tipo_consulta || '',
        observacoes: consulta.observacoes || '',
      })
      
      // Preencher campo de busca com nome do paciente
      if (paciente) {
        setSearchPaciente(`${paciente.nome} - NIF: ${paciente.nif}`)
      }
      
      // Definir médico selecionado para exibição
      if (medico) {
        setMedicoSelecionadoData({
          id: medico.id,
          nome: medico.nome,
          crm: medico.crm,
        })
      }
      
      // Definir sala atribuída se existir
      if (consulta.sala) {
        setSalaAtribuida(consulta.sala)
      }
      
      if (medico?.especialidade) {
        fetchDisponibilidadeEspecialidade(medico.especialidade)
        fetchSalas(medico.especialidade) // Buscar salas para esta especialidade
      } else if (consulta.medico_id) {
        fetchDisponibilidade(consulta.medico_id.toString())
      }
    }
  }, [consulta, medicos, pacientes])

  useEffect(() => {
    if (formData.especialidade && !consulta) {
      fetchDisponibilidadeEspecialidade(formData.especialidade)
      fetchSalas(formData.especialidade) // Buscar salas para esta especialidade
      setPaginaDatas(1) // Resetar página ao mudar especialidade
      setSalaAtribuida(null) // Limpar sala atribuída ao mudar especialidade
    } else if (!formData.especialidade) {
      setDisponibilidade([])
      setMedicoSelecionadoData(null)
      setSalaAtribuida(null)
      setPaginaDatas(1)
      setSalas([]) // Limpar salas quando não há especialidade
    }
  }, [formData.especialidade])
  
  // Verificar consultas em aberto quando paciente, especialidade ou data mudarem
  useEffect(() => {
    if (formData.paciente_id && formData.especialidade && formData.data_consulta && !consulta) {
      verificarConsultasEmAberto(formData.paciente_id, formData.especialidade, formData.data_consulta)
    } else {
      setConsultasEmAberto([])
    }
  }, [formData.paciente_id, formData.especialidade, formData.data_consulta])

  useEffect(() => {
    // Se médico foi selecionado manualmente e não há especialidade, buscar disponibilidade do médico
    if (formData.medico_id && !formData.especialidade && !consulta) {
      fetchDisponibilidade(formData.medico_id)
    }
  }, [formData.medico_id])

  const fetchPacientes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        const pacientesList = data.data || data || []
        setPacientes(pacientesList)
        setPacientesFiltrados(pacientesList)
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
    }
  }

  const fetchMedicos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        // Backend retorna array direto ou dentro de data
        const medicosList = Array.isArray(data) ? data : (data.data || [])
        setMedicos(medicosList)
      } else {
        console.error('Erro ao buscar médicos:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao buscar médicos:', error)
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
        setEspecialidades(especialidadesList.filter((e: any) => e.ativo !== false))
      }
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error)
    }
  }

  const fetchSalas = async (especialidade?: string) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/salas-consultas`
      if (especialidade) {
        url += `?especialidade=${encodeURIComponent(especialidade)}`
      }
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        const salasList = Array.isArray(data) ? data : (data.data || [])
        setSalas(salasList.filter((sala: any) => sala.disponivel !== false))
      } else {
        console.error('Erro ao buscar salas:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao buscar salas:', error)
    }
  }

  const fetchDisponibilidadeEspecialidade = async (especialidade: string) => {
    try {
      setLoadingDisponibilidade(true)
      const hoje = new Date()
      const todasDisponibilidades: any[] = []
      
      // Buscar disponibilidade para os próximos 3 meses
      for (let i = 0; i < 3; i++) {
        const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1)
        const mes = `${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, '0')}`
        
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/especialidade-disponibilidade?especialidade=${encodeURIComponent(especialidade)}&mes=${mes}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          
          if (response.ok) {
            const data = await response.json()
            if (data.data && Array.isArray(data.data)) {
              todasDisponibilidades.push(...data.data)
            }
          }
        } catch (error) {
          console.error(`Erro ao buscar disponibilidade para o mês ${mes}:`, error)
        }
      }
      
      // Filtrar apenas datas futuras ou hoje
      const hojeStr = hoje.toISOString().split('T')[0]
      const disponibilidadesFuturas = todasDisponibilidades.filter((disp: any) => disp.data >= hojeStr)
      
      // Ordenar por data
      disponibilidadesFuturas.sort((a: any, b: any) => {
        return a.data.localeCompare(b.data)
      })
      
      setDisponibilidade(disponibilidadesFuturas)
    } catch (error) {
      console.error('Erro ao buscar disponibilidade:', error)
      toast.error('Erro ao buscar datas disponíveis. Tente novamente.')
      setDisponibilidade([])
    } finally {
      setLoadingDisponibilidade(false)
    }
  }

  const fetchDisponibilidade = async (medicoId: string) => {
    try {
      setLoadingDisponibilidade(true)
      const hoje = new Date()
      const mes = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/medico-disponibilidade?medico_id=${medicoId}&mes=${mes}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setDisponibilidade(data.data || [])
      } else {
        console.error('Erro ao buscar disponibilidade:', response.statusText)
        setDisponibilidade([])
      }
    } catch (error) {
      console.error('Erro ao buscar disponibilidade:', error)
      setDisponibilidade([])
    } finally {
      setLoadingDisponibilidade(false)
    }
  }

  const selecionarData = async (data: string, medicosDisponiveis: any[]) => {
    // Selecionar um médico disponível aleatoriamente
    if (medicosDisponiveis && medicosDisponiveis.length > 0) {
      const medicoAleatorio = medicosDisponiveis[Math.floor(Math.random() * medicosDisponiveis.length)]
      setMedicoSelecionadoData(medicoAleatorio)
      setFormData({
        ...formData,
        data_consulta: data,
        medico_id: medicoAleatorio.id.toString(),
      })
    } else {
      // Se não há médicos disponíveis, apenas definir a data
      // O backend tentará atribuir automaticamente
      setFormData({
        ...formData,
        data_consulta: data,
        medico_id: '', // Deixar vazio para atribuição automática pelo backend
      })
      setMedicoSelecionadoData(null)
    }
    // Limpar sala atribuída ao mudar data (será atribuída automaticamente ao salvar)
    setSalaAtribuida(null)
    
    // Verificar consultas em aberto quando paciente e especialidade estão selecionados
    if (formData.paciente_id && formData.especialidade) {
      await verificarConsultasEmAberto(formData.paciente_id, formData.especialidade, data)
    }
  }

  const verificarConsultasEmAberto = async (pacienteId: string, especialidade: string, data: string) => {
    try {
      setLoadingConsultasAberto(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'}/verificar-consulta-existente`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paciente_id: parseInt(pacienteId),
            especialidade: especialidade,
            data_consulta: data,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.existe && data.consulta) {
          setConsultasEmAberto([data.consulta])
        } else {
          setConsultasEmAberto([])
        }
      }
    } catch (error) {
      console.error('Erro ao verificar consultas em aberto:', error)
    } finally {
      setLoadingConsultasAberto(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar se há consultas em aberto antes de submeter (apenas para novas consultas)
    if (consultasEmAberto.length > 0 && !consulta) {
      toast.error('O paciente já possui uma consulta agendada desta especialidade para esta data. Verifique as consultas em aberto antes de continuar.')
      return
    }
    
    setLoading(true)

    try {
      const url = consulta
        ? `${process.env.NEXT_PUBLIC_API_URL}/consultas/${consulta.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/consultas`
      const method = consulta ? 'PUT' : 'POST'

      // Preparar dados para envio
      const payload: any = {
        paciente_id: parseInt(formData.paciente_id),
        // sala_id não é enviado - será atribuído automaticamente pelo backend
        data_consulta: formData.data_consulta,
        hora_consulta: formData.hora_consulta || null,
        tipo_consulta: formData.tipo_consulta,
        observacoes: formData.observacoes || null,
      }

      // Se médico foi selecionado, incluir; caso contrário, incluir especialidade para atribuição automática
      if (formData.medico_id) {
        payload.medico_id = parseInt(formData.medico_id)
      } else if (formData.especialidade) {
        payload.especialidade = formData.especialidade
      }
      
      // Sempre incluir especialidade para atribuição automática de sala
      if (formData.especialidade && !payload.especialidade) {
        payload.especialidade = formData.especialidade
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
        const errorMessage = data.errors 
          ? Object.values(data.errors).flat().join(', ')
          : (data.message || 'Erro ao salvar consulta')
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Armazenar sala atribuída automaticamente
      if (data.sala) {
        setSalaAtribuida(data.sala)
      }

      toast.success(consulta ? 'Consulta atualizada com sucesso!' : 'Consulta criada com sucesso!')
      setTimeout(() => onSuccess(), 500)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar consulta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Simple Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {consulta ? 'Editar Consulta' : 'Nova Consulta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de Consulta - Primeiro campo */}
          <Select
            label="Tipo de Consulta"
            value={formData.tipo_consulta}
            onChange={(e) => setFormData({ ...formData, tipo_consulta: e.target.value })}
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="Consulta Geral">Consulta Geral</option>
            <option value="Consulta de Especialidade">Consulta de Especialidade</option>
            <option value="Retorno">Retorno</option>
            <option value="Avaliação">Avaliação</option>
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paciente <span className="text-red-500">*</span>
              </label>
              
              {/* Campo de Busca com Lista Dropdown */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <input
                  type="text"
                  value={searchPaciente}
                  onChange={(e) => {
                    setSearchPaciente(e.target.value)
                    setShowPacientesDropdown(true)
                    // Limpar seleção se o texto mudar e não corresponder a um paciente
                    const pacienteEncontrado = pacientesFiltrados.find(p => `${p.nome} - NIF: ${p.nif}` === e.target.value)
                    if (!pacienteEncontrado) {
                      setFormData({ ...formData, paciente_id: '' })
                    }
                  }}
                  onFocus={() => {
                    setShowPacientesDropdown(true)
                    // Se não há texto, mostrar todos os pacientes
                    if (!searchPaciente) {
                      setPacientesFiltrados(pacientes)
                    }
                  }}
                  onBlur={() => {
                    // Fechar dropdown após um pequeno delay para permitir clique
                    setTimeout(() => setShowPacientesDropdown(false), 200)
                  }}
                  placeholder="Buscar e selecionar paciente (nome, NIF, email ou telefone)..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                />
                
                {/* Lista Dropdown de Resultados */}
                {showPacientesDropdown && pacientesFiltrados.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {pacientesFiltrados.map((p) => {
                      const displayText = `${p.nome} - NIF: ${p.nif}`
                      const isSelected = formData.paciente_id === p.id.toString()
                      
                      return (
                        <div
                          key={p.id}
                          className={`px-4 py-2 cursor-pointer hover:bg-green-50 transition-colors ${
                            isSelected ? 'bg-green-100 border-l-4 border-green-500' : ''
                          }`}
                          onMouseDown={(e) => {
                            e.preventDefault() // Prevenir blur do input
                            setFormData({ ...formData, paciente_id: p.id.toString() })
                            setSearchPaciente(displayText)
                            setShowPacientesDropdown(false)
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{p.nome}</div>
                              <div className="text-xs text-gray-500">NIF: {p.nif}</div>
                            </div>
                            {isSelected && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                
                {showPacientesDropdown && searchPaciente && pacientesFiltrados.length === 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm text-gray-500 text-center">
                    Nenhum paciente encontrado
                  </div>
                )}
              </div>
              
              {/* Campo oculto para validação */}
              <input
                type="hidden"
                value={formData.paciente_id}
                required
              />
              
              {formData.paciente_id && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Paciente selecionado
                </p>
              )}
            </div>

            <Select
              label="Especialidade"
              value={formData.especialidade}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  especialidade: e.target.value, 
                  medico_id: '',
                  data_consulta: '',
                  sala_id: '' // Limpar sala ao mudar especialidade
                })
                setMedicoSelecionadoData(null)
                setSalaAtribuida(null) // Limpar sala atribuída ao mudar especialidade
              }}
              required
              icon={<GraduationCap className="w-4 h-4" />}
            >
              <option value="">Selecione uma especialidade</option>
              {especialidades.map((e) => (
                <option key={e.id} value={e.nome}>
                  {e.nome}
                </option>
              ))}
            </Select>
          </div>

          {/* Datas Disponíveis baseadas na Especialidade */}
          {formData.especialidade && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-900">Datas Disponíveis</h3>
              </div>
              
              {loadingDisponibilidade ? (
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Loader className="w-4 h-4 animate-spin" />
                  Carregando datas disponíveis...
                </div>
              ) : disponibilidade.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-amber-700">
                  <AlertCircle className="w-4 h-4" />
                  <span>Nenhuma data disponível para esta especialidade</span>
                </div>
              ) : (
                <>
                  {/* Cálculo de paginação */}
                  {(() => {
                    const totalPaginas = Math.ceil(disponibilidade.length / datasPorPagina)
                    const inicio = (paginaDatas - 1) * datasPorPagina
                    const fim = inicio + datasPorPagina
                    const datasPaginaAtual = disponibilidade.slice(inicio, fim)
                    
                    return (
                      <>
                        <div className="grid grid-cols-5 gap-1.5">
                          {datasPaginaAtual.map((disp: any) => {
                            const isSelected = formData.data_consulta === disp.data
                            const hoje = new Date().toISOString().split('T')[0]
                            const isPast = disp.data < hoje
                            
                            return (
                              <div
                                key={disp.data}
                                className={`p-2 rounded-md border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-green-100 border-green-500 shadow-sm'
                                    : isPast
                                    ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                                    : 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-sm'
                                }`}
                                onClick={() => {
                                  if (!isPast) {
                                    selecionarData(disp.data, disp.medicos_disponiveis || disp.medicos || [])
                                  }
                                }}
                              >
                                <div className="flex flex-col items-center text-center">
                                  <span className={`text-[10px] font-medium mb-0.5 ${
                                    isSelected ? 'text-green-700' : 'text-gray-600'
                                  }`}>
                                    {formatDate(disp.data, 'EEEE').substring(0, 3)}
                                  </span>
                                  <span className={`text-xs font-semibold mb-0.5 ${
                                    isSelected ? 'text-green-800' : 'text-gray-900'
                                  }`}>
                                    {formatDate(disp.data, 'dd/MM')}
                                  </span>
                                  <div className="flex flex-col items-center gap-0.5 mt-0.5">
                                    <span className={`text-[9px] px-1 py-0.5 rounded ${
                                      disp.vagas_disponiveis === 0
                                        ? 'bg-red-100 text-red-700'
                                        : disp.vagas_disponiveis < 3
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-green-100 text-green-700'
                                    }`}>
                                      {disp.vagas_disponiveis || 0}
                                    </span>
                                    {disp.medicos_disponiveis && disp.medicos_disponiveis.length > 0 && (
                                      <span className="text-[9px] text-gray-500">
                                        {disp.medicos_disponiveis.length} méd.
                                      </span>
                                    )}
                                  </div>
                                  {isSelected && (
                                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                        {/* Controles de Paginação */}
                        {totalPaginas > 1 && (
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                            <button
                              type="button"
                              onClick={() => setPaginaDatas(Math.max(1, paginaDatas - 1))}
                              disabled={paginaDatas === 1}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                paginaDatas === 1
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Anterior
                            </button>
                            
                            <span className="text-sm text-blue-700 font-medium">
                              Página {paginaDatas} de {totalPaginas}
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => setPaginaDatas(Math.min(totalPaginas, paginaDatas + 1))}
                              disabled={paginaDatas === totalPaginas}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                paginaDatas === totalPaginas
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              Próxima
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </>
              )}
            </div>
          )}

          {/* Médico Selecionado Automaticamente */}
          {medicoSelecionadoData && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <div className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">
                    Médico Atribuído
                  </div>
                  <div className="text-sm font-semibold text-green-900">
                    {medicoSelecionadoData.nome}
                    {medicoSelecionadoData.crm && (
                      <span className="text-green-700 font-normal ml-2">(Nº Ordem: {medicoSelecionadoData.crm})</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sala Atribuída Automaticamente */}
          {salaAtribuida && (
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <div className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
                    Sala Atribuída Automaticamente
                  </div>
                  <div className="text-sm font-semibold text-blue-900">
                    {salaAtribuida.numero}
                    {salaAtribuida.nome && (
                      <span className="text-blue-700 font-normal ml-2">- {salaAtribuida.nome}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Alerta de Consultas em Aberto */}
          {consultasEmAberto.length > 0 && !consulta && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-amber-900 mb-2">
                    Consulta em Aberto Encontrada
                  </div>
                  <p className="text-sm text-amber-800 mb-3">
                    O paciente já possui uma consulta agendada da especialidade <strong>{formData.especialidade}</strong> para o dia <strong>{formatDate(formData.data_consulta, 'dd/MM/yyyy')}</strong>.
                  </p>
                  {consultasEmAberto.map((c: any) => (
                    <div key={c.id} className="bg-white rounded-md p-3 border border-amber-200 mb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {c.medico?.nome || 'Médico não atribuído'}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {c.sala ? `Sala: ${c.sala.numero}` : 'Sala não atribuída'} • Status: {c.status}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          c.status === 'agendada' ? 'bg-yellow-100 text-yellow-700' :
                          c.status === 'confirmada' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-amber-700 mt-2">
                    ⚠️ Não será possível criar uma nova consulta da mesma especialidade para esta data.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informação sobre salas disponíveis (apenas informativo) */}
          {formData.especialidade && formData.data_consulta && !salaAtribuida && salas.length > 0 && consultasEmAberto.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              A sala será atribuída automaticamente ao salvar a consulta, baseada nas vagas disponíveis para {formData.especialidade}
            </div>
          )}

          {/* Data já selecionada acima, mostrar apenas se não foi selecionada via especialidade */}
          {!formData.data_consulta && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.data_consulta}
                onChange={(e) => setFormData({ ...formData, data_consulta: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none text-sm"
              placeholder="Observações..."
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {consulta ? 'Atualizar' : 'Salvar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

