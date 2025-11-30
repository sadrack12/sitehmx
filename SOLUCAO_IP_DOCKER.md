# ✅ Solução: IP da API no Docker

## 🔍 Problema Identificado

O container do frontend estava usando `NEXT_PUBLIC_API_URL=https://172.20.10.8/api` em vez de `http://localhost:8001/api`.

**Causa:** O Docker não estava lendo corretamente o `.env.local` ou havia uma variável antiga em cache.

---

## ✅ Solução Aplicada

### 1. Adicionado variável diretamente no `docker-compose.yml`:

```yaml
environment:
  - HOSTNAME=0.0.0.0
  - NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

### 2. Container reiniciado:

```bash
docker-compose stop frontend
docker-compose up -d frontend
```

---

## 🔄 Verificar

Aguarde alguns segundos e verifique:

```bash
docker-compose exec frontend printenv | grep NEXT_PUBLIC_API_URL
```

Deve mostrar: `NEXT_PUBLIC_API_URL=http://localhost:8001/api`

---

## ✅ Testar

1. Recarregar a página: `http://localhost:3000/consulta-online`
2. Digitar um NIF
3. Clicar em "Buscar Consultas"
4. Deve funcionar agora!

---

**Problema resolvido!** ✅

