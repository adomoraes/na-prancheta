# ==============================================================================
# ⚽ Na Prancheta — Dockerfile de Produção (Frontend React 19 + Vite 6 + PWA)
# ==============================================================================

# Estágio 1: Compilação dos artefatos estáticos
FROM node:22-alpine AS build_stage

WORKDIR /app

# Instalação limpa de dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copia código fonte do frontend
COPY . .

# Argumento de build para configurar a URL pública da API REST
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-/api}

# Compilação para produção (pasta dist/)
RUN npm run build

# Estágio 2: Servidor Web Nginx ultraleve para servir a SPA
FROM nginx:alpine

# Configuração customizada com roteamento SPA e cabeçalhos de PWA
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copia os artefatos compilados
COPY --from=build_stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
