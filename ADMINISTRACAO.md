# Guia de Administração - Hospital Geral do Moxico

## 📋 Visão Geral

Sistema administrativo completo para gerenciar todo o conteúdo da página principal do site do Hospital Geral do Moxico.

## 🚀 Configuração Inicial

### Backend

1. **Executar Migrations**
```bash
cd backend
php artisan migrate
```

2. **Criar Usuário Admin**
```bash
php artisan tinker
```
```php
$user = \App\Models\User::create([
    'name' => 'Administrador',
    'email' => 'admin@hospitalmoxico.gov.ao',
    'password' => bcrypt('password'),
    'role' => 'admin'
]);
```

3. **Configurar Storage Link (para imagens)**
```bash
php artisan storage:link
```

### Frontend

1. **Configurar Variável de Ambiente**
Criar arquivo `.env.local` na pasta `frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📁 Estrutura de Dados

### Tabelas Criadas

1. **noticias** - Notícias do site
2. **eventos** - Eventos e galeria
3. **servicos** - Serviços especializados e de apoio
4. **valores** - Valores do hospital
5. **parceiros** - Parceiros e amigos
6. **corpo_diretivo** - Membros do corpo diretivo
7. **hero_slides** - Slides da seção hero
8. **mensagem_director** - Mensagem do director geral

## 🔐 Acesso Administrativo

### Login
- URL: `/gestao/login`
- Credenciais padrão: `admin@hospitalmoxico.gov.ao` / `password`

### Permissões
- Apenas usuários com `role = 'admin'` podem acessar as páginas administrativas
- Middleware `admin` protege todas as rotas administrativas

## 📝 Páginas Administrativas

### Menu de Navegação

1. **Dashboard** (`/gestao/dashboard`)
   - Visão geral do sistema
   - Estatísticas de consultas

2. **Notícias** (`/gestao/admin/noticias`)
   - Criar, editar, deletar notícias
   - Upload de imagens
   - Controle de publicação e ordem

3. **Eventos** (`/gestao/admin/eventos`)
   - Gerenciar eventos e galeria
   - Marcar eventos como destaque
   - Upload de imagens

4. **Serviços** (`/gestao/admin/servicos`)
   - Gerenciar serviços especializados e de apoio
   - Definir tipo (especializado/apoio)
   - Upload de imagens

5. **Valores** (`/gestao/admin/valores`)
   - Gerenciar valores do hospital
   - Ícones emoji
   - Descrições opcionais

6. **Parceiros** (`/gestao/admin/parceiros`)
   - Gerenciar parceiros e amigos
   - Upload de logos
   - Links para sites

7. **Corpo Diretivo** (`/gestao/admin/corpo-diretivo`)
   - Gerenciar membros do corpo diretivo
   - Upload de fotos
   - Cargos e biografias

8. **Hero Slides** (`/gestao/admin/hero-slides`)
   - Gerenciar slides da seção hero
   - Upload de imagens
   - Botões e links opcionais

9. **Mensagem do Director** (`/gestao/admin/mensagem-director`)
   - Mensagem única do director geral
   - Upload de foto
   - Texto completo

## 🔌 API Endpoints

### Base URL
`/api/admin/`

### Endpoints Disponíveis

#### Notícias
- `GET /admin/noticias` - Listar todas
- `POST /admin/noticias` - Criar nova
- `GET /admin/noticias/{id}` - Ver detalhes
- `PUT /admin/noticias/{id}` - Atualizar
- `DELETE /admin/noticias/{id}` - Deletar

#### Eventos
- `GET /admin/eventos` - Listar todos
- `POST /admin/eventos` - Criar novo
- `GET /admin/eventos/{id}` - Ver detalhes
- `PUT /admin/eventos/{id}` - Atualizar
- `DELETE /admin/eventos/{id}` - Deletar

#### Serviços
- `GET /admin/servicos` - Listar todos
- `GET /admin/servicos?tipo=especializado` - Filtrar por tipo
- `POST /admin/servicos` - Criar novo
- `PUT /admin/servicos/{id}` - Atualizar
- `DELETE /admin/servicos/{id}` - Deletar

#### Valores
- `GET /admin/valores` - Listar todos
- `POST /admin/valores` - Criar novo
- `PUT /admin/valores/{id}` - Atualizar
- `DELETE /admin/valores/{id}` - Deletar

#### Parceiros
- `GET /admin/parceiros` - Listar todos
- `POST /admin/parceiros` - Criar novo
- `PUT /admin/parceiros/{id}` - Atualizar
- `DELETE /admin/parceiros/{id}` - Deletar

#### Corpo Diretivo
- `GET /admin/corpo-diretivo` - Listar todos
- `POST /admin/corpo-diretivo` - Criar novo
- `PUT /admin/corpo-diretivo/{id}` - Atualizar
- `DELETE /admin/corpo-diretivo/{id}` - Deletar

#### Hero Slides
- `GET /admin/hero-slides` - Listar todos
- `POST /admin/hero-slides` - Criar novo
- `PUT /admin/hero-slides/{id}` - Atualizar
- `DELETE /admin/hero-slides/{id}` - Deletar

#### Mensagem do Director
- `GET /admin/mensagem-director` - Ver mensagem atual
- `POST /admin/mensagem-director` - Criar nova
- `PUT /admin/mensagem-director/{id}` - Atualizar
- `DELETE /admin/mensagem-director/{id}` - Deletar

#### Dashboard
- `GET /admin/dashboard` - Estatísticas e menu

## 📤 Upload de Arquivos

### Imagens
- Formatos aceitos: JPG, PNG, GIF
- Tamanho máximo: 2MB
- Armazenamento: `storage/app/public/`
- Acesso público: `/storage/{caminho}`

### Pastas de Armazenamento
- Notícias: `storage/app/public/noticias/`
- Eventos: `storage/app/public/eventos/`
- Serviços: `storage/app/public/servicos/`
- Parceiros: `storage/app/public/parceiros/`
- Corpo Diretivo: `storage/app/public/corpo-diretivo/`
- Hero Slides: `storage/app/public/hero-slides/`
- Mensagem Director: `storage/app/public/mensagem-director/`

## 🔒 Segurança

- Todas as rotas administrativas requerem autenticação via Sanctum
- Middleware `admin` verifica se o usuário tem role `admin`
- Uploads validados por tipo e tamanho
- CSRF protection ativo

## 📱 Funcionalidades

### Controle de Publicação
- Todos os itens têm campo `published` (boolean)
- Apenas itens publicados aparecem no site público
- Permite trabalhar com rascunhos

### Ordenação
- Campo `order` (integer) para controlar ordem de exibição
- Ordenação crescente por padrão

### Destaques
- Eventos podem ser marcados como `featured`
- Aparecem em destaque na página

## 🛠️ Troubleshooting

### Imagens não aparecem
1. Verificar se `php artisan storage:link` foi executado
2. Verificar permissões da pasta `storage`
3. Verificar URL base no frontend

### Erro 403 (Forbidden)
- Verificar se o usuário tem `role = 'admin'`
- Verificar se o token está válido

### Erro ao fazer upload
- Verificar tamanho máximo (2MB)
- Verificar formato da imagem
- Verificar permissões da pasta storage

## 📚 Próximos Passos

1. Integrar dados do backend com a página principal (substituir constants)
2. Criar endpoints públicos para buscar dados publicados
3. Adicionar paginação nas listagens administrativas
4. Implementar busca e filtros avançados
5. Adicionar logs de auditoria

