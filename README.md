# ⚽ Na Prancheta

> **Gestão Esportiva & Vestiário Amador**  
> Aplicação moderna para organização de dia de jogo, gestão de elenco, vaquinha de arbitragem, prancheta tática e protocolo disciplinar de vestiário no futebol amador.

---

## 🌟 Visão Geral

O **Na Prancheta** foi desenvolvido para resolver as dores reais que acontecem nos bastidores do futebol amador aos finais de semana: atrasos na preleção, confusão no rateio da taxa de arbitragem, camisas devolvidas do avesso, malas perdidas e descontrole de convocações.

A solução é dividida em uma **SPA desacoplada em React 19** com interface mobile-first (PWA feel) e um **backend robusto em Laravel 11** com persistência relacional ACID em **PostgreSQL 16**.

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

### 3. 🛡️ Prancheta Tática 4-3-3 (Comissão Técnica)
- Visualização de campo sintético com posições interativas.
- Teto regulamentar de **11 titulares** em campo.
- Validação no frontend e backend contra escalação de atletas atrasados na preleção.
- Ação **"Liberar Escalação (T-35)"** com sincronização em tempo real na API.

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

### 7. 👤 Self-Onboarding do Elenco
- Cadastro facilitado de novos atletas (mensalistas ou convidados) com número de camisa único, posições primária e secundária.

### 8. 📱 Progressive Web App (PWA) & Operação Offline
- **Instalabilidade Autônoma:** Instalação em 1 toque na tela inicial no Android, iOS (Safari) e Desktop, sem barras de navegador.
- **Resiliência Offline:** Shell da aplicação e fontes armazenadas em cache pelo Service Worker (Workbox). Permite registrar presença, montar escalação e preencher súmula mesmo em vestiários subterrâneos ou campos sem sinal 4G/5G.
- **Notificação de Atualização:** Toast interativo que avisa discretamente quando uma nova versão do app estiver disponível para recarga imediata.
- **Indicador de Conectividade:** Alerta contextual na barra de status informando se a operação atual está em modo offline com dados locais preservados.

---

## 🏗️ Arquitetura & Stack Tecnológica

```
┌─────────────────────────────────────────────────────────────┐
│                      React 19 SPA (Vite)                    │
│   Tailwind CSS • Lucide Icons • API Client com Fallback     │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON / REST (Sanctum Tokens)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Laravel 11 Backend API                    │
│   PHP 8.3+ • Bounded Contexts • 15 Migrations • Eloquent   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL 16 (ou SQLite)                 │
│         ACID • Constraints CHECK / UNIQUE / Foreign Keys    │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Fetch API.
- **Backend:** PHP 8.3+, Laravel 11, Laravel Sanctum, PHPUnit.
- **Banco de Dados:** PostgreSQL 16 (produção/Docker) / SQLite (desenvolvimento local/testes).
- **Especificações:** Documentação viva em `_reversa_sdd/` (Domain, Architecture C4, ERD, ADRs, Parity Tests Gherkin).

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
2. Inicialização do container PostgreSQL 16 via Docker Compose (se não estiver rodando).
3. Preparação do backend (criação do `.env` se ausente, instalação de dependências e migrations).
4. Inicialização paralela da API Laravel (`http://localhost:8000/api`) e do Frontend (`http://localhost:3000`).
5. Encerramento limpo de todos os processos ao pressionar `Ctrl+C`.

---

### Inicialização Manual por Etapas (Opcional)

#### 1. Inicializando o Backend (Laravel 11)

```bash
# Navegue até a pasta do backend
cd backend

# 1. Instale as dependências PHP
composer install

# 2. Configure o arquivo de ambiente
cp .env.example .env
php artisan key:generate

# 3. Execute as migrations e a carga inicial dos dados legados
php artisan migrate:fresh --seed --seeder=LegacyInitialDataSeeder

# 4. Inicie o servidor da API
php artisan serve --port=8000
```

> A API estará disponível em: `http://localhost:8000/api`

---

### 2. Inicializando o Frontend (React 19)

Em outro terminal, na raiz do projeto:

```bash
# 1. Instale as dependências Node
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

> A aplicação estará acessível em: `http://localhost:5173`

O Header exibirá o badge 🟢 **"Laravel 11 + PG16"** indicando que a sincronização relacional está ativa. Em caso de queda do backend, a aplicação chaveia automaticamente para o modo de contingência local.

---

### 3. Usando com Docker Compose (Opcional)

Para subir o banco de dados PostgreSQL 16 via Docker:

```bash
docker-compose up -d
```

---

## 🧪 Suíte de Testes Automatizados

Para executar os testes de paridade de regras de negócio (PHPUnit):

```bash
cd backend
php artisan config:clear --ansi && php artisan test
```

### Testes cobertos:
- `PT-001`: Confirmação de presença no teto e transbordamento para lista de espera.
- `PT-002`: Protocolo de vestiário e corte disciplinar compulsório de atrasados (T-35).
- `PT-003`: Escalação tática 4-3-3 e teto inegociável de 11 titulares.
- `PT-004`: Vaquinha PIX, quitação da arbitragem e crédito do excedente no caixa geral.
- `PT-005`: Almoxarifado, tríplice conferência de materiais e destravamento da resenha.
- `PT-006`: Scout estatístico e exclusividade de eleição de MVP.

Para validar a conformidade e os assets do Progressive Web App (PWA):

```bash
node scripts/verify-pwa.mjs
```

Para validar o build de produção do frontend (compilação TypeScript e Service Worker):

```bash
npm run build
```

---

## 📂 Estrutura do Repositório

```text
.
├── backend/                  # API REST em Laravel 11
│   ├── app/
│   │   ├── Http/Controllers/Api/  # 8 Controllers RESTful
│   │   └── Models/                # 12 Models Eloquent com relações
│   ├── database/
│   │   ├── migrations/            # 15 Migrations de esquema
│   │   └── seeders/               # LegacyInitialDataSeeder
│   ├── routes/api.php             # Rotas autenticadas e públicas
│   └── tests/Feature/ParityTest.php # Testes de paridade de regras
├── src/                      # SPA React 19
│   ├── components/           # Componentes de tela por módulo
│   ├── data/                 # Dataset inicial e mock de contingência
│   ├── services/api.ts       # Cliente HTTP REST desacoplado
│   ├── App.tsx               # Orquestrador central e gerenciamento de abas
│   └── types.ts              # Tipagens TypeScript do domínio
├── _reversa_sdd/             # Especificações de Engenharia Reversa e Migração
│   ├── migration/            # Specs de migração (brief, C4, DDL, cutover, parity)
│   └── traceability/         # Matrizes de rastreabilidade código-spec
├── docker-compose.yml        # Orquestração do PostgreSQL 16
└── README.md                 # Guia oficial do projeto
```

---

## 📄 Licença

Este projeto é software livre sob a licença [MIT](LICENSE).
