'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/Toast'
import { Save, X, Pill, Loader2, Search, Plus, Trash2, Check } from 'lucide-react'

interface Medicamento {
  id: number
  nome: string
  principio_ativo?: string
  apresentacao?: string
  descricao?: string
}

interface ItemPrescricao {
  id: string
  medicamento?: Medicamento
  medicamento_nome?: string
  dosagem: string
  posologia: string
  dias: string
  instrucoes: string
}

interface PrescricaoFormProps {
  consulta: any
  onClose: () => void
  onSuccess: () => void
  inline?: boolean
}

export default function PrescricaoForm({ consulta, onClose, onSuccess, inline = false }: PrescricaoFormProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [itensPrescricao, setItensPrescricao] = useState<ItemPrescricao[]>([])
  const [instrucoesGerais, setInstrucoesGerais] = useState('')
  const [formularioAtual, setFormularioAtual] = useState<ItemPrescricao>({
    id: '',
    medicamento_nome: '',
    dosagem: '',
    posologia: '',
    dias: '',
    instrucoes: '',
  })
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Carregar prescrição existente se houver
    if (consulta?.prescricao && consulta.prescricao !== 'undefined' && consulta.prescricao !== 'null') {
      try {
        // Verificar se é uma string válida antes de fazer parse
        if (typeof consulta.prescricao !== 'string' || consulta.prescricao.trim() === '') {
          return
        }
        const parsed = JSON.parse(consulta.prescricao)
        if (Array.isArray(parsed)) {
          setItensPrescricao(parsed)
        } else if (parsed && typeof parsed === 'object') {
          // Formato antigo (texto simples)
          setItensPrescricao([{
            id: '1',
            medicamento_nome: '',
            dosagem: '',
            posologia: '',
            dias: '',
            instrucoes: typeof parsed === 'string' ? parsed : consulta.prescricao,
          }])
        }
      } catch (error) {
        console.error('Erro ao fazer parse da prescrição:', error)
        // Se não for JSON, tratar como texto simples
        setItensPrescricao([{
          id: '1',
          medicamento_nome: '',
          dosagem: '',
          posologia: '',
          dias: '',
          instrucoes: consulta.prescricao,
        }])
      }
    }
  }, [consulta])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const buscarMedicamentos = async (termo: string) => {
    if (termo.length < 2) {
      setMedicamentos([])
      setShowSearchResults(false)
      return
    }

    setSearching(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/medicamentos?search=${encodeURIComponent(termo)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.ok) {
        const data = await response.json()
        setMedicamentos(data.data || [])
        setShowSearchResults(true)
      }
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error)
    } finally {
      setSearching(false)
    }
  }

  const selecionarMedicamento = (medicamento: Medicamento) => {
    setFormularioAtual({
      id: '',
      medicamento,
      medicamento_nome: medicamento.nome,
      dosagem: '',
      posologia: '',
      dias: '',
      instrucoes: '',
    })
    setShowSearchResults(false)
    setMedicamentos([])
    // Focar no campo de dosagem
    setTimeout(() => {
      const dosagemInput = document.querySelector('input[placeholder*="500mg"]') as HTMLInputElement
      dosagemInput?.focus()
    }, 100)
  }


  const adicionarNaLista = () => {
    if (!formularioAtual.medicamento_nome?.trim()) {
      toast.error('Selecione ou digite um medicamento')
      return
    }

    const novoItem: ItemPrescricao = {
      id: Date.now().toString(),
      medicamento: formularioAtual.medicamento,
      medicamento_nome: formularioAtual.medicamento_nome,
      dosagem: formularioAtual.dosagem,
      posologia: formularioAtual.posologia,
      dias: formularioAtual.dias,
      instrucoes: formularioAtual.instrucoes,
    }

    setItensPrescricao([...itensPrescricao, novoItem])
    
    // Limpar formulário e focar no campo de medicamento
    setFormularioAtual({
      id: '',
      medicamento_nome: '',
      dosagem: '',
      posologia: '',
      dias: '',
      instrucoes: '',
    })
    
    // Focar no campo de medicamento
    setTimeout(() => {
      const medicamentoInput = document.querySelector('input[placeholder*="medicamento"]') as HTMLInputElement
      medicamentoInput?.focus()
    }, 100)
    
    toast.success('Medicamento adicionado à lista!')
  }

  const removerItem = (id: string) => {
    setItensPrescricao(itensPrescricao.filter(item => item.id !== id))
  }

  const formatarPrescricao = (): string => {
    return JSON.stringify(itensPrescricao)
  }

  const formatarPrescricaoTexto = (): string => {
    const itens = itensPrescricao
      .map((item, index) => {
        const partes = []
        if (item.medicamento_nome) partes.push(item.medicamento_nome)
        if (item.dosagem) partes.push(item.dosagem)
        if (item.posologia) partes.push(item.posologia)
        if (item.dias) partes.push(`por ${item.dias} dias`)
        if (item.instrucoes) partes.push(`- ${item.instrucoes}`)
        return `${index + 1}. ${partes.join(' - ')}`
      })
      .join('\n')
    
    if (instrucoesGerais.trim()) {
      return itens + (itens ? '\n\n' : '') + 'Instruções Gerais:\n' + instrucoesGerais.trim()
    }
    
    return itens
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (itensPrescricao.length === 0) {
      toast.error('Adicione pelo menos um medicamento ou instrução')
      return
    }

    setLoading(true)

    try {
      // Salvar como JSON para estrutura e também como texto formatado
      const prescricaoJson = formatarPrescricao()
      const prescricaoTexto = formatarPrescricaoTexto()

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas/${consulta.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prescricao: prescricaoTexto, // Salvar texto formatado para compatibilidade com PDF
        }),
      })

      if (response.ok) {
        toast.success('Prescrição salva com sucesso!')
        onSuccess()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erro ao salvar prescrição')
      }
    } catch (error) {
      console.error('Erro ao salvar prescrição:', error)
      toast.error('Erro ao salvar prescrição')
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <div className={`${inline ? 'w-full h-full' : 'bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh]'} overflow-hidden flex flex-col`}>
      {!inline && (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Pill className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Prescrição Médica</h2>
              <p className="text-sm text-gray-500">
                {consulta?.paciente?.nome} - {consulta?.tipo_consulta}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto ${inline ? 'p-4' : 'p-6'}`}>
          {/* Formulário de Entrada */}
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-blue-900">Preencha os dados do medicamento:</h3>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                {itensPrescricao.length + 1}º item
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Medicamento *
                </label>
                <div className="relative" ref={searchRef}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formularioAtual.medicamento_nome}
                    onChange={(e) => {
                      setFormularioAtual({ ...formularioAtual, medicamento_nome: e.target.value })
                      if (e.target.value.length >= 2) {
                        buscarMedicamentos(e.target.value)
                      } else {
                        setMedicamentos([])
                        setShowSearchResults(false)
                      }
                    }}
                    placeholder="Digite o nome do medicamento"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                  )}
                  
                  {/* Resultados da Busca */}
                  {showSearchResults && medicamentos.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {medicamentos.map((medicamento) => (
                        <div
                          key={medicamento.id}
                          onClick={() => selecionarMedicamento(medicamento)}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-sm text-gray-900">{medicamento.nome}</div>
                          {medicamento.principio_ativo && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {medicamento.principio_ativo}
                            </div>
                          )}
                          {medicamento.apresentacao && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {medicamento.apresentacao}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dosagem
                    </label>
                    <input
                      type="text"
                      value={formularioAtual.dosagem}
                      onChange={(e) => setFormularioAtual({ ...formularioAtual, dosagem: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const nextInput = document.querySelector('input[placeholder*="comprimido"]') as HTMLInputElement
                          nextInput?.focus()
                        }
                      }}
                      placeholder="Ex: 500mg, 10ml"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Posologia
                    </label>
                    <input
                      type="text"
                      value={formularioAtual.posologia}
                      onChange={(e) => setFormularioAtual({ ...formularioAtual, posologia: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const nextInput = document.querySelector('input[placeholder*="5, 7"]') as HTMLInputElement
                          nextInput?.focus()
                        }
                      }}
                      placeholder="Ex: 1 comprimido de 8/8h"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dias de Tratamento
                    </label>
                    <input
                      type="text"
                      value={formularioAtual.dias}
                      onChange={(e) => setFormularioAtual({ ...formularioAtual, dias: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const nextInput = document.querySelector('input[placeholder*="refeições"]') as HTMLInputElement
                          nextInput?.focus()
                        }
                      }}
                      placeholder="Ex: 5, 7, 10"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Instruções Adicionais
                    </label>
                    <input
                      type="text"
                      value={formularioAtual.instrucoes}
                      onChange={(e) => setFormularioAtual({ ...formularioAtual, instrucoes: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          adicionarNaLista()
                        }
                      }}
                      placeholder="Ex: Tomar após as refeições"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-blue-200">
                  <button
                    type="button"
                    onClick={() => {
                      setFormularioAtual({
                        id: '',
                        medicamento_nome: '',
                        dosagem: '',
                        posologia: '',
                        dias: '',
                        instrucoes: '',
                      })
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpar
                  </button>
                  <button
                    type="button"
                    onClick={adicionarNaLista}
                    disabled={!formularioAtual.medicamento_nome?.trim()}
                    className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar à Lista
                  </button>
                </div>
            </div>
          </div>

          {/* Lista de Itens da Prescrição */}
          <div className="space-y-4">
            {itensPrescricao.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhum medicamento adicionado</p>
                <p className="text-sm mt-1">Busque um medicamento acima para começar</p>
              </div>
            ) : (
              itensPrescricao.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">
                          {item.medicamento?.nome || item.medicamento_nome || 'Medicamento'}
                        </span>
                        {item.medicamento?.principio_ativo && (
                          <span className="text-xs text-gray-500">
                            ({item.medicamento.principio_ativo})
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.dosagem && <div><span className="font-medium">Dosagem:</span> {item.dosagem}</div>}
                        {item.posologia && <div><span className="font-medium">Posologia:</span> {item.posologia}</div>}
                        {item.dias && <div><span className="font-medium">Dias:</span> {item.dias} dias</div>}
                        {item.instrucoes && <div><span className="font-medium">Instruções:</span> {item.instrucoes}</div>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removerItem(item.id)}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors ml-2"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Instruções Gerais */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instruções Gerais (Opcional)
            </label>
            <textarea
              value={instrucoesGerais}
              onChange={(e) => setInstrucoesGerais(e.target.value)}
              rows={3}
              placeholder="Ex: Repouso relativo por 3 dias. Retorno em 7 dias."
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex justify-end gap-3">
          {!inline && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || itensPrescricao.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Prescrição
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  if (inline) {
    return content
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      {content}
    </div>
  )
}
