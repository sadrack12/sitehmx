// Constantes e dados compartilhados

import { Stethoscope, Users, Activity, Calendar, Heart, Baby, Microscope, Syringe, Scan, UserCheck, Eye, Radio, User, Droplet, Beaker, Package, Clock, AlertCircle, Brain, Bone, Scissors } from 'lucide-react'
import { Servico, Noticia, Evento } from '@/types'

export const CONTACT_INFO = {
  email: 'hospitalgeral@gmail.com',
  phone: '937 464 987',
  address: 'Hospital Geral do Moxico, Cidade do Luena, Província do Moxico',
}

export const SOCIAL_LINKS = {
  facebook: '#',
  whatsapp: '#',
  instagram: '#',
}

export const EXTERNAL_LINKS = [
  { name: 'spginecologia.pt', url: 'https://spginecologia.pt' },
  { name: 'febrasgo.org.br', url: 'https://febrasgo.org.br' },
  { name: 'who.int', url: 'https://who.int' },
  { name: 'unicef.org', url: 'https://unicef.org' },
  { name: 'fistulafoundation.org', url: 'https://fistulafoundation.org' },
  { name: 'sego.es', url: 'https://sego.es' },
  { name: 'figo.org', url: 'https://figo.org' },
]

export const NAVBAR_VALUES = [
  { icon: '❤', label: 'Humanismo' },
  { icon: '★', label: 'Competência' },
  { icon: '👁', label: 'Transparência' },
  { icon: '👥', label: 'Trabalho em Equipa' },
  { icon: '🌐', label: 'Compromisso com a sociedade' },
]

// Serviços e Especialidades Médicas
export const SERVICOS_ESPECIALIZADOS: Servico[] = [
  {
    icon: Baby,
    title: 'Pediatria',
    description: 'Especialidade médica dedicada ao cuidado da saúde de crianças e adolescentes, desde o nascimento até os 18 anos de idade.',
    image: '/images/573508682_122184405284343844_8911212578133461837_n.jpg',
    href: '/servicos',
  },
  {
    icon: Activity,
    title: 'Cirurgia Geral',
    description: 'Especialidade médica que realiza procedimentos cirúrgicos em diversas áreas do corpo, com foco em tratamentos cirúrgicos gerais.',
    image: '/images/577400924_122184958010343844_1454223572060094970_n.jpg',
    href: '/servicos',
  },
  {
    icon: Radio,
    title: 'Otorrinolaringologia',
    description: 'Especialidade médica que trata doenças relacionadas ao ouvido, nariz e garganta, incluindo problemas auditivos e respiratórios.',
    image: '/images/561520774_122182101518343844_1723576736119237803_n.jpg',
    href: '/servicos',
  },
  {
    icon: Eye,
    title: 'Oftalmologia',
    description: 'Especialidade médica dedicada ao diagnóstico e tratamento de doenças relacionadas aos olhos e à visão.',
    image: '/images/577535754_122184719738343844_5257761701614180172_n.jpg',
    href: '/servicos',
  },
  {
    icon: User,
    title: 'Estomatologia',
    description: 'Especialidade médica que trata doenças da boca, maxilares e estruturas relacionadas, incluindo problemas dentários e orais.',
    image: '/images/578003869_122184957962343844_5690754979362345545_n.jpg',
    href: '/servicos',
  },
  {
    icon: Stethoscope,
    title: 'Medicina Interna',
    description: 'Especialidade médica focada no diagnóstico e tratamento de doenças em adultos, com abordagem clínica abrangente.',
    image: '/images/556115116_122180553740343844_285671433319500312_n.jpg',
    href: '/servicos',
  },
  {
    icon: Brain,
    title: 'Neurocirurgia',
    description: 'Especialidade médica dedicada ao diagnóstico e tratamento cirúrgico de doenças do sistema nervoso central e periférico.',
    image: '/images/578006101_122184957872343844_7574823498328585283_n.jpg',
    href: '/servicos',
  },
  {
    icon: Bone,
    title: 'Ortopedia e Traumatologia',
    description: 'Especialidade médica que trata doenças e lesões do sistema musculoesquelético, incluindo ossos, articulações, músculos e ligamentos.',
    image: '/images/578006101_122184957872343844_7574823498328585283_n.jpg',
    href: '/servicos',
  },
  {
    icon: Scissors,
    title: 'Cirurgia Maxilofacial',
    description: 'Especialidade médica e odontológica que trata doenças, lesões e deformidades da face, mandíbula, maxila e estruturas relacionadas.',
    image: '/images/578006101_122184957872343844_7574823498328585283_n.jpg',
    href: '/servicos',
  },
  {
    icon: Droplet,
    title: 'Hemodiálise',
    description: 'Serviço especializado de tratamento renal que realiza hemodiálise para pacientes com insuficiência renal crónica.',
    image: '/images/560106632_122182100900343844_2963057808023442406_n.jpg',
    href: '/servicos',
  },
]

// Serviços de Apoio
export const SERVICOS_APOIO: Servico[] = [
  {
    icon: Beaker,
    title: 'Laboratório de Análises Clínicas',
    description: 'Laboratório completo para realização de exames laboratoriais e análises clínicas com tecnologia de ponta e resultados precisos.',
    image: '/images/481337255_122150224724343844_4470774594386885664_n.jpg',
    href: '/servicos',
  },
  {
    icon: Scan,
    title: 'Imagiologia',
    description: 'Serviço completo de diagnóstico por imagem incluindo Raio-X, Ecografia e TAC para auxiliar no diagnóstico médico.',
    image: '/images/553280666_122180093228343844_698813316423067076_n.jpg',
    href: '/servicos',
  },
  {
    icon: Package,
    title: 'Farmácia Hospitalar',
    description: 'Farmácia interna do hospital que fornece medicamentos prescritos aos pacientes com segurança e qualidade garantidas.',
    image: '/images/555962522_122180552600343844_8952583627148606697_n.jpg',
    href: '/servicos',
  },
  {
    icon: Calendar,
    title: 'Consultas Externas',
    description: 'Serviço de consultas médicas ambulatoriais para atendimento de pacientes em diversas especialidades médicas.',
    image: '/images/561520774_122182101518343844_1723576736119237803_n.jpg',
    href: '/servicos',
  },
  {
    icon: AlertCircle,
    title: 'Serviço de Urgência 24h',
    description: 'Atendimento de emergência disponível 24 horas por dia, 7 dias por semana, para casos urgentes e de emergência.',
    image: '/images/573508682_122184405284343844_8911212578133461837_n.jpg',
    href: '/servicos',
  },
]

export const NOTICIAS: Noticia[] = [
  {
    title: 'Covid-19 e Gravidez',
    date: '12 de Agosto de 2022',
    description: 'Considerando a conjuntura atual, fomos tentar saber qual o impacto do novo COVID-19 sobre a gravidez. O que fazer se estiver grávida...',
    image: '/images/481337255_122150224724343844_4470774594386885664_n.jpg',
    color: 'from-green-100 to-green-200',
  },
  {
    title: 'Desenvolvimento Comunitário',
    date: '08 de Abril de 2022',
    description: 'Primeira-Dama inaugura centro materno-infantil no Morro dos Veados',
    image: '/images/553280666_122180093228343844_698813316423067076_n.jpg',
    color: 'from-green-100 to-green-200',
  },
  {
    title: 'Vacinação contra Covid-19',
    date: '12 de Agosto de 2022',
    description: 'Mais de 14 mil pessoas imunizadas nas últimas 24 horas',
    image: '/images/555962522_122180552600343844_8952583627148606697_n.jpg',
    color: 'from-green-100 to-green-200',
  },
  {
    title: 'Campanha de Saúde Materna',
    date: '15 de Setembro de 2022',
    description: 'Nova campanha visa reduzir a mortalidade materna e infantil na região',
    image: '/images/556115116_122180553740343844_285671433319500312_n.jpg',
    color: 'from-green-200 to-green-300',
  },
  {
    title: 'Inovação em Cirurgias',
    date: '20 de Outubro de 2022',
    description: 'Hospital implementa novas técnicas cirúrgicas minimamente invasivas',
    image: '/images/560106632_122182100900343844_2963057808023442406_n.jpg',
    color: 'from-green-100 to-green-200',
  },
  {
    title: 'Programa de Formação',
    date: '05 de Novembro de 2022',
    description: 'Iniciativa capacita profissionais de saúde em cuidados neonatais',
    image: '/images/561520774_122182101518343844_1723576736119237803_n.jpg',
    color: 'from-green-200 to-green-300',
  },
]

export const EVENTOS: Evento[] = [
  {
    title: 'Inauguração do 1º BLH de Angola',
    date: '24 de Junho de 2022',
    featured: true,
    image: '/images/578488802_122184915152343844_2298168834801400220_n.jpg',
    color: 'from-gray-100 to-gray-200',
  },
  {
    title: 'Workshop sobre auditoria de mortes maternas e prénatais',
    date: '24 de Junho de 2022',
    featured: false,
    image: '/images/579450528_122184957920343844_677704214275117552_n.jpg',
    color: 'from-green-100 to-green-200',
  },
  {
    title: 'Doação de material de Bio-segurança a maternidade',
    date: '24 de Junho de 2022',
    featured: false,
    image: '/images/578003869_122184957962343844_5690754979362345545_n.jpg',
    color: 'from-green-100 to-green-200',
  },
  {
    title: 'Seminário de Saúde Materno-Infantil',
    date: '15 de Setembro de 2022',
    featured: false,
    image: '/images/578006101_122184957872343844_7574823498328585283_n.jpg',
    color: 'from-green-200 to-green-300',
  },
  {
    title: 'Campanha de Vacinação Infantil',
    date: '10 de Outubro de 2022',
    featured: false,
    image: '/images/577535754_122184719738343844_5257761701614180172_n.jpg',
    color: 'from-green-100 to-green-200',
  },
  {
    title: 'Conferência sobre Inovação em Saúde',
    date: '05 de Novembro de 2022',
    featured: true,
    image: '/images/577400924_122184958010343844_1454223572060094970_n.jpg',
    color: 'from-gray-100 to-gray-200',
  },
]

export const EQUIPA_ESPECIALIDADES = [
  { number: '01', specialty: 'Ginecologia e Obstetrícia' },
  { number: '02', specialty: 'Pediatria e Neonatologia' },
  { number: '03', specialty: 'Cirurgia Geral' },
  { number: '04', specialty: 'Anestesiologia' },
  { number: '05', specialty: 'Enfermagem' },
  { number: '06', specialty: 'Fisioterapia' },
]

export const RESPONSABILIDADES = [
  'Atendimento humanizado e especializado',
  'Serviços preventivos e curativos',
  'Equipas multidisciplinares',
  'Inovação e tecnologia',
  'Compromisso com a saúde',
]

