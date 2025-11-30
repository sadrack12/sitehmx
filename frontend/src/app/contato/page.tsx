'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, ExternalLink, Clock } from 'lucide-react'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    tipoContato: '',
    mensagem: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Mensagem enviada com sucesso!')
    setFormData({ nome: '', telefone: '', tipoContato: '', mensagem: '' })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-green-600 text-sm uppercase font-semibold mb-4">
              FALE CONNOSCO
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Estamos <span className="text-green-600">On</span> para ti! Entre em contato com a nossa equipa
            </h1>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Info */}
            <div>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                O nosso objectivo é melhorarmos cada dia mais ao atendimento do Hospital 
                para que os nossos utentes estejam sempre satisfeitos e seguros com a nossa 
                prestação de serviço.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Endereço</p>
                    <p className="text-gray-600 mb-2">
                      Hospital Geral do Moxico, Cidade do Luena, Província do Moxico
                    </p>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all"
                    >
                      Abrir Google Maps
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Telefone</p>
                    <a href="tel:937464987" className="text-gray-600 hover:text-green-600 transition-colors">
                      937 464 987
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">E-mail geral</p>
                    <a href="mailto:hospitalgeral@gmail.com" className="text-gray-600 hover:text-green-600 transition-colors">
                      hospitalgeral@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 font-semibold mb-2">Horários</p>
                    <div className="space-y-1 text-gray-600">
                      <p>Horário de visitas: <span className="font-semibold">16h00</span></p>
                      <p>Intervalo de almoço: <span className="font-semibold">12h00 às 13h30</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-green-600 pt-4">
                <div className="text-sm uppercase text-gray-700 font-semibold">
                  FAÇA-NOS UMA VISITA
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold mb-2 text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-semibold mb-2 text-gray-700">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                    placeholder="+244 900 000 000"
                  />
                </div>

                <div>
                  <label htmlFor="tipoContato" className="block text-sm font-semibold mb-2 text-gray-700">
                    Tipo de contacto
                  </label>
                  <select
                    id="tipoContato"
                    value={formData.tipoContato}
                    onChange={(e) => setFormData({ ...formData, tipoContato: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                  >
                    <option value="">Selecione...</option>
                    <option value="consulta">Agendamento de Consulta</option>
                    <option value="duvida">Dúvida</option>
                    <option value="reclamacao">Reclamação</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensagem" className="block text-sm font-semibold mb-2 text-gray-700">
                    Deixe a sua mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 focus:bg-white resize-none"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
