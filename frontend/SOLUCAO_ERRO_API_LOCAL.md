# 🔧 Solução: Erro 404 na API Local

## Problema

Quando você roda o frontend localmente, ele está tentando acessar a API de produção (`https://clamatec.com/api`), mas você precisa da API local rodando.

## ✅ Solução

### 1. Verificar se a API Laravel está rodando localmente

Abra um terminal e rode o backend:

```bash
cd backend
php artisan serve
```

Isso deve iniciar a API em `http://localhost:8000`

### 2. Verificar a porta

Se sua API está em outra porta, atualize o `.env.local`:

```bash
# Se estiver na porta 8001:
NEXT_PUBLIC_API_URL=http://localhost:8001/api

# Se estiver na porta 3000:
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Reiniciar o servidor de desenvolvimento

Depois de atualizar o `.env.local`, **reinicie o servidor Next.js**:

```bash
# Pare o servidor (Ctrl+C)
# Depois inicie novamente:
cd frontend
npm run dev
```

### 4. Verificar se está funcionando

Abra o navegador e veja o console. Os erros 404 devem desaparecer.

---

## 📝 Arquivos de Configuração

- **`.env.local`** → Usado em desenvolvimento (já criado: `http://localhost:8000/api`)
- **`.env.production`** → Usado quando faz build para produção (`https://clamatec.com/api`)

### Importante!

- **Nunca faça commit** do `.env.local` no Git
- Use `.env.production` apenas quando for fazer deploy
- Para build de produção, o Next.js usa automaticamente a variável definida no momento do build

---

## 🔍 Verificar se a API está respondendo

Teste diretamente no navegador ou terminal:

```bash
curl http://localhost:8000/api/public/noticias
```

Ou abra no navegador:
```
http://localhost:8000/api/public/noticias
```

Deve retornar JSON (mesmo que vazio `[]`).

---

## ⚠️ Se ainda não funcionar

1. **Verifique se o backend está rodando:**
   ```bash
   # No terminal do backend:
   php artisan serve
   ```

2. **Verifique a URL no console do navegador:**
   - Abra as DevTools (F12)
   - Vá na aba "Network"
   - Veja qual URL está sendo chamada

3. **Verifique o CORS:**
   - O backend Laravel precisa permitir requisições de `http://localhost:3000` (ou a porta do Next.js)
   - Verifique o arquivo `backend/config/cors.php`

---

## ✅ Depois que funcionar localmente

Quando for fazer build para produção, você pode:

**Opção 1:** Usar variável de ambiente no momento do build:
```bash
NEXT_PUBLIC_API_URL=https://clamatec.com/api npm run build
```

**Opção 2:** Editar temporariamente o `.env.local` antes do build:
```bash
# Editar .env.local para:
NEXT_PUBLIC_API_URL=https://clamatec.com/api

# Depois fazer build:
npm run build

# Depois voltar para desenvolvimento:
# Editar .env.local para:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

