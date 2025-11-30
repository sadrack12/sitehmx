'use client'

import { FileText, Download, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function EstatutoOrganicoPage() {
  const pdfPath = '/documents/estatuto-organico.pdf'
  const [pdfExists, setPdfExists] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifica se o PDF existe
    fetch(pdfPath, { method: 'HEAD' })
      .then((res) => {
        setPdfExists(res.ok)
        setLoading(false)
      })
      .catch(() => {
        setPdfExists(false)
        setLoading(false)
      })
  }, [pdfPath])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <FileText className="w-10 h-10" />
            </div>
            <div className="text-green-100 text-sm uppercase font-semibold mb-4">
              DOCUMENTO INSTITUCIONAL
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Estatuto <span className="text-green-100">Orgânico</span>
            </h1>
            <p className="text-lg text-green-50 max-w-2xl mx-auto">
              Normas e regulamentos que regem a organização e funcionamento do Hospital Geral do Moxico
            </p>
          </div>
        </div>
      </section>

      {/* PDF Viewer Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-12 text-center">
                <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando documento...</p>
              </div>
            ) : !pdfExists ? (
              <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
                    <AlertCircle className="w-10 h-10 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Documento não encontrado
                  </h2>
                  <p className="text-gray-600 mb-6">
                    O arquivo PDF do Estatuto Orgânico ainda não foi adicionado ao sistema.
                  </p>
                  <p className="text-sm text-gray-500">
                    Por favor, adicione o arquivo em: <code className="bg-gray-100 px-2 py-1 rounded">public/documents/estatuto-organico.pdf</code>
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Download Button */}
                <div className="flex justify-end mb-6">
                  <a
                    href={pdfPath}
                    download
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-5 h-5" />
                    Descarregar PDF
                  </a>
                </div>

                {/* PDF Viewer */}
                <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 font-medium">Estatuto Orgânico - Hospital Geral do Moxico</span>
                    </div>
                  </div>
                  <div className="relative bg-gray-100" style={{ minHeight: '800px' }}>
                    <iframe
                      src={`${pdfPath}#toolbar=1&navpanes=1&scrollbar=1`}
                      className="w-full"
                      style={{ minHeight: '800px', height: 'calc(100vh - 300px)' }}
                      title="Estatuto Orgânico PDF"
                    />
                  </div>
                </div>

                {/* Alternative: Direct link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 mb-4">
                    Se o PDF não carregar automaticamente,{' '}
                    <a
                      href={pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-semibold underline"
                    >
                      clique aqui para abrir em nova janela
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/sobre"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-md border-2 border-green-200"
              >
                Sobre Nós
              </Link>
              <Link
                href="/sobre/organigrama"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-md border-2 border-green-200"
              >
                Organigrama
              </Link>
              <Link
                href="/contato"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-md border-2 border-green-200"
              >
                Contactos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
