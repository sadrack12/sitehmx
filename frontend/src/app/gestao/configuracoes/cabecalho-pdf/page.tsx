'use client'

import { useState, useEffect } from 'react'
import { FileText, Upload, X, Save, Building2, Phone, Mail, MapPin, Image as ImageIcon, Eye } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/Toast'

interface PdfConfiguracao {
  id: number
  nome_instituicao: string
  a_republica?: string
  o_ministerio?: string
  o_governo?: string
  endereco?: string
  telefone?: string
  email?: string
  logo_path?: string
  logo_url?: string
  texto_cabecalho?: string
  rodape_texto?: string
  mostrar_logo: boolean
  mostrar_endereco: boolean
  mostrar_contato: boolean
}

export default function CabecalhoPdfPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)
  const [formData, setFormData] = useState<PdfConfiguracao>({
    id: 0,
    nome_instituicao: 'Hospital Geral do Moxico',
    a_republica: '',
    o_ministerio: '',
    o_governo: '',
    endereco: '',
    telefone: '',
    email: '',
    logo_path: '',
    texto_cabecalho: '',
    rodape_texto: '',
    mostrar_logo: true,
    mostrar_endereco: true,
    mostrar_contato: true,
  })

  useEffect(() => {
    if (token) {
      fetchConfiguracao()
    }
  }, [token])

  const fetchConfiguracao = async () => {
    try {
      setLoadingData(true)
      
      if (!token) {
        console.error('Token não disponível para buscar configuração')
        setLoadingData(false)
        return
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
      const url = `${apiUrl}/admin/pdf-configuracao`
      
      console.log('Buscando configuração do servidor...', { url, token: token ? 'presente' : 'ausente' })
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Resposta recebida:', { status: response.status, ok: response.ok, url })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro ao buscar configuração:', { status: response.status, error: errorText })
        
        if (response.status === 404) {
          console.error('Rota não encontrada. Verifique se a URL está correta:', url)
        } else if (response.status === 401) {
          console.error('Não autorizado. Verifique o token.')
        }
      }

      if (response.ok) {
        const data = await response.json()
        console.log('Dados carregados do servidor:', data)
        
        // Preencher todos os campos com os dados do servidor
        const newFormData = {
          id: data.id || 0,
          nome_instituicao: data.nome_instituicao || 'Hospital Geral do Moxico',
          a_republica: data.a_republica || '',
          o_ministerio: data.o_ministerio || '',
          o_governo: data.o_governo || '',
          endereco: data.endereco || '',
          telefone: data.telefone || '',
          email: data.email || '',
          logo_path: data.logo_path || '',
          logo_url: data.logo_url || '',
          texto_cabecalho: data.texto_cabecalho || '',
          rodape_texto: data.rodape_texto || '',
          mostrar_logo: data.mostrar_logo !== undefined ? data.mostrar_logo : true,
          mostrar_endereco: data.mostrar_endereco !== undefined ? data.mostrar_endereco : true,
          mostrar_contato: data.mostrar_contato !== undefined ? data.mostrar_contato : true,
        }
        
        console.log('FormData atualizado:', newFormData)
        setFormData(newFormData)
        
        // Carregar logo se existir
        if (data.logo_url) {
          console.log('Carregando logo:', data.logo_url)
          // Se a URL não começar com http, adicionar a URL do backend
          const logoUrl = data.logo_url.startsWith('http') 
            ? data.logo_url 
            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8001'}${data.logo_url}`
          setPreviewLogo(logoUrl)
        } else {
          console.log('Nenhuma logo encontrada')
          setPreviewLogo(null)
        }
      } else {
        const errorText = await response.text()
        console.error('Erro ao buscar configuração:', { status: response.status, error: errorText })
        toast.error('Erro ao carregar configuração')
      }
    } catch (error) {
      console.error('Erro ao buscar configuração:', error)
      toast.error('Erro ao carregar configuração do servidor')
    } finally {
      setLoadingData(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('Arquivo selecionado:', {
        name: file.name,
        size: file.size,
        type: file.type,
      })
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem')
        e.target.value = '' // Limpar input
        return
      }
      
      // Validar tamanho (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('O arquivo é muito grande. Tamanho máximo: 2MB')
        e.target.value = '' // Limpar input
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string)
        console.log('Preview da logo atualizado')
      }
      reader.onerror = () => {
        console.error('Erro ao ler arquivo')
        toast.error('Erro ao ler o arquivo')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
      const url = `${apiUrl}/admin/pdf-configuracao/logo`
      
      console.log('Removendo logo...', { url })
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro ao remover logo:', { status: response.status, error: errorText, url })
      }

      if (response.ok) {
        setPreviewLogo(null)
        setFormData({ ...formData, logo_path: '', logo_url: '' })
        toast.success('Logo removida com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao remover logo:', error)
      toast.error('Erro ao remover logo')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const logoInput = document.getElementById('logo_file') as HTMLInputElement
      const hasLogoFile = logoInput?.files?.[0]

      // Se houver logo, fazer upload primeiro
      if (hasLogoFile && logoInput.files && logoInput.files[0]) {
        try {
          const logoFormData = new FormData()
          logoFormData.append('logo_file', logoInput.files[0])
          
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
          const logoUrl = `${apiUrl}/admin/pdf-configuracao/logo`
          
          console.log('Fazendo upload do logo...', { logoUrl })
          const logoResponse = await fetch(logoUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: logoFormData,
          })
          
          if (!logoResponse.ok) {
            const errorText = await logoResponse.text()
            console.error('Erro ao fazer upload do logo:', { status: logoResponse.status, error: errorText, logoUrl })
          }

          if (logoResponse.ok) {
            const logoData = await logoResponse.json()
            console.log('Logo enviada com sucesso:', logoData)
            // Atualizar preview da logo
            if (logoData.logo_url) {
              // Se a URL não começar com http, adicionar a URL do backend
              const logoUrl = logoData.logo_url.startsWith('http') 
                ? logoData.logo_url 
                : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8001'}${logoData.logo_url}`
              setPreviewLogo(logoUrl)
            }
            // Limpar input de arquivo
            logoInput.value = ''
          } else {
            const errorData = await logoResponse.json()
            toast.error(errorData.message || 'Erro ao enviar logo')
            setLoading(false)
            return
          }
        } catch (error) {
          console.error('Erro ao fazer upload do logo:', error)
          toast.error('Erro ao enviar logo')
          setLoading(false)
          return
        }
      }

      // Sempre usar JSON para salvar os dados
      const nomeInstituicao = formData.nome_instituicao || 'Hospital Geral do Moxico'
      const jsonData = {
        nome_instituicao: nomeInstituicao,
        a_republica: formData.a_republica || null,
        o_ministerio: formData.o_ministerio || null,
        o_governo: formData.o_governo || null,
        endereco: formData.endereco || null,
        telefone: formData.telefone || null,
        email: formData.email || null,
        texto_cabecalho: formData.texto_cabecalho || null,
        rodape_texto: formData.rodape_texto || null,
        mostrar_logo: formData.mostrar_logo,
        mostrar_endereco: formData.mostrar_endereco,
        mostrar_contato: formData.mostrar_contato,
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'
      const url = `${apiUrl}/admin/pdf-configuracao`
      
      console.log('Salvando configuração:', { jsonData, url })

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jsonData),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro ao salvar configuração:', { status: response.status, error: errorText, url })
      }

      if (response.ok) {
        const result = await response.json()
        const data = result.configuracao || result
        
        console.log('Dados salvos recebidos:', data)
        
        // Atualizar TODOS os campos com os dados retornados após salvar
        setFormData({
          id: data.id || 0,
          nome_instituicao: data.nome_instituicao || 'Hospital Geral do Moxico',
          a_republica: data.a_republica || '',
          o_ministerio: data.o_ministerio || '',
          o_governo: data.o_governo || '',
          endereco: data.endereco || '',
          telefone: data.telefone || '',
          email: data.email || '',
          logo_path: data.logo_path || '',
          logo_url: data.logo_url || '',
          texto_cabecalho: data.texto_cabecalho || '',
          rodape_texto: data.rodape_texto || '',
          mostrar_logo: data.mostrar_logo !== undefined ? data.mostrar_logo : true,
          mostrar_endereco: data.mostrar_endereco !== undefined ? data.mostrar_endereco : true,
          mostrar_contato: data.mostrar_contato !== undefined ? data.mostrar_contato : true,
        })
        
        // Atualizar preview da logo
        if (data.logo_url) {
          // Se a URL não começar com http, adicionar a URL do backend
          const logoUrl = data.logo_url.startsWith('http') 
            ? data.logo_url 
            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8001'}${data.logo_url}`
          setPreviewLogo(logoUrl)
        } else {
          setPreviewLogo(null)
        }
        
        toast.success('Configuração salva com sucesso!')
      } else {
        let errorMessage = 'Erro ao salvar configuração'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          
          // Mostrar erros de validação específicos
          if (errorData.errors) {
            const errorMessages = Object.values(errorData.errors).flat()
            errorMessage = errorMessages.join(', ') || errorMessage
          }
        } catch (e) {
          console.error('Erro ao processar resposta de erro:', e)
        }
        toast.error(errorMessage)
        console.error('Erro ao salvar:', { status: response.status, errorMessage })
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar configuração')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-600 mb-2">Carregando configuração...</div>
          <div className="text-sm text-gray-400">Aguarde enquanto buscamos os dados do servidor</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Configuração do Cabeçalho PDF
        </h1>
        <p className="text-gray-600 mt-1">Configure as informações que aparecerão no cabeçalho dos documentos PDF</p>
        {formData.id > 0 && (
          <p className="text-sm text-green-600 mt-1">✓ Dados carregados (ID: {formData.id})</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Formulário */}
          <div className="space-y-6">
            {/* Informações Governamentais */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Governamentais</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">A República</label>
                  <input
                    type="text"
                    value={formData.a_republica || ''}
                    onChange={(e) => setFormData({ ...formData, a_republica: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="Ex: República de Angola"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">O Ministério</label>
                  <input
                    type="text"
                    value={formData.o_ministerio || ''}
                    onChange={(e) => setFormData({ ...formData, o_ministerio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="Ex: Ministério da Saúde"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">O Governo</label>
                  <input
                    type="text"
                    value={formData.o_governo || ''}
                    onChange={(e) => setFormData({ ...formData, o_governo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="Ex: Governo Provincial do Moxico"
                  />
                </div>
              </div>
            </div>

            {/* Informações da Instituição */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações da Instituição</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Instituição <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nome_instituicao}
                    onChange={(e) => setFormData({ ...formData, nome_instituicao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Endereço
                  </label>
                  <textarea
                    value={formData.endereco || ''}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formData.telefone || ''}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Logo */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Logo</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload de Logo</label>
                  <input
                    id="logo_file"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>
                {previewLogo && (
                  <div className="relative inline-block">
                    <img 
                      src={previewLogo} 
                      alt="Logo preview" 
                      className="max-h-32 rounded-lg" 
                      onError={(e) => {
                        console.error('Erro ao carregar logo:', previewLogo)
                        const target = e.target as HTMLImageElement
                        if (!target.src.startsWith('data:')) {
                          const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8001'
                          const logoPath = previewLogo.startsWith('/') ? previewLogo : `/${previewLogo}`
                          target.src = `${apiBase}${logoPath}`
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="mostrar_logo"
                    checked={formData.mostrar_logo}
                    onChange={(e) => setFormData({ ...formData, mostrar_logo: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="mostrar_logo" className="text-sm text-gray-700">Mostrar logo nos documentos</label>
                </div>
              </div>
            </div>

            {/* Textos Adicionais */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Textos Adicionais</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Cabeçalho</label>
                  <textarea
                    value={formData.texto_cabecalho || ''}
                    onChange={(e) => setFormData({ ...formData, texto_cabecalho: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Rodapé</label>
                  <textarea
                    value={formData.rodape_texto || ''}
                    onChange={(e) => setFormData({ ...formData, rodape_texto: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Opções de Exibição */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Opções de Exibição</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="mostrar_endereco"
                    checked={formData.mostrar_endereco}
                    onChange={(e) => setFormData({ ...formData, mostrar_endereco: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="mostrar_endereco" className="text-sm text-gray-700">Mostrar endereço</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="mostrar_contato"
                    checked={formData.mostrar_contato}
                    onChange={(e) => setFormData({ ...formData, mostrar_contato: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="mostrar_contato" className="text-sm text-gray-700">Mostrar informações de contato</label>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Preview */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview do Cabeçalho
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                {formData.mostrar_logo && previewLogo && (
                  <div className="mb-4">
                    <img 
                      src={previewLogo} 
                      alt="Logo" 
                      className="mx-auto max-h-24" 
                      onError={(e) => {
                        console.error('Erro ao carregar logo no preview:', previewLogo)
                        const target = e.target as HTMLImageElement
                        if (!target.src.startsWith('data:')) {
                          const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8001'
                          const logoPath = previewLogo.startsWith('/') ? previewLogo : `/${previewLogo}`
                          target.src = `${apiBase}${logoPath}`
                        }
                      }}
                    />
                  </div>
                )}
                {formData.a_republica && (
                  <p className="text-sm font-semibold text-gray-700 mb-1">{formData.a_republica}</p>
                )}
                {formData.o_ministerio && (
                  <p className="text-sm font-semibold text-gray-700 mb-1">{formData.o_ministerio}</p>
                )}
                {formData.o_governo && (
                  <p className="text-sm font-semibold text-gray-700 mb-2">{formData.o_governo}</p>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{formData.nome_instituicao}</h3>
                {formData.mostrar_endereco && formData.endereco && (
                  <p className="text-sm text-gray-600 mb-1 flex items-center justify-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {formData.endereco}
                  </p>
                )}
                {formData.mostrar_contato && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {formData.telefone && (
                      <p className="flex items-center justify-center gap-1">
                        <Phone className="w-4 h-4" />
                        {formData.telefone}
                      </p>
                    )}
                    {formData.email && (
                      <p className="flex items-center justify-center gap-1">
                        <Mail className="w-4 h-4" />
                        {formData.email}
                      </p>
                    )}
                  </div>
                )}
                {formData.texto_cabecalho && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">{formData.texto_cabecalho}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar Configuração'}
          </button>
        </div>
      </form>
    </div>
  )
}

