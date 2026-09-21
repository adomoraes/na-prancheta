# ⚽ Na Prancheta

> **Gestão Esportiva & Vestiário Amador**  
> Aplicação moderna para organização de dia de jogo, gestão de elenco, vaquinha de arbitragem, prancheta tática, protocolo disciplinar de vestiário e backoffice administrativo para o futebol amador.

---

## 🌟 Visão Geral

O **Na Prancheta** foi desenvolvido para resolver as dores reais que acontecem nos bastidores do futebol amador aos finais de semana: atrasos na preleção, confusão no rateio da taxa de arbitragem, camisas devolvidas do avesso, malas perdidas, descontrole de convocações e falta de um backoffice administrativo seguro.

A solução é dividida em uma **SPA desacoplada em React 19** com interface mobile-first (PWA nativo) e um **backend robusto em Laravel 11** com persistência relacional ACID em **PostgreSQL 16**.

O projeto conta com rastreabilidade total e especificações executáveis geradas através do framework de engenharia reversa **Reversa** (disponíveis em `_reversa_sdd/`).

---

## 🎯 Principais Módulos & Regras de Negócio

### 1. ⏱️ Protocolo do Vestiário (Régua T-50, T-35, T-25)
- **T-50 (Abertura do Vestiário):** Entrega e distribuição dos uniformes oficiais.
- **T-35 (Preleção & Corte Disciplinar):** Atletas que chegam ao vestiário após o horário limite sofrem **corte disciplinar compulsório** e devem obrigatoriamente iniciar a partida no banco de reservas.
- **T-25 (Aquecimento de Campo):** Transição de elenco e início dos trabalhos físicos com bola.

### 2. 📋 Ficha do Jogo & Presença em 1 Toque
- Confirmação ágil pelos atletas (`Vou`, `Não vou`, `Dúvida`).
- **Teto Regulamentar:** Limite estrito de 14 confirmados na partida.
- **Transbordamento:** O 15º atleta confirmado em diante é automaticamente alocado na **Lista de Espera**.
- **Compartilhamento Público:** Links de WhatsApp para convidados e torcida acessarem horário, adversário e localização GPS sem necessidade de login prévio.

### 3. 🛡️ Prancheta Tática 4-3-3 (Comissão Técnica)
- Visualização de campo sintético com posições interativas.
- Teto regulamentar de **11 titulares** em campo.
- Validação no frontend e backend contra escalação de atletas atrasados na preleção.
- Ação **"Liberar Escalação (T-35)"** protegida por perfil RBAC (`tecnico` e `geral`).

### 4. 💰 Painel do Tesoureiro do Dia & Vaquinha PIX
- Rateio transparente da taxa de arbitragem (meta de R$ 300,00) apenas entre os confirmados.
- Cópia da chave PIX em 1 toque e gerador automático de relatório formatado para grupos de WhatsApp.
- Ação **"Encerrar & Creditar Caixa"**: Liquidação da arbitragem e transferência automática do saldo excedente para o **Caixa Geral da equipe**.

### 5. 📦 Almoxarifado, Custódia de Malas & Trava da Resenha
- Catálogo e controle de patrimônio ativo (bolas, uniformes, coletes, cones, farmácia).
- **Tríplice Checagem Pós-Jogo:**
  1. 22 camisas oficiais recolhidas e **desviradas do lado correto** para lavagem.
  2. Bolsão com 6 bolas oficiais recolhido no gramado.
  3. Mala 1 trancada no porta-malas do veículo oficial de transporte.
- **Trava da Resenha:** O consumo de bebidas e a resenha social permanecem formalmente bloqueados até o registro do fechamento das malas na API.

### 6. 🏆 Scout Pós-Jogo & Eleição do MVP
- Registro estatístico por atleta: gols, assistências, cartões amarelos/vermelhos, gols sofridos de goleiro e minutos jogados.
- **Exclusividade do MVP:** Garantia no banco de dados de que apenas um atleta é eleito o Craque da Partida.

### 7. 🔐 Autenticação Segura & RBAC (Role-Based Access Control)
- **Múltiplos Provedores:** Login via Google Identity Services (GIS) com validação de token OAuth2 ou autenticação clássica por e-mail/telefone e senha com hash seguro.
- **Taxonomia Canônica de Papéis:**
  - `atleta`: Visualização da partida, confirmação de presença e consulta de dados.
  - `tecnico`: Gestão tática, escalação e scouts do jogo.
  - `financeiro`: Cobrança de vaquinha, baixa de PIX e conferência financeira.
  - `almoxarifado`: Custódia de materiais e conferência de malas (destravamento da resenha).
  - `geral`: Gestão executiva com poderes operacionais em todas as abas do dia de jogo.
  - `root`: Superusuário técnico mestre com exclusividade no backoffice administrativo.
- **Defesa em Profundidade:** Rotas de mutação protegidas via token Bearer (Sanctum) com resposta `401 Unauthorized` para visitantes anônimos e `403 Forbidden` para papéis não autorizados.

### 8. 👑 Painel Administrativo Master (ROOT Backoffice)
- **Dashboard Isolada:** Interface administrativa em Dark Mode (Zinc 950) desacoplada do fluxo da partida, acessível pelo botão "Painel Admin" no cabeçalho exclusivo para o usuário `root`.
- **5 Módulos de CRUD Mestre:**
  1. **Usuários & Perfis:** Criação, edição, alteração de papéis, redefinição de senhas com revogação forçada de tokens e exclusão de contas.
  2. **Elenco & Atletas (Soft Delete):** Cadastro e manutenção de atletas com exclusão lógica (`ativo: false`), garantindo preservação de scouts históricos e presenças passadas.
  3. **Partidas & Vestiário:** Agendamento de jogos com cálculo automatizado dos horários regulamentares de vestiário (T-50, T-35 e T-25) e alteração de status (`agendada`, `em_andamento`, `encerrada`, `cancelada`).
  4. **Caixa Geral do Clube:** Extrato financeiro consolidado de entradas e saídas administrativas com cálculo de saldo em tempo real.
  5. **Patrimônio & Almoxarifado:** Inventário de bens esportivos (bolas, coletes, redes, cones) com estado de conservação e quantidade total.
- **Endpoints Exclusivos:** Rotas sob `/api/admin/*` protegidas por middleware estrito `role:root`.

### 9. 📱 Progressive Web App (PWA) & Operação Offline
- **Instalabilidade Autônoma:** Instalação em 1 toque na tela inicial no Android, iOS (Safari) e Desktop, sem barras de navegador.
- **Resiliência Offline:** Shell da aplicação e fontes cacheadas pelo Service Worker (Workbox). Permite visualizar ficha do jogo, escalar time e consultar regras mesmo em campos ou vestiários sem sinal 4G/5G.
- **Notificação de Atualização:** Toast interativo que detecta novas versões da aplicação para recarga suave.

---

## 🏗️ Arquitetura & Stack Tecnológica

```
┌─────────────────────────────────────────────────────────────┐
│                      React 19 SPA (Vite)                    │
│   Tailwind CSS • Lucide Icons • PWA Service Worker (Workbox)│
│   AdminDashboard • LoginModal (Google GIS) • RBAC Guards    │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON / REST (Sanctum Tokens)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Laravel 11 Backend API                    │
│   PHP 8.3+ • 9 Controllers RESTful • Middleware CheckRole   │
│   Grupo /api/admin/* exclusivo ROOT • 16 Migrations         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL 16 (ou SQLite)                 │
│         ACID • Constraints CHECK / UNIQUE / Foreign Keys    │
│         Soft Delete Atletas • Índices de Performance        │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Vite PWA Plugin (Workbox).
- **Backend:** PHP 8.3+, Laravel 11, Laravel Sanctum, PHPUnit.
- **Banco de Dados:** PostgreSQL 16 (produção/Docker) / SQLite (desenvolvimento local/testes).
- **Especificações:** Documentação viva em `_reversa_sdd/` e ciclo forward em `_reversa_forward/`.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js:** versão 18+ e npm.
- **PHP:** versão 8.2+ e Composer (para execução direta) **ou** Docker com Docker Compose.

---

### ⚡ Inicialização Rápida (Comando Único Recomendado)

Para subir todos os serviços (PostgreSQL no Docker, Backend Laravel 11 e Frontend React 19) com um único comando:

```bash
npm start
# ou
./start.sh
```

O script realiza automaticamente:
1. Verificação de dependências do ambiente (Node, npm, PHP, Composer, Docker).
2. Inicialização do container PostgreSQL 16 via Docker Compose.
3. Preparação do backend (criação do `.env` se ausente, migrations e carga inicial).
4. Inicialização paralela da API Laravel (`http://localhost:8000/api`) e do Frontend (`http://localhost:5173`).
5. Encerramento limpo de todos os processos ao pressionar `Ctrl+C`.

---

### Inicialização Manual por Etapas (Opcional)

#### 1. Backend (Laravel 11)

```bash
cd backend

# 1. Instale as dependências PHP
composer install

# 2. Configure o ambiente
cp .env.example .env
php artisan key:generate

# 3. Execute as migrations e carga inicial
php artisan migrate:fresh --seed --seeder=LegacyInitialDataSeeder

# 4. Inicie o servidor da API
php artisan serve --port=8000
```

> A API estará disponível em: `http://localhost:8000/api`

---

#### 2. Frontend (React 19)

Em outro terminal, na raiz do projeto:

```bash
# 1. Instale as dependências Node
npm install

# 2. Inicie o servidor Vite
npm run dev
```

> A aplicação estará acessível em: `http://localhost:5173`

O cabeçalho exibirá o indicador 🟢 **"Laravel 11 + PG16"** confirmando a conectividade com o banco de dados.

---

### 3. Perfis Rápidos de Demonstração (Ambiente Dev)

Ao clicar no botão **"Entrar"** no cabeçalho, acesse a aba **"Perfis Rápidos (Dev)"** para alternar instantaneamente entre qualquer um dos 6 papéis do sistema:
- **Administrador Root:** Acesso completo aos CRUDs do Painel Admin.
- **Diretoria / Gestor Geral:** Visão executiva de todas as abas do jogo.
- **Comissão Técnica:** Montagem de escalação e scouts.
- **Tesoureiro do Dia:** Cobrança da vaquinha e baixa de pagamentos.
- **Almoxarifado:** Conferência de materiais e fechamento de malas.
- **Atleta:** Ficha pública e confirmação de presença.

---

## 🧪 Suíte de Testes Automatizados

Para executar a bateria completa de testes de integração e paridade (PHPUnit):

```bash
cd backend
php artisan config:clear --ansi && php artisan test
```

### Cobertura da Suíte (34 Testes Passando):
- **`AdminCrudTest` (8 testes):**
  - Rejeição 401 para requisições anônimas em rotas administrativas.
  - Rejeição 403 para usuários sem perfil `root` (incluindo perfil `geral`).
  - Acesso irrestrito e execução completa dos CRUDs de Usuários, Atletas (com Soft Delete), Partidas, Caixa e Patrimônio pelo usuário ROOT.
- **`RouteAuthProtectionTest` (8 testes):**
  - Preservação pública de leitura (`GET /partidas/{id}`).
  - Bloqueio estrito com 401 em mutações (`/presencas`, `/escalacao`, `/vaquinha`, `/almoxarifado`, `/scouts`).
- **`AuthTest` (10 testes):**
  - Login clássico, login Google (GIS), dev-login, autorização RBAC e revogação de tokens no logout.
- **`ParityTest` (6 testes):**
  - Regras de negócio de vestiário (T-50/T-35/T-25), teto de atletas, lista de espera, taxa de arbitragem e trava da resenha.

Para validar o build de produção do frontend (compilação TypeScript e Service Worker PWA):

```bash
npm run build
```

---

## 📂 Estrutura do Repositório

```text
.
├── backend/                             # API REST em Laravel 11
│   ├── app/
│   │   ├── Http/Controllers/Api/        # Controladores RESTful (AdminController, AuthController, etc.)
│   │   ├── Http/Middleware/             # CheckRole (RBAC e 401/403)
│   │   └── Models/                      # Models Eloquent com relações (User, Atleta, Partida, etc.)
│   ├── database/
│   │   ├── migrations/                  # Migrations de esquema relacional
│   │   └── seeders/                     # LegacyInitialDataSeeder
│   ├── routes/api.php                   # Rotas públicas, autenticadas e grupo /api/admin/*
│   └── tests/Feature/                   # Suítes de testes automatizados (AdminCrudTest, ParityTest, etc.)
├── src/                                 # SPA React 19
│   ├── components/                      # Componentes visuais por contexto esportivo
│   │   ├── admin/                       # AdminDashboard.tsx (Dashboard ROOT Master)
│   │   ├── auth/                        # LoginModal.tsx (Google GIS + Perfis Rápidos)
│   │   └── Header.tsx                   # Cabeçalho com indicador de conexão e atalho ROOT
│   ├── contexts/                        # AuthContext.tsx (Gerenciamento de sessão e RBAC)
│   ├── services/api.ts                  # Cliente HTTP REST desacoplado com interceptador 401
│   ├── App.tsx                          # Orquestrador central e chaveador de visão (Match vs Admin)
│   └── types.ts                         # Tipagens TypeScript e DTOs do domínio
├── _reversa_forward/                    # Artefatos do ciclo forward das features
│   ├── 001-implementar-pwa/
│   ├── 002-autenticacao-google-rbac/
│   ├── 003-bloqueio-rotas-auth/
│   └── 004-painel-adm-root/
├── _reversa_sdd/                        # Especificações de Engenharia Reversa
├── docker-compose.yml                   # Orquestração do banco PostgreSQL 16
├── start.sh                             # Script de inicialização automática de todos os serviços
└── README.md                            # Guia oficial do projeto
```

---

## 📄 Licença

Este projeto é software livre sob a licença [MIT](LICENSE).
