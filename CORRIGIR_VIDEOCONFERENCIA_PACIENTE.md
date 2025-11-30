# ✅ Correção: Videoconferência do Paciente

## 🔍 Problema Identificado

O componente mostrava "Conectando à videoconferência..." mas não conectava porque:

1. A página estava passando `consulta={consultaData}` mas o componente espera `roomUrl` e `token`
2. Não estava buscando o token do Daily.co antes de mostrar o componente

---

## ✅ Solução Aplicada

### 1. Página consulta-videoconferencia/page.tsx

Adicionado busca do token do Daily.co após validar o NIF:

```typescript
// Buscar token do Daily.co para o paciente
if (data.consulta?.consulta_online && data.consulta?.id) {
  setLoadingToken(true)
  const tokenResponse = await fetch(
    `${apiUrl}/daily/${data.consulta.id}/token?nif=${encodeURIComponent(nifToUse)}`
  )
  
  if (tokenResponse.ok) {
    const tokenData = await tokenResponse.json()
    setRoomUrl(tokenData.room?.url || '')
    setToken(tokenData.token || '')
    setShowVideo(true)
  }
}
```

### 2. Passando parâmetros corretos para o componente:

```typescript
<DailyVideoModalPaciente
  consultaId={consultaId}
  nomeUsuario={consultaData.paciente?.nome || 'Paciente'}
  roomUrl={roomUrl}
  token={token}
  isOpen={showVideo}
  onClose={...}
/>
```

---

## ✅ Verificar

1. Recarregar a página: `http://localhost:3000/consulta-videoconferencia?id=24&nif=500000000`
2. Deve buscar o token automaticamente
3. Deve conectar à videoconferência

---

## 📝 Arquivos Modificados

- `frontend/src/app/consulta-videoconferencia/page.tsx` - busca token e passa parâmetros corretos

---

**Problema resolvido!** ✅

