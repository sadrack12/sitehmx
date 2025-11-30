import { ArrowRight, Target, Award, Users, CheckCircle, Activity } from 'lucide-react'
import Link from 'next/link'

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-green-600 text-sm uppercase font-semibold mb-4">
              SOBRE NÓS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Determinação e compromisso com a <span className="text-green-600">saúde</span> do utente
            </h1>
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
              <div className="prose prose-lg max-w-none">
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
        </div>
      </section>

      {/* Missão Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-green-600 text-sm uppercase font-semibold mb-4">
                MISSÃO
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                A nossa <span className="text-green-600">Missão</span>
              </h2>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-8 md:p-12 shadow-xl border-2 border-green-200/50">
              <p className="text-xl text-gray-800 leading-relaxed text-center font-medium">
                Prestar cuidados de saúde humanizados, eficientes e de qualidade à população do Moxico e das províncias vizinhas, contribuindo para a melhoria contínua dos indicadores de saúde pública.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visão Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-green-600 text-sm uppercase font-semibold mb-4">
                VISÃO
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                A nossa <span className="text-green-600">Visão</span>
              </h2>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-8 md:p-12 shadow-xl border-2 border-green-200/50">
              <p className="text-xl text-gray-800 leading-relaxed text-center font-medium">
                Ser uma instituição hospitalar de referência regional e nacional, reconhecida pela excelência clínica, inovação científica e compromisso com o bem-estar humano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-green-600 text-sm uppercase font-semibold mb-4">
              VALORES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Os nossos <span className="text-green-600">Valores</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Princípios que guiam o nosso trabalho e compromisso com a excelência em saúde
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-green-500 transition-all hover:shadow-xl">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Humanização no atendimento</h3>
              <p className="text-gray-600 text-sm">
                Tratamento respeitoso e personalizado para cada paciente
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-green-500 transition-all hover:shadow-xl">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Ética e transparência na gestão</h3>
              <p className="text-gray-600 text-sm">
                Conduta íntegra e processos transparentes em todas as áreas
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-green-500 transition-all hover:shadow-xl">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Competência e profissionalismo</h3>
              <p className="text-gray-600 text-sm">
                Excelência técnica e dedicação profissional em todos os serviços
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-green-500 transition-all hover:shadow-xl">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Solidariedade e compromisso social</h3>
              <p className="text-gray-600 text-sm">
                Responsabilidade social e apoio à comunidade
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-green-500 transition-all hover:shadow-xl">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Inovação e melhoria contínua</h3>
              <p className="text-gray-600 text-sm">
                Busca constante por novas tecnologias e melhores práticas
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
