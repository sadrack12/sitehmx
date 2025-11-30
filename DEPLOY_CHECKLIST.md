# ✅ Checklist de Deploy no cPanel

Use este checklist para garantir que todos os passos foram executados corretamente.

## 📋 Antes de Começar

- [ ] Acesso ao cPanel confirmado
- [ ] PHP 8.1+ verificado (cPanel → Select PHP Version)
- [ ] Composer disponível no servidor (via Terminal/SSH)
- [ ] Node.js disponível (se usar opção Node.js para frontend)
- [ ] Domínio configurado e apontando para o servidor
- [ ] SSL/HTTPS instalado ou disponível

---

## 🔧 PARTE 1: Backend (Laravel)

### Preparação Local
- [ ] Executado `./scripts/prepare-backend.sh` OU manualmente:
  - [ ] `composer install --optimize-autoloader --no-dev`
  - [ ] `php artisan key:generate`
  - [ ] `.env` configurado (para referência)
- [ ] APP_KEY gerado e anotado

### Banco de Dados no cPanel
- [ ] Banco de dados criado (ex: `sitehmx_db`)
- [ ] Usuário MySQL criado
- [ ] Usuário adicionado ao banco com privilégios completos
- [ ] Credenciais anotadas (nome completo do banco/usuário do cPanel)

### Upload do Backend
- [ ] Todos os arquivos do `backend/` enviados para `public_html/api/`
- [ ] Arquivo `.env` **NÃO** foi enviado (criar manualmente no servidor)
- [ ] Pastas excluídas: `.git/`, `node_modules/` (se existir)

### Configuração no Servidor
- [ ] Arquivo `.env` criado em `public_html/api/` com configurações corretas:
  - [ ] `APP_ENV=production`
  - [ ] `APP_DEBUG=false`
  - [ ] `APP_KEY` definido
  - [ ] Credenciais do banco configuradas
  - [ ] `APP_URL` e `FRONTEND_URL` configurados
- [ ] Permissões configuradas:
  - [ ] `storage/` → 775
  - [ ] `bootstrap/cache/` → 775
- [ ] Arquivo `.htaccess` em `public_html/api/public/` configurado

### Execução no Servidor
- [ ] Migrações executadas: `php artisan migrate --force`
- [ ] Seeders executados (se necessário): `php artisan db:seed --force`
- [ ] Storage link criado: `php artisan storage:link`
- [ ] Cache otimizado:
  - [ ] `php artisan config:cache`
  - [ ] `php artisan route:cache`
  - [ ] `php artisan view:cache`

### Testes do Backend
- [ ] API responde: `https://seudominio.com/api/public/noticias`
- [ ] Retorna JSON (mesmo que vazio)
- [ ] Sem erros 500 nos logs

---

## 🎨 PARTE 2: Frontend (Next.js)

### Escolha do Método
Escolha uma opção:

#### Opção A: Build Estático (Mais Simples)
- [ ] Executado `./scripts/prepare-frontend.sh static` OU:
  - [ ] `.env.local` criado com `NEXT_PUBLIC_API_URL`
  - [ ] `output: 'export'` adicionado no `next.config.js`
  - [ ] `npm run build` executado
  - [ ] Pasta `out/` criada

#### Opção B: Com Node.js (Mais Flexível)
- [ ] Executado `./scripts/prepare-frontend.sh nodejs` OU:
  - [ ] `.env.local` criado com `NEXT_PUBLIC_API_URL`
  - [ ] `npm run build` executado
  - [ ] Pasta `.next/` criada

### Upload do Frontend

#### Se Opção A (Estático):
- [ ] Toda a pasta `out/` enviada para `public_html/`
- [ ] Pasta `images/` incluída
- [ ] Permissões configuradas: pastas 755, arquivos 644

#### Se Opção B (Node.js):
- [ ] Pasta `.next/` enviada
- [ ] Pasta `public/` enviada
- [ ] Arquivos enviados: `package.json`, `next.config.js`, `server.js`
- [ ] `.env.local` criado no servidor
- [ ] Node.js App criado no cPanel:
  - [ ] Versão 18.x ou superior
  - [ ] Application root: `public_html`
  - [ ] Startup file: `server.js`
- [ ] `npm install --production` executado no servidor
- [ ] Aplicação Node.js iniciada/restartada

### Testes do Frontend
- [ ] Site carrega: `https://seudominio.com`
- [ ] Imagens aparecem corretamente
- [ ] Navegação funciona
- [ ] API conecta (sem erros CORS)

---

## ⚙️ PARTE 3: Configurações Finais

### CORS
- [ ] `config/cors.php` configurado com domínio correto
- [ ] Ou mantido `['*']` se necessário

### SSL/HTTPS
- [ ] Certificado SSL instalado (Let's Encrypt ou outro)
- [ ] Site acessível via HTTPS
- [ ] Redirecionamento HTTP → HTTPS configurado (opcional)

### Variáveis de Ambiente
- [ ] Frontend: `NEXT_PUBLIC_API_URL` aponta para API correta
- [ ] Backend: `APP_URL` e `FRONTEND_URL` corretos
- [ ] Sem barras no final das URLs

---

## 🧪 PARTE 4: Testes Completos

### Testes Funcionais
- [ ] Página inicial carrega corretamente
- [ ] Notícias são exibidas (se houver)
- [ ] Eventos são exibidos (se houver)
- [ ] Corpo diretivo é exibido
- [ ] Imagens carregam corretamente
- [ ] Formulário de contato funciona
- [ ] Login funciona: `/gestao/login`
- [ ] Painel administrativo acessível após login
- [ ] CRUD de notícias funciona
- [ ] CRUD de eventos funciona
- [ ] Upload de imagens funciona

### Testes de API
- [ ] `GET /api/public/noticias` → retorna JSON
- [ ] `GET /api/public/eventos` → retorna JSON
- [ ] `GET /api/public/corpo-diretivo` → retorna JSON
- [ ] `POST /api/login` → retorna token
- [ ] Rotas protegidas requerem autenticação

### Testes de Performance
- [ ] Páginas carregam em menos de 3 segundos
- [ ] Imagens são otimizadas
- [ ] Sem erros no console do navegador
- [ ] Sem erros 404 para recursos estáticos

---

## 🔒 Segurança

- [ ] `APP_DEBUG=false` em produção
- [ ] `APP_ENV=production` em produção
- [ ] Arquivo `.env` não está acessível publicamente
- [ ] Senhas do banco são seguras
- [ ] CORS configurado corretamente (não permitir *)
- [ ] Permissões de arquivos verificadas:
  - [ ] Pastas sensíveis não têm permissões 777
  - [ ] Arquivos de configuração não são públicos
- [ ] Logs não expõem informações sensíveis

---

## 📊 Monitoramento

- [ ] Logs do Laravel configurados: `storage/logs/laravel.log`
- [ ] Logs do Node.js verificados (se aplicável)
- [ ] Erros sendo logados corretamente
- [ ] Acesso aos logs no servidor testado

---

## 💾 Backup

- [ ] Backup do banco de dados feito
- [ ] Backup dos arquivos feito
- [ ] Estratégia de backup automático planejada

---

## 🚀 Otimizações

### Laravel
- [ ] Cache de configuração ativado
- [ ] Cache de rotas ativado
- [ ] Cache de views ativado
- [ ] Opcache ativado (se disponível)

### Frontend
- [ ] Build otimizado para produção
- [ ] Imagens otimizadas
- [ ] Assets minificados

### Servidor
- [ ] Gzip/Brotli ativado no cPanel
- [ ] Cache do navegador configurado
- [ ] CDN configurado (opcional)

---

## ✅ Finalização

- [ ] Todos os testes passaram
- [ ] Sem erros nos logs
- [ ] Site acessível e funcional
- [ ] Documentação atualizada
- [ ] Credenciais de acesso documentadas e seguras

---

## 📝 Notas

_Use este espaço para anotar qualquer observação importante durante o deploy:_

```
Data do Deploy: _______________
Domínio: ______________________
Versão do PHP: ________________
Versão do Node.js: _____________
Observações: ___________________
_____________________________
```

---

## 🔄 Atualizações Futuras

Quando precisar atualizar o sistema:

- [ ] Backup feito antes da atualização
- [ ] Arquivos novos enviados
- [ ] Migrações executadas (se houver)
- [ ] Cache limpo e recriado
- [ ] Testes realizados após atualização

---

**✅ Deploy concluído com sucesso!**

Se todos os itens estiverem marcados, seu sistema está pronto para uso! 🎉
