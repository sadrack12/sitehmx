'use client'

import { useState, useEffect } from 'react'
import { Calendar, User, Stethoscope, CheckCircle, AlertCircle, Loader, Search, ChevronLeft, ChevronRight, Video } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import Select from '@/components/ui/Select'
import { formatDate } from '@/utils'

export default function AgendarPage() {
  const [step, setStep] = useState(1) // 1: Validar NIF, 2: Cadastrar (se necessário), 3: Agendar Consulta, 4: Confirmação
  const [loading, setLoading] = useState(false)
  const [validatingNIF, setValidatingNIF] = useState(false)
  const [pacienteEncontrado, setPacienteEncontrado] = useState<any>(null)
  const [especialidades, setEspecialidades] = useState<any[]>([])
  const [disponibilidade, setDisponibilidade] = useState<any[]>([])
  const [loadingDisponibilidade, setLoadingDisponibilidade] = useState(false)
  const [medicoAtribuido, setMedicoAtribuido] = useState<any>(null)
  const [nifInput, setNifInput] = useState('')
  const [consultaExistente, setConsultaExistente] = useState<any>(null)
  const [verificandoConsulta, setVerificandoConsulta] = useState(false)
  const [paginaDatas, setPaginaDatas] = useState(1)
  const datasPorPagina = 4
  const [formData, setFormData] = useState({
    // Dados do Paciente
    paciente_id: '',
    nome: '',
    nif: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    
    // Dados da Consulta
    especialidade: '',
    data_consulta: '',
    observacoes: '',
    consulta_online: false,
  })

  useEffect(() => {
    fetchEspecialidades()
  }, [])

  useEffect(() => {
    if (formData.especialidade && step === 3) {
      fetchDisponibilidadeEspecialidade(formData.especialidade)
      setPaginaDatas(1) // Resetar para primeira página ao mudar especialidade
    } else {
      setDisponibilidade([])
      setPaginaDatas(1)
    }
  }, [formData.especialidade, step])

  useEffect(() => {
    // Verificar se já existe consulta quando paciente, especialidade e data são selecionados
    if (formData.paciente_id && formData.especialidade && formData.data_consulta && step === 3) {
      verificarConsultaExistente()
    } else {
      setConsultaExistente(null)
    }
  }, [formData.paciente_id, formData.especialidade, formData.data_consulta, step])


  const fetchEspecialidades = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
      const response = await fetch(`${apiUrl}/especialidades`)
      if (response.ok) {
        const data = await response.json()
        const especialidadesList = data.data || data || []
        setEspecialidades(especialidadesList)
      } else {
        toast.error('Erro ao buscar especialidades')
      }
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error)
      toast.error('Erro ao buscar especialidades. Tente novamente.')
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
            `${process.env.NEXT_PUBLIC_API_URL}/especialidade-disponibilidade?especialidade=${encodeURIComponent(especialidade)}&mes=${mes}`
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
    } finally {
      setLoadingDisponibilidade(false)
    }
  }

  const formatNIF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.slice(0, 9)
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 9) {
      return numbers
    }
    return numbers.slice(0, 9)
  }

  const verificarConsultaExistente = async () => {
    if (!formData.paciente_id || !formData.especialidade || !formData.data_consulta) {
      setConsultaExistente(null)
      return
    }

    try {
      setVerificandoConsulta(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'}/verificar-consulta-existente`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paciente_id: parseInt(formData.paciente_id),
            especialidade: formData.especialidade,
            data_consulta: formData.data_consulta,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.existe) {
          setConsultaExistente(data.consulta)
        } else {
          setConsultaExistente(null)
        }
      } else {
        setConsultaExistente(null)
      }
    } catch (error) {
      console.error('Erro ao verificar consulta existente:', error)
      setConsultaExistente(null)
    } finally {
      setVerificandoConsulta(false)
    }
  }

  const validarNIF = async () => {
    if (!nifInput || nifInput.length < 9) {
      toast.error('Por favor, digite um NIF válido (9 dígitos)')
      return
    }

    setValidatingNIF(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
      const response = await fetch(`${apiUrl}/buscar-paciente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nif: nifInput }),
      })

      const data = await response.json()

      if (data.encontrado) {
        // Paciente encontrado - carregar dados e ir para agendamento
        setPacienteEncontrado(data.paciente)
        setFormData({
          ...formData,
          paciente_id: data.paciente.id.toString(),
          nome: data.paciente.nome,
          nif: data.paciente.nif,
          email: data.paciente.email || '',
          telefone: data.paciente.telefone || '',
          data_nascimento: data.paciente.data_nascimento || '',
        })
        toast.success('Paciente encontrado! Prosseguindo para agendamento...')
        setStep(3) // Ir direto para agendamento
      } else {
        // Paciente não encontrado - mostrar formulário de cadastro
        setFormData({
          ...formData,
          nif: nifInput,
        })
        setStep(2) // Ir para cadastro
      }
    } catch (error: any) {
      console.error('Erro ao validar NIF:', error)
      toast.error('Erro ao validar NIF. Tente novamente.')
    } finally {
      setValidatingNIF(false)
    }
  }

  const criarPaciente = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
      const response = await fetch(`${apiUrl}/criar-paciente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          nif: formData.nif,
          email: formData.email,
          telefone: formData.telefone,
          data_nascimento: formData.data_nascimento,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPacienteEncontrado(data.paciente)
        setFormData({
          ...formData,
          paciente_id: data.paciente.id.toString(),
        })
        toast.success('Paciente cadastrado com sucesso!')
        setStep(3) // Ir para agendamento
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.errors
          ? Object.values(errorData.errors).flat().join(', ')
          : errorData.message || 'Erro ao cadastrar paciente'
        toast.error(errorMessage)
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar paciente:', error)
      toast.error('Erro ao cadastrar paciente. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.telefone || formData.telefone.trim() === '') {
      toast.error('Por favor, preencha o campo telefone')
      return
    }
    
    if (!formData.email || formData.email.trim() === '') {
      toast.error('Por favor, preencha o campo email')
      return
    }
    
    setLoading(true)

    try {
      // Criar consulta usando endpoint público
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
      const consultaResponse = await fetch(`${apiUrl}/agendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paciente_id: formData.paciente_id ? parseInt(formData.paciente_id) : null,
          nome: formData.nome,
          nif: formData.nif,
          email: formData.email,
          telefone: formData.telefone || '',
          data_nascimento: formData.data_nascimento || null,
          especialidade: formData.especialidade,
          data_consulta: formData.data_consulta,
          observacoes: formData.observacoes || '',
          consulta_online: formData.consulta_online || false,
        }),
      })

      if (consultaResponse.ok) {
        const responseData = await consultaResponse.json()
        if (responseData.medico_atribuido) {
          setMedicoAtribuido(responseData.medico_atribuido)
        }
        toast.success('Consulta agendada com sucesso!')
        setStep(4) // Mostrar confirmação
        // Resetar formulário
        setNifInput('')
        setPacienteEncontrado(null)
        setFormData({
          paciente_id: '',
          nome: '',
          nif: '',
          email: '',
          telefone: '',
          data_nascimento: '',
          especialidade: '',
          data_consulta: '',
          observacoes: '',
          consulta_online: false,
        })
      } else {
        const errorData = await consultaResponse.json()
        console.error('Erro ao agendar consulta:', errorData)
        const errorMessage = errorData.errors
          ? Object.values(errorData.errors).flat().join(', ')
          : errorData.message || 'Erro ao agendar consulta'
        toast.error(errorMessage)
      }
    } catch (error: any) {
      console.error('Erro ao agendar consulta:', error)
      toast.error(error.message || 'Erro ao agendar consulta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Agendar Consulta</h1>
          <p className="text-gray-600">Preencha os dados abaixo para agendar sua consulta</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
            </div>
            <div className={`w-20 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step > 2 ? <CheckCircle className="w-6 h-6" /> : '2'}
            </div>
            <div className={`w-20 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step > 3 ? <CheckCircle className="w-6 h-6" /> : '3'}
            </div>
          </div>
        </div>

        {/* Step 4: Confirmação */}
        {step === 4 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Consulta Agendada com Sucesso!</h2>
              <p className="text-gray-600 mb-6">
                Sua consulta foi agendada. Você receberá uma confirmação por email.
              </p>
            </div>

            {/* Informações da Consulta */}
            {medicoAtribuido && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-green-900 mb-3">Detalhes da Consulta</h3>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    <span><strong>Médico:</strong> {medicoAtribuido.nome}</span>
                    {medicoAtribuido.crm && <span className="text-green-600">(Nº Ordem: {medicoAtribuido.crm})</span>}
                  </div>
                  {formData.especialidade && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span><strong>Especialidade:</strong> {formData.especialidade}</span>
                    </div>
                  )}
                  {formData.data_consulta && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span><strong>Data:</strong> {formatDate(formData.data_consulta, 'EEEE, dd/MM/yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setStep(1)
                  setNifInput('')
                  setMedicoAtribuido(null)
                  window.location.href = '/'
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Voltar para o Início
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step 1: Validar NIF */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Verificar NIF</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Digite seu NIF *
                    </label>
                    <input
                      type="text"
                      value={nifInput}
                      onChange={(e) => setNifInput(formatNIF(e.target.value))}
                      maxLength={9}
                      placeholder="000000000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-center text-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          validarNIF()
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Digite seu NIF para verificar se já está cadastrado
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={validarNIF}
                      disabled={validatingNIF || !nifInput || nifInput.length < 9}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {validatingNIF ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        <>
                          Verificar
                          <Search className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Cadastrar Paciente */}
            {step === 2 && (
              <form onSubmit={criarPaciente} className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-900">
                      NIF não encontrado. Por favor, complete seu cadastro para continuar.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIF *
                    </label>
                    <input
                      type="text"
                      value={formData.nif}
                      onChange={(e) => setFormData({ ...formData, nif: formatNIF(e.target.value) })}
                      required
                      maxLength={9}
                      placeholder="000000000"
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                      required
                      maxLength={9}
                      placeholder="900000000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      value={formData.data_nascimento}
                      onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setNifInput('')
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        Cadastrar e Continuar
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Agendar Consulta */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Dados da Consulta</h2>
                </div>

                {/* Informações do Paciente */}
                {pacienteEncontrado && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-green-600" />
                      <h3 className="text-sm font-semibold text-green-900">Paciente</h3>
                    </div>
                    <div className="space-y-2 text-sm text-green-800">
                      <p>
                        <strong>{pacienteEncontrado.nome}</strong> - NIF: {pacienteEncontrado.nif}
                      </p>
                      {(!formData.telefone || !formData.email) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
                          <p className="text-xs text-yellow-900 font-semibold mb-2">
                            Complete seus dados de contato:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-yellow-900 mb-1">
                                Telefone *
                              </label>
                              <input
                                type="tel"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                                required
                                maxLength={9}
                                placeholder="900000000"
                                className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-yellow-900 mb-1">
                                Email *
                              </label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Seleção de Especialidade */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidade *
                  </label>
                  <Select
                    value={formData.especialidade}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        especialidade: e.target.value, 
                        data_consulta: ''
                      })
                    }}
                    options={[
                      { value: '', label: 'Selecione uma especialidade...' },
                      ...especialidades.map((e) => ({
                        value: e.nome,
                        label: e.nome,
                      })),
                    ]}
                  />
                </div>

                {/* Seleção de Data - Baseada na Agenda dos Médicos */}
                {formData.especialidade && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Selecione a Data da Consulta *
                    </label>
                    
                    {loadingDisponibilidade ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-center gap-3 text-blue-700">
                          <Loader className="w-5 h-5 animate-spin" />
                          <span className="text-sm font-medium">Carregando datas disponíveis...</span>
                        </div>
                      </div>
                    ) : disponibilidade.length === 0 ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                        <div className="flex items-start gap-3 text-amber-800">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold mb-1">Nenhum dia disponível</p>
                            <p className="text-xs">
                              Não há datas disponíveis cadastradas para esta especialidade. Verifique se os médicos têm agenda de trabalho configurada.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <h3 className="text-base font-semibold text-gray-900">
                            Datas Disponíveis - {formData.especialidade}
                          </h3>
                          <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {disponibilidade.length} data{disponibilidade.length !== 1 ? 's' : ''} disponível{disponibilidade.length !== 1 ? 'eis' : ''}
                          </span>
                        </div>
                        
                        {(() => {
                          const inicio = (paginaDatas - 1) * datasPorPagina
                          const fim = inicio + datasPorPagina
                          const datasPaginaAtual = disponibilidade.slice(inicio, fim)
                          const totalPaginas = Math.ceil(disponibilidade.length / datasPorPagina)
                          
                          return (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {datasPaginaAtual.map((disp: any, index: number) => {
                                  const isSelected = formData.data_consulta === disp.data
                                  const hoje = new Date().toISOString().split('T')[0]
                                  const isPast = disp.data < hoje
                                  const vagasDisponiveis = disp.total_vagas - disp.consultas_marcadas
                                  
                                  return (
                              <div
                                key={`${disp.data}-${index}`}
                                className={`relative flex flex-col p-3 rounded-lg border-2 transition-all ${
                                  isSelected
                                    ? 'bg-green-50 border-green-500 shadow-md'
                                    : isPast || vagasDisponiveis <= 0
                                    ? 'bg-gray-50 border-gray-300 opacity-50 cursor-not-allowed'
                                    : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer'
                                }`}
                                onClick={() => {
                                  if (!isPast && vagasDisponiveis > 0) {
                                    setFormData({ ...formData, data_consulta: disp.data })
                                  }
                                }}
                              >
                                <div className="flex items-start justify-between mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <Calendar className={`w-4 h-4 ${isSelected ? 'text-green-600' : 'text-blue-600'}`} />
                                    <div>
                                      <div className={`text-sm font-bold ${isSelected ? 'text-green-900' : 'text-gray-900'}`}>
                                        {formatDate(disp.data, 'EEEE, dd/MM/yyyy')}
                                      </div>
                                      {disp.total_medicos > 0 && (
                                        <div className="text-xs text-gray-600 mt-0.5">
                                          {disp.total_medicos} médico{disp.total_medicos !== 1 ? 's' : ''}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full shadow-sm">
                                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-200">
                                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                    vagasDisponiveis > 5
                                      ? 'bg-green-100 text-green-800'
                                      : vagasDisponiveis > 0
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {vagasDisponiveis > 0 ? `${vagasDisponiveis} vaga${vagasDisponiveis !== 1 ? 's' : ''}` : 'Sem vagas'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {disp.consultas_marcadas} agendada{disp.consultas_marcadas !== 1 ? 's' : ''}
                                  </div>
                                </div>
                                  </div>
                                  )
                                })}
                              </div>
                              
                              {totalPaginas > 1 && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                  <button
                                    type="button"
                                    onClick={() => setPaginaDatas(p => Math.max(1, p - 1))}
                                    disabled={paginaDatas === 1}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                    Anterior
                                  </button>
                                  
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                      Página <strong>{paginaDatas}</strong> de <strong>{totalPaginas}</strong>
                                    </span>
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => setPaginaDatas(p => Math.min(totalPaginas, p + 1))}
                                    disabled={paginaDatas === totalPaginas}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    Próxima
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </>
                          )
                        })()}
                      </div>
                    )}
                    
                    {formData.data_consulta && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold">
                            Data selecionada: <strong className="text-green-900">{formatDate(formData.data_consulta, 'EEEE, dd/MM/yyyy')}</strong>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Aviso sobre consulta existente */}
                {consultaExistente && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-900 mb-1">
                          Você já possui uma consulta agendada desta especialidade
                        </p>
                        <p className="text-sm text-red-800">
                          Você já tem uma consulta de <strong>{formData.especialidade}</strong> agendada para o dia <strong>{formatDate(formData.data_consulta, 'EEEE, dd/MM/yyyy')}</strong>. 
                          Por favor, escolha outra data ou especialidade.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informação sobre atribuição automática */}
                {formData.especialidade && formData.data_consulta && !consultaExistente && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-900">
                        O médico será atribuído automaticamente entre os disponíveis da especialidade <strong>{formData.especialidade}</strong> no dia selecionado.
                      </p>
                    </div>
                  </div>
                )}

                {/* Opção de Consulta Online */}
                <div className="mt-6 mb-4">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.consulta_online}
                      onChange={(e) => setFormData({ ...formData, consulta_online: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Consulta Online</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Realize sua consulta por videoconferência sem sair de casa
                      </p>
                    </div>
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (Opcional)
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Descreva brevemente o motivo da consulta..."
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading || !formData.especialidade || !formData.data_consulta || !!consultaExistente}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Agendando...
                      </>
                    ) : (
                      <>
                        Confirmar Agendamento
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
