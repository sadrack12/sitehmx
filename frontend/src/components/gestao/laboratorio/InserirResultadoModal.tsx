'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { X, Loader2, FileText, Calendar, ClipboardList } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { formatDate } from '@/utils'

interface SolicitacaoExameLaboratorio {
  id: number
  paciente?: {
    nome: string
    nif: string
  }
  exame?: {
    nome: string
    codigo?: string
  }
  medico_solicitante?: {
    nome: string
  }
  data_solicitacao: string
  status: string
  resultado?: string
  data_resultado?: string
  arquivo_resultado?: string
}

interface InserirResultadoModalProps {
  solicitacao: SolicitacaoExameLaboratorio
  onClose: () => void
  onSuccess: () => void
}

export default function InserirResultadoModal({
  solicitacao,
  onClose,
  onSuccess,
}: InserirResultadoModalProps) {
  const { token } = useAuth()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    resultado: solicitacao.resultado || '',
    data_resultado: solicitacao.data_resultado || new Date().toISOString().split('T')[0],
    data_realizacao: new Date().toISOString().split('T')[0],
    status: 'concluido' as 'concluido',
    arquivo_resultado: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.resultado.trim() && !formData.arquivo_resultado) {
      toast.error('Preencha o resultado ou anexe um arquivo')
      return
    }

    setSaving(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
      const formDataToSend = new FormData()

      // Apenas enviar campos preenchidos
      if (formData.resultado.trim()) {
        formDataToSend.append('resultado', formData.resultado.trim())
      }
      if (formData.data_resultado) {
        formDataToSend.append('data_resultado', formData.data_resultado)
      }
      if (formData.data_realizacao) {
        formDataToSend.append('data_realizacao', formData.data_realizacao)
      }
      formDataToSend.append('status', formData.status)

      if (formData.arquivo_resultado) {
        formDataToSend.append('arquivo_resultado', formData.arquivo_resultado)
      }

      const response = await fetch(`${apiUrl}/admin/laboratorio/${solicitacao.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success('Resultado inserido com sucesso!')
        onSuccess()
        onClose()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erro ao inserir resultado')
      }
    } catch (error) {
      console.error('Erro ao inserir resultado:', error)
      toast.error('Erro ao inserir resultado')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Inserir Resultado</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Data do Resultado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data do Resultado *
            </label>
            <input
              type="date"
              value={formData.data_resultado}
              onChange={(e) => {
                const date = e.target.value
                setFormData({ 
                  ...formData, 
                  data_resultado: date,
                  data_realizacao: date // Usar a mesma data
                })
              }}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Resultado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resultado *
            </label>
            <textarea
              value={formData.resultado}
              onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
              rows={6}
              placeholder="Digite o resultado do exame..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>

          {/* Arquivo de Resultado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anexar Arquivo (opcional)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) =>
                setFormData({ ...formData, arquivo_resultado: e.target.files?.[0] || null })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
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
              disabled={saving || (!formData.resultado.trim() && !formData.arquivo_resultado)}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

