'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/Toast'
import { X, Save, Loader, User, CheckCircle, AlertCircle, MapPin } from 'lucide-react'
import Select from '@/components/ui/Select'

interface PacienteModalProps {
  paciente?: any
  onClose: () => void
  onSuccess: () => void
}

export default function PacienteModal({ paciente, onClose, onSuccess }: PacienteModalProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    nome: '',
    nif: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    endereco: '',
    cidade: '',
    estado: '',
  })

  useEffect(() => {
    if (paciente) {
      setFormData({
        nome: paciente.nome || '',
        nif: paciente.nif || '',
        email: paciente.email || '',
        telefone: paciente.telefone || '',
        data_nascimento: paciente.data_nascimento || '',
        endereco: paciente.endereco || '',
        cidade: paciente.cidade || '',
        estado: paciente.estado || '',
      })
    }
  }, [paciente])

  const formatNIF = (value: string) => value.replace(/\D/g, '').slice(0, 9)
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }
    switch (name) {
      case 'nome':
        if (!value.trim()) newErrors.nome = 'Nome é obrigatório'
        else if (value.trim().length < 3) newErrors.nome = 'Nome deve ter pelo menos 3 caracteres'
        else delete newErrors.nome
        break
      case 'nif':
        if (!value.trim()) newErrors.nif = 'NIF é obrigatório'
        else if (value.replace(/\D/g, '').length !== 9) newErrors.nif = 'NIF deve ter 9 dígitos'
        else delete newErrors.nif
        break
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = 'Email inválido'
        else delete newErrors.email
        break
    }
    setErrors(newErrors)
    return !newErrors[name]
  }

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true })
    validateField(name, formData[name as keyof typeof formData])
  }

  const handleChange = (name: string, value: string) => {
    if (name === 'nif') value = formatNIF(value)
    if (name === 'telefone') value = formatPhone(value)
    setFormData({ ...formData, [name]: value })
    if (touched[name]) validateField(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched: Record<string, boolean> = {}
    Object.keys(formData).forEach(key => { allTouched[key] = true })
    setTouched(allTouched)

    let isValid = true
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key as keyof typeof formData])) isValid = false
    })

    if (!isValid) {
      toast.error('Por favor, corrija os erros no formulário')
      return
    }

    setLoading(true)
    try {
      const url = paciente
        ? `${process.env.NEXT_PUBLIC_API_URL}/pacientes/${paciente.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/pacientes`
      const method = paciente ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao salvar paciente')
      }

      toast.success(paciente ? 'Paciente atualizado com sucesso!' : 'Paciente cadastrado com sucesso!')
      setTimeout(() => onSuccess(), 500)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar paciente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {paciente ? 'Editar Paciente' : 'Novo Paciente'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  onBlur={() => handleBlur('nome')}
                  required
                  placeholder="Nome completo"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all bg-white outline-none text-sm ${
                    touched.nome && errors.nome
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : touched.nome && !errors.nome
                      ? 'border-green-500'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                  }`}
                />
                {touched.nome && !errors.nome && formData.nome && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {touched.nome && errors.nome && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
              {touched.nome && errors.nome && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.nome}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIF <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nif}
                  onChange={(e) => handleChange('nif', e.target.value)}
                  onBlur={() => handleBlur('nif')}
                  required
                  placeholder="123456789"
                  maxLength={9}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all bg-white outline-none text-sm ${
                    touched.nif && errors.nif
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : touched.nif && !errors.nif && formData.nif.length === 9
                      ? 'border-green-500'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                  }`}
                />
                {touched.nif && !errors.nif && formData.nif.length === 9 && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {touched.nif && errors.nif && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
              {touched.nif && errors.nif && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.nif}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="email@exemplo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all bg-white outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all bg-white outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Nascimento</label>
              <input
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => handleChange('data_nascimento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all bg-white outline-none text-sm"
              />
            </div>
            <Select
              label="Estado"
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
            >
              <option value="">Selecione o estado</option>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                value={formData.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                placeholder="Nome da cidade"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all bg-white outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <input
              type="text"
              value={formData.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
              placeholder="Rua, número, bairro"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all bg-white outline-none text-sm"
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
                  {paciente ? 'Atualizar' : 'Salvar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

