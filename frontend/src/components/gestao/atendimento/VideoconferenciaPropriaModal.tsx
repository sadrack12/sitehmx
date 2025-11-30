'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { X, Video, VideoOff, Mic, MicOff, PhoneOff, Save, Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/Toast'

interface VideoconferenciaPropriaModalProps {
  isOpen: boolean
  onClose: () => void
  consultaId: number
  pacienteNome: string
  medicoNome: string
  salaVideoconferencia?: string
  onAnamneseSaved?: () => void
}

export default function VideoconferenciaPropriaModal({
  isOpen,
  onClose,
  consultaId,
  pacienteNome,
  medicoNome,
  salaVideoconferencia,
  onAnamneseSaved,
}: VideoconferenciaPropriaModalProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  // DataChannel removido - não é mais necessário
  // const dataChannelRef = useRef<RTCDataChannel | null>(null)
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savingAnamnese, setSavingAnamnese] = useState(false)
  const [mediaPermissionGranted, setMediaPermissionGranted] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [mediaErrorType, setMediaErrorType] = useState<string>('')
  
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

  // Verificar se o navegador suporta getUserMedia
  const checkMediaSupport = useCallback(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        supported: false,
        error: 'Seu navegador não suporta acesso à câmera e microfone. Use Chrome, Firefox, Edge ou Safari atualizado.'
      }
    }
    
    // Verificar se está em contexto seguro (HTTPS ou localhost)
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
      
      // Verificar suporte do navegador
      const supportCheck = checkMediaSupport()
      if (!supportCheck.supported) {
        setMediaError(supportCheck.error || 'Navegador não suportado')
        setMediaErrorType('NotSupportedError')
        toast.error(supportCheck.error || 'Navegador não suportado')
        setLoading(false)
        return
      }
      
      console.log('Solicitando permissão de câmera e microfone...')
      console.log('navigator.mediaDevices disponível:', !!navigator.mediaDevices)
      console.log('getUserMedia disponível:', !!navigator.mediaDevices?.getUserMedia)
      
      // Solicitar permissão explicitamente - usar constraints mais simples primeiro
      // Isso garante que o popup apareça (similar ao Google Meet)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,  // Simplificado para garantir que o popup apareça
        audio: true,  // Simplificado para garantir que o popup apareça
      })
      
      console.log('Stream recebido, aplicando constraints de qualidade...')
      
      // Depois de obter a permissão, podemos aplicar constraints mais específicas se necessário
      // Mas primeiro precisamos garantir que o popup apareça
      
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
      console.error('Detalhes do erro:', {
        name: error.name,
        message: error.message,
        constraint: error.constraint
      })
      
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
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Configuração de vídeo não suportada'
        errorType = 'OverconstrainedError'
      } else {
        errorMessage = error.message || 'Erro desconhecido ao acessar dispositivos'
        errorType = 'UnknownError'
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
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    }

    const pc = new RTCPeerConnection(configuration)
    
    // Adicionar stream local
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!)
      })
    }

    // Receber stream remoto
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    // DataChannel removido - causa problemas de parsing no SDP
    // A anamnese será sincronizada via API HTTP em vez de WebRTC DataChannel
    // const dataChannel = pc.createDataChannel('anamnese', { ordered: true })
    // dataChannelRef.current = dataChannel

    // ICE candidates
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        try {
          const token = localStorage.getItem('token')
          const roomId = salaVideoconferencia || `webrtc-consulta-${consultaId}`
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webrtc/${roomId}/candidato`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
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
      console.log('Estado da conexão:', pc.connectionState)
      setIsConnected(pc.connectionState === 'connected')
    }

    peerConnectionRef.current = pc
  }, [consultaId, salaVideoconferencia])

  // Iniciar chamada (criar oferta)
  const startCall = useCallback(async () => {
    console.log('startCall chamado!', {
      hasPeerConnection: !!peerConnectionRef.current,
      consultaId,
      salaVideoconferencia,
      mediaPermissionGranted,
      hasLocalStream: !!localStreamRef.current,
      tracksCount: localStreamRef.current?.getTracks().length || 0
    })
    
    if (!peerConnectionRef.current) {
      console.error('PeerConnection não existe!')
      toast.error('Erro: Conexão WebRTC não inicializada. Recarregue a página.')
      return
    }

    if (!mediaPermissionGranted || !localStreamRef.current) {
      console.error('Permissão de mídia não concedida ou stream não disponível!')
      toast.error('Por favor, permita acesso à câmera e microfone primeiro.')
      return
    }

    try {
      setLoading(true)
      console.log('Verificando tracks no PeerConnection...')
      
      // Garantir que os tracks estão adicionados ao PeerConnection
      const existingTracks = peerConnectionRef.current.getSenders().map(s => s.track)
      const streamTracks = localStreamRef.current.getTracks()
      
      console.log('Verificando tracks:', {
        existingTracksCount: existingTracks.length,
        streamTracksCount: streamTracks.length,
        streamTracks: streamTracks.map(t => ({ kind: t.kind, id: t.id, enabled: t.enabled }))
      })
      
      // Adicionar tracks que ainda não foram adicionados
      streamTracks.forEach((track) => {
        if (!existingTracks.includes(track)) {
          console.log('Adicionando track:', track.kind, track.id)
          peerConnectionRef.current!.addTrack(track, localStreamRef.current!)
        }
      })
      
      // Aguardar um pouco para garantir que os tracks foram adicionados
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const finalTracks = peerConnectionRef.current.getSenders()
      console.log('Tracks no PeerConnection após adicionar:', finalTracks.length)
      console.log('Detalhes dos tracks:', finalTracks.map(s => ({
        kind: s.track?.kind,
        id: s.track?.id,
        enabled: s.track?.enabled
      })))
      
      // Verificar se há pelo menos um track de áudio e um de vídeo
      const audioTracks = finalTracks.filter(s => s.track?.kind === 'audio')
      const videoTracks = finalTracks.filter(s => s.track?.kind === 'video')
      
      if (audioTracks.length === 0 || videoTracks.length === 0) {
        console.error('Tracks insuficientes!', {
          audio: audioTracks.length,
          video: videoTracks.length
        })
        toast.error('Erro: Tracks de áudio/vídeo não foram adicionados corretamente. Tente novamente.')
        setLoading(false)
        return
      }
      
      console.log('Criando oferta com tracks:', {
        audio: audioTracks.length,
        video: videoTracks.length
      })
      
      // Criar oferta
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
      
      console.log('Oferta criada, verificando SDP:', {
        sdpLength: offer.sdp?.length || 0,
        hasAudio: offer.sdp?.includes('m=audio') || false,
        hasVideo: offer.sdp?.includes('m=video') || false,
        hasApplication: offer.sdp?.includes('m=application') || false
      })
      
      // Limpar SDP de forma conservadora - remover apenas o que realmente causa problemas
      let cleanedOfferSdp = offer.sdp || ''
      const lines = cleanedOfferSdp.split('\r\n')
      const validLines: string[] = []
      let isInDataChannel = false
      const removedPayloadTypes = new Set<number>()
      const validPayloadTypesByMedia = new Map<string, Set<number>>()
      let currentMediaType: string | null = null
      
      // Primeira passagem: identificar payload types removidos e rastrear payload types válidos por mídia
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
        
        if (trimmed.startsWith('a=rtpmap:')) {
          const rtpmapMatch = trimmed.match(/^a=rtpmap:(\d+)\s+(.+)$/)
          if (rtpmapMatch) {
            const payloadType = parseInt(rtpmapMatch[1])
            const codec = rtpmapMatch[2]
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
            validPayloadTypesByMedia.set('audio', new Set(payloadTypes))
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
            if (removedPayloadTypes.has(payloadType)) {
              continue
            }
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
        
        // Remover linhas a=fmtp que referenciam payload types removidos OU que não estão na linha m=
        if (trimmed.startsWith('a=fmtp:')) {
          const fmtpMatch = trimmed.match(/^a=fmtp:(\d+)/)
          if (fmtpMatch) {
            const payloadType = parseInt(fmtpMatch[1])
            if (removedPayloadTypes.has(payloadType)) {
              continue
            }
            if (trimmed.includes('apt=')) {
              const aptMatch = trimmed.match(/apt=(\d+)/)
              if (aptMatch && removedPayloadTypes.has(parseInt(aptMatch[1]))) {
                continue
              }
            }
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
      
      cleanedOfferSdp = validLines.join('\r\n')
      
      // Criar oferta limpa
      const cleanedOffer = {
        type: offer.type,
        sdp: cleanedOfferSdp
      }
      
      console.log('Oferta criada:', {
        type: cleanedOffer.type,
        sdpLength: cleanedOffer.sdp?.length || 0,
        sdpPreview: cleanedOffer.sdp?.substring(0, 100) || '',
        originalSdpLength: offer.sdp?.length || 0
      })
      
      await peerConnectionRef.current.setLocalDescription(cleanedOffer)
      console.log('Local description definida')
      
      // Enviar oferta para backend
      const token = localStorage.getItem('token')
      const roomId = salaVideoconferencia || `webrtc-consulta-${consultaId}`
      console.log('Enviando oferta para roomId:', roomId)
      console.log('URL:', `${process.env.NEXT_PUBLIC_API_URL}/webrtc/${roomId}/oferta`)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webrtc/${roomId}/oferta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          offer: {
            type: offer.type,
            sdp: offer.sdp,
          },
          consulta_id: consultaId,
        }),
      })

      console.log('Resposta do servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log('Resposta do servidor (dados):', responseData)
        toast.success('Chamada iniciada! Aguardando paciente conectar...')
        
        // Polling para verificar resposta (em produção, use WebSocket)
        const checkAnswer = setInterval(async () => {
          try {
            const answerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webrtc/${roomId}/resposta`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            
            if (answerResponse.ok) {
              const answerData = await answerResponse.json()
              console.log('Verificando resposta:', answerData)
              
              if (answerData.answer && peerConnectionRef.current) {
                console.log('Resposta encontrada! Conectando...')
                
                // Limpar SDP da resposta de forma conservadora
                let cleanedAnswerSdp = answerData.answer.sdp || ''
                const answerLines = cleanedAnswerSdp.split('\r\n')
                const validAnswerLines: string[] = []
                let isInDataChannel = false
                const removedPayloadTypes = new Set<number>()
                const validPayloadTypes = new Set<number>()
                
                // Primeira passagem: identificar payload types removidos
                for (let i = 0; i < answerLines.length; i++) {
                  const line = answerLines[i]
                  const trimmed = line.trim()
                  
                  if (trimmed.startsWith('a=rtpmap:')) {
                    const rtpmapMatch = trimmed.match(/^a=rtpmap:(\d+)\s+(.+)$/)
                    if (rtpmapMatch) {
                      const payloadType = parseInt(rtpmapMatch[1])
                      const codec = rtpmapMatch[2]
                      if (codec.includes('ulpfec') || codec.includes('red/90000') || codec.includes('rtx/90000')) {
                        removedPayloadTypes.add(payloadType)
                      } else {
                        validPayloadTypes.add(payloadType)
                      }
                    }
                  }
                }
                
                // Segunda passagem: filtrar linhas e atualizar linha m=
                for (let i = 0; i < answerLines.length; i++) {
                  const line = answerLines[i]
                  const trimmed = line.trim()
                  
                  if (trimmed.startsWith('a=group:BUNDLE')) {
                    const bundleMatch = trimmed.match(/a=group:BUNDLE\s+(.+)/)
                    if (bundleMatch) {
                      const mids = bundleMatch[1].split(' ').filter((mid: string) => mid !== '2')
                      validAnswerLines.push(`a=group:BUNDLE ${mids.join(' ')}`)
                    } else {
                      validAnswerLines.push(line)
                    }
                    continue
                  }
                  
                  if (trimmed.startsWith('m=application')) {
                    isInDataChannel = true
                    continue
                  }
                  
                  // Processar linha m= (audio/video) - atualizar para remover payload types inválidos
                  if (trimmed.startsWith('m=') && !trimmed.startsWith('m=application')) {
                    isInDataChannel = false
                    
                    const mLineMatch = trimmed.match(/^(m=\w+\s+\d+\s+\w+\/(\w+)\s+)(.+)$/)
                    if (mLineMatch) {
                      const prefix = mLineMatch[1]
                      const payloadTypesStr = mLineMatch[3]
                      const payloadTypes = payloadTypesStr.split(' ').filter((pt: string) => {
                        const ptNum = parseInt(pt)
                        return !removedPayloadTypes.has(ptNum)
                      })
                      validAnswerLines.push(prefix + payloadTypes.join(' '))
                    } else {
                      validAnswerLines.push(line)
                    }
                    continue
                  }
                  
                  if (isInDataChannel) {
                    continue
                  }
                  
                  if (trimmed.startsWith('a=max-message-size:') || 
                      trimmed.startsWith('a=sctp-port:') ||
                      trimmed.startsWith('a=ssrc:') ||
                      trimmed.startsWith('a=ssrc-group:')) {
                    continue
                  }
                  
                  if (trimmed.includes('ulpfec') || 
                      trimmed.includes('red/90000') || 
                      trimmed.includes('rtx/90000')) {
                    continue
                  }
                  
                  // Remover linhas a=rtpmap de codecs removidos
                  if (trimmed.startsWith('a=rtpmap:')) {
                    const rtpmapMatch = trimmed.match(/^a=rtpmap:(\d+)/)
                    if (rtpmapMatch && removedPayloadTypes.has(parseInt(rtpmapMatch[1]))) {
                      continue
                    }
                  }
                  
                  if (trimmed.startsWith('a=fmtp:')) {
                    const fmtpMatch = trimmed.match(/^a=fmtp:(\d+)/)
                    if (fmtpMatch) {
                      const payloadType = parseInt(fmtpMatch[1])
                      if (removedPayloadTypes.has(payloadType)) {
                        continue
                      }
                      if (trimmed.includes('apt=')) {
                        const aptMatch = trimmed.match(/apt=(\d+)/)
                        if (aptMatch && removedPayloadTypes.has(parseInt(aptMatch[1]))) {
                          continue
                        }
                      }
                      // Se o payload type não está na lista de válidos, remover também
                      if (!validPayloadTypes.has(payloadType)) {
                        continue
                      }
                    }
                  }
                  
                  // Remover linhas a=rtcp-fb de payload types removidos
                  if (trimmed.startsWith('a=rtcp-fb:')) {
                    const rtcpFbMatch = trimmed.match(/^a=rtcp-fb:(\d+)/)
                    if (rtcpFbMatch && removedPayloadTypes.has(parseInt(rtcpFbMatch[1]))) {
                      continue
                    }
                  }
                  
                  validAnswerLines.push(line)
                }
                
                cleanedAnswerSdp = validAnswerLines.join('\r\n')
                
                // Normalizar quebras de linha
                cleanedAnswerSdp = cleanedAnswerSdp.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n')
                
                const cleanedAnswer = {
                  type: answerData.answer.type,
                  sdp: cleanedAnswerSdp
                }
                
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(cleanedAnswer))
                clearInterval(checkAnswer)
                setIsConnected(true)
                toast.success('Paciente conectado!')
              }
            }
          } catch (error) {
            console.error('Erro ao verificar resposta:', error)
          }
        }, 2000) // Verificar a cada 2 segundos
        
        // Limpar polling após 5 minutos
        setTimeout(() => clearInterval(checkAnswer), 300000)
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao iniciar chamada' }))
        console.error('Erro na resposta:', response.status, errorData)
        toast.error(errorData.message || `Erro ao iniciar chamada (${response.status})`)
      }
    } catch (error: any) {
      console.error('Erro ao iniciar chamada:', error)
      console.error('Stack trace:', error.stack)
      toast.error('Erro ao iniciar chamada: ' + (error.message || 'Erro desconhecido'))
    } finally {
      setLoading(false)
    }
  }, [consultaId, salaVideoconferencia, mediaPermissionGranted])

  // Toggle vídeo
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
        setIsVideoEnabled(!isVideoEnabled)
      }
    }
  }, [isVideoEnabled])

  // Toggle áudio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled
        setIsAudioEnabled(!isAudioEnabled)
      }
    }
  }, [isAudioEnabled])

  // Finalizar chamada
  const endCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    
    // DataChannel removido - não precisa fechar
    // if (dataChannelRef.current) {
    //   dataChannelRef.current.close()
    //   dataChannelRef.current = null
    // }
    
    setIsConnected(false)
  }, [])

  // Salvar anamnese
  const handleSaveAnamnese = useCallback(async () => {
    try {
      setSavingAnamnese(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas/${consultaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(anamnese),
      })

      if (response.ok) {
        toast.success('Anamnese salva com sucesso!')
        if (onAnamneseSaved) {
          onAnamneseSaved()
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erro ao salvar anamnese')
      }
    } catch (error) {
      console.error('Erro ao salvar anamnese:', error)
      toast.error('Erro ao salvar anamnese')
    } finally {
      setSavingAnamnese(false)
    }
  }, [consultaId, anamnese, onAnamneseSaved])

  // Sincronizar anamnese via canal de dados
  // Sincronizar anamnese via API HTTP (DataChannel removido)
  const syncAnamnese = useCallback(async () => {
    if (!isConnected) return
    
    try {
      // Salvar anamnese via API HTTP em vez de WebRTC DataChannel
      const token = localStorage.getItem('token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultas/${consultaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          anamnese: anamnese,
        }),
      })
    } catch (error) {
      console.error('Erro ao sincronizar anamnese:', error)
      // Não mostrar erro ao usuário para não interromper a chamada
    }
  }, [anamnese, isConnected, consultaId])

  // Verificar suporte ao abrir o modal
  useEffect(() => {
    if (isOpen && !mediaPermissionGranted) {
      const supportCheck = checkMediaSupport()
      if (!supportCheck.supported) {
        setMediaError(supportCheck.error || 'Navegador não suportado')
        setMediaErrorType('NotSupportedError')
      }
    }
  }, [isOpen, mediaPermissionGranted, checkMediaSupport])

  useEffect(() => {
    if (!isOpen) {
      // Limpar recursos quando modal fechar
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
        localStreamRef.current = null
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      
      // DataChannel removido - não precisa fechar
      
      setIsConnected(false)
      setMediaPermissionGranted(false)
      setMediaError(null)
      setMediaErrorType('')
      return
    }

    // Quando modal abrir, criar conexão peer apenas uma vez
    if (!peerConnectionRef.current) {
      createPeerConnection()
    }

    // Cleanup quando componente desmontar
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
        localStreamRef.current = null
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      
      // DataChannel removido - não precisa fechar
    }
  }, [isOpen, createPeerConnection])

  // Sincronizar anamnese quando mudar (com debounce para não sobrecarregar API)
  useEffect(() => {
    if (isConnected) {
      // Debounce de 1 segundo para não fazer muitas requisições
      const timeoutId = setTimeout(() => {
        syncAnamnese()
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [anamnese, isConnected, syncAnamnese])

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
                {medicoNome} ↔ {pacienteNome}
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
                    {mediaErrorType === 'NotFoundError' && (
                      <p className="text-red-300 text-sm ml-8">
                        Verifique se os dispositivos estão conectados e funcionando corretamente.
                      </p>
                    )}
                    {mediaErrorType === 'NotReadableError' && (
                      <p className="text-red-300 text-sm ml-8">
                        Feche outros aplicativos que possam estar usando a câmera ou microfone e tente novamente.
                      </p>
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
                {/* Vídeo Remoto (Paciente) */}
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
                        <p>Aguardando conexão com paciente...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vídeo Local (Médico) */}
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
                
                {!isConnected && (
                  <button
                    onClick={() => {
                      console.log('Botão Iniciar Chamada clicado!')
                      startCall()
                    }}
                    disabled={loading || !peerConnectionRef.current || !mediaPermissionGranted}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    title={
                      !peerConnectionRef.current 
                        ? 'Aguardando inicialização...' 
                        : !mediaPermissionGranted 
                        ? 'Permita acesso à câmera e microfone primeiro'
                        : 'Iniciar chamada com paciente'
                    }
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5" />
                        Iniciar Chamada
                      </>
                    )}
                  </button>
                )}
                {isConnected && (
                  <div className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                    Conectado
                  </div>
                )}
                
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

          {/* Área de Anamnese */}
          <div className="w-96 bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
              <h3 className="text-lg font-bold text-gray-900">Anamnese</h3>
              <p className="text-sm text-gray-600">Preencha durante a consulta</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Queixa Principal
                </label>
                <textarea
                  value={anamnese.queixa_principal}
                  onChange={(e) => setAnamnese({ ...anamnese, queixa_principal: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Descreva a queixa principal do paciente..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  História da Doença Atual
                </label>
                <textarea
                  value={anamnese.historia_doenca_atual}
                  onChange={(e) => setAnamnese({ ...anamnese, historia_doenca_atual: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="História da doença atual..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  História Patológica Pregressa
                </label>
                <textarea
                  value={anamnese.historia_patologica_pregressa}
                  onChange={(e) => setAnamnese({ ...anamnese, historia_patologica_pregressa: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="História patológica pregressa..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  História Familiar
                </label>
                <textarea
                  value={anamnese.historia_familiar}
                  onChange={(e) => setAnamnese({ ...anamnese, historia_familiar: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="História familiar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  História Social
                </label>
                <textarea
                  value={anamnese.historia_social}
                  onChange={(e) => setAnamnese({ ...anamnese, historia_social: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="História social..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pressão Arterial
                  </label>
                  <input
                    type="text"
                    value={anamnese.pressao_arterial}
                    onChange={(e) => setAnamnese({ ...anamnese, pressao_arterial: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: 120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FC (bpm)
                  </label>
                  <input
                    type="text"
                    value={anamnese.frequencia_cardiaca}
                    onChange={(e) => setAnamnese({ ...anamnese, frequencia_cardiaca: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: 72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FR (rpm)
                  </label>
                  <input
                    type="text"
                    value={anamnese.frequencia_respiratoria}
                    onChange={(e) => setAnamnese({ ...anamnese, frequencia_respiratoria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: 16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperatura (°C)
                  </label>
                  <input
                    type="text"
                    value={anamnese.temperatura}
                    onChange={(e) => setAnamnese({ ...anamnese, temperatura: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: 36.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="text"
                    value={anamnese.peso}
                    onChange={(e) => setAnamnese({ ...anamnese, peso: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: 70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Altura (cm)
                  </label>
                  <input
                    type="text"
                    value={anamnese.altura}
                    onChange={(e) => setAnamnese({ ...anamnese, altura: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: 175"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exame Físico
                </label>
                <textarea
                  value={anamnese.exame_fisico}
                  onChange={(e) => setAnamnese({ ...anamnese, exame_fisico: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Achados do exame físico..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico
                </label>
                <textarea
                  value={anamnese.diagnostico}
                  onChange={(e) => setAnamnese({ ...anamnese, diagnostico: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Diagnóstico..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conduta
                </label>
                <textarea
                  value={anamnese.conduta}
                  onChange={(e) => setAnamnese({ ...anamnese, conduta: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Conduta médica..."
                />
              </div>

              <button
                onClick={handleSaveAnamnese}
                disabled={savingAnamnese}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                {savingAnamnese ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Anamnese
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

