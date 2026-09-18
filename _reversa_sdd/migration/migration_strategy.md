---
schemaVersion: 1
generatedAt: 2026-09-18T15:40:00-03:00
reversa:
  version: "1.3.3"
kind: migration_strategy
producedBy: strategist
hash: "sha256:63995cf2105005089c05fde32b09d2f472d836ffc883ccb34a1ceb93dd1de42b"
---

# Migration Strategy — Na Prancheta

> Estratégias de migração avaliadas com trade-offs explícitos para o Na Prancheta.
> Considera o brief de migração, o apetite transformacional e a stack alvo (Laravel 11 + PostgreSQL 16 + React 19).
> A estratégia recomendada é a proposta técnica do Strategist; a decisão final é do usuário na pausa humana.

## Estratégias avaliadas

### Estratégia A: Modular Cutover por Ondas (Recomendada)
- **Descrição**: O backend Laravel 11 é construído de forma completa com todas as entidades e migrations relacionais. A conexão do frontend React 19 SPA com a API REST é realizada em 3 ondas funcionais sucessivas com validação pré-jogo.
- **Quando aplica**: Aplicações com módulos desacoplados no frontend, onde se deseja introduzir persistência real sem risco de interrupção operacional abrupta no dia do jogo.
- **Custo**: Baixo.
- **Risco**: Baixo.
- **Tempo**: Curto-médio (1 a 2 semanas por onda).
- **Adequação ao apetite derivado** (`transformational`): **Excelente**. Permite modelagem 100% idiomática do Laravel 11 desde o início, testando a resiliência de rede e autenticação no vestiário de forma gradual.
- **Trade-offs**:
  - *Prós*:
    - Risco minimizado para a rodada do time de futebol (módulos não-migrados ainda operam em fallback).
    - Validação antecipada da autenticação Sanctum e do fluxo de presença antes de entrar nas finanças da vaquinha e na prancheta.
    - Carga de dados inicial homogênea via Database Seeders no Laravel a partir de `src/data/initialData.ts`.
  - *Contras*:
    - Frontend temporariamente precisa suportar chaveamento de serviço de dados durante as ondas.

### Estratégia B: Big Bang Total
- **Descrição**: Constrói-se todo o backend Laravel e vira-se a chave do frontend React 19 de uma só vez em um único deploy coordenado.
- **Quando aplica**: Sistemas pequenos onde a manutenção de estados intermediários de migração é considerada desperdício de tempo.
- **Custo**: Muito baixo.
- **Risco**: Alto.
- **Tempo**: Curto (entrega em lote único).
- **Adequação ao apetite derivado** (`transformational`): **Alta**. Elimina código de transição e entrega o sistema novo puro de uma só vez.
- **Trade-offs**:
  - *Prós*:
    - Menor esforço de scaffolding no frontend (sem camadas de compatibilidade temporárias).
    - Entrega única e encerramento imediato do ciclo de migração.
  - *Contras*:
    - Risco concentrado no primeiro dia de jogo real; qualquer falha de token Sanctum ou endpoint bloqueia simultaneamente presença, prancheta e vaquinha.
    - Dificuldade de diagnóstico caso ocorram problemas de concorrência simultâneos no vestiário.

### Estratégia C: Strangler Fig com Proxy Reverso
- **Descrição**: Roteamento por API Gateway / Nginx que intercepta chamadas e estrangula serviços progressivamente.
- **Quando aplica**: Sistemas legados monolíticos de grande porte com backend ativo em produção que não podem ser desligados.
- **Custo**: Alto.
- **Risco**: Baixo.
- **Tempo**: Longo.
- **Adequação ao apetite derivado** (`transformational`): **Baixa**. O legado do Na Prancheta é puramente frontend em SPA estática sem backend anterior para estrangular via proxy.
- **Trade-offs**:
  - *Prós*:
    - Padrão corporativo clássico para migração de grandes legados.
  - *Contras*:
    - Totalmente desnecessário e contraproducente para uma aplicação web SPA desacoplada. Descartado formalmente.

---

## Comparativo

| Critério | Estratégia A (Modular por Ondas) | Estratégia B (Big Bang Total) | Estratégia C (Strangler Fig) |
|---|:---:|:---:|:---:|
| **Custo** | Baixo | Muito baixo | Alto |
| **Risco Operacional** | **Baixo** | Alto | Baixo |
| **Tempo de Entrega** | Curto-médio | Curto | Longo |
| **Aderência ao Apetite** | **Excelente** | Alta | Baixa |
| **Resiliência no Vestiário** | **Alta** (testada em ondas) | Baixa (tudo ou nada) | Média |
| **Compatibilidade de Paradigma**| Total (Laravel 11 Idiomático) | Total (Laravel 11 Idiomático) | Complexa |

---

## Recomendação do Strategist

- **Estratégia recomendada**: **Estratégia A (Modular Cutover por Ondas)**
- **Justificativa**: 
  O apetite é transformacional e a stack alvo é robusta (Laravel 11 + PostgreSQL 16), mas a aplicação atende a um contexto físico de uso sob estresse e conectividade instável (vestiário de futebol amador nos 70 minutos antes do jogo). Dividir a ativação em 3 ondas elimina o risco de falha catastrófica no primeiro jogo, permitindo que a comissão técnica valide a sincronia de presenças antes de confiar a arrecadação da vaquinha e o fechamento do almoxarifado ao backend.

### Estrutura das 3 Ondas de Cutover
1. **Onda 1 (Fundação & Presença)**:
   - Backend: Autenticação Sanctum, Migrations das tabelas `usuarios`, `atletas`, `partidas` e `confirmacoes_presenca`.
   - Frontend: Telas de login/onboarding e confirmação rápida de presença conectadas à API REST.
2. **Onda 2 (Operação de Campo & Tática)**:
   - Backend: Migrations de `partida_titulares` e endpoints de escalação e cronômetro T-35.
   - Frontend: Prancheta tática e protocolo do vestiário consumindo a API com polling inteligente.
3. **Onda 3 (Pós-Jogo, Finanças & Almoxarifado)**:
   - Backend: Migrations de `vaquinha_lancamentos`, `itens_almoxarifado`, `conferencias_malas` e `scouts`.
   - Frontend: Módulo do Tesoureiro, Scout e Almoxarifado com Trava da Resenha.

---

## Sinais de alerta específicos
- **Mudança de Paradigma (Local-First → Multi-Usuário Concorrente)**: A comissão técnica e os atletas testarão presenças simultâneas na Onda 1. O cache e polling curto do TanStack Query devem ser validados na Onda 1 para garantir sensação instantânea em conexões 4G fracas.
- **Rollback de Segurança**: O frontend deve reter a flag de contingência `VITE_USE_MOCK_STORAGE=true` durante o período das ondas para permitir reversão instantânea em caso de pane do servidor na hora do jogo.

---

## Decisão humana
- **Estratégia escolhida**: Estratégia A (Modular Cutover por Ondas)
- **Quem decidiu**: Ado
- **Quando**: 2026-09-18T15:43:02-03:00
- **Justificativa do decisor**: Validação progressiva por ondas funcionais (Fundação/Presença -> Campo/Tática -> Pós-Jogo/Finanças), eliminando risco operacional no vestiário e garantindo transição segura do local-first para o Laravel 11.
