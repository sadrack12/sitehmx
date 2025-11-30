'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sobreOpen, setSobreOpen] = useState(false)
  const [servicosOpen, setServicosOpen] = useState(false)
  const [reservadoOpen, setReservadoOpen] = useState(false)

  const isGestao = pathname?.startsWith('/gestao')

  if (isGestao) {
    return null
  }

  const sobreDropdownItems = [
    { href: '#mensagem-director', label: 'Mensagem do Director Geral' },
    { href: '#missao', label: 'Missão' },
    { href: '#visao', label: 'Visão' },
    { href: '#missao-visao-valores', label: 'Valores' },
    { href: '#corpo-diretivo', label: 'Quem é Quem' },
    { href: '/sobre/estatuto-organico', label: 'Estatuto Orgânico' },
    { href: '/sobre/organigrama', label: 'Organigrama' },
  ]

  const servicosDropdownItems = [
    { href: '/servicos#especialidades-medicas', label: 'Especialidades Médicas' },
    { href: '/servicos#servicos-apoio', label: 'Serviços de Apoio' },
  ]

  const navLinks = [
    { href: '/', label: 'Home' },
    { 
      href: '#', 
      label: 'Sobre Nós',
      hasDropdown: true,
      dropdownItems: sobreDropdownItems
    },
    { 
      href: '/servicos', 
      label: 'Serviços',
      hasDropdown: true,
      dropdownItems: servicosDropdownItems
    },
    { href: '#noticias', label: 'Notícias' },
    { 
      href: '#eventos', 
      label: 'Eventos',
      hasDropdown: false 
    },
    { 
      href: '/galeria', 
      label: 'Galeria',
      hasDropdown: false 
    },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/logo.jpeg"
                alt="Hospital Geral do Moxico"
                fill
                className="object-contain"
                sizes="48px"
                priority
              />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 leading-tight">HOSPITAL GERAL</div>
              <div className="text-xs text-gray-600 leading-tight">DO MOXICO</div>
            </div>
            <div className="ml-2.5 pl-2.5 border-l border-gray-300 flex items-center">
              <Image
                src="/images/governo.png"
                alt="Governo de Angola - Ministério da Saúde"
                width={180}
                height={36}
                className="h-9 w-auto object-contain"
                style={{ width: 'auto', height: '36px' }}
              />
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <div 
                key={`${link.label}-${index}`}
                className="relative group"
                onMouseEnter={() => {
                  if (link.hasDropdown && link.dropdownItems) {
                    if (link.label === 'Sobre Nós') {
                      setSobreOpen(true)
                    } else if (link.label === 'Serviços') {
                      setServicosOpen(true)
                    }
                  }
                }}
                onMouseLeave={() => {
                  if (link.hasDropdown && link.dropdownItems) {
                    if (link.label === 'Sobre Nós') {
                      setSobreOpen(false)
                    } else if (link.label === 'Serviços') {
                      setServicosOpen(false)
                    }
                  }
                }}
              >
                <Link
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('#')) {
                      e.preventDefault()
                      // Se não estiver na home, navegar primeiro
                      if (pathname !== '/') {
                        window.location.href = `/${link.href}`
                      } else {
                        const element = document.querySelector(link.href)
                        if (element) {
                          const offset = 80
                          const elementPosition = element.getBoundingClientRect().top
                          const offsetPosition = elementPosition + window.pageYOffset - offset
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          })
                        }
                      }
                    }
                  }}
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-green-600 border-b-2 border-green-600 pb-1'
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
                {link.hasDropdown && link.dropdownItems && (
                  <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 transition-all duration-200 ${
                    (link.label === 'Sobre Nós' && sobreOpen) || (link.label === 'Serviços' && servicosOpen)
                      ? 'opacity-100 visible translate-y-0' 
                      : 'opacity-0 invisible -translate-y-2'
                  }`}>
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        onClick={(e) => {
                          setSobreOpen(false)
                          setServicosOpen(false)
                          setMobileMenuOpen(false)
                          
                          if (item.href.includes('#')) {
                            e.preventDefault()
                            const [path, hash] = item.href.split('#')
                            const targetPath = path || '/'
                            
                            // Se não estiver na página correta, navegar primeiro
                            if (pathname !== targetPath) {
                              window.location.href = item.href
                            } else {
                              setTimeout(() => {
                                const element = document.querySelector(`#${hash}`)
                                if (element) {
                                  const offset = 80
                                  const elementPosition = element.getBoundingClientRect().top
                                  const offsetPosition = elementPosition + window.pageYOffset - offset
                                  window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                  })
                                }
                              }, 100)
                            }
                          }
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-3">
              <Link
                href="/consulta-online"
                className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:via-blue-800 hover:to-blue-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Consulta Online</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>
              <Link
                href="/agendar"
                className="relative bg-gradient-to-r from-green-600 via-green-700 to-green-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-700 hover:via-green-800 hover:to-green-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Agendar Consulta</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 hover:text-green-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <div key={`${link.label}-${index}`}>
                  {link.hasDropdown && link.dropdownItems ? (
                    <div>
                      <button
                        onClick={() => {
                          if (link.label === 'Sobre Nós') {
                            setSobreOpen(!sobreOpen)
                          } else if (link.label === 'Serviços') {
                            setServicosOpen(!servicosOpen)
                          }
                        }}
                        className={`w-full flex items-center justify-between font-medium transition-colors ${
                          pathname === link.href
                            ? 'text-green-600'
                            : 'text-gray-700 hover:text-green-600'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          (link.label === 'Sobre Nós' && sobreOpen) || (link.label === 'Serviços' && servicosOpen)
                            ? 'rotate-180' 
                            : ''
                        }`} />
                      </button>
                      {((link.label === 'Sobre Nós' && sobreOpen) || (link.label === 'Serviços' && servicosOpen)) && (
                        <div className="pl-4 mt-2 flex flex-col gap-2">
                          {link.dropdownItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                              onClick={(e) => {
                                setMobileMenuOpen(false)
                                setSobreOpen(false)
                                setServicosOpen(false)
                                
                                if (item.href.includes('#')) {
                                  e.preventDefault()
                                  const [path, hash] = item.href.split('#')
                                  const targetPath = path || '/'
                                  
                                  // Se não estiver na página correta, navegar primeiro
                                  if (pathname !== targetPath) {
                                    window.location.href = item.href
                                  } else {
                                    setTimeout(() => {
                                      const element = document.querySelector(`#${hash}`)
                                      if (element) {
                                        const offset = 80
                                        const elementPosition = element.getBoundingClientRect().top
                                        const offsetPosition = elementPosition + window.pageYOffset - offset
                                        window.scrollTo({
                                          top: offsetPosition,
                                          behavior: 'smooth'
                                        })
                                      }
                                    }, 100)
                                  }
                                }
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`font-medium transition-colors ${
                        pathname === link.href
                          ? 'text-green-600'
                          : 'text-gray-700 hover:text-green-600'
                      }`}
                      onClick={(e) => {
                        setMobileMenuOpen(false)
                        if (link.href.startsWith('#')) {
                          e.preventDefault()
                          // Se não estiver na home, navegar primeiro
                          if (pathname !== '/') {
                            window.location.href = `/${link.href}`
                          } else {
                            setTimeout(() => {
                              const element = document.querySelector(link.href)
                              if (element) {
                                const offset = 80
                                const elementPosition = element.getBoundingClientRect().top
                                const offsetPosition = elementPosition + window.pageYOffset - offset
                                window.scrollTo({
                                  top: offsetPosition,
                                  behavior: 'smooth'
                                })
                              }
                            }, 100)
                          }
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/consulta-online"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-center hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Consulta Online</span>
              </Link>
              <Link
                href="/agendar"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold text-center hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center justify-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Agendar Consulta</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
