# 🔧 Rebuild Forçando URL Correta

## ⚠️ Possível Problema

A variável de ambiente `NEXT_PUBLIC_API_URL` pode ter sido definida com `/public/` durante o build.

---

## ✅ SOLUÇÃO: Rebuild Sem Variável de Ambiente

Faça o rebuild **sem** definir `NEXT_PUBLIC_API_URL`, para que use o fallback correto:

```bash
cd frontend

# Remover variável de ambiente se estiver definida
unset NEXT_PUBLIC_API_URL

# Rebuild limpo
rm -rf out .next
npm run build
```

Ou se você tem um arquivo `.env.local`, verifique se ele não tem `/public/`:

```bash
cd frontend
cat .env.local
```

Se tiver algo como `NEXT_PUBLIC_API_URL=https://clamatec.com/api/public`, corrija para:
```
NEXT_PUBLIC_API_URL=https://clamatec.com/api
```

---

## 🔧 Rebuild Agora

Execute:

```bash
cd frontend
rm -rf out .next
npm run build
```

Depois faça upload novamente.

---

**Faça o rebuild limpo AGORA!** 🚀

