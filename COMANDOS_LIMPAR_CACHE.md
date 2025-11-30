# 📋 Comandos para Limpar Cache do Laravel

## 🎯 Execute no Servidor

### Via SSH ou Terminal do cPanel:

```bash
# 1. Ir para o diretório do Laravel
cd ~/public_html/api

# 2. Limpar todos os caches
php artisan route:clear
php artisan config:clear
php artisan cache:clear

# 3. Verificar rotas
php artisan route:list | grep "consulta-online"

# 4. Recriar caches (opcional, mas recomendado)
php artisan route:cache
php artisan config:cache
```

---

## ✅ Resultado Esperado

**Após executar `php artisan route:list | grep "consulta-online"`:**

**Deve aparecer:**
```
POST   api/consulta-online/buscar  ... ConsultaOnlineController@buscarPorNIF
GET    api/consulta-online/{id}    ... ConsultaOnlineController@obterLinkConsulta
```

---

## ⚠️ Se Ainda Não Aparecer

**Verifique:**

1. [ ] O arquivo `routes/api.php` existe?
2. [ ] O controller `ConsultaOnlineController` existe?
3. [ ] O método `buscarPorNIF` existe no controller?

---

**Execute os comandos e me diga o resultado!** 🚀

