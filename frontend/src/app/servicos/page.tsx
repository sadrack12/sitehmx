'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import Section, { SectionHeader } from '@/components/ui/Section'
import { SERVICOS_ESPECIALIZADOS, SERVICOS_APOIO } from '@/constants'

export default function ServicosPage() {
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section>
        <SectionHeader
          badge="SERVIÇOS DO HOSPITAL"
          title={
            <>
              Serviços e <span className="text-green-600">Especialidades Médicas</span>
            </>
          }
        />
      </Section>

      {/* Serviços e Especialidades Médicas */}
      <Section bg="gray" id="especialidades-medicas">
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
                className="flex items-start gap-4 p-4 bg-white rounded-lg hover:bg-green-50 transition-colors group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <Icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                    {servico.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {servico.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Serviços de Apoio */}
      <section id="servicos-apoio" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="text-green-600 text-sm uppercase font-semibold mb-2">
              SERVIÇOS DE APOIO
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Serviços de <span className="text-green-600">Apoio</span> ao Atendimento
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Serviços complementares essenciais para garantir o melhor atendimento aos nossos pacientes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICOS_APOIO.map((servico, index) => {
              const Icon = servico.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <Icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                      {servico.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {servico.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 text-white/90">Entre em contato e descubra como podemos ajudar</p>
          <Link
            href="/contato"
            className="inline-block bg-white text-green-600 px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            Entre em Contato
          </Link>
        </div>
      </section>
    </div>
  )
}
