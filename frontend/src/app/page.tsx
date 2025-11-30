'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, Users, Calendar, Heart, Star, Eye, Users as UsersIcon, Globe, Info, Stethoscope, Baby, Microscope, Calculator, Syringe, UserCheck, Scan, Activity, Droplet, ChevronLeft, ChevronRight, CheckCircle, GraduationCap, BookOpen, Beaker, Building, Hand, Leaf, UsersRound, MapPin, Phone, Mail, Globe2, Video } from 'lucide-react'
import { useState, useEffect } from 'react'
import Section, { SectionHeader } from '@/components/ui/Section'
import NoticiaCard from '@/components/ui/NoticiaCard'
import EventoCard from '@/components/ui/EventoCard'
import Organigrama from '@/components/Organigrama'
import { SERVICOS_ESPECIALIZADOS, SERVICOS_APOIO, CONTACT_INFO } from '@/constants'

interface Noticia {
  id: number
  title: string
  description: string
  date: string
  image?: string
  published: boolean
}

interface Evento {
  id: number
  title: string
  description?: string
  date: string
  image?: string
  featured: boolean
  published: boolean
}

interface MembroCorpoDiretivo {
  id: number
  name: string
  cargo: string
  bio?: string
  image?: string
  nivel: number
  parent_id?: number | null
  children?: MembroCorpoDiretivo[]
  published: boolean
  order: number
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [eventosPage, setEventosPage] = useState(1)
  const [noticiasPage, setNoticiasPage] = useState(1)
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [corpoDiretivo, setCorpoDiretivo] = useState<MembroCorpoDiretivo[]>([])
  const [loading, setLoading] = useState(true)
  
  const itemsPerPage = 6
  
  useEffect(() => {
    fetchPublicContent()
  }, [])

  useEffect(() => {
    // Scroll suave com offset para compensar o navbar fixo
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          const offset = 80 // Altura aproximada do navbar
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }
    }

    // Executar após o componente montar
    setTimeout(handleHashChange, 100)

    // Escutar mudanças no hash
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])
  
  const fetchPublicContent = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
      const [noticiasRes, eventosRes, corpoDiretivoRes] = await Promise.all([
        fetch(`${apiUrl}/noticias`),
        fetch(`${apiUrl}/eventos`),
        fetch(`${apiUrl}/corpo-diretivo`)
      ])
      
      if (noticiasRes.ok) {
        const noticiasData = await noticiasRes.json()
        setNoticias(noticiasData)
      }
      
      if (eventosRes.ok) {
        const eventosData = await eventosRes.json()
        setEventos(eventosData)
      }

      if (corpoDiretivoRes.ok) {
        const corpoDiretivoData = await corpoDiretivoRes.json()
        setCorpoDiretivo(corpoDiretivoData)
      }
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const eventosTotalPages = Math.ceil(eventos.length / itemsPerPage)
  const noticiasTotalPages = Math.ceil(noticias.length / itemsPerPage)
  
  const eventosPaginated = eventos.slice(
    (eventosPage - 1) * itemsPerPage,
    eventosPage * itemsPerPage
  )
  
  const noticiasPaginated = noticias.slice(
    (noticiasPage - 1) * itemsPerPage,
    noticiasPage * itemsPerPage
  )

  const slides = [
    {
      title: 'Hospital Geral',
      subtitle: 'do Moxico',
      description: 'O maior centro de atendimento ao público materno-infantil do país, com tecnologia, inovação e compromisso com a saúde da mulher, do casal e da criança.',
      image: '/images/561520774_122182101518343844_1723576736119237803_n.jpg',
      imageGradient: 'from-green-100 to-green-200',
      icon: Users,
    },
    {
      title: 'Cuidado',
      subtitle: 'Humanizado',
      description: 'Garantimos o atendimento humanizado e especializado à mulher e ao neonato por meio de serviços preventivos e curativos.',
      image: '/images/573508682_122184405284343844_8911212578133461837_n.jpg',
      imageGradient: 'from-green-200 to-green-300',
      icon: Heart,
    },
    {
      title: 'Tecnologia',
      subtitle: 'e Inovação',
      description: 'Alta tecnologia e programas de ensino e pesquisa para reduzir o índice de morbi-mortalidade no país.',
      image: '/images/577400924_122184958010343844_1454223572060094970_n.jpg',
      imageGradient: 'from-green-300 to-green-400',
      icon: Star,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="text-green-600 text-sm font-semibold mb-4">
                Bem-vindo ao Hospital Geral do Moxico
              </div>
              <div className="relative h-[400px]">
                {slides.map((slide, index) => {
                  const SlideIcon = slide.icon
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === currentSlide
                          ? 'opacity-100 translate-x-0'
                          : index < currentSlide
                          ? 'opacity-0 -translate-x-full'
                          : 'opacity-0 translate-x-full'
                      }`}
                    >
                      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        <span className="text-green-600">{slide.title}</span>
                        <br />
                        <span className="text-black">{slide.subtitle}</span>
                      </h1>
                      <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        {slide.description}
                      </p>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="w-5 h-5" />
                        <span>Continuar a rolar</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Slide Indicators */}
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-all"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="w-5 h-5 text-green-600" />
                </button>
                <div className="flex gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'w-8 bg-green-600'
                          : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Ir para slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-all"
                  aria-label="Próximo slide"
                >
                  <ChevronRight className="w-5 h-5 text-green-600" />
                </button>
              </div>
            </div>

            {/* Right Image Slider */}
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                {slides.map((slide, index) => {
                  const SlideIcon = slide.icon
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === currentSlide
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95'
                      }`}
                    >
                      {/* Imagem real */}
                      <div className="relative w-full h-full">
                        <Image
                          src={slide.image}
                          alt={`${slide.title} ${slide.subtitle}`}
                          fill
                          className="object-cover"
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      {/* Overlay gradient sutil */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${slide.imageGradient} opacity-20`}></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section id="missao-visao-valores" className="py-12 bg-white relative">
        {/* Decorative lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Title Section */}
            <div className="flex-shrink-0 md:w-40">
              <div className="inline-block">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  OS NOSSOS VALORES
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              </div>
            </div>
            
            {/* Values Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="group relative bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <UsersIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-900 font-semibold text-xs leading-tight group-hover:text-green-700 transition-colors">Humanização no atendimento</span>
                </div>
              </div>
              
              <div className="group relative bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-900 font-semibold text-xs leading-tight group-hover:text-green-700 transition-colors">Ética e transparência na gestão</span>
                </div>
              </div>
              
              <div className="group relative bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-900 font-semibold text-xs leading-tight group-hover:text-green-700 transition-colors">Competência e profissionalismo</span>
                </div>
              </div>
              
              <div className="group relative bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-900 font-semibold text-xs leading-tight group-hover:text-green-700 transition-colors">Solidariedade e compromisso social</span>
                </div>
              </div>
              
              <div className="group relative bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-900 font-semibold text-xs leading-tight group-hover:text-green-700 transition-colors">Inovação e melhoria contínua</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão Section */}
      <section id="missao" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Text */}
            <div>
              <div className="text-green-600 text-sm uppercase font-semibold mb-4">
                A NOSSA MISSÃO
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                A nossa <span className="text-green-600">Missão</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Prestar cuidados de saúde humanizados, eficientes e de qualidade à população do Moxico e das províncias vizinhas, contribuindo para a melhoria contínua dos indicadores de saúde pública.
              </p>
              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all"
              >
                Saber mais
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Background gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                
                {/* Real Image */}
                <div className="relative w-full h-full">
                  <Image
                    src="/images/573508682_122184405284343844_8911212578133461837_n.jpg"
                    alt="A Nossa Missão"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-green-600/20 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-green-600/30 z-10">
                  <div className="flex items-center gap-2 text-gray-800">
                    <Users className="w-5 h-5 text-green-700" />
                    <span className="text-sm font-semibold">Cuidado humanizado com os nossos pacientes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visão Section */}
      <section id="visao" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Background gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                
                {/* Real Image */}
                <div className="relative w-full h-full">
                  <Image
                    src="/images/561520774_122182101518343844_1723576736119237803_n.jpg"
                    alt="Sobre Nós"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute bottom-0 left-0 right-0 bg-green-600/20 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-green-600/30 flex items-center gap-2 text-gray-800 z-10">
                  <Info className="w-5 h-5 text-green-700" />
                  <span className="text-sm font-semibold">Sobre quem somos e o que fazemos</span>
                </div>
              </div>
            </div>

            {/* Right Text */}
            <div>
              <div className="text-green-600 text-sm uppercase font-semibold mb-4">
                VISÃO
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                A nossa <span className="text-green-600">Visão</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Ser uma instituição hospitalar de referência regional e nacional, reconhecida pela excelência clínica, inovação científica e compromisso com o bem-estar humano.
              </p>
              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all"
              >
                Saber mais
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* História e Evolução Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-green-600 text-sm uppercase font-semibold mb-4">
                HISTÓRIA E EVOLUÇÃO
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                O Hospital Geral do <span className="text-green-600">Moxico</span>
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                O Hospital Geral do Moxico, abreviadamente designado por <strong>«HGMx»</strong>, é um estabelecimento
                público de saúde da rede hospitalar de referência nacional, integrado no Serviço Nacional de Saúde para a prestação diferenciada, especializada e qualificada de assistência médica e de cuidados de
                enfermagem à população, com fins de promoção da saúde e prevenção de doença.
              </p>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                O Hospital Geral do Moxico é uma pessoa colectiva de direito público, dotado de autonomia
                administrativa, financeira e patrimonial, cuja capacidade jurídica abrange todos os direitos
                e obrigações necessárias ao cumprimento das suas atribuições.
              </p>

              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">O Hospital Geral do Moxico tem os seguintes objectivos:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span><strong>a)</strong> Assegurar aos utentes assistência médica de qualidade e prestação de cuidados de enfermagem diferenciados;</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span><strong>b)</strong> Contribuir para a redução da mortalidade das doenças mais frequentes nas suas áreas de jurisdição;</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span><strong>c)</strong> Prestar cuidados de saúde diferenciados na área médica e cirúrgica, aos utentes tanto inseridos localmente, como transferidos das unidades sanitárias periféricas, através do sistema de referência e contra referência;</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span><strong>d)</strong> Contribuir para o desenvolvimento das unidades sanitárias periféricas da sua zona de jurisdição, facilitando o acesso dos doentes referenciados e fornecendo retro informação, assim como participando na resolução de problemas bem identificados.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mensagem do Director Section */}
      <section id="mensagem-director" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Green Dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-2 h-2 bg-green-400 rounded-full opacity-30"></div>
          <div className="absolute bottom-40 left-20 w-2.5 h-2.5 bg-green-500 rounded-full opacity-30"></div>
          <div className="absolute top-1/2 left-10 w-2 h-2 bg-green-300 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-green-400 rounded-full opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block relative">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-green-600/30 to-green-500/20 rounded-full blur-xl transform scale-150"></div>
                
                {/* Main title */}
                <div className="relative">
                  <div className="text-green-600 text-lg md:text-xl font-bold mb-2 tracking-wider">
                    Mensagem do Director Geral
                  </div>
                  
                  {/* Decorative underline */}
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="w-8 h-1 bg-gradient-to-r from-transparent to-green-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-green-600 via-green-500 to-green-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div className="w-8 h-1 bg-gradient-to-l from-transparent to-green-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-8 md:p-12 shadow-xl border-2 border-green-200/50 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-300/20 rounded-tr-full"></div>
              
              <div className="relative z-10">
                <div className="grid md:grid-cols-3 gap-8 items-start">
                  {/* Photo Section */}
                  <div className="md:col-span-1 flex justify-center md:justify-start">
                    <div className="relative">
                      <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative">
                        {/* Placeholder gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600"></div>
                        
                        {/* Photo */}
                        <div className="relative w-full h-full z-10">
                          <Image
                            src="/images/481337255_122150224724343844_4470774594386885664_n.jpg"
                            alt="Director Geral"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 200px, 224px"
                          />
                        </div>
                        
                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-green-600/20 rounded-bl-full"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-green-500/20 rounded-tr-full"></div>
                      </div>
                      
                      {/* Name badge below photo */}
                      <div className="mt-4 text-center md:text-left">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Dr. Nome do Diretor</h3>
                        <p className="text-green-600 font-semibold text-sm">Director Geral</p>
                      </div>
                    </div>
                  </div>

                  {/* Message Section */}
                  <div className="md:col-span-2">
                    {/* Quote icon */}
                    <div className="flex justify-center md:justify-start mb-6">
                      <div className="bg-green-600 rounded-full p-3 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Message content */}
                    <div className="mb-6">
                      <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic mb-6">
                        &quot;É com grande orgulho e compromisso que lidero o Hospital Geral do Moxico, 
                        uma instituição dedicada à excelência no cuidado à saúde da mulher, do casal e da criança. 
                        Nossa missão é proporcionar atendimento humanizado, com tecnologia de ponta e uma equipa 
                        multidisciplinar altamente qualificada.&quot;
                      </p>
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                        Trabalhamos incansavelmente para reduzir os índices de morbi-mortalidade e promover 
                        a saúde materno-infantil em Angola. Cada dia é uma oportunidade de fazer a diferença 
                        na vida das famílias que confiam em nós.
                      </p>
                    </div>

                    {/* Signature line */}
                    <div className="pt-4 border-t border-green-300/50">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                        <p className="text-gray-600 text-sm italic">Com dedicação e compromisso</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corpo Diretivo Section - Organigrama */}
      <section id="corpo-diretivo" className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Decorative Green Dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-2 h-2 bg-green-400 rounded-full opacity-30"></div>
          <div className="absolute bottom-40 left-20 w-2.5 h-2.5 bg-green-500 rounded-full opacity-30"></div>
          <div className="absolute top-1/2 left-10 w-2 h-2 bg-green-300 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-green-400 rounded-full opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block relative mb-6">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-green-600/30 to-green-500/20 rounded-full blur-xl transform scale-150"></div>
              
              {/* Main text */}
              <div className="relative text-green-600 text-xl md:text-2xl lg:text-3xl font-extrabold mb-4 tracking-wide px-6 py-3">
                Conheça quem é quem, no nosso hospital geral
              </div>
              
              {/* Decorative underline */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-8 h-1 bg-gradient-to-r from-transparent to-green-600 rounded-full"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="w-16 h-1 bg-gradient-to-r from-green-600 via-green-500 to-green-600 rounded-full"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="w-8 h-1 bg-gradient-to-r from-green-600 to-transparent rounded-full"></div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              A nossa <span className="text-green-600">Liderança</span> e{' '}
              <span className="text-green-600">Visão</span> para o futuro
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça a estrutura organizacional e os profissionais que lideram o Hospital Geral do Moxico
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {corpoDiretivo.length > 0 ? (
              <Organigrama 
                membros={corpoDiretivo} 
                apiUrl={process.env.NEXT_PUBLIC_API_URL}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Organigrama em construção...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Serviços e Especialidades Médicas Section */}
      <Section bg="gray">
        <div className="mb-12">
          <div className="text-green-600 text-sm uppercase font-semibold mb-2">
            SERVIÇOS E ESPECIALIDADES MÉDICAS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Serviços e <span className="text-green-600">Especialidades Médicas</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICOS_ESPECIALIZADOS.map((servico, index) => {
            const Icon = servico.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors text-base">
                      {servico.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {servico.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="text-center mt-10">
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Ver Todos os Serviços
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>

      {/* Serviços de Apoio Section */}
      <Section bg="white">
        <div className="mb-12">
          <div className="text-green-600 text-sm uppercase font-semibold mb-2">
            SERVIÇOS DE APOIO
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Serviços de <span className="text-green-600">Apoio</span> ao Atendimento
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICOS_APOIO.map((servico, index) => {
            const Icon = servico.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors text-base">
                      {servico.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {servico.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="text-center mt-10">
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Ver Todos os Serviços de Apoio
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>

      {/* Investigação e Ensino Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-green-600 text-sm uppercase font-semibold mb-4">
              INVESTIGAÇÃO E ENSINO
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Centro de <span className="text-green-600">Formação</span> e{' '}
              <span className="text-green-600">Investigação</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              O Hospital é também um centro de formação e investigação, comprometido com a excelência científica e o desenvolvimento profissional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Beaker className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                Projetos de Pesquisa Científica
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Desenvolvimento de projetos de pesquisa científica em áreas clínicas e epidemiológicas para avançar o conhecimento médico e melhorar os cuidados de saúde.
              </p>
            </div>

            <div className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Building className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                Parcerias Académicas
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Colaboração com universidades e institutos técnicos para promover a formação de qualidade e o intercâmbio de conhecimentos.
              </p>
            </div>

            <div className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                Programas de Estágios
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Programas de estágios e formações práticas para estudantes de saúde, proporcionando experiência clínica e desenvolvimento profissional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsabilidade Social Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-green-600 text-sm uppercase font-semibold mb-4">
              RESPONSABILIDADE SOCIAL
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Compromisso com o <span className="text-green-600">Desenvolvimento</span> Humano e Ambiental
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              O Hospital Geral do Moxico desenvolve programas e ações que vão além dos cuidados médicos, promovendo o bem-estar da comunidade e a sustentabilidade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <UsersRound className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                Programas Comunitários
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Programas comunitários de prevenção e promoção da saúde, levando cuidados e educação sanitária às comunidades locais.
              </p>
            </div>

            <div className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Hand className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                Campanhas Solidárias
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Campanhas solidárias e ações de voluntariado que mobilizam a comunidade e promovem a solidariedade e o apoio mútuo.
              </p>
            </div>

            <div className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                Sustentabilidade Ambiental
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Projetos ambientais e de sustentabilidade hospitalar, comprometidos com a proteção do meio ambiente e práticas ecológicas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner - Economize Tempo */}
      <section className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="text-sm uppercase mb-2 opacity-90">ECONOMIZE TEMPO</div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Agende uma consulta sem sair de casa
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/agendar"
                className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl whitespace-nowrap text-center"
              >
                Agendar Consulta
              </Link>
              <Link
                href="/consulta-online"
                className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-all transform hover:scale-105 shadow-xl whitespace-nowrap text-center flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                Consulta Online
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos Section */}
      <section id="eventos" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Green Dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-3 h-3 bg-green-400 rounded-full opacity-30"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-green-500 rounded-full opacity-40"></div>
          <div className="absolute top-60 left-1/4 w-2.5 h-2.5 bg-green-300 rounded-full opacity-30"></div>
          <div className="absolute bottom-40 right-1/4 w-3 h-3 bg-green-400 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-green-500 rounded-full opacity-40"></div>
          <div className="absolute top-1/2 right-10 w-2.5 h-2.5 bg-green-300 rounded-full opacity-30"></div>
          <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-green-400 rounded-full opacity-30"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-green-500 rounded-full opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12">
            <div className="text-green-600 text-sm uppercase font-semibold mb-2">
              EVENTOS E GALERIA
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Os nossos eventos em destaque
            </h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4">
            {eventosPaginated.map((evento, index) => (
              <EventoCard key={index} evento={evento} />
            ))}
          </div>

          {/* Paginação */}
          {eventosTotalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setEventosPage(prev => Math.max(1, prev - 1))}
                disabled={eventosPage === 1}
                className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-green-50 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: eventosTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setEventosPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      eventosPage === page
                        ? 'bg-green-600 text-white shadow-lg scale-110'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-500'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setEventosPage(prev => Math.min(eventosTotalPages, prev + 1))}
                disabled={eventosPage === eventosTotalPages}
                className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-green-50 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 mb-4">
              Página {eventosPage} de {eventosTotalPages} • {eventos.length} eventos no total
            </p>
            <Link
              href="/galeria"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Ver Galeria Completa
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Notícias Section */}
      <section id="noticias" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="text-green-600 text-sm uppercase font-semibold mb-2">
              NOTÍCIAS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Notícias recentes sobre Saúde e o nosso hospital
            </h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4">
            {noticiasPaginated.map((noticia, index) => (
              <NoticiaCard key={index} noticia={noticia} />
            ))}
          </div>

          {/* Paginação */}
          {noticiasTotalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setNoticiasPage(prev => Math.max(1, prev - 1))}
                disabled={noticiasPage === 1}
                className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-green-50 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: noticiasTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setNoticiasPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      noticiasPage === page
                        ? 'bg-green-600 text-white shadow-lg scale-110'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-500'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setNoticiasPage(prev => Math.min(noticiasTotalPages, prev + 1))}
                disabled={noticiasPage === noticiasTotalPages}
                className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-green-50 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 mb-4">
              Página {noticiasPage} de {noticiasTotalPages} • {noticias.length} notícias no total
            </p>
            {noticias.length > itemsPerPage && (
              <Link
                href="#noticias"
                onClick={(e) => {
                  e.preventDefault()
                  if (noticiasPage < noticiasTotalPages) {
                    setNoticiasPage(noticiasTotalPages)
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Ver Todas as Notícias
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Parceiros Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Green Dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-2 h-2 bg-green-400 rounded-full opacity-30"></div>
          <div className="absolute bottom-40 left-20 w-2.5 h-2.5 bg-green-500 rounded-full opacity-30"></div>
          <div className="absolute top-1/2 left-10 w-2 h-2 bg-green-300 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-green-400 rounded-full opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12">
            <div className="text-green-600 text-sm uppercase font-semibold mb-2">
              PARCEIROS E AMIGOS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Parceiros e Amigos do Hospital
            </h2>
          </div>

          <div className="relative">
            <div className="flex items-center justify-center gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="group flex-shrink-0 w-56 h-40 bg-white rounded-2xl flex items-center justify-center border-2 border-gray-100 hover:border-green-500 transition-all duration-300 shadow-md hover:shadow-2xl transform hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                      <div className="w-8 h-8 bg-green-600 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    </div>
                    <div className="text-gray-500 text-sm font-semibold group-hover:text-green-700 transition-colors duration-300">
                      Parceiro {i}
                    </div>
                  </div>
                  
                  {/* Corner decoration */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
            <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-3 hover:bg-green-50 hover:shadow-2xl transition-all transform hover:scale-110 border border-gray-100 hover:border-green-500 z-20">
              <ArrowRight className="w-5 h-5 text-gray-600 rotate-180 hover:text-green-600 transition-colors" />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-3 hover:bg-green-50 hover:shadow-2xl transition-all transform hover:scale-110 border border-gray-100 hover:border-green-500 z-20">
              <ArrowRight className="w-5 h-5 text-gray-600 hover:text-green-600 transition-colors" />
            </button>
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="#parceiros"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Ver Todos os Parceiros
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contactos Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Decorative Elements - Enhanced */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full blur-[120px] opacity-15 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-[140px] opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-50 rounded-full blur-[130px] opacity-20"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-50 rounded-full mb-5 border border-green-100">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-green-600 text-xs uppercase font-bold tracking-widest">
                CONTACTOS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
              Entre em <span className="text-green-600 relative">
                Contacto
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-green-600/20 transform -skew-x-12"></span>
              </span> connosco
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Estamos disponíveis para esclarecer as suas dúvidas e prestar o melhor atendimento
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10">
            {/* Endereço */}
            <div className="group relative bg-white rounded-xl p-4 border border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-green-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="relative w-11 h-11 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md group-hover:shadow-xl">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">
                  Endereço
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed group-hover:text-gray-700 transition-colors">
                  Hospital Geral do Moxico, Cidade do Luena, Província do Moxico
                </p>
              </div>
              
              {/* Corner Accents */}
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-0 group-hover:scale-100" style={{ transitionDelay: '100ms' }}></div>
            </div>

            {/* Telefone */}
            <div className="group relative bg-white rounded-xl p-4 border border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <div className="relative z-10">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-green-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="relative w-11 h-11 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md group-hover:shadow-xl">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">
                  Telefone
                </h3>
                <a href="tel:937464987" className="text-gray-600 hover:text-green-600 transition-all text-sm font-semibold inline-block group-hover:translate-x-1 duration-300">
                  937 464 987
                </a>
              </div>
              
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-0 group-hover:scale-100" style={{ transitionDelay: '100ms' }}></div>
            </div>

            {/* E-mail */}
            <div className="group relative bg-white rounded-xl p-4 border border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <div className="relative z-10">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-green-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="relative w-11 h-11 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md group-hover:shadow-xl">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">
                  E-mail geral
                </h3>
                <a href="mailto:hospitalgeral@gmail.com" className="text-gray-600 hover:text-green-600 transition-all text-xs font-semibold break-all leading-relaxed inline-block group-hover:translate-x-1 duration-300">
                  hospitalgeral@gmail.com
                </a>
              </div>
              
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-0 group-hover:scale-100" style={{ transitionDelay: '100ms' }}></div>
            </div>

            {/* Horários - Featured Card */}
            <div className="group relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-xl p-4 border-2 border-green-600 hover:border-green-500 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden text-white sm:col-span-2 lg:col-span-1">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-800 to-green-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/50 to-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              {/* Decorative Circles */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-500"></div>
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-white/5 rounded-full blur-lg group-hover:bg-white/10 transition-all duration-700"></div>
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="relative w-11 h-11 bg-white/25 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md group-hover:shadow-xl border border-white/20">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-base font-bold mb-3">
                  Horários
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 group/item">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                    <div>
                      <p className="font-semibold text-xs mb-0.5">Horário de visitas</p>
                      <p className="text-white/90 text-xs">16h00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 group/item">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                    <div>
                      <p className="font-semibold text-xs mb-0.5">Intervalo de almoço</p>
                      <p className="text-white/90 text-xs">12h00 às 13h30</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Corner Accents */}
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-0 group-hover:scale-100" style={{ transitionDelay: '100ms' }}></div>
            </div>
          </div>

          {/* Call to Action - Enhanced */}
          <div className="text-center mt-12">
            <a
              href="/contato"
              className="group relative inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
            >
              {/* Button Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-600/20 to-green-600/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <span className="relative z-10">Enviar Mensagem</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
