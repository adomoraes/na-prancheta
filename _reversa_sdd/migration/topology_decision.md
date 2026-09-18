---
schemaVersion: 1
generatedAt: 2026-09-18T15:44:00-03:00
reversa:
  version: "1.3.3"
kind: topology_decision
producedBy: designer
hash: "sha256:edfc56be3cd974bd7ae79898e3d4dd4f3516e53ba6295fe80e4ff1c403cfa102"
---

# Topology Decision — Na Prancheta

> Decisão consciente sobre como organizar a arquitetura e a estrutura do sistema novo: preservar a topologia do legado, adotar uma topologia moderna ou aplicar um modelo híbrido.
> Leitura obrigatória para a Fase 2 do Designer (arquitetura e dados) e para a geração de código.

## Topologia do legado detectada
- **Padrão organizacional**: Monolito de Componentes em Camada Única (Flat Components / Package-by-type)
- **Confiança**: 🟢 CONFIRMADO
- **Evidências**:
  - `_reversa_sdd/architecture.md:28-35`: Frontend SPA com componentes irmãos concentrados em `src/components/`, orquestrados por prop drilling direto a partir do componente raiz `src/App.tsx`.
  - `_reversa_sdd/inventory.md`: Ausência de separação por módulos ou domínios em diretórios. Arquivo único de tipagens (`src/types.ts`) e arquivo estático com todas as entidades (`src/data/initialData.ts`).
- **Mapa da árvore legada** (resumido):
  ```
  src/
  ├── components/
  │   ├── AlmoxarifadoView.tsx
  │   ├── MatchCardConfirmacao.tsx
  │   ├── PranchetaTecnica.tsx
  │   ├── ScoutPosJogo.tsx
  │   ├── SelfOnboardingModal.tsx
  │   ├── TesoureiroColeta.tsx
  │   └── VestiarioTimeline.tsx
  ├── data/
  │   └── initialData.ts
  ├── App.tsx
  ├── main.tsx
  └── types.ts
  ```

## Diagnóstico estrutural
- **Acoplamento**: **Alto** no agregador `App.tsx` (responsável por hidratar e repassar todos os estados e callbacks), mas baixo entre os componentes filhos.
- **Coesão por módulo**: **Média**. Cada componente encapsula sua tela, mas mistura renderização visual com validação de regras de negócio (limite de 11 titulares, unicidade de MVP, checagem de horário T-35).
- **Módulos órfãos / mortos**: Nenhum.
- **Camadas redundantes**: Nenhuma.
- **Violações de fronteira**: O cliente de frontend assume integralmente as decisões de persistência (`localStorage`) e lógica de negócio que deveriam ser de backend.
- **Mistura de paradigmas/estilos**: Predominantemente funcional/reativo no React com lógica procedural de timers (`setInterval`).
- **Avaliação geral**: **Parcialmente problemática**. Adequado para um protótipo de tela única isolado, porém insuficiente para suportar concorrência multi-usuário, integridade referencial e auditoria exigidas pelo backend real.

## Topologia moderna proposta
- **Padrão**: **Modular Monolith por Bounded Contexts (Laravel 11 REST API) + Feature-Based Structure (React 19 SPA)**
- **Justificativa**: 
  O Laravel 11 possui arquitetura idiomática em camadas (Controllers, Form Requests, Eloquent Models, Services e API Resources). O agrupamento por Bounded Contexts mapeia perfeitamente as 7 unidades de negócio do clube amador (Elenco, Presença, Tática, Vestiário, Financeiro, Scout e Almoxarifado), permitindo transações atômicas no PostgreSQL e manutenção simples por um desenvolvedor solo (Ado). No frontend, a organização por `features/` substitui a pasta plana de componentes.
- **Ganhos concretos esperados**:
  - *Isolamento de Regras de Negócio*: Regras críticas (T-35, Trava da Resenha, Teto de Titulares) vivem em Domain Services testáveis no PHP, sem depender de renderização no React.
  - *Integridade de Dados*: Constraints de banco de dados (`UNIQUE`, `CHECK`, Foreign Keys) no PostgreSQL impedem estados corruptos.
  - *Escalabilidade e Testabilidade*: Cada contexto possui testes automatizados independentes (`Feature` e `Unit` no Pest/PHPUnit).
- **Custo / risco**:
  - *Esforço de Reorganização*: Pequena reestruturação de imports no frontend React ao mover de `components/` para `features/`.
- **Esboço da árvore proposta**:
  ```
  backend/ (Laravel 11)
  ├── app/
  │   ├── Http/
  │   │   ├── Controllers/Api/ (AuthController, AtletaController, PartidaController, TaticaController, VaquinhaController, AlmoxarifadoController, ScoutController)
  │   │   ├── Requests/ (StoreAtletaRequest, UpdateEscalacaoRequest, QuitarVaquinhaRequest, FecharMalaRequest, etc.)
  │   │   └── Resources/ (AtletaResource, PartidaResource, TaticaResource, VaquinhaResource, AlmoxarifadoResource)
  │   ├── Models/ (Atleta, Partida, ConfirmacaoPresenca, Titular, VaquinhaLancamento, CaixaMovimentacao, ScoutPartida, ItemAlmoxarifado, ConferenciaMala)
  │   ├── Services/ (EscalacaoService, VaquinhaService, AlmoxarifadoService, PresencaService)
  │   └── Policies/ (PartidaPolicy, FinanceiroPolicy)
  ├── database/
  │   ├── migrations/ (10 migrations relacionais com constraints)
  │   └── seeders/ (LegacyInitialDataSeeder)
  └── routes/
      └── api.php
  
  frontend/ (React 19 SPA)
  ├── src/
  │   ├── features/
  │   │   ├── auth/ (Login, Magic Link, token Sanctum)
  │   │   ├── elenco/ (Onboarding, lista do time)
  │   │   ├── presenca/ (Ficha da partida, botões 1-toque, lista de espera)
  │   │   ├── tatica/ (Prancheta tática 4-3-3, preleção)
  │   │   ├── vestiario/ (Timeline T-X)
  │   │   ├── financeiro/ (Tesoureiro, arrecadação PIX, WhatsApp report)
  │   │   ├── scout/ (Estatísticas, MVP)
  │   │   └── almoxarifado/ (Checklist de malas, trava da resenha)
  │   ├── services/
  │   │   └── api.ts (Cliente Axios / TanStack Query)
  │   └── shared/ (Componentes de UI, ícones, Tailwind tokens)
  ```

## Opções apresentadas ao usuário
1. **Preservar topologia legada** (conservador)
   - Laravel mínimo com controllers e models planos em pasta única; React mantém todos os arquivos em `src/components/`.
2. **Adotar topologia moderna proposta** (transformacional - Recomendada)
   - Backend Laravel 11 estruturado em Bounded Contexts / Services e frontend React reorganizado por `features/`.
3. **Híbrido** (equilibrado)
   - Backend moderno no Laravel 11 com Services e Models relacionais; frontend React mantém a pasta `src/components/` existente apenas redirecionando chamadas para o `api.ts`.

## Decisão do usuário
- **Escolha**: 2 (Adotar topologia moderna proposta — Transformacional)
- **Justificativa do usuário**: Ado optou por adotar a topologia moderna por Bounded Contexts com Services de Domínio no Laravel 11 e estrutura modular por features no frontend React 19, garantindo arquitetura limpa, escalável e desacoplada.
- **Decidido em**: 2026-09-18T15:46:29-03:00

## Mapeamento legado → novo
| Módulo / pasta legada | Bounded context novo (Laravel 11) | Tipo | Observações |
|---|---|---|---|
| `SelfOnboardingModal.tsx` | `Contexto Elenco & Identidade` | modernizado | Gerencia atletas, usuários e credenciais Sanctum |
| `MatchCardConfirmacao.tsx` | `Contexto Partidas & Presença` | modernizado | Ficha da partida, presenças e lista de espera |
| `VestiarioTimeline.tsx` | `Contexto Vestiário & Protocolo` | modernizado | Marcos temporais T-X derivados do horário da partida |
| `PranchetaTecnica.tsx` | `Contexto Tática & Escalação` | modernizado | Formação 4-3-3, titulares e validação T-35 |
| `TesoureiroColeta.tsx` | `Contexto Financeiro & Vaquinha` | modernizado | Cota de arbitragem, quitação PIX e Caixa Geral da Equipe |
| `ScoutPosJogo.tsx` | `Contexto Desempenho & Scout` | modernizado | Estatísticas não-negativas e exclusividade estrita de MVP |
| `AlmoxarifadoView.tsx` | `Contexto Patrimônio & Custódia` | modernizado | Inventário, camisas desviradas e Trava da Resenha |

## Implicações pendentes para próximos passos do Designer
| Etapa do Designer | Implicação | Como honrar |
|---|---|---|
| **target_architecture** | Deve detalhar o container Docker Sail, o Nginx/PHP-FPM, o PostgreSQL 16 e o fluxo de comunicação REST/JSON. | Gerar diagrama C4 de containers e componentes no Mermaid. |
| **target_domain_model** | Mapear entidades ricas com agregados, invariants e serviços de domínio. | Definir contratos de métodos e eventos para cada aggregate. |
| **target_data_model** | Modelar tabelas relacionais no PostgreSQL com tipos exatos e constraints. | Especificar DDL com chaves primárias, chaves estrangeiras, índices e constraints `UNIQUE`/`CHECK`. |
| **data_migration_plan** | Garantir a carga inicial a partir de `initialData.ts`. | Desenhar o seeder automatizado com mapeamento de IDs e enums. |

## Notas
- A topologia proposta foi desenhada para maximizar a ergonomia de desenvolvimento no ecossistema Laravel 11 sem overengineering.
