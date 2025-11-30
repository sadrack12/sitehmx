'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

// Lista de imagens da galeria
const GALERIA_IMAGENS = [
  {
    id: 1,
    src: '/images/481337255_122150224724343844_4470774594386885664_n.jpg',
    title: 'Evento Hospitalar',
    category: 'Eventos',
  },
  {
    id: 2,
    src: '/images/553280666_122180093228343844_698813316423067076_n.jpg',
    title: 'Cerimónia de Inauguração',
    category: 'Eventos',
  },
  {
    id: 3,
    src: '/images/555962522_122180552600343844_8952583627148606697_n.jpg',
    title: 'Equipa Médica',
    category: 'Equipa',
  },
  {
    id: 4,
    src: '/images/556115116_122180553740343844_285671433319500312_n.jpg',
    title: 'Atendimento ao Paciente',
    category: 'Serviços',
  },
  {
    id: 5,
    src: '/images/560106632_122182100900343844_2963057808023442406_n.jpg',
    title: 'Instalações Hospitalares',
    category: 'Instalações',
  },
  {
    id: 6,
    src: '/images/561520774_122182101518343844_1723576736119237803_n.jpg',
    title: 'Cuidados de Saúde',
    category: 'Serviços',
  },
  {
    id: 7,
    src: '/images/573508682_122184405284343844_8911212578133461837_n.jpg',
    title: 'Missão e Valores',
    category: 'Sobre',
  },
  {
    id: 8,
    src: '/images/577400924_122184958010343844_1454223572060094970_n.jpg',
    title: 'Workshop Médico',
    category: 'Eventos',
  },
  {
    id: 9,
    src: '/images/577535754_122184719738343844_5257761701614180172_n.jpg',
    title: 'Tecnologia Médica',
    category: 'Instalações',
  },
  {
    id: 10,
    src: '/images/578003869_122184957962343844_5690754979362345545_n.jpg',
    title: 'Doação de Material',
    category: 'Eventos',
  },
  {
    id: 11,
    src: '/images/578006101_122184957872343844_7574823498328585283_n.jpg',
    title: 'Seminário de Saúde',
    category: 'Eventos',
  },
  {
    id: 12,
    src: '/images/578488802_122184915152343844_2298168834801400220_n.jpg',
    title: 'Inauguração BLH',
    category: 'Eventos',
  },
  {
    id: 13,
    src: '/images/579450528_122184957920343844_677704214275117552_n.jpg',
    title: 'Auditoria de Mortes Maternas',
    category: 'Eventos',
  },
]

const CATEGORIAS = ['Todas', 'Eventos', 'Equipa', 'Serviços', 'Instalações', 'Sobre']

export default function GaleriaPage() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas')
  const [imagemSelecionada, setImagemSelecionada] = useState<number | null>(null)
  const [galeriaPage, setGaleriaPage] = useState(1)
  
  const itemsPerPage = 12

  const imagensFiltradas = categoriaSelecionada === 'Todas'
    ? GALERIA_IMAGENS
    : GALERIA_IMAGENS.filter(img => img.category === categoriaSelecionada)
  
  const galeriaTotalPages = Math.ceil(imagensFiltradas.length / itemsPerPage)
  
  const imagensPaginated = imagensFiltradas.slice(
    (galeriaPage - 1) * itemsPerPage,
    galeriaPage * itemsPerPage
  )
  
  // Reset page when category changes
  const handleCategoryChange = (categoria: string) => {
    setCategoriaSelecionada(categoria)
    setGaleriaPage(1)
  }

  const imagemAtual = imagemSelecionada !== null
    ? GALERIA_IMAGENS.find(img => img.id === imagemSelecionada)
    : null

  const proximaImagem = () => {
    if (imagemSelecionada === null) return
    const indexAtual = GALERIA_IMAGENS.findIndex(img => img.id === imagemSelecionada)
    const proximoIndex = (indexAtual + 1) % GALERIA_IMAGENS.length
    setImagemSelecionada(GALERIA_IMAGENS[proximoIndex].id)
  }

  const imagemAnterior = () => {
    if (imagemSelecionada === null) return
    const indexAtual = GALERIA_IMAGENS.findIndex(img => img.id === imagemSelecionada)
    const anteriorIndex = indexAtual === 0 ? GALERIA_IMAGENS.length - 1 : indexAtual - 1
    setImagemSelecionada(GALERIA_IMAGENS[anteriorIndex].id)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-green-600 text-sm uppercase font-semibold mb-4">
              GALERIA DE FOTOS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Conheça o nosso <span className="text-green-600">Hospital</span> através das nossas imagens
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore os momentos, eventos e instalações do Hospital Geral do Moxico
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORIAS.map((categoria) => (
              <button
                key={categoria}
                onClick={() => handleCategoryChange(categoria)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  categoriaSelecionada === categoria
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagensPaginated.map((imagem) => (
              <div
                key={imagem.id}
                onClick={() => setImagemSelecionada(imagem.id)}
                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-white shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <Image
                  src={imagem.src}
                  alt={imagem.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-sm mb-1">{imagem.title}</h3>
                    <p className="text-xs opacity-90">{imagem.category}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  {imagem.category}
                </div>
              </div>
            ))}
          </div>

          {imagensFiltradas.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Nenhuma imagem encontrada nesta categoria.</p>
            </div>
          )}

          {/* Paginação */}
          {galeriaTotalPages > 1 && imagensFiltradas.length > 0 && (
            <>
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setGaleriaPage(prev => Math.max(1, prev - 1))}
                  disabled={galeriaPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-green-50 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: galeriaTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setGaleriaPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        galeriaPage === page
                          ? 'bg-green-600 text-white shadow-lg scale-110'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-500'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setGaleriaPage(prev => Math.min(galeriaTotalPages, prev + 1))}
                  disabled={galeriaPage === galeriaTotalPages}
                  className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-green-50 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Página {galeriaPage} de {galeriaTotalPages} • {imagensFiltradas.length} imagens no total
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Modal Lightbox */}
      {imagemSelecionada !== null && imagemAtual && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setImagemSelecionada(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              setImagemSelecionada(null)
            }}
            className="absolute top-4 right-4 text-white hover:text-green-400 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              imagemAnterior()
            }}
            className="absolute left-4 text-white hover:text-green-400 transition-colors z-10 bg-black/50 rounded-full p-2 hover:bg-black/70"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              proximaImagem()
            }}
            className="absolute right-4 text-white hover:text-green-400 transition-colors z-10 bg-black/50 rounded-full p-2 hover:bg-black/70"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div
            className="relative max-w-6xl w-full h-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imagemAtual.src}
              alt={imagemAtual.title}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{imagemAtual.title}</h3>
              <p className="text-green-400 font-semibold">{imagemAtual.category}</p>
            </div>
          </div>

          {/* Contador */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {GALERIA_IMAGENS.findIndex(img => img.id === imagemSelecionada) + 1} / {GALERIA_IMAGENS.length}
          </div>
        </div>
      )}
    </div>
  )
}

