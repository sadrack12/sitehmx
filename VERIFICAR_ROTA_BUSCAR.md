# 🔍 Verificar Erro 404 em `/buscar`

## 🚨 Problema

O erro mostra que está tentando acessar uma rota `/buscar` que não existe.

---

## 🔍 Verificações

### 1. Verificar Rota no Laravel

No servidor, execute:

```bash
cd ~/public_html/api
php artisan route:list | grep buscar
```

**Deve mostrar:**
- `POST api/consulta-online/buscar`
- `POST api/buscar-paciente`

---

### 2. Verificar URL no Frontend

O código em `consulta-online/page.tsx` está usando:

```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
const response = await fetch(`${apiUrl}/consulta-online/buscar`, {
```

**Isso está correto!**

---

## ⚠️ Possíveis Causas

1. **Build antigo:** O frontend ainda tem código antigo com `/public/`
2. **Cache do navegador:** O navegador pode estar usando código antigo
3. **URL incompleta:** Pode estar faltando parte da URL

---

## ✅ SOLUÇÃO

### 1. Rebuild do Frontend (OBRIGATÓRIO)

Você precisa fazer um novo build com as correções:

```bash
cd frontend
npm run build
```

### 2. Upload

Faça upload de **TODA** a pasta `frontend/out/` para `public_html/` no cPanel.

### 3. Limpar Cache do Navegador

- Pressione `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)
- Ou limpe o cache manualmente no navegador

---

## 🧪 Testar

Depois do rebuild e upload:

1. Acesse a página de consulta online
2. Tente buscar consultas por NIF
3. Verifique o Console (F12) para ver a URL exata sendo chamada

---

**Faça o rebuild e teste novamente!** 🚀

