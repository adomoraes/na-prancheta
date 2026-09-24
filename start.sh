#!/usr/bin/env bash

# ==============================================================================
# ⚽ Na Prancheta — Script de Inicialização Unificada (Local Dev)
# ==============================================================================
# Inicia PostgreSQL (Docker), Backend API (Laravel 11) e Frontend SPA (React/Vite)
# com um único comando e encerramento limpo ao pressionar Ctrl+C.
# ==============================================================================

set -uo pipefail

# Cores e Estilos para o Terminal
BOLD="\033[1m"
GREEN="\033[1;32m"
BLUE="\033[1;34m"
CYAN="\033[1;36m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
DIM="\033[2m"
NC="\033[0m"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

echo -e "${GREEN}${BOLD}"
echo "======================================================================"
echo " ⚽  NA PRANCHETA — AMBIENTE DE DESENVOLVIMENTO LOCAL"
echo "======================================================================"
echo -e "${NC}"

# ------------------------------------------------------------------------------
# 1. Verificação de Dependências Básicas do Sistema
# ------------------------------------------------------------------------------
echo -e "${CYAN}🔍 [1/4] Verificando pré-requisitos do ambiente...${NC}"

missing_deps=()
for cmd in node npm php composer; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        missing_deps+=("$cmd")
    fi
done

if [ ${#missing_deps[@]} -ne 0 ]; then
    echo -e "${RED}❌ Ferramentas ausentes no sistema:${NC} ${missing_deps[*]}"
    echo -e "${YELLOW}Por favor, instale as dependências acima antes de prosseguir.${NC}"
    exit 1
fi

echo -e "   ${DIM}✔ Node.js $(node -v) / npm $(npm -v)${NC}"
echo -e "   ${DIM}✔ PHP $(php -r 'echo PHP_VERSION;') / Composer $(composer -V | awk '{print $3}')${NC}"

# Validação das extensões de banco de dados do PHP
if ! php -m | grep -qiE "pdo_sqlite|pdo_pgsql"; then
    echo -e "${RED}❌ Extensão PDO do banco de dados não encontrada no PHP!${NC}"
    echo -e "${YELLOW}O Laravel precisa do driver SQLite (pdo_sqlite) ou PostgreSQL (pdo_pgsql) para conectar ao banco.${NC}"
    echo -e "${YELLOW}Para resolver, execute no seu terminal:${NC}"
    echo -e "   ${BOLD}${GREEN}sudo apt install -y php8.3-sqlite3 php8.3-pgsql${NC}"
    exit 1
fi

# ------------------------------------------------------------------------------
# 2. Inicialização do Banco de Dados PostgreSQL (Docker)
# ------------------------------------------------------------------------------
echo -e "${CYAN}🐘 [2/4] Verificando banco de dados PostgreSQL...${NC}"

# Função para testar se a porta 5432 já está aberta
is_pg_ready() {
    if command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -q "^na_prancheta_db$"; then
        docker exec na_prancheta_db pg_isready -U postgres -q 2>/dev/null
        return $?
    fi
    # Fallback teste de conexão TCP caso rode nativo
    (echo > /dev/tcp/127.0.0.1/5432) >/dev/null 2>&1
    return $?
}

if ! is_pg_ready; then
    if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
        echo -e "   ${YELLOW}Iniciando container PostgreSQL 16 via Docker Compose...${NC}"
        if docker compose version >/dev/null 2>&1; then
            docker compose -f "$ROOT_DIR/docker-compose.yml" up -d postgres >/dev/null 2>&1
        else
            docker-compose -f "$ROOT_DIR/docker-compose.yml" up -d postgres >/dev/null 2>&1
        fi

        # Aguarda o PostgreSQL aceitar conexões (máx 15 segundos)
        echo -n "   Aguardando PostgreSQL ficar pronto..."
        retries=15
        while [ $retries -gt 0 ]; do
            if is_pg_ready; then
                break
            fi
            sleep 1
            echo -n "."
            retries=$((retries - 1))
        done
        echo ""

        if [ $retries -eq 0 ]; then
            echo -e "${RED}⚠️  Tempo limite excedido aguardando PostgreSQL. Verifique os logs do Docker.${NC}"
        else
            echo -e "   ${GREEN}✔ PostgreSQL pronto para receber conexões!${NC}"
        fi
    else
        echo -e "   ${YELLOW}⚠️  Docker não está em execução. Certifique-se de ter um PostgreSQL rodando na porta 5432.${NC}"
    fi
else
    echo -e "   ${GREEN}✔ PostgreSQL já está em execução na porta 5432.${NC}"
fi

# ------------------------------------------------------------------------------
# 3. Preparação do Backend (Laravel 11)
# ------------------------------------------------------------------------------
echo -e "${CYAN}⚙️  [3/4] Configurando Backend Laravel...${NC}"

# .env do backend
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "   ${YELLOW}Criando backend/.env a partir do .env.example...${NC}"
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    php "$BACKEND_DIR/artisan" key:generate --no-interaction >/dev/null 2>&1
fi

# Dependências do Composer
if [ ! -d "$BACKEND_DIR/vendor" ]; then
    echo -e "   ${YELLOW}Instalando dependências do Composer (primeira execução)...${NC}"
    composer install --working-dir="$BACKEND_DIR" --no-interaction --quiet
fi

# Executar migrations se necessário
if ! php "$BACKEND_DIR/artisan" migrate --force; then
    echo -e "${RED}❌ Falha ao executar as migrations do Laravel.${NC}"
    echo -e "${YELLOW}Verifique os drivers do PHP ou a conexão com o banco em backend/.env.${NC}"
    exit 1
fi

# Seed inicial se banco estiver sem dados de partida
PARTIDA_COUNT=$(php "$BACKEND_DIR/artisan" tinker --execute="echo App\\Models\\Partida::count();" 2>/dev/null || echo "1")
if [ "$PARTIDA_COUNT" = "0" ]; then
    echo -e "   ${YELLOW}Banco vazio. Executando seed com dados da partida teste...${NC}"
    php "$BACKEND_DIR/artisan" db:seed --class=LegacyInitialDataSeeder --force
fi

echo -e "   ${GREEN}✔ Backend pronto!${NC}"

# ------------------------------------------------------------------------------
# 4. Preparação do Frontend (React 19 / Vite)
# ------------------------------------------------------------------------------
echo -e "${CYAN}🌐 [4/4] Verificando dependências do Frontend...${NC}"
if [ ! -d "$ROOT_DIR/node_modules" ]; then
    echo -e "   ${YELLOW}Instalando pacotes npm (primeira execução)...${NC}"
    npm install --prefix "$ROOT_DIR" --quiet
fi
echo -e "   ${GREEN}✔ Frontend pronto!${NC}"

# ------------------------------------------------------------------------------
# 5. Verificação de Portas Ocupadas
# ------------------------------------------------------------------------------
check_port() {
    local port=$1
    if ss -lptn "sport = :$port" 2>/dev/null | grep -q LISTEN; then
        return 0
    fi
    return 1
}

if check_port 8000; then
    echo -e "${RED}⚠️  Aviso: A porta 8000 (Backend API) já está em uso por outro processo.${NC}"
fi

if check_port 3000; then
    echo -e "${RED}⚠️  Aviso: A porta 3000 (Frontend Vite) já está em uso por outro processo.${NC}"
fi

# ------------------------------------------------------------------------------
# 6. Painel de Status
# ------------------------------------------------------------------------------
echo ""
echo -e "${BOLD}${GREEN}======================================================================${NC}"
echo -e "${BOLD} 🚀  SERVIÇOS INICIADOS COM SUCESSO!${NC}"
echo -e "${BOLD}${GREEN}======================================================================${NC}"
echo -e " 🌐  ${BOLD}Frontend (SPA):${NC}  ${CYAN}http://localhost:3000${NC}"
echo -e " ⚙️   ${BOLD}Backend API:${NC}     ${CYAN}http://localhost:8000/api${NC}"
echo -e " 🐘  ${BOLD}PostgreSQL:${NC}      ${CYAN}localhost:5432 (na_prancheta)${NC}"
echo -e "${DIM}----------------------------------------------------------------------${NC}"
echo -e " ${YELLOW}Pressione ${BOLD}[Ctrl+C]${NC}${YELLOW} a qualquer momento para encerrar os servidores.${NC}"
echo -e "${BOLD}${GREEN}======================================================================${NC}"
echo ""

# ------------------------------------------------------------------------------
# 7. Execução dos Servidores com Encerramento Limpo (Trap)
# ------------------------------------------------------------------------------
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Encerrando serviços locais do Na Prancheta...${NC}"
    
    # Desativa traps para evitar chamadas recursivas
    trap - SIGINT SIGTERM EXIT
    
    # Finaliza todos os processos filhos da sessão
    jobs -p | xargs -r kill -TERM 2>/dev/null || true
    
    # Aguarda encerramento
    sleep 0.5
    
    echo -e "${GREEN}✅ Todos os processos foram encerrados. Bom descanso e até o próximo jogo! ⚽${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Executa Backend Laravel em background com prefixo colorido
(
    cd "$BACKEND_DIR"
    FORCE_COLOR=1 php artisan serve --host=127.0.0.1 --port=8000 2>&1 \
        | awk '{print "\033[1;34m[API]\033[0m  " $0; fflush()}'
) &

# Executa Frontend Vite em background com prefixo colorido
(
    cd "$ROOT_DIR"
    FORCE_COLOR=1 npm run dev -- --clearScreen false 2>&1 \
        | awk '{print "\033[1;32m[WEB]\033[0m  " $0; fflush()}'
) &

# Aguarda encerramento de qualquer um dos processos
wait -n 2>/dev/null || wait
