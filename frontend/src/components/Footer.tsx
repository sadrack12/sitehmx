import Link from 'next/link'
import { Activity, Mail, Phone, Facebook, MessageCircle, Instagram, MapPin, Clock } from 'lucide-react'
import { CONTACT_INFO, SOCIAL_LINKS } from '@/constants'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand and Contact */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 rounded-lg p-2.5">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900">HOSPITAL GERAL</div>
                <div className="text-sm text-gray-600 font-medium">DO MOXICO</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Inovação e Compromisso com a saúde da mulher, do casal e da criança.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-green-600 transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-600 hover:text-green-600 transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-gray-600">
                  <div>Horário de visitas: 16h00</div>
                  <div>Intervalo de almoço: 12h00 às 13h30</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-900">Navegação</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Galeria
                </Link>
              </li>
              <li>
                <Link href="#eventos" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="#noticias" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Contactos
                </Link>
              </li>
              <li>
                <Link href="/gestao/login" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Gabinete do Utente
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociais e Informações */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-900">Siga-nos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Mantenha-se conectado através das nossas redes sociais
            </p>
            <div className="flex gap-3 mb-6">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-all transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-all transform hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-all transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-1">GOVERNO DE ANGOLA</div>
              <div className="text-xs text-gray-500">MINISTÉRIO DA SAÚDE</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © 2024 <span className="text-green-600 font-semibold">Hospital Geral do Moxico</span> - Todos os direitos reservados
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link href="/contato" className="hover:text-green-600 transition-colors">
                Política de Privacidade
              </Link>
              <span>•</span>
              <Link href="/contato" className="hover:text-green-600 transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
