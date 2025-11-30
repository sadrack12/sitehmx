# Configuração Daily.co

## 📋 Pré-requisitos

1. Conta no Daily.co (gratuita): https://www.daily.co/
2. API Key do Daily.co
3. Domínio configurado (opcional, pode usar o padrão)

## 🔧 Configuração

### 1. Criar Conta Daily.co

1. Acesse https://www.daily.co/
2. Crie uma conta gratuita
3. Vá em Settings → API Keys
4. Copie sua API Key

### 2. Configurar Backend (.env)

Adicione no arquivo `backend/.env`:

```env
DAILY_API_KEY=sua_api_key_aqui
DAILY_DOMAIN=hmx.daily.co
```

**Nota:** O `DAILY_DOMAIN` é opcional. Se não configurar, será usado o padrão do Daily.co.

### 3. Instalar Dependências Frontend

```bash
cd frontend
npm install @daily-co/daily-js
```

Ou se já estiver no projeto:

```bash
npm install
```

## ✅ Verificação

Após configurar:

1. Inicie o backend e frontend
2. Acesse uma consulta online
3. Clique em "Iniciar Videoconferência"
4. O modal Daily.co deve abrir automaticamente

## 🎯 Funcionalidades

- ✅ Médico sempre como anfitrião (owner)
- ✅ Controle total de permissões
- ✅ Interface moderna
- ✅ Compartilhamento de tela
- ✅ Chat integrado
- ✅ Controles de áudio/vídeo

## 📝 Notas

- O plano gratuito do Daily.co permite 2 horas/dia e 2 participantes
- Para uso maior, considere o plano pago
- As salas são criadas automaticamente quando necessário
- Tokens expiram em 2 horas por segurança

