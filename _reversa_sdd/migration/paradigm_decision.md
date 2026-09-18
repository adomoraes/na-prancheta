---
schemaVersion: 1
generatedAt: 2026-09-18T15:25:34-03:00
reversa:
  version: "1.3.3"
kind: paradigm_decision
producedBy: paradigm_advisor
hash: "sha256:e8fa9e4f7b8ed3230458f4fc76d8b434d1565b3cdc475b92b9645d673477e2a7"
---

# Paradigm Decision — Na Prancheta

> Decisão consciente sobre como tratar a mudança de paradigma entre o legado e a stack alvo.
> Este artefato é leitura obrigatória primeiro para qualquer agente posterior e para o agente de codificação.

## Paradigma do legado detectado
- **Paradigma principal**: Funcional / Reativo Local-First (Frontend SPA)
- **Confiança**: 🟢 CONFIRMADO
- **Evidências**:
  - `_reversa_sdd/architecture.md:28-35`: Padrão SPA puramente client-side em React 19 + TypeScript + Vite, gerenciamento de estado via hooks (`useState`, `useEffect`) e prop drilling centralizado em `App.tsx`.
  - `_reversa_sdd/architecture.md:32-35`: Persistência síncrona em `window.localStorage` sem backend ou camada de rede síncrona/assíncrona.
  - `_reversa_sdd/domain.md:9-27`: Modelos expressos como interfaces TypeScript planas hidratadas a partir de constantes estáticas em `src/data/initialData.ts`.
- **Variações observadas**:
  - `VestiarioTimeline`: Fluxo com decremento procedural simulado via `setInterval` de 15s.
  - `PranchetaTecnica`: Manipulação funcional imutável de arrays (`titularesIds.filter(...)`).

## Stack alvo declarada
- **Linguagem**: PHP 8.3+
- **Framework**: Laravel 11
- **Banco**: PostgreSQL 16 (com Migrations e Eloquent ORM)
- **Mensageria / Tempo Real**: Laravel Reverb (WebSockets)
- **Infra**: Docker Compose (Laravel Sail) / Nginx + PHP-FPM
- **Frontend Consumidor**: React 19 SPA (existente, mantido desacoplado como consumidor REST puro)

## Paradigma natural inferido
- **Paradigma**: OO clássico com Active Record (Eloquent ORM) e API RESTful transacional multi-usuário.
- **Justificativa**: O ecossistema Laravel 11 é fundamentado no padrão Active Record via Eloquent, controllers RESTful, validação declarativa via Form Requests, container de injeção de dependência e transações ACID no PostgreSQL.
- **Alternativas viáveis**: Arquitetura Hexagonal/Clean com Repositories estritos ou Event Sourcing completo (descartadas por adicionar complexidade desnecessária para o porte operacional do Na Prancheta).

## Gap identificado
- **Severidade**: Alto
- **Implicações concretas**:
  - **Implicação 1 (Assincronismo e Latência de Rede)**: A escalação tática (`toggleTitular` em `_reversa_sdd/prancheta-tatica/design.md`) deixa de ser uma mutação síncrona em memória e passa a ser uma chamada HTTP (`POST /api/partidas/{id}/titulares`). Requer tratamento de loading, feedback otimista e tratamento de falha de conexão.
  - **Implicação 2 (Invariantes em Banco vs Ternários em UI)**: O limite de 11 titulares (`RN-03`), a unicidade de camisa (`RN-OE-05`) e o corte do atraso T-35 (`RN-02`) saem de verificações de tela e viram Form Requests, Domain Services e Constraints (`UNIQUE`, Foreign Keys) no PostgreSQL.
  - **Implicação 3 (Modelagem Relacional Eloquent vs Blob em Memória)**: O estado plano de `initialData.ts` é decomposto em tabelas relacionais com chaves estrangeiras (`atletas`, `partidas`, `confirmacoes_presenca`, `vaquinha_lancamentos`, `itens_almoxarifado`, `scouts_partida`).
  - **Implicação 4 (Concorrência e Auditoria Multi-Usuário)**: A quitação de PIX (`TesoureiroColeta`) e a Trava da Resenha (`AlmoxarifadoView`) deixam de ser isoladas no navegador local e ganham auditoria real no banco (`quitado_em`, `usuario_id`), permitindo conciliação simultânea entre atletas e comissão.

## Opções apresentadas ao usuário
1. **Adotar paradigma natural da stack (transformacional)**:
   - Migração completa para modelos Eloquent, Migrations relacionais, Form Requests e controllers RESTful no Laravel 11. Frontend React 19 mantido desacoplado consumindo endpoints REST.
2. **Forçar paradigma similar ao legado (conservador)**:
   - Armazenar o estado como blob JSON em tabela única Key-Value no Laravel. Perda de integridade relacional, relatórios SQL e concorrência real.
3. **Híbrido (equilibrado)**:
   - Backend relacional com suporte a cache offline no frontend via IndexedDB/Service Worker.

## Decisão do usuário
- **Escolha**: 1 (Adotar paradigma natural da stack — Transformacional)
- **Justificativa do usuário**: Ado optou expressamente pela opção 1, abraçando a transformação idiomática para o backend Laravel 11 + PostgreSQL e desacoplando o React 19 como consumidor REST.
- **Decidido em**: 2026-09-18T15:25:34-03:00

## Apetite derivado
- `derived_appetite`: transformational

## Implicações pendentes para próximos agentes
| Agente | Implicação | Como honrar |
|---|---|---|
| **Curator** | Regras de validação e persistência puramente de frontend/localStorage devem ser convertidas em regras de negócio de backend (API / Database). | Mapear regras de integridade (camisa única, 11 titulares, teto de presença, T-35) como regras canônicas de API REST / PostgreSQL. |
| **Strategist** | Apetite transformacional permite corte limpo de backend (Big Bang do backend + integração progressiva de telas). | Planejar infraestrutura Laravel 11 + PostgreSQL com carga inicial (seeders) e fases modulares de endpoints. |
| **Designer** | Arquitetura monolito modular ou API desacoplada com Eloquent Models, Form Requests, Services e Migrations. | Modelar entidades relacionais, contratos OpenAPI/REST e estrutura de pastas idiomática do Laravel 11. |
| **Screen Translator** | Telas do React 19 SPA mantidas, substituindo handlers de storage local por chamadas Axios/Fetch à API REST. | Mapear mapeamentos de endpoints para cada tela e prever estados de carregamento e erro. |
| **Inspector** | Garantir conformidade com as regras de integridade e padrões Laravel 11. | Auditar prontidão das specs para geração de código. |

## Notas
- O frontend React 19 existente deve ter sua camada de serviço de dados (`src/data/initialData.ts` e leituras de `localStorage`) substituída por um cliente de API REST (ex: Axios ou Fetch com TanStack Query).
- O backend Laravel 11 será o único detentor da verdade (single source of truth) de regras de validação, integridade relacional e concorrência.
