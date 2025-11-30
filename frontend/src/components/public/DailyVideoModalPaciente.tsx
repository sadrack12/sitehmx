'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Loader2, Video, Users, Mic, MicOff, VideoIcon, VideoOff } from 'lucide-react'
import { dailyManager } from '@/utils/dailyManager'

interface DailyVideoModalPacienteProps {
  isOpen: boolean
  onClose: () => void
  consultaId: number
  nomeUsuario: string
  roomUrl: string
  token: string
}

export default function DailyVideoModalPaciente({
  isOpen,
  onClose,
  consultaId,
  nomeUsuario,
  roomUrl,
  token,
}: DailyVideoModalPacienteProps) {
  const dailyContainerRef = useRef<HTMLDivElement>(null)
  const callFrameRef = useRef<any>(null)
  const isInitializingRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  useEffect(() => {
    if (!isOpen || !consultaId || !roomUrl || !token) {
      console.log('Aguardando dados para inicializar:', { isOpen, consultaId, hasRoomUrl: !!roomUrl, hasToken: !!token })
      return
    }

    console.log('Iniciando Daily.co para paciente:', { consultaId, roomUrl, hasToken: !!token, tokenLength: token?.length })

    let isMounted = true // Flag para verificar se o componente ainda está montado

    const initializeDaily = async () => {
      console.log('initializeDaily chamado')
      
      if (isInitializingRef.current) {
        console.warn('Inicialização já em andamento, ignorando...')
        return
      }
      
      console.log('Verificando suporte ao WebRTC...')
      
      // Verificar suporte ao WebRTC antes de continuar
      // Nota: getUserMedia pode não estar disponível imediatamente, mas o Daily.co pode solicitar permissões depois
      if (typeof window !== 'undefined') {
        const hasWebRTC = !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection || (window as any).mozRTCPeerConnection)
        const hasGetUserMedia = !!(navigator.mediaDevices?.getUserMedia || (navigator as any).getUserMedia || (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia)
        
        console.log('Resultado verificação WebRTC:', { hasWebRTC, hasGetUserMedia })
        
        // Apenas verificar WebRTC básico - getUserMedia pode não estar disponível até solicitar permissão
        if (!hasWebRTC) {
          console.error('WebRTC não suportado!', { hasWebRTC, hasGetUserMedia })
          const errorMsg = 'Seu navegador não suporta videoconferência (WebRTC). Por favor, use um navegador moderno como Chrome, Firefox, Safari ou Edge.'
          setError(errorMsg)
          setLoading(false)
          isInitializingRef.current = false
          return
        }
        
        // Avisar se getUserMedia não está disponível, mas continuar (Daily.co pode solicitar depois)
        if (!hasGetUserMedia) {
          console.warn('getUserMedia não detectado imediatamente, mas continuando. O Daily.co solicitará permissões quando necessário.')
        }
        
        // Verificar se está em HTTPS ou localhost (WebRTC requer HTTPS em produção)
        const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.') || window.location.hostname.startsWith('172.') || window.location.hostname.startsWith('10.')
        console.log('Verificação de segurança:', { protocol: window.location.protocol, hostname: window.location.hostname, isSecure })
        if (!isSecure) {
          console.warn('WebRTC pode não funcionar em HTTP. Recomendado usar HTTPS ou acessar via localhost/IP local.')
        }
      } else {
        console.warn('window não está definido')
      }
      
      console.log('Verificação de WebRTC concluída, continuando...')
      
      console.log('Verificando se outra instância está sendo criada...')
      
      if (dailyManager.isCreating()) {
        console.warn('Outra instância está sendo criada, aguardando...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        if (dailyManager.isCreating()) {
          throw new Error('Outra instância do Daily.co está sendo criada. Aguarde e tente novamente.')
        }
      }
      
      console.log('Marcando inicialização como em andamento...')
      isInitializingRef.current = true
      dailyManager.setCreating(true)
      
      // Destruir qualquer instância ativa ANTES de começar
      try {
        console.log('Destruindo instâncias ativas do Daily.co...')
        await dailyManager.destroyActiveInstance()
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Instâncias ativas destruídas')
      } catch (e) {
        console.warn('Erro ao destruir instâncias ativas:', e)
      }
      
      try {
        console.log('Iniciando processo de inicialização...')
        setLoading(true)
        setError(null)

        // Verificar se ainda está montado
        if (!isMounted) {
          console.warn('Componente desmontado durante inicialização')
          return
        }

        // Destruir qualquer instância anterior
        if (callFrameRef.current) {
          try {
            console.log('Destruindo instância anterior do Daily.co...')
            callFrameRef.current.destroy()
            // Aguardar mais tempo para garantir que o Daily.co limpou tudo internamente
            await new Promise(resolve => setTimeout(resolve, 1000))
          } catch (e) {
            console.warn('Erro ao destruir instância anterior:', e)
          }
          callFrameRef.current = null
        }

        // Limpar container completamente
        if (dailyContainerRef.current) {
          // Remover todos os iframes do container
          const iframes = dailyContainerRef.current.querySelectorAll('iframe')
          iframes.forEach(iframe => {
            try {
              iframe.remove()
            } catch (e) {
              console.warn('Erro ao remover iframe:', e)
            }
          })
          dailyContainerRef.current.innerHTML = ''
          // Forçar reflow
          void dailyContainerRef.current.offsetHeight
        }

        // Aguardar mais tempo após limpar para garantir que não há referências residuais
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Verificar novamente se ainda está montado
        if (!isMounted) {
          console.warn('Componente desmontado após limpeza')
          return
        }
        
        // Verificar se o container ainda existe após a limpeza
        if (!dailyContainerRef.current) {
          console.error('Container foi removido após limpeza')
          throw new Error('Container não está disponível após limpeza')
        }
        
        // Garantir que o container está conectado ao DOM
        if (!dailyContainerRef.current.isConnected) {
          console.error('Container não está conectado ao DOM')
          throw new Error('Container não está conectado ao DOM')
        }

        if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
          throw new Error('Container do Daily.co não está disponível')
        }

        // Importar Daily.co
        await new Promise(resolve => setTimeout(resolve, 300))
        const DailyModule = await import('@daily-co/daily-js')
        
        let DailyIframe: any = null
        if (DailyModule.default && typeof DailyModule.default.createFrame === 'function') {
          DailyIframe = DailyModule.default
        } else if (typeof DailyModule.createFrame === 'function') {
          DailyIframe = DailyModule
        } else if (DailyModule.DailyIframe && typeof DailyModule.DailyIframe.createFrame === 'function') {
          DailyIframe = DailyModule.DailyIframe
        } else {
          throw new Error('Daily.co não foi carregado corretamente')
        }

        // Verificar se há método para destruir todas as instâncias
        // O Daily.co mantém uma referência global, então precisamos garantir que não há instâncias ativas
        if (typeof DailyIframe.destroyAll === 'function') {
          try {
            console.log('Destruindo todas as instâncias do Daily.co...')
            DailyIframe.destroyAll()
            await new Promise(resolve => setTimeout(resolve, 500))
          } catch (e) {
            console.warn('Erro ao destruir todas as instâncias:', e)
          }
        }

        // Tentar acessar instâncias globais se existirem
        if ((window as any).DailyIframe) {
          try {
            const globalInstances = (window as any).DailyIframe._instances || []
            console.log('Instâncias globais encontradas:', globalInstances.length)
            for (const instance of globalInstances) {
              try {
                if (instance && typeof instance.destroy === 'function') {
                  instance.destroy()
                }
              } catch (e) {
                console.warn('Erro ao destruir instância global:', e)
              }
            }
            await new Promise(resolve => setTimeout(resolve, 500))
          } catch (e) {
            console.warn('Erro ao acessar instâncias globais:', e)
          }
        }

        if (typeof DailyIframe.load === 'function') {
          try {
            await DailyIframe.load()
          } catch (e) {
            console.warn('Erro ao pré-carregar Daily.co:', e)
          }
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        // Verificar se o container ainda existe e está no DOM
        if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
          throw new Error('Container do Daily.co não está disponível para criar o frame')
        }

        // Verificar dimensões do container
        const rect = dailyContainerRef.current.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) {
          console.warn('Container tem dimensões zero, aguardando...')
          await new Promise(resolve => setTimeout(resolve, 300))
          const newRect = dailyContainerRef.current.getBoundingClientRect()
          if (newRect.width === 0 || newRect.height === 0) {
            throw new Error('Container do Daily.co não tem dimensões válidas')
          }
        }

        // Criar frame
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

        // Verificar novamente se não há instância existente antes de criar
        if (callFrameRef.current) {
          console.warn('Ainda há uma instância existente, destruindo antes de criar nova...')
          try {
            callFrameRef.current.destroy()
            await new Promise(resolve => setTimeout(resolve, 500))
          } catch (e) {
            console.warn('Erro ao destruir instância antes de criar:', e)
          }
          callFrameRef.current = null
        }

        // Verificar se o container ainda está disponível
        if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
          throw new Error('Container não está disponível para criar o frame')
        }

        // Limpar container uma última vez antes de criar
        if (dailyContainerRef.current) {
          dailyContainerRef.current.innerHTML = ''
          void dailyContainerRef.current.offsetHeight // Forçar reflow
        }

        await new Promise(resolve => setTimeout(resolve, 300))

        // Verificar se há instâncias ativas antes de criar
        // O Daily.co pode ter uma referência global que precisamos limpar
        let attempts = 0
        const maxAttempts = 3
        
        while (attempts < maxAttempts) {
          try {
            // Tentar acessar e destruir qualquer instância global existente
            if ((window as any).DailyIframe) {
              try {
                // Tentar acessar a lista de instâncias
                const dailyGlobal = (window as any).DailyIframe
                if (dailyGlobal._instances && Array.isArray(dailyGlobal._instances)) {
                  console.log(`Encontradas ${dailyGlobal._instances.length} instâncias globais, destruindo...`)
                  for (const instance of dailyGlobal._instances) {
                    try {
                      if (instance && typeof instance.destroy === 'function') {
                        instance.destroy()
                      }
                    } catch (e) {
                      // Ignorar erros individuais
                    }
                  }
                  // Limpar o array
                  dailyGlobal._instances = []
                }
              } catch (e) {
                console.warn('Não foi possível acessar instâncias globais:', e)
              }
            }
            
            // Aguardar um pouco após limpeza
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Verificar se o container ainda está disponível
            if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
              throw new Error('Container não está disponível')
            }
            
            // Limpar container uma última vez
            if (dailyContainerRef.current) {
              const iframes = dailyContainerRef.current.querySelectorAll('iframe')
              iframes.forEach(iframe => iframe.remove())
              dailyContainerRef.current.innerHTML = ''
            }
            
            await new Promise(resolve => setTimeout(resolve, 300))
            
            // Verificar uma última vez se há instâncias globais antes de criar
            if ((window as any).DailyIframe) {
              const dailyGlobal = (window as any).DailyIframe
              if (dailyGlobal._instances && Array.isArray(dailyGlobal._instances) && dailyGlobal._instances.length > 0) {
                console.warn(`Ainda há ${dailyGlobal._instances.length} instâncias globais antes da tentativa ${attempts + 1}`)
                // Tentar destruir novamente
                for (const instance of [...dailyGlobal._instances]) {
                  try {
                    if (instance && typeof instance.destroy === 'function') {
                      instance.destroy()
                    }
                  } catch (e) {
                    // Ignorar
                  }
                }
                dailyGlobal._instances = []
                await new Promise(resolve => setTimeout(resolve, 800))
              }
            }
            
            console.log(`Tentativa ${attempts + 1} de criar instância do Daily.co...`)
            
            // Verificar se o container ainda existe e está conectado
            if (!dailyContainerRef.current) {
              throw new Error('Container não está disponível (null)')
            }
            
            if (!dailyContainerRef.current.isConnected) {
              throw new Error('Container não está conectado ao DOM')
            }
            
            // Verificar dimensões do container
            const rect = dailyContainerRef.current.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) {
              console.warn('Container tem dimensões zero, aguardando...')
              await new Promise(resolve => setTimeout(resolve, 500))
              // Verificar novamente
              const rect2 = dailyContainerRef.current.getBoundingClientRect()
              if (rect2.width === 0 || rect2.height === 0) {
                throw new Error('Container não está visível (dimensões zero)')
              }
            }
            
            // Garantir que o container está vazio
            if (dailyContainerRef.current.innerHTML.trim() !== '') {
              console.warn('Container não está vazio, limpando...')
              dailyContainerRef.current.innerHTML = ''
              await new Promise(resolve => setTimeout(resolve, 300))
            }
            
            // Aguardar um pouco para garantir que o DOM está estável
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
            
            try {
              // Verificar novamente se o container ainda está disponível
              if (!dailyContainerRef.current || !dailyContainerRef.current.isConnected) {
                throw new Error('Container foi removido antes de criar o frame')
              }
              
              // Tentar criar o frame normalmente
              callFrameRef.current = DailyIframe.createFrame(
                dailyContainerRef.current,
                frameOptions
              )
              
              if (callFrameRef.current) {
                console.log('Frame criado com sucesso na tentativa', attempts + 1)
                // Registrar a instância no gerenciador
                dailyManager.registerInstance(callFrameRef.current)
                break // Sucesso, sair do loop
              } else {
                throw new Error('createFrame retornou null')
              }
            } catch (frameError: any) {
              // Se o erro for sobre WebRTC, pode ser que o navegador esteja bloqueando
              // Mas vamos tentar continuar mesmo assim, pois pode funcionar
              if (frameError.message && (frameError.message.includes('WebRTC') || frameError.message.includes('suppressed'))) {
                console.warn('Erro de WebRTC detectado ao criar frame, mas tentando continuar...')
                
                // Se for a primeira tentativa e o erro for de WebRTC, tentar novamente
                // pois pode ser um problema temporário ou de permissões
                if (attempts < 1) {
                  console.log('Primeira tentativa com erro de WebRTC, tentando novamente...')
                  attempts++
                  await new Promise(resolve => setTimeout(resolve, 2000))
                  // Continuar o loop para tentar novamente
                  continue
                }
              }
              
              // Se não foi criado, lançar o erro para ser tratado abaixo
              throw frameError
            }
          } catch (createError: any) {
            attempts++
            console.error(`Erro na tentativa ${attempts}:`, createError.message)
            
            if (createError.message && createError.message.includes('Duplicate')) {
              if (attempts < maxAttempts) {
                console.warn(`Instância duplicada detectada, tentando novamente (${attempts}/${maxAttempts})...`)
                
                // Limpar mais agressivamente
                if (dailyContainerRef.current) {
                  const parent = dailyContainerRef.current.parentElement
                  if (parent) {
                    const newContainer = document.createElement('div')
                    newContainer.className = dailyContainerRef.current.className
                    newContainer.style.cssText = dailyContainerRef.current.style.cssText
                    newContainer.setAttribute('ref', 'dailyContainerRef')
                    parent.replaceChild(newContainer, dailyContainerRef.current)
                    dailyContainerRef.current = newContainer
                  }
                }
                
                // Aguardar mais tempo antes de tentar novamente
                await new Promise(resolve => setTimeout(resolve, 1500 * attempts))
              } else {
                const errorMsg = 'Não foi possível criar a videoconferência. Isso pode acontecer se:\n' +
                  '1. Há outra videoconferência aberta (feche todas as outras antes de abrir esta)\n' +
                  '2. A página precisa ser recarregada\n' +
                  '3. Há um problema com a conexão\n\n' +
                  'Por favor, feche todas as outras videoconferências e tente novamente.'
                setError(errorMsg)
                throw new Error(errorMsg)
              }
            } else if (createError.message && (createError.message.includes('WebRTC') || createError.message.includes('not supported') || createError.message.includes('suppressed'))) {
              // Erro específico de WebRTC - pode ser bloqueado pelo navegador em HTTP
              console.error('Erro de WebRTC do Daily.co:', createError)
              
              // Tentar continuar mesmo com o erro - pode ser um falso positivo
              // O Daily.co pode funcionar mesmo se houver esse erro inicial
              console.warn('Erro de WebRTC detectado, mas tentando continuar...')
              
              // Aguardar um pouco e verificar se o frame foi criado mesmo assim
              await new Promise(resolve => setTimeout(resolve, 1000))
              
              if (callFrameRef.current) {
                console.log('Frame foi criado mesmo com erro de WebRTC, continuando...')
                // Continuar normalmente
              } else {
                // Se realmente não foi criado, mostrar erro
                const currentUrl = window.location.href
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                const isHttps = window.location.protocol === 'https:'
                const isLocalIp = /^(192\.|172\.|10\.)/.test(window.location.hostname)
                
                let errorMsg = 'O navegador está bloqueando o acesso à câmera/microfone porque o WebRTC requer HTTPS ou localhost.\n\n'
                
                if (!isHttps && !isLocalhost) {
                  errorMsg += 'Soluções:\n\n' +
                    '1. Use HTTPS: Acesse via https://' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '\n' +
                    '2. Use localhost: Acesse via http://localhost:' + (window.location.port || '3000') + '\n' +
                    '3. Configure HTTPS no servidor (recomendado para produção)\n\n' +
                    'Nota: Navegadores modernos bloqueiam WebRTC em HTTP para IPs locais por segurança.'
                } else {
                  errorMsg += 'Por favor:\n\n' +
                    '1. Permita o acesso à câmera e microfone nas configurações do navegador\n' +
                    '2. Recarregue a página e tente novamente\n' +
                    '3. Verifique se o site está acessível via HTTPS'
                }
                
                setError(errorMsg)
                setLoading(false)
                throw new Error(errorMsg)
              }
            } else {
              // Se não for erro de duplicata, lançar imediatamente
              throw new Error('Erro ao criar frame do Daily.co: ' + (createError.message || 'Erro desconhecido'))
            }
          }
        }
        
        if (!callFrameRef.current) {
          throw new Error('Falha ao criar frame do Daily.co após todas as tentativas')
        }

        // Verificar se o frame foi criado com sucesso
        if (!callFrameRef.current) {
          throw new Error('Falha ao criar frame do Daily.co - retornou null')
        }

        // Aguardar um pouco para garantir que o frame foi inicializado internamente
        await new Promise(resolve => setTimeout(resolve, 500))

        // Verificar se ainda está montado
        if (!isMounted) {
          console.warn('Componente desmontado após criar frame')
          if (callFrameRef.current) {
            try {
              callFrameRef.current.destroy()
            } catch (e) {
              // Ignorar erro
            }
            callFrameRef.current = null
          }
          return
        }

        // Verificar novamente se o frame ainda existe após o delay
        // Se foi destruído, tentar recriar uma vez
        if (!callFrameRef.current) {
          console.warn('Frame foi destruído após criação, tentando recriar...')
          
          // Verificar se ainda está montado antes de recriar
          if (!isMounted) {
            console.warn('Componente desmontado, não recriando frame')
            return
          }
          
          // Limpar container novamente
          if (dailyContainerRef.current && dailyContainerRef.current.isConnected) {
            dailyContainerRef.current.innerHTML = ''
            await new Promise(resolve => setTimeout(resolve, 300))
          }
          
          // Verificar novamente se ainda está montado
          if (!isMounted) {
            return
          }
          
          // Tentar recriar o frame
          try {
            if (dailyContainerRef.current && dailyContainerRef.current.isConnected) {
              callFrameRef.current = DailyIframe.createFrame(
                dailyContainerRef.current,
                frameOptions
              )
              
              if (!callFrameRef.current) {
                throw new Error('Falha ao recriar frame do Daily.co')
              }
              
              await new Promise(resolve => setTimeout(resolve, 500))
              
              // Verificar se ainda está montado
              if (!isMounted) {
                if (callFrameRef.current) {
                  try {
                    callFrameRef.current.destroy()
                  } catch (e) {
                    // Ignorar erro
                  }
                  callFrameRef.current = null
                }
                return
              }
              
              if (!callFrameRef.current) {
                throw new Error('Frame do Daily.co foi destruído novamente após recriação')
              }
            } else {
              throw new Error('Container não está disponível para recriar o frame')
            }
          } catch (recreateError: any) {
            console.error('Erro ao recriar frame:', recreateError)
            throw new Error('Não foi possível criar o frame do Daily.co após múltiplas tentativas')
          }
        }

        // Verificar novamente antes de configurar event listeners
        if (!callFrameRef.current) {
          throw new Error('Frame do Daily.co não está disponível para configurar event listeners')
        }

        // Verificar se o método on existe
        if (typeof callFrameRef.current.on !== 'function') {
          throw new Error('Método on não está disponível no Daily.co')
        }

        // Event listeners
        callFrameRef.current
          .on('loaded', () => {
            console.log('Daily.co iframe carregado')
          })
          .on('joined-meeting', (event: any) => {
            console.log('Entrou na reunião:', event)
            setIsJoined(true)
            setParticipants(Array.isArray(event.participants) ? event.participants : [])
            setLoading(false)
          })
          .on('participant-joined', (event: any) => {
            console.log('Participante entrou:', event)
            setParticipants((prev) => {
              const currentParticipants = Array.isArray(prev) ? prev : []
              return [...currentParticipants, event.participant]
            })
          })
          .on('participant-left', (event: any) => {
            console.log('Participante saiu:', event)
            setParticipants((prev) => {
              const currentParticipants = Array.isArray(prev) ? prev : []
              return currentParticipants.filter((p) => p.user_id !== event.participant.user_id)
            })
          })
          .on('error', (err: any) => {
            console.error('Erro no Daily.co:', err)
            let errorMessage = 'Erro na videoconferência'
            if (err.errorMsg === 'account-missing-payment-method') {
              errorMessage = 'A conta Daily.co precisa de um método de pagamento configurado.'
            } else if (err.errorMsg === 'Load failed') {
              errorMessage = 'Não foi possível carregar a videoconferência. Verifique sua conexão.'
            } else if (err.errorMsg) {
              errorMessage = 'Erro na videoconferência: ' + err.errorMsg
            }
            setError(errorMessage)
            setLoading(false)
          })
          .on('left-meeting', () => {
            console.log('Saiu da reunião')
            setIsJoined(false)
            onClose()
          })

        // Verificar novamente antes de fazer join
        if (!callFrameRef.current) {
          throw new Error('Frame do Daily.co foi perdido antes do join')
        }

        // Verificar se o método join existe
        if (typeof callFrameRef.current.join !== 'function') {
          throw new Error('Método join não está disponível no Daily.co')
        }

        // Fazer join
        await new Promise(resolve => setTimeout(resolve, 500))
        
        console.log('Tentando fazer join:', { 
          hasFrame: !!callFrameRef.current, 
          roomUrl, 
          hasToken: !!token,
          tokenLength: token?.length,
          userName: nomeUsuario 
        })
        
        // Verificar se roomUrl e token estão válidos
        if (!roomUrl || !token) {
          throw new Error('URL da sala ou token não fornecidos')
        }
        
        // O método join() do Daily.co aceita apenas url, token e opcionalmente userName
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
            console.log('Vídeo local ativado (paciente)')
          } catch (e) {
            console.warn('Erro ao ativar vídeo local (paciente):', e)
          }
        }
        
        if (callFrameRef.current && typeof callFrameRef.current.setLocalAudio === 'function') {
          try {
            await callFrameRef.current.setLocalAudio(true)
            console.log('Áudio local ativado (paciente)')
          } catch (e) {
            console.warn('Erro ao ativar áudio local (paciente):', e)
          }
        }
      } catch (err: any) {
        console.error('Erro ao inicializar Daily.co:', err)
        console.error('Detalhes do erro:', {
          message: err.message,
          stack: err.stack,
          roomUrl,
          hasToken: !!token,
          consultaId,
        })
        
        let errorMessage = 'Erro ao inicializar videoconferência: ' + (err.message || 'Erro desconhecido')
        
        // Mensagens mais específicas baseadas no tipo de erro
        if (err.message?.includes('WebRTC')) {
          errorMessage = 'Seu navegador não suporta videoconferência. Use Chrome, Firefox, Safari ou Edge.'
        } else if (err.message?.includes('token')) {
          errorMessage = 'Erro ao validar acesso. Verifique se o NIF está correto e tente novamente.'
        } else if (err.message?.includes('sala') || err.message?.includes('room')) {
          errorMessage = 'Erro ao acessar a sala de videoconferência. Tente novamente ou entre em contato com o hospital.'
        } else if (err.message?.includes('Duplicate')) {
          errorMessage = 'Não é possível abrir múltiplas videoconferências ao mesmo tempo.\n\n' +
            'Por favor:\n' +
            '1. Feche todas as outras videoconferências abertas\n' +
            '2. Recarregue a página se necessário\n' +
            '3. Tente novamente'
        }
        
        if (isMounted) {
          setError(errorMessage)
          setLoading(false)
        }
      } finally {
        isInitializingRef.current = false
        dailyManager.setCreating(false)
      }
    }

    // Só inicializar se tiver todos os dados necessários
    if (roomUrl && token) {
      console.log('Chamando initializeDaily com dados completos')
      initializeDaily()
    } else {
      console.warn('Não foi possível inicializar: faltam roomUrl ou token', { roomUrl, hasToken: !!token })
    }

    return () => {
      console.log('Cleanup: desmontando componente Daily.co')
      // Marcar como desmontado
      isMounted = false
      isInitializingRef.current = false
      dailyManager.setCreating(false)
      
      // Limpar container primeiro
      if (dailyContainerRef.current) {
        try {
          // Remover todos os iframes
          const iframes = dailyContainerRef.current.querySelectorAll('iframe')
          iframes.forEach(iframe => {
            try {
              iframe.remove()
            } catch (e) {
              console.warn('Erro ao remover iframe no cleanup:', e)
            }
          })
          dailyContainerRef.current.innerHTML = ''
        } catch (e) {
          console.warn('Erro ao limpar container no cleanup:', e)
        }
      }
      
      // Destruir instância do Daily.co
      if (callFrameRef.current) {
        try {
          callFrameRef.current.destroy()
          // Aguardar um pouco para garantir que o Daily.co limpou tudo
          setTimeout(() => {
            dailyManager.unregisterInstance(callFrameRef.current)
            callFrameRef.current = null
          }, 500)
        } catch (e) {
          console.warn('Erro ao destruir Daily.co no cleanup:', e)
          callFrameRef.current = null
        }
      }
    }
  }, [isOpen, consultaId, roomUrl, token, nomeUsuario, onClose])

  const toggleMute = () => {
    if (callFrameRef.current && typeof callFrameRef.current.setLocalAudio === 'function') {
      try {
        const newMuted = !isMuted
        callFrameRef.current.setLocalAudio(!newMuted)
        setIsMuted(newMuted)
      } catch (e) {
        console.error('Erro ao alternar áudio:', e)
      }
    }
  }

  const toggleVideo = () => {
    if (callFrameRef.current && typeof callFrameRef.current.setLocalVideo === 'function') {
      try {
        const newVideoOff = !isVideoOff
        callFrameRef.current.setLocalVideo(!newVideoOff)
        setIsVideoOff(newVideoOff)
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

  if (!isOpen) return null

  const participantCount = participants.length + (isJoined ? 1 : 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-white" />
            <h2 className="text-white font-semibold">Videoconferência - {nomeUsuario}</h2>
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-semibold">
              Paciente
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white text-sm">
              <Users className="w-4 h-4" />
              <span>{participantCount} participante(s)</span>
            </div>
            <button
              onClick={leaveMeeting}
              className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
              title="Sair"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading/Error */}
        {(loading || error) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
            {loading && (
              <div className="text-center text-white">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                <p className="text-lg">Conectando à videoconferência...</p>
              </div>
            )}
            {error && (
              <div className="text-center text-white max-w-md mx-auto px-4">
                <div className="bg-red-600/20 border border-red-500 rounded-lg p-6">
                  <p className="text-red-200 mb-4">{error}</p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Daily.co Container */}
        <div 
          ref={dailyContainerRef} 
          className="flex-1 w-full h-full relative"
          style={{ minWidth: '100%', minHeight: '100%' }}
        />

        {/* Controls */}
        {isJoined && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
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
                className={`p-3 rounded-full transition-colors ${
                  isVideoOff
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                title={isVideoOff ? 'Ativar vídeo' : 'Desativar vídeo'}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={leaveMeeting}
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                title="Sair da chamada"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

