'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api'
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

interface HeroSlide {
  id: number
  title?: string
  description?: string
  image: string
  button_text?: string
  button_link?: string
  published: boolean
  order: number
}

export default function HeroSlidesPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    button_text: '',
    button_link: '',
    published: true,
    order: 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/gestao/login')
    } else if (user && user.role !== 'admin') {
      router.push('/gestao/dashboard')
    }
  }, [user, authLoading, router])

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get('/admin/hero-slides', token || undefined)
      setSlides(data)
    } catch (error) {
      console.error('Erro ao buscar slides:', error)
      alert('Erro ao carregar slides')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchSlides()
    }
  }, [user, fetchSlides])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!imageFile && !editingSlide) {
      alert('Por favor, selecione uma imagem')
      return
    }

    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('button_text', formData.button_text)
      formDataToSend.append('button_link', formData.button_link)
      formDataToSend.append('published', formData.published ? '1' : '0')
      formDataToSend.append('order', formData.order.toString())

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      if (editingSlide) {
        await api.putFormData(`/admin/hero-slides/${editingSlide.id}`, formDataToSend, token || undefined)
      } else {
        await api.postFormData('/admin/hero-slides', formDataToSend, token || undefined)
      }

      await fetchSlides()
      resetForm()
      alert(editingSlide ? 'Slide atualizado com sucesso!' : 'Slide criado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar slide:', error)
      alert(error.message || 'Erro ao salvar slide')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este slide?')) return

    try {
      await api.delete(`/admin/hero-slides/${id}`, token || undefined)
      await fetchSlides()
      alert('Slide deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar slide:', error)
      alert('Erro ao deletar slide')
    }
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title || '',
      description: slide.description || '',
      button_text: slide.button_text || '',
      button_link: slide.button_link || '',
      published: slide.published,
      order: slide.order,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      button_text: '',
      button_link: '',
      published: true,
      order: 0,
    })
    setImageFile(null)
    setEditingSlide(null)
    setShowForm(false)
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-gray-600 mt-1">Gerencie os slides da seção hero</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Novo Slide
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingSlide ? 'Editar Slide' : 'Novo Slide'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Texto do Botão</label>
                <input
                  type="text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  placeholder="Agendar Consulta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Link do Botão</label>
                <input
                  type="text"
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  placeholder="/contato"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Imagem {!editingSlide && '*'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  required={!editingSlide}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm font-semibold">Publicado</label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : editingSlide ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Imagem</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ordem</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {slides.map((slide) => (
                <tr key={slide.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {slide.image && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${slide.image}`}
                        alt={slide.title || 'Slide'}
                        width={100}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{slide.title || 'Sem título'}</div>
                    {slide.description && (
                      <div className="text-sm text-gray-500 line-clamp-1">{slide.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {slide.published ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <Eye className="w-3 h-3" />
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        <EyeOff className="w-3 h-3" />
                        Rascunho
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{slide.order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

