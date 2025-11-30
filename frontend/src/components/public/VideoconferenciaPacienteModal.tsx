'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { X, Video, VideoOff, Mic, MicOff, PhoneOff, Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/Toast'

interface VideoconferenciaPacienteModalProps {
  isOpen: boolean
  onClose: () => void
  consultaId: number
  pacienteNome: string
  medicoNome: string
  roomId: string
}

export default function VideoconferenciaPacienteModal({
  isOpen,
  onClose,
  consultaId,
  pacienteNome,
  medicoNome,
  roomId,
}: VideoconferenciaPacienteModalProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mediaPermissionGranted, setMediaPermissionGranted] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [mediaErrorType, setMediaErrorType] = useState<string>('')

  // Verificar se o navegador suporta getUserMedia
  const checkMediaSupport = useCallback(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        supported: false,
        error: 'Seu navegador não suporta acesso à câmera e microfone. Use Chrome, Firefox, Edge ou Safari atualizado.'
      }
    }
    
    const isSecureContext = window.isSecureContext || 
                            window.location.protocol === 'https:' || 
                            window.location.hostname === 'localhost' ||
                            window.location.hostname === '127.0.0.1'
    
    if (!isSecureContext) {
      return {
        supported: false,
        error: 'Acesso à câmera e microfone requer HTTPS. Certifique-se de que o site está usando uma conexão segura.'
      }
    }
    
    return { supported: true }
  }, [])

  // Inicializar câmera e microfone
  const initializeMedia = useCallback(async () => {
    try {
      setLoading(true)
      setMediaError(null)
      setMediaErrorType('')
      
      const supportCheck = checkMediaSupport()
      if (!supportCheck.supported) {
        setMediaError(supportCheck.error || 'Navegador não suportado')
        setMediaErrorType('NotSupportedError')
        toast.error(supportCheck.error || 'Navegador não suportado')
        setLoading(false)
        return
      }
      
      console.log('Solicitando permissão de câmera e microfone...')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      
      console.log('Permissão concedida! Stream recebido:', stream)
      console.log('Tracks no stream:', stream.getTracks().map(t => ({ kind: t.kind, id: t.id, enabled: t.enabled, readyState: t.readyState })))
      
      localStreamRef.current = stream
      
      // Usar setTimeout para garantir que o elemento de vídeo está renderizado
      setTimeout(() => {
        if (localVideoRef.current) {
          console.log('Atribuindo stream ao elemento de vídeo local')
          localVideoRef.current.srcObject = stream
          localVideoRef.current.play().catch(err => {
            console.error('Erro ao reproduzir vídeo local:', err)
          })
        } else {
          console.warn('Elemento de vídeo local não encontrado!')
        }
      }, 100)
      
      setIsVideoEnabled(true)
      setIsAudioEnabled(true)
      setMediaPermissionGranted(true)
      
      // Garantir que PeerConnection existe e adicionar tracks
      if (!peerConnectionRef.current) {
        console.log('Criando PeerConnection após obter stream...')
        createPeerConnection()
      } else {
        // Adicionar tracks ao PeerConnection existente
        console.log('Adicionando tracks ao PeerConnection existente...')
        stream.getTracks().forEach((track) => {
          const existingTracks = peerConnectionRef.current!.getSenders().map(s => s.track)
          if (!existingTracks.includes(track)) {
            console.log('Adicionando track ao PeerConnection:', track.kind, track.id)
            peerConnectionRef.current!.addTrack(track, stream)
          }
        })
        console.log('Tracks no PeerConnection após adicionar:', peerConnectionRef.current.getSenders().length)
      }
      
      toast.success('Câmera e microfone ativados!')
    } catch (error: any) {
      console.error('Erro ao acessar câmera/microfone:', error)
      setMediaPermissionGranted(false)
      
      let errorMessage = 'Erro ao acessar câmera ou microfone'
      let errorType = ''
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Permissão negada'
        errorType = 'NotAllowedError'
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'Câmera ou microfone não encontrados'
        errorType = 'NotFoundError'
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Dispositivo em uso por outro aplicativo'
        errorType = 'NotReadableError'
      }
      
      setMediaError(errorMessage)
      setMediaErrorType(errorType)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [checkMediaSupport])

  // Criar conexão WebRTC
  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      return
    }

    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    }

    const pc = new RTCPeerConnection(configuration)
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!)
      })
    }

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webrtc/${roomId}/candidato`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              candidate: event.candidate,
            }),
          })
        } catch (error) {
          console.error('Erro ao enviar ICE candidate:', error)
        }
      }
    }

    pc.onconnectionstatechange = () => {
      console.log('Estado da conexão WebRTC:', pc.connectionState)
      setIsConnected(pc.connectionState === 'connected')
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        toast.error('Conexão WebRTC falhou ou foi desconectada.')
      }
    }

    peerConnectionRef.current = pc
  }, [roomId])

  // Aceitar chamada (criar resposta quando receber oferta)
  const acceptCall = useCallback(async (offerData: any) => {
    if (!peerConnectionRef.current) return

    try {
      setLoading(true)
      
      // Garantir que o offer está no formato correto
      let offer: RTCSessionDescriptionInit
      if (typeof offerData === 'string') {
        // Se for string, tentar fazer parse
        try {
          offer = JSON.parse(offerData)
        } catch {
          throw new Error('Formato de oferta inválido')
        }
      } else if (offerData.type && offerData.sdp) {
        // Se já for objeto com type e sdp
        offer = offerData
      } else {
        throw new Error('Formato de oferta inválido')
      }
      
      console.log('Aceitando oferta:', offer)
      
      // Validar formato do SDP
      if (!offer.type || !offer.sdp) {
        throw new Error('Oferta inválida: falta type ou sdp')
      }
      
      if (typeof offer.sdp !== 'string') {
        throw new Error('SDP deve ser uma string')
      }
      
      // Validar formato básico do SDP
      if (!offer.sdp.includes('v=0') || !offer.sdp.includes('m=')) {
        console.error('SDP inválido - formato incorreto:', offer.sdp.substring(0, 200))
        throw new Error('SDP inválido: formato incorreto')
      }
      
      if (offer.type !== 'offer') {
        console.warn('Tipo de oferta inesperado:', offer.type)
      }
      
      // Limpar e normalizar o SDP
      let cleanedSdp = offer.sdp.trim()
      
      // Remover caracteres de controle inválidos (exceto \r\n que são válidos)
      cleanedSdp = cleanedSdp.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
      
      // Normalizar quebras de linha para \r\n
      cleanedSdp = cleanedSdp.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n')
      
      // Remover linhas vazias duplicadas
      cleanedSdp = cleanedSdp.replace(/(\r\n){3,}/g, '\r\n\r\n')
      
      // Garantir que começa com v=0
      if (!cleanedSdp.startsWith('v=0')) {
        // Tentar encontrar onde começa o SDP válido
        const v0Index = cleanedSdp.indexOf('v=0')
        if (v0Index > 0) {
          cleanedSdp = cleanedSdp.substring(v0Index)
        } else {
          throw new Error('SDP não contém linha v=0 válida')
        }
      }
      
      // Limpar SDP de forma conservadora - remover apenas o que realmente causa problemas
      const lines = cleanedSdp.split('\r\n')
      const validLines: string[] = []
      let isInDataChannel = false
      const removedPayloadTypes = new Set<number>() // Rastrear payload types removidos
      const validPayloadTypesByMedia = new Map<string, Set<number>>() // Rastrear payload types válidos por mídia (audio/video)
      let currentMediaType: string | null = null
      
      // Primeira passagem: identificar codecs removidos e rastrear payload types válidos por mídia
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()
        
        // Identificar tipo de mídia atual e extrair payload types válidos
        if (trimmed.startsWith('m=audio')) {
          currentMediaType = 'audio'
          const mLineMatch = trimmed.match(/^m=\w+\s+\d+\s+\w+\/(\w+)\s+(.+)$/)
          if (mLineMatch) {
            const payloadTypesStr = mLineMatch[2]
            const payloadTypes = payloadTypesStr.split(' ').map(pt => parseInt(pt))
            validPayloadTypesByMedia.set('audio', new Set(payloadTypes))
          }
        } else if (trimmed.startsWith('m=video')) {
          currentMediaType = 'video'
          const mLineMatch = trimmed.match(/^m=\w+\s+\d+\s+\w+\/(\w+)\s+(.+)$/)
          if (mLineMatch) {
            const payloadTypesStr = mLineMatch[2]
            const payloadTypes = payloadTypesStr.split(' ').map(pt => parseInt(pt))
            validPayloadTypesByMedia.set('video', new Set(payloadTypes))
          }
        } else if (trimmed.startsWith('m=')) {
          currentMediaType = null
        }
        
        // Identificar payload types de codecs que vamos remover
        if (trimmed.startsWith('a=rtpmap:')) {
          const rtpmapMatch = trimmed.match(/^a=rtpmap:(\d+)\s+(.+)$/)
          if (rtpmapMatch) {
            const payloadType = parseInt(rtpmapMatch[1])
            const codec = rtpmapMatch[2]
            // Marcar payload types de codecs problemáticos para remoção
            if (codec.includes('ulpfec') || codec.includes('red/90000') || codec.includes('rtx/90000')) {
              removedPayloadTypes.add(payloadType)
            }
          }
        }
      }
      
      // Segunda passagem: filtrar linhas e atualizar linha m=
      currentMediaType = null
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()
        
        // Processar linha a=group:BUNDLE para remover mid:2 (DataChannel)
        if (trimmed.startsWith('a=group:BUNDLE')) {
          const bundleMatch = trimmed.match(/a=group:BUNDLE\s+(.+)/)
          if (bundleMatch) {
            const mids = bundleMatch[1].split(' ').filter((mid: string) => mid !== '2')
            validLines.push(`a=group:BUNDLE ${mids.join(' ')}`)
          } else {
            validLines.push(line)
          }
          continue
        }
        
        // Remover DataChannel completamente
        if (trimmed.startsWith('m=application')) {
          isInDataChannel = true
          currentMediaType = null
          continue
        }
        
        // Processar linha m= (audio/video) - atualizar para remover payload types inválidos
        if (trimmed.startsWith('m=audio')) {
          isInDataChannel = false
          currentMediaType = 'audio'
          
          const mLineMatch = trimmed.match(/^(m=\w+\s+\d+\s+\w+\/(\w+)\s+)(.+)$/)
          if (mLineMatch) {
            const prefix = mLineMatch[1]
            const payloadTypesStr = mLineMatch[3]
            const payloadTypes = payloadTypesStr.split(' ').filter(pt => {
              const ptNum = parseInt(pt.trim())
              // Manter apenas payload types válidos (não removidos)
              return !isNaN(ptNum) && ptNum > 0 && !removedPayloadTypes.has(ptNum)
            }).map(pt => parseInt(pt.trim()))
            const updatedLine = prefix + payloadTypes.join(' ')
            validLines.push(updatedLine)
            // Atualizar conjunto de payload types válidos para esta mídia
            validPayloadTypesByMedia.set('audio', new Set(payloadTypes))
            console.log('Linha m=audio atualizada:', {
              original: trimmed,
              updated: updatedLine,
              validPayloadTypes: Array.from(validPayloadTypesByMedia.get('audio')!)
            })
          } else {
            validLines.push(line)
          }
          continue
        } else if (trimmed.startsWith('m=video')) {
          isInDataChannel = false
          currentMediaType = 'video'
          
          const mLineMatch = trimmed.match(/^(m=\w+\s+\d+\s+\w+\/(\w+)\s+)(.+)$/)
          if (mLineMatch) {
            const prefix = mLineMatch[1]
            const payloadTypesStr = mLineMatch[3]
            const payloadTypes = payloadTypesStr.split(' ').filter(pt => {
              const ptNum = parseInt(pt.trim())
              // Manter apenas payload types válidos (não removidos)
              return !isNaN(ptNum) && ptNum > 0 && !removedPayloadTypes.has(ptNum)
            }).map(pt => parseInt(pt.trim()))
            const updatedLine = prefix + payloadTypes.join(' ')
            validLines.push(updatedLine)
            // Atualizar conjunto de payload types válidos para esta mídia
            validPayloadTypesByMedia.set('video', new Set(payloadTypes))
          } else {
            validLines.push(line)
          }
          continue
        } else if (trimmed.startsWith('m=')) {
          isInDataChannel = false
          currentMediaType = null
          validLines.push(line)
          continue
        }
        
        if (isInDataChannel) {
          continue
        }
        
        // Remover linhas específicas problemáticas
        if (trimmed.startsWith('a=max-message-size:') || 
            trimmed.startsWith('a=sctp-port:') ||
            trimmed.startsWith('a=ssrc:') ||
            trimmed.startsWith('a=ssrc-group:')) {
          continue
        }
        
        // Remover codecs problemáticos
        if (trimmed.includes('ulpfec') || 
            trimmed.includes('red/90000') || 
            trimmed.includes('rtx/90000')) {
          continue
        }
        
        // Remover linhas a=rtpmap de codecs removidos OU que não estão na linha m= correspondente
        if (trimmed.startsWith('a=rtpmap:')) {
          const rtpmapMatch = trimmed.match(/^a=rtpmap:(\d+)/)
          if (rtpmapMatch) {
            const payloadType = parseInt(rtpmapMatch[1])
            // Remover se foi marcado para remoção
            if (removedPayloadTypes.has(payloadType)) {
              console.log('Removendo a=rtpmap:', payloadType, 'porque está em removedPayloadTypes')
              continue
            }
            // Verificar se está na linha m= correspondente
            if (currentMediaType && validPayloadTypesByMedia.has(currentMediaType)) {
              const validSet = validPayloadTypesByMedia.get(currentMediaType)!
              if (!validSet.has(payloadType)) {
                console.log('Removendo a=rtpmap:', payloadType, 'porque não está na linha m=' + currentMediaType, 'Válidos:', Array.from(validSet), 'Linha completa:', trimmed)
                continue
              } else {
                // Payload type está válido, manter a linha
                console.log('Mantendo a=rtpmap:', payloadType, 'para mídia', currentMediaType)
              }
            } else if (!currentMediaType) {
              // Se não sabemos qual mídia, verificar se está em qualquer conjunto válido
              let foundInAnyMedia = false
              for (const [mediaType, validSet] of validPayloadTypesByMedia.entries()) {
                if (validSet.has(payloadType)) {
                  foundInAnyMedia = true
                  // Atualizar currentMediaType para esta mídia
                  currentMediaType = mediaType
                  console.log('Encontrado payload type', payloadType, 'em mídia', mediaType, 'atualizando currentMediaType')
                  break
                }
              }
              if (!foundInAnyMedia) {
                console.log('Removendo a=rtpmap:', payloadType, 'porque não está em nenhuma linha m= válida')
                continue
              }
            }
          }
        }
        
        // Remover linhas a=fmtp que referenciam payload types removidos OU que não estão na linha m=
        if (trimmed.startsWith('a=fmtp:')) {
          const fmtpMatch = trimmed.match(/^a=fmtp:(\d+)/)
          if (fmtpMatch) {
            const payloadType = parseInt(fmtpMatch[1])
            // Se este payload type foi removido, remover a linha fmtp
            if (removedPayloadTypes.has(payloadType)) {
              continue
            }
            // Se referencia um payload type removido via apt=
            if (trimmed.includes('apt=')) {
              const aptMatch = trimmed.match(/apt=(\d+)/)
              if (aptMatch && removedPayloadTypes.has(parseInt(aptMatch[1]))) {
                continue
              }
            }
            // Se o payload type não está na linha m= correspondente, remover
            if (currentMediaType && validPayloadTypesByMedia.has(currentMediaType)) {
              const validSet = validPayloadTypesByMedia.get(currentMediaType)!
              if (!validSet.has(payloadType)) {
                continue
              }
            } else if (!currentMediaType) {
              continue
            }
          }
        }
        
        // Remover linhas a=rtcp-fb de payload types removidos OU que não estão na linha m=
        if (trimmed.startsWith('a=rtcp-fb:')) {
          const rtcpFbMatch = trimmed.match(/^a=rtcp-fb:(\d+)/)
          if (rtcpFbMatch) {
            const payloadType = parseInt(rtcpFbMatch[1])
            if (removedPayloadTypes.has(payloadType)) {
              continue
            }
            // Se o payload type não está na linha m= correspondente, remover
            if (currentMediaType && validPayloadTypesByMedia.has(currentMediaType)) {
              const validSet = validPayloadTypesByMedia.get(currentMediaType)!
              if (!validSet.has(payloadType)) {
                continue
              }
            } else if (!currentMediaType) {
              continue
            }
          }
        }
        
        // Manter todas as outras linhas
        validLines.push(line)
      }
      
      cleanedSdp = validLines.join('\r\n')
      
      // Garantir que tem pelo menos uma linha m=
      if (!cleanedSdp.includes('m=')) {
        throw new Error('SDP não contém linha m= válida')
      }
      
      console.log('Criando RTCSessionDescription com:', {
        type: offer.type,
        sdpLength: cleanedSdp.length,
        sdpPreview: cleanedSdp.substring(0, 200),
        originalSdpLength: offer.sdp.length,
        linesCount: cleanedSdp.split('\r\n').length
      })
      
      // Criar objeto de oferta limpo
      const cleanedOffer: RTCSessionDescriptionInit = {
        type: offer.type as RTCSdpType,
        sdp: cleanedSdp
      }
      
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(cleanedOffer))
      } catch (error: any) {
        console.error('Erro ao criar RTCSessionDescription:', error)
        console.error('SDP completo (primeiros 500 chars):', cleanedSdp.substring(0, 500))
        console.error('SDP completo (últimos 500 chars):', cleanedSdp.substring(Math.max(0, cleanedSdp.length - 500)))
        throw error
      }
      
      // Garantir que os tracks estão adicionados ao PeerConnection antes de criar resposta
      if (localStreamRef.current && peerConnectionRef.current) {
        const existingTracks = peerConnectionRef.current.getSenders().map(s => s.track)
        const streamTracks = localStreamRef.current.getTracks()
        
        console.log('Verificando tracks antes de criar resposta:', {
          existingTracks: existingTracks.length,
          streamTracks: streamTracks.length
        })
        
        // Adicionar tracks que ainda não foram adicionados
        streamTracks.forEach((track) => {
          if (!existingTracks.includes(track)) {
            console.log('Adicionando track antes de criar resposta:', track.kind, track.id)
            peerConnectionRef.current!.addTrack(track, localStreamRef.current!)
          }
        })
        
        console.log('Tracks no PeerConnection:', peerConnectionRef.current.getSenders().length)
      }
      
      const answer = await peerConnectionRef.current.createAnswer()
      
      // Limpar SDP da resposta removendo linhas problemáticas
      let cleanedAnswerSdp = answer.sdp || ''
      cleanedAnswerSdp = cleanedAnswerSdp.split('\r\n').filter((line: string) => {
        const trimmed = line.trim()
        // Remover linhas não suportadas por alguns navegadores
        if (trimmed.startsWith('a=max-message-size:')) return false
        if (trimmed.startsWith('a=sctp-port:')) return false
        return true
      }).join('\r\n')
      
      // Criar resposta limpa
      const cleanedAnswer = {
        type: answer.type,
        sdp: cleanedAnswerSdp
      }
      
      await peerConnectionRef.current.setLocalDescription(cleanedAnswer)

      // Enviar resposta para o backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webrtc/${roomId}/resposta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: {
            type: cleanedAnswer.type,
            sdp: cleanedAnswer.sdp,
          },
        }),
      })
      
      toast.success('Chamada aceita!')
      setIsConnected(true)
    } catch (error: any) {
      console.error('Erro ao aceitar chamada:', error)
      toast.error('Erro ao aceitar chamada: ' + (error.message || 'Erro desconhecido'))
    } finally {
      setLoading(false)
    }
  }, [roomId])

  // Verificar se há oferta disponível (polling)
  useEffect(() => {
    if (!isOpen || !mediaPermissionGranted || !peerConnectionRef.current) return

    console.log('Iniciando polling para oferta, roomId:', roomId)

    const checkOffer = setInterval(async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/webrtc/${roomId}/oferta`
        console.log('Verificando oferta em:', url)
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          console.log('Resposta da oferta:', data)
          
          if (data.offer && peerConnectionRef.current) {
            console.log('Oferta encontrada! Aceitando chamada...')
            console.log('Tipo da oferta:', typeof data.offer)
            console.log('Conteúdo da oferta:', JSON.stringify(data.offer, null, 2))
            
            // Verificar se a oferta tem o formato correto
            if (data.offer && typeof data.offer === 'object') {
              if (data.offer.type && data.offer.sdp && typeof data.offer.sdp === 'string') {
                // Validar formato básico do SDP
                if (data.offer.sdp.includes('v=0') && data.offer.sdp.includes('m=')) {
                  await acceptCall(data.offer)
                  clearInterval(checkOffer)
                } else {
                  console.error('SDP inválido: não contém linhas básicas (v=0, m=)')
                  console.error('SDP recebido:', data.offer.sdp?.substring(0, 200))
                }
              } else {
                console.error('Oferta com formato inválido - falta type ou sdp:', {
                  hasType: !!data.offer.type,
                  hasSdp: !!data.offer.sdp,
                  sdpType: typeof data.offer.sdp
                })
              }
            } else {
              console.error('Oferta não é um objeto válido:', data.offer)
            }
          }
        } else {
          console.log('Erro ao buscar oferta:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Erro ao verificar oferta:', error)
      }
    }, 2000)

    return () => clearInterval(checkOffer)
  }, [isOpen, mediaPermissionGranted, roomId, acceptCall])

  useEffect(() => {
    if (!isOpen) {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
        localStreamRef.current = null
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      
      setIsConnected(false)
      setMediaPermissionGranted(false)
      setMediaError(null)
      setMediaErrorType('')
      return
    }

    if (!peerConnectionRef.current) {
      createPeerConnection()
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
        localStreamRef.current = null
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
    }
  }, [isOpen, createPeerConnection])

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
        setIsVideoEnabled(!isVideoEnabled)
      }
    }
  }, [isVideoEnabled])

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled
        setIsAudioEnabled(!isAudioEnabled)
      }
    }
  }, [isAudioEnabled])

  const endCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    
    setIsConnected(false)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative w-full h-full flex flex-col bg-gray-900">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 to-transparent px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Video className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-white font-semibold text-lg">Consulta Online</h2>
              <p className="text-gray-300 text-sm">
                {pacienteNome} ↔ {medicoNome}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              endCall()
              onClose()
            }}
            className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 flex overflow-hidden pt-20">
          {/* Área de Vídeo */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black p-4">
            {/* Tela de Solicitação de Permissão */}
            {!mediaPermissionGranted && (
              <div className="flex flex-col items-center justify-center text-center text-white max-w-2xl px-4">
                <div className={`rounded-full p-6 mb-6 ${mediaError ? 'bg-red-600/20' : 'bg-blue-600/20'}`}>
                  {mediaError ? (
                    <AlertCircle className="w-16 h-16 text-red-400" />
                  ) : (
                    <Video className="w-16 h-16" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {mediaError ? 'Permissão Necessária' : 'Permissão de Câmera e Microfone'}
                </h3>
                <p className="text-gray-300 mb-4">
                  {mediaError 
                    ? 'Para iniciar a consulta online, precisamos de acesso à sua câmera e microfone.'
                    : 'Para iniciar a consulta online, precisamos de acesso à sua câmera e microfone. Clique no botão abaixo para permitir o acesso.'
                  }
                </p>
                {!mediaError && (
                  <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3 mb-6 text-left max-w-xl w-full">
                    <p className="text-blue-200 text-sm">
                      <strong>💡 Importante:</strong> Ao clicar em &quot;Permitir Acesso&quot;, o navegador mostrará um popup pedindo permissão. 
                      Se o popup não aparecer, verifique as configurações do navegador ou recarregue a página.
                    </p>
                  </div>
                )}
                {mediaError && (
                  <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-5 mb-6 text-left max-w-xl w-full">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-200 font-semibold">{mediaError}</p>
                    </div>
                    {mediaErrorType === 'NotAllowedError' && (
                      <div className="text-red-300 text-sm space-y-3 ml-8">
                        <div>
                          <p className="font-semibold mb-2">Como permitir o acesso:</p>
                          <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>
                              <strong>Chrome/Edge:</strong> Clique no ícone de cadeado (🔒) na barra de endereços → 
                              <span className="text-red-200"> Câmera e Microfone → Permitir</span>
                            </li>
                            <li>
                              <strong>Firefox:</strong> Clique no ícone de escudo → 
                              <span className="text-red-200"> Permissões → Permitir câmera e microfone</span>
                            </li>
                            <li>
                              <strong>Safari:</strong> Safari → Preferências → Websites → 
                              <span className="text-red-200"> Câmera/Microfone → Permitir</span>
                            </li>
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-red-700">
                          <p className="flex items-center gap-2">
                            <span>💡</span>
                            <span><strong>Dica:</strong> Após alterar as configurações, clique em &quot;Tentar Novamente&quot; abaixo.</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
                  <button
                    onClick={initializeMedia}
                    disabled={loading}
                    className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Solicitando permissão...
                      </>
                    ) : (
                      <>
                        <Video className="w-6 h-6" />
                        {mediaError ? 'Tentar Novamente' : 'Permitir Acesso'}
                      </>
                    )}
                  </button>
                  {mediaError && (
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      title="Recarregar página"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Recarregar
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Área de Vídeo (apenas quando permissão concedida) */}
            {mediaPermissionGranted && (
              <>
                {/* Vídeo Remoto (Médico) */}
                <div className="relative w-full max-w-4xl aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                      <div className="text-center text-white">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                        <p>Aguardando médico iniciar a chamada...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vídeo Local (Paciente) */}
                <div className="relative w-64 aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ display: localVideoRef.current?.srcObject ? 'block' : 'none' }}
                    onLoadedMetadata={() => {
                      console.log('Metadados do vídeo local carregados')
                      if (localVideoRef.current) {
                        localVideoRef.current.play().catch(err => {
                          console.error('Erro ao reproduzir vídeo local após metadata:', err)
                        })
                      }
                    }}
                    onPlay={() => {
                      console.log('Vídeo local começou a reproduzir')
                      if (localVideoRef.current) {
                        localVideoRef.current.style.display = 'block'
                      }
                    }}
                    onError={(e) => {
                      console.error('Erro no elemento de vídeo local:', e)
                    }}
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                      <VideoOff className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  {(!localVideoRef.current || !localVideoRef.current.srcObject) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                      <div className="text-center text-white text-sm">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p>Aguardando câmera...</p>
                        <p className="text-xs mt-2 text-gray-400">Certifique-se de permitir o acesso</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Controles (apenas quando permissão concedida) */}
            {mediaPermissionGranted && (
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoEnabled
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  title={isVideoEnabled ? 'Desligar vídeo' : 'Ligar vídeo'}
                >
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition-colors ${
                    isAudioEnabled
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  title={isAudioEnabled ? 'Desligar microfone' : 'Ligar microfone'}
                >
                  {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => {
                    endCall()
                    onClose()
                  }}
                  className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                  title="Encerrar chamada"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

