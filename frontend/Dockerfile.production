# Dockerfile para produção - Next.js build estático
# Este Dockerfile faz o build no servidor durante o deploy

# Stage 1: Instalar dependências
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo dev para build)
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Variáveis de ambiente para build (podem ser passadas via ARG)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://hospitalgeraldomoxico.com/api}

# Build estático do Next.js
RUN npm run build

# Verificar se o build gerou arquivos estáticos
RUN if [ ! -d "/app/out" ]; then \
      echo "❌ Erro: Build não gerou pasta out!" && exit 1; \
    else \
      echo "✅ Build concluído com sucesso!" && \
      ls -la /app/out | head -10; \
    fi

# Stage 3: Servir arquivos estáticos com Nginx
FROM nginx:alpine

# Copiar arquivos buildados da pasta out
COPY --from=builder /app/out /usr/share/nginx/html

# Criar diretório se não existir
RUN mkdir -p /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

# Nginx já está configurado para servir arquivos estáticos
CMD ["nginx", "-g", "daemon off;"]

