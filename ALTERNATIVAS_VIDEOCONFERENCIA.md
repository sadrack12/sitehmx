# Alternativas ao Jitsi para Videoconferência

## 🎯 Requisitos do Sistema
- Médico sempre como anfitrião/moderador
- Consultas médicas online
- Integração com sistema hospitalar
- Privacidade e segurança de dados médicos

---

## 🏆 Melhores Opções

### 1. **BigBlueButton** 
**Tipo:** Open Source, Auto-hospedado

**⚠️ REQUER INSTALAÇÃO EM SERVIDOR PRÓPRIO**

**Requisitos de Instalação:**
- Servidor Ubuntu 20.04 ou 22.04
- Mínimo 4GB RAM (recomendado 8GB+)
- 2+ CPUs
- 25GB+ espaço em disco
- Conhecimento técnico para instalação e manutenção
- Processo de instalação complexo (várias horas)

**Vantagens:**
- ✅ Controle total de moderador/anfitrião via API
- ✅ Open source e gratuito
- ✅ Focado em educação, mas funciona bem para telemedicina
- ✅ Permite definir moderador programaticamente
- ✅ Recursos: compartilhamento de tela, chat, gravação
- ✅ Boa documentação de API

**Desvantagens:**
- ❌ **Requer instalação e manutenção de servidor próprio**
- ⚠️ Interface menos moderna que Jitsi
- ⚠️ Mais recursos de servidor necessários
- ⚠️ Complexidade de setup e manutenção

**Alternativa sem instalação:**
- Existem serviços de hospedagem que oferecem BigBlueButton pronto (pago)

**Integração:**
```javascript
// Exemplo de integração BigBlueButton
const bbb = require('bigbluebutton-js');
const api = bbb.api('https://bbb.example.com/bigbluebutton/', 'SECRET');

// Criar sala com médico como moderador
const createMeeting = async (consultaId, medicoId) => {
  const meeting = await api.create({
    name: `Consulta ${consultaId}`,
    meetingID: `consulta-${consultaId}`,
    moderatorPW: 'senha-medico', // Senha do moderador
    attendeePW: 'senha-paciente', // Senha do participante
  });
  
  // URL para médico (moderador)
  const moderatorUrl = api.join({
    fullName: 'Dr. João',
    meetingID: meeting.meetingID,
    password: 'senha-medico', // Sempre moderador
    userID: medicoId,
  });
  
  return moderatorUrl;
};
```

**Custo:** Gratuito (self-hosted)

---

### 2. **Daily.co** ⭐ MELHOR PARA INTEGRAÇÃO
**Tipo:** SaaS com API robusta

**Vantagens:**
- ✅ API muito poderosa e bem documentada
- ✅ Controle total de permissões via API
- ✅ Permite definir owner/moderador programaticamente
- ✅ Interface moderna e responsiva
- ✅ SDK fácil de integrar
- ✅ Suporte a gravação
- ✅ Boa qualidade de vídeo/áudio

**Desvantagens:**
- ⚠️ Pago (mas tem plano gratuito generoso)
- ⚠️ Dependência de serviço externo

**Integração:**
```javascript
// Exemplo Daily.co
import DailyIframe from '@daily-co/daily-js';

const createRoom = async (consultaId, medicoId) => {
  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DAILY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `consulta-${consultaId}`,
      privacy: 'private',
      properties: {
        enable_screenshare: true,
        enable_chat: true,
        // Médico sempre será owner
        owner_id: medicoId,
      },
    }),
  });
  
  const room = await response.json();
  
  // Token para médico (owner)
  const medicoToken = await createToken(room.id, medicoId, 'owner');
  
  // Token para paciente (participant)
  const pacienteToken = await createToken(room.id, pacienteId, 'participant');
  
  return { medicoToken, pacienteToken, roomUrl: room.url };
};
```

**Custo:** 
- Plano gratuito: 2 horas/dia, 2 participantes
- Starter: $0.00195/minuto por participante
- Pro: $0.00150/minuto por participante

---

### 3. **Zoom SDK** 
**Tipo:** SaaS com SDK

**Vantagens:**
- ✅ API robusta e bem documentada
- ✅ Permite definir host programaticamente
- ✅ Qualidade de vídeo excelente
- ✅ Muito estável e confiável
- ✅ Suporte a gravação automática
- ✅ SDK para web fácil de integrar

**Desvantagens:**
- ⚠️ Pago (mas tem plano básico gratuito)
- ⚠️ Limite de 40 minutos no plano gratuito
- ⚠️ Dependência de serviço externo

**Integração:**
```javascript
// Zoom Web SDK
import ZoomMtg from '@zoomus/websdk';

const joinMeeting = (consultaId, userRole) => {
  ZoomMtg.init({
    leaveOnPageUnload: true,
    patchJsMedia: true,
  });
  
  ZoomMtg.join({
    signature: signature, // Gerado no backend
    sdkKey: ZOOM_SDK_KEY,
    meetingNumber: consultaId,
    passWord: password,
    userName: userRole === 'medico' ? 'Dr. João' : 'Paciente',
    userEmail: email,
    tk: '',
    zak: '', // Para host
    success: (res) => {
      console.log('Entrou na reunião');
    },
    error: (res) => {
      console.error('Erro ao entrar', res);
    },
  });
};
```

**Custo:**
- Básico: Gratuito (40 min, 100 participantes)
- Pro: $14.99/mês
- Business: $19.99/mês

---

### 4. **Google Meet API**
**Tipo:** SaaS (Google Workspace)

**Vantagens:**
- ✅ Integração com Google Workspace
- ✅ Qualidade de vídeo excelente
- ✅ Familiar para muitos usuários
- ✅ Suporte a até 100 participantes (gratuito)

**Desvantagens:**
- ⚠️ Requer Google Workspace para API completa
- ⚠️ Controle de moderador limitado via API
- ⚠️ Primeiro a entrar pode ser moderador (similar ao Jitsi)

**Custo:**
- Gratuito: Até 100 participantes, 60 minutos
- Workspace: A partir de $6/mês

---

### 5. **WebRTC Próprio (Simple Peer / PeerJS)**
**Tipo:** Open Source, Self-hosted

**Vantagens:**
- ✅ Controle total
- ✅ Gratuito
- ✅ Sem limites
- ✅ Privacidade total
- ✅ Customizável

**Desvantagens:**
- ⚠️ Desenvolvimento complexo
- ⚠️ Requer servidor TURN/STUN
- ⚠️ Manutenção contínua
- ⚠️ Mais tempo de desenvolvimento

**Integração:**
```javascript
// Exemplo com Simple Peer
import Peer from 'simple-peer';

// Médico cria oferta
const medicoPeer = new Peer({ initiator: true, trickle: false });

medicoPeer.on('signal', (data) => {
  // Enviar para backend
  sendOfferToBackend(data);
});

// Paciente recebe oferta
const pacientePeer = new Peer({ trickle: false });

pacientePeer.on('signal', (data) => {
  sendAnswerToBackend(data);
});
```

**Custo:** Gratuito (mas requer infraestrutura)

---

## 📊 Comparação Rápida

| Solução | Instalação? | Controle Moderador | Custo | Complexidade | Privacidade |
|---------|------------|-------------------|-------|--------------|------------|
| **BigBlueButton** | ❌ **SIM** | ✅ Total | Gratuito* | Alta | ✅ Alta |
| **Daily.co** | ✅ **NÃO** | ✅ Total | Pago** | Baixa | ⚠️ Média |
| **Zoom SDK** | ✅ **NÃO** | ✅ Total | Pago | Baixa | ⚠️ Média |
| **Google Meet** | ✅ **NÃO** | ⚠️ Limitado | Gratuito/Pago | Baixa | ⚠️ Média |
| **WebRTC Próprio** | ❌ **SIM** | ✅ Total | Gratuito* | Muito Alta | ✅ Máxima |

*Gratuito mas requer servidor próprio (custo de hospedagem)
**Tem plano gratuito generoso (2h/dia)

---

## 🎯 Recomendação para Seu Caso

### **Opção 1: Daily.co** ⭐ MELHOR ESCOLHA (Sem instalação)
- ✅ **NÃO requer instalação** - apenas API
- ✅ Resolve o problema do moderador
- ✅ API excelente e bem documentada
- ✅ Controle total de permissões
- ✅ Integração rápida (poucos dias)
- ✅ Plano gratuito generoso (2h/dia, 2 participantes)
- ⚠️ Custo mensal para uso maior

### **Opção 2: Zoom SDK** (Sem instalação, confiável)
- ✅ **NÃO requer instalação** - apenas SDK
- ✅ API robusta
- ✅ Controle total de host/moderador
- ✅ Qualidade excelente
- ✅ Muito estável
- ⚠️ Limite de 40 min no plano gratuito
- ⚠️ Custo mensal

### **Opção 3: BigBlueButton** (Requer instalação)
- ❌ **REQUER instalação em servidor próprio**
- ✅ Resolve o problema do moderador
- ✅ Open source e gratuito (mas custo de servidor)
- ✅ Boa para telemedicina
- ⚠️ Complexidade de setup e manutenção
- ⚠️ Requer conhecimento técnico

### **Opção 4: Melhorar Jitsi com servidor próprio**
- ❌ **REQUER instalação** (se usar self-hosted)
- ✅ Usar Jitsi self-hosted com configuração customizada
- ✅ Pode configurar para sempre dar moderador ao médico
- ✅ Mantém a solução atual, apenas melhora
- ⚠️ Ainda pode usar Jitsi público, mas com limitações

---

## 🚀 Próximos Passos

### **Opção Recomendada: Daily.co** (Sem instalação)

1. **Criar conta Daily.co:**
   - Acessar https://www.daily.co/
   - Criar conta gratuita
   - Obter API key no dashboard

2. **Integrar no Backend (Laravel):**
   - Criar endpoints para criar salas
   - Gerar tokens para médico (owner) e paciente
   - Gerenciar ciclo de vida das salas

3. **Integrar no Frontend (Next.js):**
   - Instalar SDK: `npm install @daily-co/daily-js`
   - Criar componente de videoconferência
   - Substituir componente Jitsi atual

### **Alternativa: BigBlueButton** (Requer instalação)

1. **Instalar BigBlueButton:**
   - Servidor Ubuntu 20.04/22.04
   - Seguir guia oficial de instalação
   - Configurar SSL e domínio

2. **Integrar API:**
   - Instalar biblioteca `bigbluebutton-js` no backend
   - Criar endpoints para criar salas
   - Gerar URLs de acesso

3. **Frontend:**
   - Criar componente que abre iframe do BBB
   - Passar URLs geradas pelo backend

### **Alternativa: Melhorar Jitsi Atual**

1. **Usar Jitsi Self-Hosted:**
   - Instalar Jitsi Meet em servidor
   - Configurar JWT para definir moderador
   - Atualizar componente atual

2. **Ou manter Jitsi público:**
   - Melhorar lógica de detecção de moderador
   - Adicionar instruções claras para usuários
   - Aceitar limitação do primeiro a entrar

---

## 📝 Nota sobre Privacidade

Para consultas médicas, considere:
- **LGPD/GDPR compliance**
- **Criptografia end-to-end**
- **Gravação com consentimento**
- **Armazenamento seguro de dados**

Todas as soluções acima podem ser configuradas para atender requisitos de privacidade médica.

