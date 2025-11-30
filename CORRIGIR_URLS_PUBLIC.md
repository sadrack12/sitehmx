# 🔧 Corrigir URLs com /public/ no Backend

## ⚠️ Problema

**A API está retornando URLs com `/public/` em vez de `/api/`:**

```json
{
  "url": "/public/consultas/2/requisicao-exames?nif=500000000"
}
```

**Deveria ser:**
```json
{
  "url": "/api/consultas/2/requisicao-exames?nif=500000000"
}
```

---

## ✅ CORREÇÃO APLICADA

**Arquivo corrigido:** `backend/app/Http/Controllers/Api/PublicController.php`

**Mudanças:**
- ❌ Antes: `/public/consultas/{$consultaId}/prescricao`
- ✅ Agora: `/api/consultas/{$consultaId}/prescricao`

- ❌ Antes: `/public/consultas/{$consultaId}/requisicao-exames`
- ✅ Agora: `/api/consultas/{$consultaId}/requisicao-exames`

- ❌ Antes: `/public/consultas/{$consultaId}/recibo`
- ✅ Agora: `/api/consultas/{$consultaId}/recibo`

---

## 🚀 APLICAR NO SERVIDOR

### Via cPanel File Manager ou FTP:

1. **Faça upload de:** `backend/app/Http/Controllers/Api/PublicController.php`
2. **Para:** `public_html/api/app/Http/Controllers/Api/PublicController.php`
3. **Substitua o arquivo existente**

### Depois, limpe o cache:

**No servidor, execute:**

```bash
cd ~/public_html/api
php artisan route:clear
php artisan config:clear
php artisan route:cache
```

---

## ✅ Verificar

**Após aplicar, teste:**

1. **Acesse:** `https://clamatec.com/api/consultas/2/documentos?nif=500000000`
2. **As URLs devem estar com `/api/` em vez de `/public/`**

---

**Faça upload do arquivo corrigido para o servidor!** 🚀
