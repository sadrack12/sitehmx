'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Loader2, Video } from 'lucide-react'

interface VideoconferenciaModalProps {
  isOpen: boolean
  onClose: () => void
  salaId: string
  nomeUsuario: string
  isMedico?: boolean // Indica se é o médico (anfitrião)
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export default function VideoconferenciaModal({
  isOpen,
  onClose,
  salaId,
  nomeUsuario,
  isMedico = false,
}: VideoconferenciaModalProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModerator, setIsModerator] = useState(false)
  const [showModeratorWarning, setShowModeratorWarning] = useState(false)

  useEffect(() => {
    // Suppress Jitsi audio sink errors during this component's lifecycle
    const originalError = console.error
    const errorFilter = (...args: any[]) => {
      const errorMessage = args.join(' ')
      if (
        errorMessage.includes('NotAllowedError') &&
        errorMessage.includes('user gesture is required') &&
        (errorMessage.includes('AbstractAudio') || errorMessage.includes('setting sink') || errorMessage.includes('app:media'))
      ) {
        // Silently ignore - harmless browser security restriction
        return
      }
      originalError.apply(console, args)
    }
    console.error = errorFilter

    if (!isOpen || !jitsiContainerRef.current || !salaId) {
      // Restore console.error before early return
      return () => {
        console.error = originalError
      }
    }

    // Limpar instância anterior se existir
    if (apiRef.current) {
      try {
        apiRef.current.dispose()
      } catch (e) {
        console.log('Erro ao limpar API anterior:', e)
      }
      apiRef.current = null
    }

    setLoading(true)
    setError(null)
    setIsModerator(false)
    setShowModeratorWarning(false)

    // Carregar script do Jitsi
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    
    script.onload = () => {
      if (window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
        try {
          const domain = 'meet.jit.si'
          
          // Gerar senha de moderador baseada no ID da sala (para garantir que médico seja sempre moderador)
          // A senha será o hash simples do ID da sala + "medico"
          const moderatorPassword = isMedico ? btoa(salaId + '_medico_' + Date.now()).substring(0, 12) : undefined
          
          const options = {
            roomName: salaId,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            userInfo: {
              displayName: nomeUsuario,
            },
            // Se for médico, usar senha de moderador
            ...(isMedico && moderatorPassword ? {
              jwt: undefined, // Não usar JWT no Jitsi público
            } : {}),
            configOverwrite: {
              // Se for médico, configurar como moderador
              ...(isMedico ? {
                // Configurações para garantir privilégios de moderador
                enableWelcomePage: false,
                enableClosePage: false,
              } : {}),
              prejoinPageEnabled: false,
              enableWelcomePage: false,
              requireDisplayName: false,
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              enableNoAudioDetection: false,
              enableNoisyMicDetection: false,
              startAudioOnly: false,
              disableDeepLinking: true,
              enableLayerSuspension: true,
              enableRemb: true,
              enableTcc: true,
              // Entrada direta sem pedir permissões
              skipPrejoin: true,
              skipPrejoinOnMobile: true,
              // Auto-join
              enableAutoJoin: true,
              enableAutoJoinOnMobile: true,
              // Não mostrar página de pré-join
              hideDisplayName: false,
              // Configurações para entrada direta
              disableInitialGUM: false,
              // Forçar entrada direta
              enableInsecureRoomNameWarning: false,
              // Configurações para garantir que médico seja moderador
              ...(isMedico ? {
                // Se for médico, tentar entrar como moderador
                // O primeiro a entrar será moderador automaticamente
                // Mas podemos usar a API para promover se necessário
              } : {}),
            },
            interfaceConfigOverwrite: {
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              TOOLBAR_BUTTONS: [
                'microphone',
                'camera',
                'closedcaptions',
                'desktop',
                'fullscreen',
                'fodeviceselection',
                'hangup',
                'chat',
                'settings',
                'raisehand',
                'videoquality',
                'filmstrip',
                'feedback',
                'stats',
                'shortcuts',
                'tileview',
                'videobackgroundblur',
                'download',
                'help',
                'mute-everyone',
                'mute-video-everyone',
              ],
            },
          }

          apiRef.current = new window.JitsiMeetExternalAPI(domain, options)

          // Quando a reunião estiver pronta
          apiRef.current.addEventListener('videoConferenceJoined', (event: any) => {
            setLoading(false)
            console.log('Usuário entrou na reunião', event)
            
            // Se for médico, garantir que seja moderador
            if (isMedico) {
              // Tentar promover a moderador imediatamente
              const promoteToModerator = () => {
                try {
                  // Verificar se já é moderador
                  const isModerator = apiRef.current?.isModerator?.() || false
                  console.log('É moderador?', isModerator)
                  
                  if (!isModerator) {
                    setIsModerator(false)
                    setShowModeratorWarning(true)
                    
                    // Tentar obter a lista de participantes
                    const participants = apiRef.current?.getParticipantsInfo?.() || []
                    console.log('Participantes na sala:', participants)
                    
                    // Se houver outro moderador, tentar remover e promover o médico
                    const otherModerator = participants.find((p: any) => 
                      p.role === 'moderator' && p.participantId !== apiRef.current?.getMyUserId?.()
                    )
                    
                    if (otherModerator) {
                      console.log('Outro moderador encontrado:', otherModerator)
                      console.log('⚠️ No Jitsi público, não é possível remover moderador automaticamente')
                      console.log('💡 Solução: O paciente deve sair e o médico entrar primeiro, OU')
                      console.log('💡 O moderador atual (paciente) deve promover o médico manualmente')
                    } else {
                      // Se não há outro moderador, o médico deve ser o primeiro
                      // Mas se não for moderador, pode ser um problema de timing
                      console.log('Nenhum outro moderador encontrado')
                      console.log('Tentando verificar novamente em 3 segundos...')
                      setTimeout(() => {
                        const checkAgain = apiRef.current?.isModerator?.() || false
                        if (checkAgain) {
                          console.log('✅ Médico agora é moderador!')
                          setIsModerator(true)
                          setShowModeratorWarning(false)
                        } else {
                          console.log('⚠️ Médico ainda não é moderador')
                          console.log('💡 Isso pode acontecer se o paciente entrou primeiro')
                          console.log('💡 Solução: Peça ao paciente para sair e você entrar primeiro')
                        }
                      }, 3000)
                    }
                  } else {
                    console.log('✅ Médico é moderador/anfitrião!')
                    setIsModerator(true)
                    setShowModeratorWarning(false)
                  }
                } catch (e) {
                  console.log('Erro ao verificar/promover moderador:', e)
                }
              }
              
              // Tentar imediatamente
              promoteToModerator()
              
              // Tentar novamente após 2 segundos (caso a sala ainda esteja inicializando)
              setTimeout(promoteToModerator, 2000)
              
              // Tentar uma última vez após 5 segundos
              setTimeout(promoteToModerator, 5000)
            }
          })

          // Quando o usuário se tornar moderador
          apiRef.current.addEventListener('participantRoleChanged', (event: any) => {
            console.log('Papel do participante mudou:', event)
            const myId = apiRef.current?.getMyUserId?.()
            
            // Verificar se é o próprio usuário que mudou de papel
            if (event.id === myId || event.participantId === myId) {
              if (event.role === 'moderator') {
                console.log('✅ Você foi promovido a moderador/anfitrião!')
                setIsModerator(true)
                setShowModeratorWarning(false)
                if (isMedico) {
                  console.log('✅ Médico promovido a moderador com sucesso!')
                }
              }
            }
          })

          // Evento quando o participante entra
          apiRef.current.addEventListener('participantJoined', (event: any) => {
            console.log('Participante entrou:', event)
          })

          // Quando houver erro
          apiRef.current.addEventListener('error', (err: any) => {
            // Ignore harmless audio sink errors
            if (
              err?.name === 'NotAllowedError' &&
              (err?.message?.includes('user gesture is required') ||
                err?.message?.includes('setting sink'))
            ) {
              return
            }
            console.error('Erro no Jitsi:', err)
            setError('Erro ao carregar videoconferência. Tente novamente.')
            setLoading(false)
          })

          // Quando o participante sair
          apiRef.current.addEventListener('readyToClose', () => {
            if (apiRef.current) {
              apiRef.current.dispose()
            }
            onClose()
          })

          // Timeout para loading
          setTimeout(() => {
            if (loading) {
              setLoading(false)
            }
          }, 10000)
        } catch (err: any) {
          console.error('Erro ao inicializar Jitsi:', err)
          setError('Erro ao inicializar videoconferência: ' + (err.message || 'Erro desconhecido'))
          setLoading(false)
        }
      }
    }

    script.onerror = () => {
      setError('Erro ao carregar script do Jitsi Meet')
      setLoading(false)
    }

    document.body.appendChild(script)

    return () => {
      // Restore original console.error
      console.error = originalError
      
      if (apiRef.current) {
        try {
          apiRef.current.dispose()
        } catch (e) {
          console.log('Erro ao limpar API:', e)
        }
        apiRef.current = null
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [isOpen, salaId, nomeUsuario, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-white" />
            <h2 className="text-white font-semibold">Videoconferência - {nomeUsuario}</h2>
            {isMedico && isModerator && (
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-semibold">
                Anfitrião
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Aviso se médico não for moderador */}
        {isMedico && showModeratorWarning && !isModerator && (
          <div className="absolute top-16 left-0 right-0 z-20 bg-yellow-600/90 text-white px-4 py-3 mx-4 rounded-lg shadow-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Você não está como anfitrião</h3>
                <p className="text-sm text-yellow-100">
                  No Jitsi, o primeiro usuário a entrar se torna anfitrião automaticamente. 
                  Se o paciente entrou primeiro, você não terá privilégios de anfitrião.
                </p>
                <p className="text-sm text-yellow-100 mt-2 font-semibold">
                  💡 Solução: Peça ao paciente para sair da sala e você entrar primeiro, ou 
                  peça ao paciente (anfitrião atual) para promover você manualmente nas configurações.
                </p>
              </div>
              <button
                onClick={() => setShowModeratorWarning(false)}
                className="flex-shrink-0 text-yellow-100 hover:text-white transition-colors"
                title="Fechar aviso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
            <div className="text-white text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
              <p className="text-lg">Carregando videoconferência...</p>
              <p className="text-sm text-gray-400 mt-2">
                Se for o primeiro a entrar, clique em &quot;Start meeting&quot; quando aparecer
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
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Jitsi Container */}
        <div ref={jitsiContainerRef} className="flex-1 w-full h-full" />
      </div>
    </div>
  )
}

