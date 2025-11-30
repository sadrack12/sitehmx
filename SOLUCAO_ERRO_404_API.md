# 🔧 Solução: Erro 404 na API (Desenvolvimento Local)

## ❌ Problema

Você está vendo estes erros no console do navegador:
```
Failed to load resource: the server responded with a status of 404
api/public/noticias
api/public/eventos
api/public/corpo-diretivo
```

**Causa:** O frontend está tentando acessar a API de produção (`https://clamatec.com/api`), mas você está rodando localmente.

---

## ✅ Solução Passo a Passo

### Passo 1: Verificar se a API Laravel está rodando

Abra um **novo terminal** e rode:

```bash
cd backend
php artisan serve
```

Você deve ver algo como:
```
Starting Laravel development server: http://127.0.0.1:8000
```

**Importante:** Mantenha esse terminal aberto enquanto desenvolve!

---

### Passo 2: Configurar o `.env.local` do frontend

**Opção A - Manual:**

Edite o arquivo `frontend/.env.local` e coloque:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Opção B - Usando o script (mais fácil):**

Execute no terminal:

```bash
cd frontend
./configurar-api-local.sh
```

Ele vai perguntar a porta (geralmente 8000).

---

### Passo 3: Reiniciar o servidor Next.js

**Importante:** Depois de mudar o `.env.local`, você **DEVE reiniciar** o servidor:

1. Pare o servidor atual (pressione `Ctrl+C` no terminal do Next.js)
2. Inicie novamente:

```bash
cd frontend
npm run dev
```

---

### Passo 4: Testar

1. Abra o navegador em `http://localhost:3000`
2. Abra o Console do navegador (F12 → Console)
3. Os erros 404 devem ter desaparecido!

---

## 🧪 Testar se a API está funcionando

Antes de tudo, teste se a API está respondendo:

No navegador, abra:
```
http://localhost:8000/api/public/noticias
```

Ou no terminal:
```bash
curl http://localhost:8000/api/public/noticias
```

**Deve retornar:** `[]` (array vazio) ou dados em JSON.

Se retornar erro 404 ou não conectar, verifique:
- A API está rodando? (`php artisan serve`)
- A porta está correta? (geralmente 8000)

---

## 📝 Resumo dos Arquivos

### Para Desenvolvimento Local:
**`frontend/.env.local`**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Para Produção:
Quando for fazer build para produção, use:
```bash
NEXT_PUBLIC_API_URL=https://clamatec.com/api npm run build
```

Ou edite temporariamente o `.env.local` antes do build.

---

## ⚠️ Problemas Comuns

### 1. "CORS Error"
Se aparecer erro de CORS, verifique o arquivo `backend/config/cors.php` e certifique-se que permite `http://localhost:3000`.

### 2. "Connection Refused"
- Verifique se a API está rodando: `php artisan serve`
- Verifique a porta: padrão é 8000

### 3. Erros continuam aparecendo
- **Reinicie o servidor Next.js** após mudar o `.env.local`
- Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
- Verifique se o `.env.local` está correto

---

## 🎯 Checklist

- [ ] API Laravel está rodando (`php artisan serve`)
- [ ] `.env.local` configurado com `http://localhost:8000/api`
- [ ] Servidor Next.js foi **reiniciado** após mudar o `.env.local`
- [ ] Testou a API diretamente no navegador (`http://localhost:8000/api/public/noticias`)
- [ ] Erros 404 desapareceram no console

---

## ✅ Pronto!

Depois desses passos, o frontend deve conectar na API local e os erros 404 devem desaparecer! 🚀
