'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/Toast'
import { Save, Loader, FileText, Heart, Activity, Thermometer } from 'lucide-react'

interface AnamneseFormProps {
  consulta: any
  onClose: () => void
  onSuccess: () => void
  inline?: boolean
}

export default function AnamneseForm({ consulta, onClose, onSuccess, inline = false }: AnamneseFormProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    queixa_principal: '',
    exame_fisico: '',
    pressao_arterial: '',
    frequencia_cardiaca: '',
    temperatura: '',
    diagnostico: '',
  })

  useEffect(() => {
    if (consulta) {
      setFormData({
        queixa_principal: consulta.queixa_principal || '',
        exame_fisico: consulta.exame_fisico || '',
        pressao_arterial: consulta.pressao_arterial || '',
        frequencia_cardiaca: consulta.frequencia_cardiaca || '',
        temperatura: consulta.temperatura || '',
        diagnostico: consulta.diagnostico || '',
      })
    }
  }, [consulta])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas/${consulta.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao salvar anamnese')
      }

      toast.success('Anamnese salva com sucesso!')
      setTimeout(() => onSuccess(), 500)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar anamnese')
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <div className={`${inline ? 'w-full h-full' : 'bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh]'} overflow-y-auto`}>
      {/* Header */}
      {!inline && (
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ficha de Anamnese</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {consulta.paciente?.nome} - {consulta.tipo_consulta}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={`${inline ? 'p-4' : 'p-6'} space-y-4`}>
          {/* Queixa Principal */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-green-600" />
              <h3 className="text-base font-semibold text-gray-900">Anamnese</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Queixa Principal <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.queixa_principal}
                onChange={(e) => setFormData({ ...formData, queixa_principal: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none text-sm"
                placeholder="Descreva a queixa principal do paciente..."
              />
            </div>
          </div>

          {/* Exame Físico e Sinais Vitais */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-green-600" />
              <h3 className="text-base font-semibold text-gray-900">Exame Físico e Sinais Vitais</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exame Físico
              </label>
              <textarea
                value={formData.exame_fisico}
                onChange={(e) => setFormData({ ...formData, exame_fisico: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none text-sm"
                placeholder="Descreva o exame físico realizado..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  Pressão Arterial
                </label>
                <input
                  type="text"
                  value={formData.pressao_arterial}
                  onChange={(e) => setFormData({ ...formData, pressao_arterial: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="Ex: 120/80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  FC (bpm)
                </label>
                <input
                  type="text"
                  value={formData.frequencia_cardiaca}
                  onChange={(e) => setFormData({ ...formData, frequencia_cardiaca: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="Ex: 72"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  Temperatura (°C)
                </label>
                <input
                  type="text"
                  value={formData.temperatura}
                  onChange={(e) => setFormData({ ...formData, temperatura: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  placeholder="Ex: 36.5"
                />
              </div>
            </div>
          </div>

          {/* Diagnóstico */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-green-600" />
              <h3 className="text-base font-semibold text-gray-900">Diagnóstico</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnóstico
              </label>
              <textarea
                value={formData.diagnostico}
                onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none text-sm"
                placeholder="Descreva o diagnóstico..."
              />
            </div>
          </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
          {!inline && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
          )}
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
                Salvar Anamnese
              </>
            )}
          </button>
        </div>
      </form>
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

