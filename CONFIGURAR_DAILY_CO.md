# 📹 Configurar Daily.co

## 🎯 Objetivo

Configurar a API do Daily.co para habilitar videoconferências.

---

## 📋 PASSO A PASSO

### Passo 1: Criar Conta Daily.co (Se Não Tiver)

1. **Acesse:** https://dashboard.daily.co/
2. **Clique em "Sign Up"** ou "Get Started"
3. **Crie uma conta** (há plano gratuito)

### Passo 2: Obter API Key

1. **Faça login** no dashboard
2. **Vá em:** Settings → API Keys
3. **Clique em "Create API Key"**
4. **Copie a chave** (ela só aparece uma vez!)

### Passo 3: Adicionar no .env

**No servidor, edite:**

**Arquivo:** `public_html/api/.env`

**Adicione a linha:**
```env
DAILY_API_KEY=sua_chave_aqui
```

**Substitua `sua_chave_aqui` pela chave copiada.**

### Passo 4: Limpar Cache

**No servidor, execute:**

```bash
cd ~/public_html/api
php artisan config:clear
php artisan config:cache
```

---

## ✅ Verificar

**Após configurar, teste:**

1. **Acesse:** `https://clamatec.com/gestao/consultas`
2. **Tente iniciar uma videoconferência**
3. **Não deve mais aparecer o erro de Daily.co não configurado**

---

## ⚠️ IMPORTANTE

**Se não quiser usar Daily.co agora:**

- O erro não impede o funcionamento básico
- Apenas a funcionalidade de videoconferência não funcionará
- Você pode configurar depois

---

**Configure o Daily.co quando estiver pronto!** 🚀

