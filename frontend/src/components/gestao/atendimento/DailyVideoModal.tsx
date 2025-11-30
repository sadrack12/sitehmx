'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Loader2, Video, Users, Mic, MicOff, VideoIcon, VideoOff, FileText, Save, ChevronRight, Pill, ClipboardList, Plus, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { dailyManager } from '@/utils/dailyManager'
import AnamneseForm from './AnamneseForm'
import PrescricaoForm from './PrescricaoForm'
import SolicitarExameModal from './SolicitarExameModal'

interface DailyVideoModalProps {
  isOpen: boolean
  onClose: () => void
  consultaId: number
  nomeUsuario: string
  isMedico?: boolean
}

export default function DailyVideoModal({
  isOpen,
  onClose,
  consultaId,
  nomeUsuario,
  isMedico = false,
}: DailyVideoModalProps) {
  const dailyContainerRef = useRef<HTMLDivElement>(null)
  const callFrameRef = useRef<any>(null)
  const isInitializingRef = useRef(false) // Flag para evitar múltiplas inicializações simultâneas
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roomData, setRoomData] = useState<any>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [activeTab, setActiveTab] = useState<'anamnese' | 'prescricao' | 'exames'>('anamnese')
  const [showPanel, setShowPanel] = useState(false)
  const [savingAnamnese, setSavingAnamnese] = useState(false)
  const [savingPrescricao, setSavingPrescricao] = useState(false)
  const [savingExames, setSavingExames] = useState(false)
  const [consultaData, setConsultaData] = useState<any>(null)
  const [examesDisponiveis, setExamesDisponiveis] = useState<any[]>([])
  const [loadingExames, setLoadingExames] = useState(false)
  
  // Estado da anamnese
  const [anamnese, setAnamnese] = useState({
    queixa_principal: '',
    historia_doenca_atual: '',
    historia_patologica_pregressa: '',
    historia_familiar: '',
    historia_social: '',
    exame_fisico: '',
    pressao_arterial: '',
    frequencia_cardiaca: '',
    frequencia_respiratoria: '',
    temperatura: '',
    peso: '',
    altura: '',
    diagnostico: '',
    conduta: '',
  })

  // Estado da prescrição
  const [prescricao, setPrescricao] = useState('')

  // Estado da requisição de exames
  const [examesSelecionados, setExamesSelecionados] = useState<number[]>([])
  const [observacoesExames, setObservacoesExames] = useState('')
  const [urgenteExames, setUrgenteExames] = useState(false)

  // Carregar dados da consulta
  useEffect(() => {
    if (!isOpen || !consultaId || !isMedico) return

    const loadConsulta = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/consultas/${consultaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setConsultaData(data)
          // Preencher anamnese com dados existentes
          if (data) {
            setAnamnese({
              queixa_principal: data.queixa_principal || '',
              historia_doenca_atual: data.historia_doenca_atual || '',
              historia_patologica_pregressa: data.historia_patologica_pregressa || '',
              historia_familiar: data.historia_familiar || '',
              historia_social: data.historia_social || '',
              exame_fisico: data.exame_fisico || '',
              pressao_arterial: data.pressao_arterial || '',
              frequencia_cardiaca: data.frequencia_cardiaca || '',
              frequencia_respiratoria: data.frequencia_respiratoria || '',
              temperatura: data.temperatura || '',
              peso: data.peso || '',
              altura: data.altura || '',
              diagnostico: data.diagnostico || '',
              conduta: data.conduta || '',
            })
            setPrescricao(data.prescricao || '')
          }
        }
      } catch (err) {
        console.error('Erro ao carregar consulta:', err)
      }
    }

    loadConsulta()
  }, [isOpen, consultaId, isMedico])

  // Carregar exames disponíveis
  useEffect(() => {
    if (!isOpen || !isMedico) return

    const loadExames = async () => {
      setLoadingExames(true)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/exames`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setExamesDisponiveis(data.data || data || [])
        }
      } catch (err) {
        console.error('Erro ao carregar exames:', err)
      } finally {
        setLoadingExames(false)
      }
    }

    loadExames()
  }, [isOpen, isMedico])

  // Carregar sala e token
  useEffect(() => {
    if (!isOpen || !consultaId) return

    const loadRoom = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem('token')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/daily/consulta/${consultaId}/room`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erro ao carregar sala')
        }

        const data = await response.json()
        setRoomData(data)

        // Aguardar um pouco para garantir que o container está montado no DOM
        await new Promise(resolve => setTimeout(resolve, 300))

        // Verificar se o container está montado
        if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
          throw new Error('Container do Daily.co não está disponível. Tente novamente.')
        }

        // Inicializar Daily.co
        if (data.current_user_token && data.room) {
          await initializeDaily(data.room.url, data.current_user_token)
        } else {
          throw new Error('Token ou URL da sala não disponível')
        }
      } catch (err: any) {
        console.error('Erro ao carregar sala:', err)
        setError(err.message || 'Erro ao carregar videoconferência')
        setLoading(false)
      }
    }

    loadRoom()

    return () => {
      // Cleanup: destruir instância do Daily.co quando o componente desmontar ou fechar
      if (callFrameRef.current) {
        try {
          callFrameRef.current.destroy()
        } catch (e) {
          console.warn('Erro ao destruir Daily.co no cleanup:', e)
        }
        dailyManager.unregisterInstance(callFrameRef.current)
        callFrameRef.current = null
      }
      
      // Limpar container
      if (dailyContainerRef.current) {
        dailyContainerRef.current.innerHTML = ''
      }
    }
  }, [isOpen, consultaId])

  const initializeDaily = async (roomUrl: string, token: string) => {
    // Evitar múltiplas inicializações simultâneas
    if (isInitializingRef.current) {
      console.warn('Inicialização já em andamento, ignorando chamada duplicada')
      return
    }
    
    // Verificar suporte ao WebRTC antes de continuar
    if (typeof window !== 'undefined') {
      const hasWebRTC = !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection || (window as any).mozRTCPeerConnection)
      const hasGetUserMedia = !!(navigator.mediaDevices?.getUserMedia || (navigator as any).getUserMedia || (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia)
      
      if (!hasWebRTC || !hasGetUserMedia) {
        const errorMsg = 'Seu navegador não suporta videoconferência (WebRTC). Por favor, use um navegador moderno como Chrome, Firefox, Safari ou Edge.'
        setError(errorMsg)
        setLoading(false)
        isInitializingRef.current = false
        return
      }
      
      // Verificar se está em HTTPS ou localhost (WebRTC requer HTTPS em produção)
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      if (!isSecure && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.warn('WebRTC pode não funcionar em HTTP. Recomendado usar HTTPS.')
      }
    }
    
    if (dailyManager.isCreating()) {
      console.warn('Outra instância está sendo criada, aguardando...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      if (dailyManager.isCreating()) {
        throw new Error('Outra instância do Daily.co está sendo criada. Aguarde e tente novamente.')
      }
    }
    
    isInitializingRef.current = true
    dailyManager.setCreating(true)
    
    // Destruir qualquer instância ativa ANTES de começar
    try {
      console.log('Destruindo instâncias ativas do Daily.co...')
      await dailyManager.destroyActiveInstance()
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (e) {
      console.warn('Erro ao destruir instâncias ativas:', e)
    }
    
    try {
      // IMPORTANTE: Destruir qualquer instância anterior do Daily.co antes de criar uma nova
      if (callFrameRef.current) {
        console.log('Destruindo instância anterior do Daily.co...')
        try {
          callFrameRef.current.destroy()
          // Aguardar mais tempo após destruir para garantir que o Daily.co limpou tudo internamente
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (destroyError) {
          console.warn('Erro ao destruir instância anterior:', destroyError)
        }
        dailyManager.unregisterInstance(callFrameRef.current)
        callFrameRef.current = null
      }
      
      // Limpar completamente o container antes de criar novo frame
      if (dailyContainerRef.current) {
        dailyContainerRef.current.innerHTML = ''
        // Forçar reflow
        void dailyContainerRef.current.offsetHeight
      }
      
      // Aguardar um pouco após limpar para garantir que o DOM foi atualizado
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Aguardar mais tempo para garantir que o DOM está totalmente renderizado
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!dailyContainerRef.current) {
        throw new Error('Container do Daily.co não encontrado')
      }

      // Verificar se o container está no DOM e visível
      if (!dailyContainerRef.current.isConnected) {
        throw new Error('Container do Daily.co não está no DOM')
      }

      // Verificar se o container tem dimensões válidas
      let rect = dailyContainerRef.current.getBoundingClientRect()
      let attempts = 0
      while ((rect.width === 0 || rect.height === 0) && attempts < 5) {
        console.warn(`Container tem dimensões zero (tentativa ${attempts + 1}), aguardando...`)
        await new Promise(resolve => setTimeout(resolve, 300))
        rect = dailyContainerRef.current.getBoundingClientRect()
        attempts++
      }
      
      if (rect.width === 0 || rect.height === 0) {
        throw new Error('Container do Daily.co não tem dimensões válidas após múltiplas tentativas')
      }
      
      console.log('Container pronto:', { width: rect.width, height: rect.height })

      // Verificar novamente se o container ainda existe após os delays
      if (!dailyContainerRef.current) {
        throw new Error('Container do Daily.co não encontrado após inicialização')
      }

      // Importar Daily.co dinamicamente (apenas no cliente)
      // Aguardar um pouco mais para garantir que o módulo está totalmente carregado
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const DailyModule = await import('@daily-co/daily-js')
      
      // Verificar estrutura do módulo - Daily.co pode exportar de diferentes formas
      let DailyIframe: any = null
      const DailyModuleAny = DailyModule as any
      
      // Tentar diferentes formas de acessar o módulo
      if (DailyModuleAny.default && typeof DailyModuleAny.default.createFrame === 'function') {
        DailyIframe = DailyModuleAny.default
      } else if (DailyModuleAny.default && DailyModuleAny.default.default && typeof DailyModuleAny.default.default.createFrame === 'function') {
        DailyIframe = DailyModuleAny.default.default
      } else if (typeof DailyModuleAny.createFrame === 'function') {
        DailyIframe = DailyModuleAny
      } else if (typeof DailyModuleAny === 'function') {
        DailyIframe = DailyModuleAny
      } else if (DailyModuleAny.DailyIframe && typeof DailyModuleAny.DailyIframe.createFrame === 'function') {
        DailyIframe = DailyModuleAny.DailyIframe
      } else {
        // Tentar acessar diretamente como objeto
        const moduleKeys = Object.keys(DailyModuleAny)
        console.log('Daily.co module keys:', moduleKeys)
        console.log('Daily.co module structure:', DailyModule)
        
        // Procurar por qualquer propriedade que tenha createFrame
        for (const key of moduleKeys) {
          const value = (DailyModule as any)[key]
          if (value && typeof value.createFrame === 'function') {
            DailyIframe = value
            break
          }
        }
        
        if (!DailyIframe) {
          throw new Error('Daily.co não foi carregado corretamente. Estrutura do módulo desconhecida.')
        }
      }

      // Verificar se createFrame existe
      if (!DailyIframe || typeof DailyIframe.createFrame !== 'function') {
        console.error('Daily.co module:', DailyIframe)
        console.error('Daily.co type:', typeof DailyIframe)
        throw new Error('Daily.co não foi carregado corretamente. createFrame não encontrado.')
      }
      
      // Tentar usar o método load() se disponível para pré-carregar o bundle
      if (typeof DailyIframe.load === 'function') {
        try {
          console.log('Pré-carregando Daily.co...')
          await DailyIframe.load()
          console.log('Daily.co pré-carregado com sucesso')
        } catch (loadError) {
          console.warn('Erro ao pré-carregar Daily.co (continuando mesmo assim):', loadError)
        }
      }
      
      // Aguardar mais um pouco antes de criar o frame para garantir que tudo está pronto
      await new Promise(resolve => setTimeout(resolve, 500))

      // Verificar se o container ainda existe e está no DOM
      if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
        throw new Error('Container do Daily.co não está disponível')
      }

      // Criar instância do Daily.co com tratamento de erro específico
      try {
        // Garantir que o container tenha dimensões mínimas
        if (dailyContainerRef.current) {
          const rect = dailyContainerRef.current.getBoundingClientRect()
          if (rect.width === 0 || rect.height === 0) {
            console.warn('Container tem dimensões zero, aguardando...')
            await new Promise(resolve => setTimeout(resolve, 300))
            // Verificar novamente após aguardar
            const newRect = dailyContainerRef.current.getBoundingClientRect()
            if (newRect.width === 0 || newRect.height === 0) {
              throw new Error('Container do Daily.co não tem dimensões válidas')
            }
          }
        }

        // Verificar novamente se o container ainda existe
        if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
          throw new Error('Container do Daily.co não está disponível para criar o frame')
        }

        // Criar o frame - usar uma abordagem mais robusta
        // O Daily.co pode ter problemas se o container não estiver totalmente renderizado
        let frameCreated = false
        let attempts = 0
        const maxAttempts = 3
        
        while (!frameCreated && attempts < maxAttempts) {
          try {
            attempts++
            console.log(`Tentativa ${attempts} de criar frame do Daily.co`)
            
            // Verificar novamente se o container existe e está no DOM
            if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
              throw new Error('Container não está disponível')
            }
            
            // Verificar dimensões novamente
            const currentRect = dailyContainerRef.current.getBoundingClientRect()
            if (currentRect.width === 0 || currentRect.height === 0) {
              console.warn('Container ainda sem dimensões, aguardando...')
              await new Promise(resolve => setTimeout(resolve, 300))
              continue
            }
            
            // Usar requestAnimationFrame para garantir que o DOM está totalmente renderizado
            await new Promise<void>((resolve) => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  resolve()
                })
              })
            })
            
            // Forçar um reflow do DOM antes de criar o frame
            void dailyContainerRef.current.offsetHeight
            
            // Criar o frame com configurações mínimas primeiro
            // Usar try-catch interno para capturar erros específicos do Daily.co
            try {
              // Verificar se o container ainda existe antes de criar
              if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
                throw new Error('Container não está disponível antes de criar frame')
              }
              
              // Criar o frame - usar apenas propriedades válidas do Daily.co
              // Documentação: https://docs.daily.co/reference/daily-js/daily-iframe-class
              const frameOptions: any = {
                showLeaveButton: false,
                showFullscreenButton: false,
                showParticipantsBar: false,
                iframeStyle: {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  border: 'none',
                },
              }
              
              // Criar o frame - usar uma abordagem mais defensiva
              console.log('Criando frame do Daily.co...')
              
              // Verificar novamente o container antes de criar
              if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
                throw new Error('Container não está disponível no momento da criação')
              }
              
              // Tentar criar o frame - suprimindo erros de postMessage que podem ser não-críticos
              // O erro de postMessage pode ocorrer dentro do createFrame mas o frame ainda pode funcionar
              let frameCreationError: any = null
              
              // Tentar criar o frame - pode lançar erro de postMessage internamente
              // Mas vamos tentar continuar mesmo se houver esse erro
              try {
                callFrameRef.current = DailyIframe.createFrame(
                  dailyContainerRef.current,
                  frameOptions
                )
                // Registrar a instância no gerenciador
                if (callFrameRef.current) {
                  dailyManager.registerInstance(callFrameRef.current)
                }
              } catch (immediateError: any) {
                // Se o erro for sobre postMessage, pode ser um problema interno do Daily.co
                // Mas vamos verificar se o frame foi criado mesmo assim
                if (immediateError.message?.includes('postMessage') || 
                    immediateError.message?.includes('null') ||
                    immediateError.message?.includes('is not an object')) {
                  console.warn('Erro de postMessage durante createFrame (pode ser não-crítico):', immediateError.message)
                  frameCreationError = immediateError
                  
                  // Aguardar um pouco para ver se o frame foi criado mesmo com o erro
                  await new Promise(resolve => setTimeout(resolve, 500))
                  
                  // Se o frame não foi criado, tentar novamente
                  if (!callFrameRef.current) {
                    console.log('Frame não foi criado, tentando novamente...')
                    try {
                      callFrameRef.current = DailyIframe.createFrame(
                        dailyContainerRef.current,
                        frameOptions
                      )
                    } catch (retryError: any) {
                      // Se ainda falhar, lançar o erro original
                      throw immediateError
                    }
                  }
                } else {
                  throw immediateError
                }
              }
              
              // Verificar se foi criado
              if (!callFrameRef.current) {
                throw new Error('createFrame retornou null')
              }
              
              // Aguardar um pouco após criar o frame para garantir que foi inicializado internamente
              await new Promise(resolve => setTimeout(resolve, 500))
              
              // Verificar novamente se ainda existe após o delay
              if (!callFrameRef.current) {
                throw new Error('Frame foi destruído após criação')
              }
              
              // Se chegou aqui, o frame foi criado com sucesso (mesmo que tenha havido erro de postMessage)
              frameCreated = true
              // Registrar a instância no gerenciador
              if (callFrameRef.current) {
                dailyManager.registerInstance(callFrameRef.current)
              }
              console.log('Frame do Daily.co criado com sucesso' + (frameCreationError ? ' (com aviso de postMessage)' : ''))
            } catch (createError: any) {
              // Se o erro for sobre postMessage, pode ser um problema de timing interno do Daily.co
              // Mas vamos verificar se o frame foi criado mesmo assim antes de lançar o erro
              if (createError.message?.includes('postMessage') || 
                  createError.message?.includes('null') ||
                  createError.message?.includes('is not an object')) {
                console.warn('Erro interno do Daily.co durante createFrame:', createError.message)
                
                // Aguardar um pouco para ver se o frame foi criado mesmo com o erro
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Se o frame foi criado mesmo com o erro, continuar
                if (callFrameRef.current) {
                  console.log('Frame foi criado mesmo com erro de postMessage, continuando...')
                  frameCreated = true
                  return // Sair do try-catch interno, frame foi criado
                }
                
                // Se não foi criado, lançar o erro para ser capturado pelo catch externo
                throw createError
              }
              throw createError
            }
          } catch (frameError: any) {
            console.warn(`Erro na tentativa ${attempts}:`, frameError.message)
            
            // Se não for a última tentativa e o erro for relacionado a postMessage ou null
            if (attempts < maxAttempts && (
              frameError.message?.includes('postMessage') || 
              frameError.message?.includes('null') ||
              frameError.message?.includes('is not an object')
            )) {
              // Limpar qualquer tentativa anterior
              if (callFrameRef.current) {
                try {
                  callFrameRef.current.destroy()
                } catch (e) {
                  // Ignorar erro ao destruir
                }
                dailyManager.unregisterInstance(callFrameRef.current)
                callFrameRef.current = null
              }
              
              // Limpar container completamente
              if (dailyContainerRef.current) {
                dailyContainerRef.current.innerHTML = ''
                // Forçar reflow
                void dailyContainerRef.current.offsetHeight
              }
              
              // Aguardar antes de tentar novamente (aumentar o delay a cada tentativa)
              await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
              
              // Verificar novamente o container
              if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
                throw new Error('Container não está disponível após aguardar')
              }
            } else {
              // Última tentativa ou erro não relacionado a postMessage
              throw frameError
            }
          }
        }
        
        if (!frameCreated) {
          throw new Error('Não foi possível criar o frame do Daily.co após múltiplas tentativas')
        }

        // Verificar se a instância foi criada
        if (!callFrameRef.current) {
          throw new Error('Falha ao criar instância do Daily.co - retornou null')
        }
      } catch (createError: any) {
        console.error('Erro ao criar frame do Daily.co:', createError)
        // Se o erro for relacionado a WebRTC
        if (createError.message && (createError.message.includes('WebRTC') || createError.message.includes('not supported'))) {
          const errorMsg = 'Seu navegador não suporta videoconferência ou o WebRTC está bloqueado. Por favor:\n\n' +
            '1. Use um navegador moderno (Chrome, Firefox, Safari ou Edge)\n' +
            '2. Verifique se o site está acessível via HTTPS\n' +
            '3. Permita o acesso à câmera e microfone nas configurações do navegador\n' +
            '4. Tente recarregar a página'
          setError(errorMsg)
          setLoading(false)
          throw new Error(errorMsg)
        }
        // Se o erro for relacionado a postMessage, pode ser que o iframe não foi criado corretamente
        if (createError.message && createError.message.includes('postMessage')) {
          throw new Error('Erro ao inicializar iframe do Daily.co. Tente fechar e abrir novamente.')
        }
        throw new Error('Erro ao criar frame do Daily.co: ' + (createError.message || 'Erro desconhecido'))
      }

      // Event listeners - configurar ANTES de fazer join
      callFrameRef.current
        .on('loaded', () => {
          console.log('Daily.co iframe carregado')
          // Não definir loading como false aqui, pois ainda não entramos na reunião
        })
        .on('loading', (event: any) => {
          console.log('Daily.co está carregando:', event)
        })
        .on('error', (event: any) => {
          console.error('Erro no Daily.co:', event)
        })
        .on('joined-meeting', (event: any) => {
          console.log('Entrou na reunião:', event)
          console.log('Participantes na reunião:', event.participants)
          console.log('Local participant:', event.participants?.local)
          setIsJoined(true)
          setParticipants(event.participants || {})
          setLoading(false) // Definir loading como false apenas quando entrar na reunião
          
          // Verificar se há outros participantes e garantir que o vídeo está ativo
          if (event.participants) {
            Object.keys(event.participants).forEach((participantId) => {
              const participant = event.participants[participantId]
              if (!participant.local && participant.video === false) {
                console.warn('Participante sem vídeo detectado:', participant)
              }
            })
          }
        })
        .on('participant-joined', (event: any) => {
          console.log('Participante entrou:', event)
          console.log('Participante detalhes:', {
            user_id: event.participant?.user_id,
            user_name: event.participant?.user_name,
            video: event.participant?.video,
            audio: event.participant?.audio,
            local: event.participant?.local,
          })
          setParticipants((prev) => ({
            ...prev,
            [event.participant.user_id]: event.participant,
          }))
        })
        .on('participant-left', (event: any) => {
          console.log('Participante saiu:', event)
          setParticipants((prev) => {
            const updated = { ...prev }
            delete updated[event.participant.user_id]
            return updated
          })
        })
        .on('error', (err: any) => {
          console.error('Erro no Daily.co:', err)
          
          // Tratar erros específicos do Daily.co
          let errorMessage = 'Erro na videoconferência'
          if (err.errorMsg === 'account-missing-payment-method') {
            errorMessage = 'A conta Daily.co precisa de um método de pagamento configurado. Entre em contato com o administrador.'
          } else if (err.errorMsg === 'Load failed') {
            errorMessage = 'Não foi possível carregar a videoconferência. Verifique sua conexão e tente novamente.'
          } else if (err.errorMsg) {
            errorMessage = 'Erro na videoconferência: ' + err.errorMsg
          } else if (err.message) {
            errorMessage = 'Erro na videoconferência: ' + err.message
          }
          
          setError(errorMessage)
          setLoading(false)
        })
        .on('left-meeting', () => {
          console.log('Saiu da reunião')
          setIsJoined(false)
          onClose()
        })

      // Verificar se a instância foi criada antes de fazer join
      if (!callFrameRef.current) {
        throw new Error('Falha ao criar instância do Daily.co')
      }

      // Aguardar mais tempo para garantir que o iframe foi totalmente criado e renderizado
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Verificar novamente se a instância ainda existe
      if (!callFrameRef.current) {
        throw new Error('Instância do Daily.co foi perdida antes do join')
      }

      // Verificar se o método join existe
      if (typeof callFrameRef.current.join !== 'function') {
        throw new Error('Método join não está disponível no Daily.co')
      }

      // Verificar se já está na reunião (pode ter entrado automaticamente)
      let state = 'not-loaded'
      try {
        if (typeof callFrameRef.current.meetingState === 'function') {
          state = callFrameRef.current.meetingState()
          console.log('Estado atual da reunião:', state)
        }
      } catch (e) {
        console.warn('Não foi possível verificar o estado da reunião:', e)
      }

      if (state === 'joined-meeting') {
        console.log('Já está na reunião, pulando join')
        setIsJoined(true)
        setLoading(false)
        return
      }

      // Entrar na sala com token
      // Usar apenas a URL da sala, o token será usado automaticamente
      console.log('Tentando entrar na sala:', roomUrl)
      console.log('Token disponível:', token ? 'Sim' : 'Não')
      
      try {
        // O método join() do Daily.co aceita apenas url e token (e opcionalmente userName)
        // As outras propriedades devem ser configuradas via setLocalVideo/setLocalAudio após o join
        await callFrameRef.current.join({
          url: roomUrl,
          token: token,
          userName: nomeUsuario,
        })
        console.log('Join realizado com sucesso')
        
        // Garantir que o vídeo e áudio local estão ativos após o join
        if (callFrameRef.current && typeof callFrameRef.current.setLocalVideo === 'function') {
          try {
            await callFrameRef.current.setLocalVideo(true)
            console.log('Vídeo local ativado')
          } catch (e) {
            console.warn('Erro ao ativar vídeo local:', e)
          }
        }
        
        if (callFrameRef.current && typeof callFrameRef.current.setLocalAudio === 'function') {
          try {
            await callFrameRef.current.setLocalAudio(true)
            console.log('Áudio local ativado')
          } catch (e) {
            console.warn('Erro ao ativar áudio local:', e)
          }
        }
      } catch (joinError: any) {
        console.error('Erro ao fazer join:', joinError)
        // Se o erro for sobre load failed, pode ser problema com URL ou token
        if (joinError.message?.includes('Load failed') || joinError.errorMsg === 'Load failed') {
          throw new Error('Não foi possível carregar a videoconferência. Verifique se a sala existe e o token é válido.')
        }
        throw joinError
      }
    } catch (err: any) {
      console.error('Erro ao inicializar Daily.co:', err)
      
      // Limpar instância se houver erro
      if (callFrameRef.current) {
        try {
          callFrameRef.current.destroy()
        } catch (e) {
          // Ignorar erro ao destruir
        }
        dailyManager.unregisterInstance(callFrameRef.current)
        callFrameRef.current = null
      }
      
      // Limpar container
      if (dailyContainerRef.current) {
        dailyContainerRef.current.innerHTML = ''
      }
      
      setError('Erro ao inicializar videoconferência: ' + (err.message || 'Erro desconhecido'))
      setLoading(false)
    } finally {
      // Sempre liberar a flag, mesmo em caso de erro
      isInitializingRef.current = false
      dailyManager.setCreating(false)
    }
  }

  const toggleMute = () => {
    if (callFrameRef.current && typeof callFrameRef.current.setLocalAudio === 'function') {
      try {
        const muted = callFrameRef.current.localAudio()
        callFrameRef.current.setLocalAudio(!muted)
        setIsMuted(!muted)
      } catch (e) {
        console.error('Erro ao alternar áudio:', e)
      }
    }
  }

  const toggleVideo = () => {
    if (callFrameRef.current && typeof callFrameRef.current.setLocalVideo === 'function') {
      try {
        const videoOff = callFrameRef.current.localVideo()
        callFrameRef.current.setLocalVideo(!videoOff)
        setIsVideoOff(!videoOff)
      } catch (e) {
        console.error('Erro ao alternar vídeo:', e)
      }
    }
  }

  const leaveMeeting = () => {
    if (callFrameRef.current && typeof callFrameRef.current.leave === 'function') {
      try {
        callFrameRef.current.leave()
      } catch (e) {
        console.error('Erro ao sair da chamada:', e)
      }
    }
    onClose()
  }

  const handleSaveAnamnese = async () => {
    if (!consultaId) return

    setSavingAnamnese(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/consultas/${consultaId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(anamnese),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao salvar anamnese')
      }

      toast.success('Anamnese salva com sucesso!')
    } catch (err: any) {
      console.error('Erro ao salvar anamnese:', err)
      toast.error(err.message || 'Erro ao salvar anamnese')
    } finally {
      setSavingAnamnese(false)
    }
  }

  const handleSavePrescricao = async () => {
    if (!consultaId) return

    setSavingPrescricao(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/consultas/${consultaId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prescricao }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao salvar prescrição')
      }

      toast.success('Prescrição salva com sucesso!')
    } catch (err: any) {
      console.error('Erro ao salvar prescrição:', err)
      toast.error(err.message || 'Erro ao salvar prescrição')
    } finally {
      setSavingPrescricao(false)
    }
  }

  const handleSaveExames = async () => {
    if (!consultaId || !consultaData || examesSelecionados.length === 0) {
      toast.error('Selecione pelo menos um exame')
      return
    }

    setSavingExames(true)
    try {
      const token = localStorage.getItem('token')
      const medicoId = consultaData.medico_id || consultaData.medico?.id
      const pacienteId = consultaData.paciente_id || consultaData.paciente?.id

      if (!medicoId || !pacienteId) {
        throw new Error('Dados da consulta incompletos')
      }

      // Criar requisições de exames
      const promises = examesSelecionados.map(exameId =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            consulta_id: consultaId,
            paciente_id: pacienteId,
            exame_id: exameId,
            medico_solicitante_id: medicoId,
            data_solicitacao: new Date().toISOString().split('T')[0],
            observacoes: observacoesExames,
            urgente: urgenteExames,
          }),
        })
      )

      const responses = await Promise.all(promises)
      const errors = responses.filter(r => !r.ok)

      if (errors.length > 0) {
        throw new Error('Erro ao criar algumas requisições de exames')
      }

      toast.success(`${examesSelecionados.length} requisição(ões) de exame(s) criada(s) com sucesso!`)
      setExamesSelecionados([])
      setObservacoesExames('')
      setUrgenteExames(false)
    } catch (err: any) {
      console.error('Erro ao salvar exames:', err)
      toast.error(err.message || 'Erro ao criar requisições de exames')
    } finally {
      setSavingExames(false)
    }
  }

  const toggleExameSelection = (exameId: number) => {
    setExamesSelecionados(prev =>
      prev.includes(exameId)
        ? prev.filter(id => id !== exameId)
        : [...prev, exameId]
    )
  }

  if (!isOpen) return null

  const participantCount = Object.keys(participants).length + (isJoined ? 1 : 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" style={{ pointerEvents: 'auto' }}>
      <div className="relative w-full h-full flex flex-col" style={{ pointerEvents: 'auto', overflow: 'hidden' }}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent px-4 py-3 flex items-center justify-between pointer-events-auto" style={{ zIndex: 100, height: '60px' }}>
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-white" />
            <h2 className="text-white font-semibold">Videoconferência - {nomeUsuario}</h2>
            {isMedico && (
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-semibold">
                Anfitrião
              </span>
            )}
            {isJoined && (
              <div className="flex items-center gap-2 text-white text-sm">
                <Users className="w-4 h-4" />
                <span>{participantCount} {participantCount === 1 ? 'participante' : 'participantes'}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Botão de Painel de Consulta (apenas para médico) */}
            {isMedico && isJoined && (
              <button
                onClick={() => setShowPanel(!showPanel)}
                className="px-3 py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white pointer-events-auto cursor-pointer flex items-center gap-2 font-medium shadow-lg"
                title={showPanel ? 'Ocultar Painel' : 'Mostrar Painel de Consulta'}
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm">Consulta</span>
              </button>
            )}
            {/* Controles de áudio/vídeo */}
            {isJoined && (
              <>
                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-lg transition-colors pointer-events-auto cursor-pointer ${
                    isMuted
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  title={isMuted ? 'Ativar microfone' : 'Desativar microfone'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-lg transition-colors pointer-events-auto cursor-pointer ${
                    isVideoOff
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  title={isVideoOff ? 'Ativar câmera' : 'Desativar câmera'}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                </button>
              </>
            )}
            {/* Botão de Terminar Reunião (mais visível quando conectado) */}
            {isJoined && (
              <button
                onClick={leaveMeeting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors pointer-events-auto cursor-pointer font-semibold flex items-center gap-2"
                title="Terminar Reunião"
              >
                <X className="w-4 h-4" />
                <span>Sair</span>
              </button>
            )}
            {/* Botão X simples quando não está conectado */}
            {!isJoined && (
              <button
                onClick={leaveMeeting}
                className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-lg pointer-events-auto cursor-pointer"
                title="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20" style={{ marginTop: '60px', height: 'calc(100% - 60px)' }}>
            <div className="text-white text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
              <p className="text-lg">Carregando videoconferência...</p>
              <p className="text-sm text-gray-400 mt-2">
                Conectando à sala Daily.co...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
            <div className="text-white text-center max-w-md px-4">
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-6">
                <p className="text-lg font-semibold mb-2">Erro ao carregar videoconferência</p>
                <p className="text-sm text-gray-300 mb-4">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setError(null)
                      setLoading(true)
                      // Recarregar
                      window.location.reload()
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Tentar Novamente
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily.co Container */}
        <div className="flex-1 w-full relative flex" style={{ marginTop: '60px', height: 'calc(100% - 60px)', zIndex: 1 }}>
          <div 
            ref={dailyContainerRef} 
            className={`flex-1 relative transition-all duration-300 ${showPanel && isMedico ? '' : ''}`}
            style={{ 
              width: showPanel && isMedico ? 'calc(100% - 600px)' : '100%', 
              maxWidth: showPanel && isMedico ? 'calc(100% - 600px)' : '100%',
              height: '100%', 
              zIndex: 1, 
              pointerEvents: 'auto', 
              position: 'relative' 
            }}
          />
          
          {/* Painel de Anamnese (apenas para médico) */}
          {isMedico && isJoined && (
            <div
              className={`absolute top-0 right-0 h-full bg-white shadow-2xl transition-transform duration-300 z-20 ${
                showPanel ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{ width: '600px' }}
            >
              <div className="h-full flex flex-col">
                {/* Header do painel */}
                <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Consulta</h3>
                      <p className="text-sm text-gray-600">Preencha durante a consulta</p>
                    </div>
                    <button
                      onClick={() => setShowPanel(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Abas */}
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('anamnese')}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'anamnese'
                          ? 'text-green-600 border-b-2 border-green-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      Anamnese
                    </button>
                    <button
                      onClick={() => setActiveTab('prescricao')}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'prescricao'
                          ? 'text-green-600 border-b-2 border-green-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Pill className="w-4 h-4 inline mr-2" />
                      Prescrição
                    </button>
                    <button
                      onClick={() => setActiveTab('exames')}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'exames'
                          ? 'text-green-600 border-b-2 border-green-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <ClipboardList className="w-4 h-4 inline mr-2" />
                      Exames
                    </button>
                  </div>
                </div>

                {/* Conteúdo das abas */}
                <div className="flex-1 overflow-y-auto">
                  {/* Aba Anamnese */}
                  {activeTab === 'anamnese' && consultaData && (
                    <AnamneseForm
                      consulta={consultaData}
                      inline={true}
                      onClose={() => {}}
                      onSuccess={() => {
                        // Recarregar dados da consulta
                        const loadConsulta = async () => {
                          try {
                            const token = localStorage.getItem('token')
                            const response = await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/consultas/${consultaId}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            )
                            if (response.ok) {
                              const data = await response.json()
                              setConsultaData(data)
                            }
                          } catch (err) {
                            console.error('Erro ao recarregar consulta:', err)
                          }
                        }
                        loadConsulta()
                      }}
                    />
                  )}

                  {/* Aba Prescrição */}
                  {activeTab === 'prescricao' && consultaData && (
                    <PrescricaoForm
                      consulta={consultaData}
                      inline={true}
                      onClose={() => {}}
                      onSuccess={() => {
                        // Recarregar dados da consulta
                        const loadConsulta = async () => {
                          try {
                            const token = localStorage.getItem('token')
                            const response = await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/consultas/${consultaId}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            )
                            if (response.ok) {
                              const data = await response.json()
                              setConsultaData(data)
                            }
                          } catch (err) {
                            console.error('Erro ao recarregar consulta:', err)
                          }
                        }
                        loadConsulta()
                      }}
                    />
                  )}

                  {/* Aba Exames */}
                  {activeTab === 'exames' && consultaData && (
                    <SolicitarExameModal
                      consulta={{
                        ...consultaData,
                        id: consultaData.id || consultaId, // Garantir que o id existe
                        paciente_id: consultaData.paciente_id || consultaData.paciente?.id,
                        medico_id: consultaData.medico_id || consultaData.medico?.id,
                      }}
                      inline={true}
                      onClose={() => {}}
                      onSuccess={() => {
                        // Recarregar dados da consulta
                        const loadConsulta = async () => {
                          try {
                            const token = localStorage.getItem('token')
                            const response = await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/consultas/${consultaId}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            )
                            if (response.ok) {
                              const data = await response.json()
                              setConsultaData(data)
                            }
                          } catch (err) {
                            console.error('Erro ao recarregar consulta:', err)
                          }
                        }
                        loadConsulta()
                      }}
                    />
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

