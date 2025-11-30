# ✅ Verificar Rota /consulta-videoconferencia

## ✅ Rota Está Correta!

**URL:** `https://clamatec.com/consulta-videoconferencia?id=2&nif=500000000`

**Formato:** ✅ Correto
- ✅ Rota: `/consulta-videoconferencia`
- ✅ Parâmetro `id`: `2`
- ✅ Parâmetro `nif`: `500000000`

---

## 🔍 Como Funciona

O código lê os parâmetros da URL:

1. **Lê `id` da query string:** `?id=2`
2. **Lê `nif` da query string:** `&nif=500000000`
3. **Valida automaticamente** se ambos foram passados
4. **Faz chamada à API:** `/api/consultas/2/documentos?nif=500000000`

---

## ⚠️ Problema Atual

**A página está mostrando "Carregando..." e não carrega.**

**Possíveis causas:**

1. **API não está respondendo:**
   - Verifique se `/api/consultas/2/documentos?nif=500000000` funciona
   - Teste no navegador ou Postman

2. **Arquivo HTML estático não foi gerado:**
   - O Next.js precisa gerar `consulta-videoconferencia.html`
   - Faça rebuild: `npm run build`

3. **JavaScript não está sendo executado:**
   - Verifique o Console (F12) para erros
   - Verifique se os arquivos JS estão carregando

---

## 🚀 SOLUÇÃO

### 1. Verificar API

**Teste no navegador:**
```
https://clamatec.com/api/consultas/2/documentos?nif=500000000
```

**Deve retornar JSON:**
```json
{
  "validado": true,
  "consulta": { ... }
}
```

### 2. Rebuild Frontend

**Se a API funcionar, faça rebuild:**

```bash
cd frontend
npm run build
```

**Depois, faça upload de `frontend/out/` para `public_html/`**

### 3. Verificar Console

**Abra o Console (F12) e verifique:**
- Erros de JavaScript
- Requisições à API
- Status das respostas

---

## ✅ Verificar se Funciona

**Após rebuild e upload:**

1. **Acesse:** `https://clamatec.com/consulta-videoconferencia?id=2&nif=500000000`
2. **Deve:**
   - Validar o NIF automaticamente
   - Carregar a videoconferência
   - Mostrar o player de vídeo

---

**A rota está correta! O problema pode ser na API ou no build estático.** 🚀

