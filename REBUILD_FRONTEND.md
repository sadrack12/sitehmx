# 🔄 Rebuild do Frontend - Corrigir Erro JSON

## ⚡ Comandos Rápidos

### No seu computador (local):

```bash
cd frontend

# Definir URL da API para produção
export NEXT_PUBLIC_API_URL=https://clamatec.com/api

# Fazer build
npm run build

# Verificar se build foi criado
ls -la out/
```

### Depois, faça upload de TODA a pasta `out/` para `public_html/` no cPanel

---

## 🔧 Alternativa: Build com .env.local

Se preferir usar arquivo:

1. **Crie/edite `frontend/.env.local`:**

```
NEXT_PUBLIC_API_URL=https://clamatec.com/api
```

2. **Depois faça build:**

```bash
cd frontend
npm run build
```

---

## ✅ Depois do Upload

1. **No navegador, limpe o localStorage:**
   - Abra Console (F12)
   - Execute: `localStorage.clear()`
   - Recarregue a página

2. **Teste o login:**
   - Acesse: `https://clamatec.com/gestao/login`
   - Email: `admin@sitehmx.com`
   - Senha: `admin123`

---

## 📋 Checklist

- [ ] Fiz novo build com `NEXT_PUBLIC_API_URL` definida
- [ ] Fiz upload de TODA a pasta `out/` para cPanel
- [ ] Limpei o localStorage no navegador
- [ ] Testei o login

**Execute os comandos e me diga se funcionou!** 🎯

