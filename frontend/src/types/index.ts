// Tipos compartilhados para toda a aplicação

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'gestor' | 'atendente' | 'medico'
  medico_id?: number
  medico?: Medico
  created_at?: string
  updated_at?: string
}

export interface Paciente {
  id: number
  nome: string
  nif: string
  email?: string
  telefone?: string
  data_nascimento?: string
  endereco?: string
  cidade?: string
  estado?: string
  created_at?: string
  updated_at?: string
}

export interface Medico {
  id: number
  nome: string
  especialidade: string
  crm?: string
  telefone?: string
  email?: string
  created_at?: string
  updated_at?: string
}

export interface Consulta {
  id: number
  paciente_id: number
  medico_id: number
  sala_id?: number
  data_consulta: string
  hora_consulta: string
  tipo_consulta: string
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada'
  agendada_online?: boolean
  observacoes?: string
  queixa_principal?: string
  historia_doenca_atual?: string
  historia_patologica_pregressa?: string
  historia_familiar?: string
  historia_social?: string
  exame_fisico?: string
  pressao_arterial?: string
  frequencia_cardiaca?: string
  frequencia_respiratoria?: string
  temperatura?: string
  peso?: string
  altura?: string
  diagnostico?: string
  conduta?: string
  prescricao?: string
  exames_complementares?: string
  paciente?: Paciente
  medico?: Medico
  created_at?: string
  updated_at?: string
}

export interface Servico {
  id?: number
  icon: any
  title: string
  description: string
  image?: string
  href?: string
}

export interface Noticia {
  title: string
  date: string
  description: string
  image?: string
  color?: string
  href?: string
}

export interface Evento {
  title: string
  date: string
  description?: string
  featured?: boolean
  image?: string
  color?: string
  href?: string
}

export interface StatCard {
  title: string
  value: number | string
  icon: any
  color: string
  bgColor: string
  iconColor: string
}

