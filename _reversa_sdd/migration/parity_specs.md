---
schemaVersion: 1
generatedAt: 2026-09-18T17:15:00-03:00
reversa:
  version: "1.3.3"
kind: parity_specs
producedBy: inspector
hash: "sha256:4e4796783547a7c6347e66604d920015c498fe23e6c1fa18105b010a7a4fc040"
---

# Parity Specs — Na Prancheta

> Estratégia executável de validação e comprovação de equivalência comportamental entre o legado React 19 SPA local-first e o sistema novo em **Laravel 11 + PostgreSQL 16 + React 19**, adaptada à mudança de paradigma transformacional ([paradigm_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/paradigm_decision.md)).

---

## 1. Estratégia Geral de Validação

Para garantir que nenhuma regra de negócio crítica seja corrompida durante a migração, o sistema adota 4 modos complementares de validação:

- [x] **Contract tests**: Validação rigorosa dos contratos RESTful (OpenAPI/JSON) do Laravel 11 via Form Requests e API Resources.
- [x] **Characterization tests**: Suíte de especificações executáveis em Gherkin derivada diretamente das 22 regras MIGRAR catalogadas em [target_business_rules.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md).
- [x] **Data parity**: Validação de integridade e idempotência do ETL via [LegacyInitialDataSeeder.php](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/data_migration_plan.md), comparando os dados iniciais do legado com o schema relacional do PostgreSQL 16.
- [x] **Screen contract tests**: Validação estrutural de componentes de interface, consumo de endpoints e comportamento sob os 4 estados assíncronos (`idle`, `loading`, `error`, `success`), conforme definido em [target_screens.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_screens.md).

---

## 2. Critérios de "Paridade Aceita"

| Critério | Meta Estipulada | Mecanismo de Aferição |
|---|---|---|
| **Métrica Primária** | **0% de divergência funcional** nos 6 fluxos críticos | 100% de taxa de sucesso na execução dos cenários Gherkin em [parity_tests/](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_tests/). |
| **Integridade de Dados** | **Zero perda de atletas ou partidas** | Checksum e contagem de registros pós-execução do seeder de migração inicial. |
| **Janela de Observação** | **2 rodadas consecutivas de jogos-treino** | Período de homologação em ambiente de staging antes do cutover final da Onda 3. |
| **Critério de Bloqueio** | **Bloqueio imediato do Cutover** | Qualquer falha em invariantes de integridade (teto de 11 titulares, corte T-35, exclusividade de MVP, totalizadores da vaquinha ou trava da resenha). |

---

## 3. Cobertura Adaptada ao Paradigma

### Transição: Procedural/Local-first React 19 → Objeto/Relacional (Laravel 11 + PostgreSQL 16)
O legado operava de forma procedural com persistência mono-usuário em `window.localStorage` e sem concorrência. A nova arquitetura transfere a autoridade e as regras de negócio para o backend Laravel 11 com transações PostgreSQL ACID.

As seguintes dimensões adicionais de teste são obrigatórias na implementação:

### 3.1 Invariantes em Aggregates e Domain Services
- **Aggregate Partida**:
  - Transbordamento automático e atômico para `lista_espera` ao atingir a capacidade máxima ([BR-MIGRAR-007](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - Cálculo temporal do protocolo regressivo ($T-70$, $T-50$, $T-35$, $T-25$) derivado canonicamente de `partidas.horario_inicio` ([BR-MIGRAR-001](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
- **Aggregate Escalação**:
  - Teto inegociável de no máximo 11 titulares simultâneos ([BR-MIGRAR-009](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - Elegibilidade estrita: atletas com `chegou_apos_t35 = true` ou status de presença diferente de `confirmado` são rejeitados com HTTP 422 ([BR-MIGRAR-002](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md), [BR-MIGRAR-010](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
- **Aggregate Vaquinha**:
  - Geração de cobrança restrita a atletas com presença confirmada ([BR-MIGRAR-012](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - Destinação atômica do saldo excedente (arrecadado - meta de arbitragem) diretamente para o Caixa Geral da Equipe ([BR-HUMANA-003](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/ambiguity_log.md)).
- **Aggregate Almoxarifado**:
  - Trava de segurança da resenha: liberação social estritamente condicionada à tríplice checagem completa (22 camisas desviradas, 6 bolas e mala trancada) ([BR-MIGRAR-020](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md), [BR-MIGRAR-021](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
- **Aggregate Scout**:
  - Integridade estatística: valores `>= 0` assegurados por `CHECK constraints` no banco ([BR-MIGRAR-017](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - Exclusividade estrita do Craque do Jogo (MVP): eleição de um novo atleta revoga automaticamente a do anterior em transação atômica ([BR-MIGRAR-018](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).

### 3.2 Concorrência e Transações Atômicas
- Operações de concorrência crítica (confirmação simultânea de última vaga, quitação PIX e eleição de MVP) devem utilizar `DB::transaction` com locks otimistas ou seletivos (`lockForUpdate`), impedindo estados intermediários inválidos.

---

## 4. Paridade de Telas (Modo Modernizado)

Por decisão humana confirmada em [screen_modernization_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_modernization_decision.md), as telas foram modernizadas. Em vez de testes visuais byte-a-byte, a validação de paridade de telas aplica **Screen Contract Testing**:

1. **Hierarquia e Elementos**: A árvore de componentes em React 19 deve honrar a estrutura declarada em [target_screens.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_screens.md).
2. **Ciclo dos 4 Estados Assíncronos**:
   - `idle`: Estado padrão inicial.
   - `loading`: Skeleton visual exibido durante requisição de rede.
   - `error`: Exibição de alerta ou toast com ação de retry.
   - `success`: Renderização completa dos dados da entidade.
3. **Mutações Otimistas**: Atualizações de presença e seleção na prancheta devem refletir imediatamente no DOM local, sincronizando via TanStack Query em background.

---

## 5. § Exceções (Propagação de Deviations Aprovadas)

As seguintes divergências intencionais documentadas em [screen_deviation_log.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_deviation_log.md) foram **aprovadas pelo usuário (Ado)** e estão formalmente incorporadas às specs de paridade:

| ID | Título | Justificativa e Tratamento nos Testes |
|---|---|---|
| **DEV-001** | Estados Assíncronos e Skeletons em Todas as Telas | O teste de tela valida que o estado de loading é transitório e desaparece quando o payload HTTP 200 é resolvido, em vez de exigir sincronia imediata do storage local. |
| **DEV-002** | Toasts Visuais em vez de `window.alert()` | Testes de integração no frontend devem verificar a renderização de elementos de notificação Toast na árvore DOM, sem interceptar `window.alert`. |
| **DEV-003** | Máscara Telefônica e Validação em Tempo Real de Camisa | Testes de formulário devem validar a formatação do input telefônico e simular a resposta HTTP 422 quando uma camisa já registrada for informada. |
| **DEV-004** | Controles Estendidos de Súmula no Scout | Testes de súmula cobrem explicitamente seletores visuais de cartão vermelho e gols sofridos para goleiro, ausentes na interface do legado. |
| **DEV-005** | Tela Dedicada de Autenticação Sanctum | Validação de fluxo de barreira de login, redirecionamento de rotas não autenticadas e armazenamento de token de sessão Sanctum. |

---

## 6. Tipos de Teste e Ferramentas Recomendadas

| Nível | Ferramenta Alvo | Escopo |
|---|---|---|
| **Backend Unit & Feature** | **PHPUnit / Pest (Laravel 11)** | Validação de Models, Eloquent Observers, Form Requests, Policies e Endpoints RESTful com `RefreshDatabase`. |
| **Frontend Component Tests** | **Vitest + React Testing Library** | Validação de renderização de componentes, simulação de eventos e transição entre os 4 estados assíncronos com Mock Service Worker (MSW). |
| **End-to-End & Fluxos Críticos** | **Playwright** | Automação dos cenários Gherkin em navegador real simulando a experiência mobile do atleta e da comissão técnica. |

---

## 7. Reuso de Characterization Specs e Origens do Legado

- **Origem das Regras**: Extraídas formalmente dos artefatos de requisitos, design e domínio da pasta `_reversa_sdd/` (unidades `confirmacao-presenca`, `protocolo-vestiario`, `prancheta-tatica`, `tesoureiro-vaquinha`, `scout-pos-jogo`, `almoxarifado-patrimonio` e `onboarding-elenco`).
- **Adaptações para o Sistema Novo**:
  - Eliminação de dependências do `window.localStorage` e do `setInterval` fraco.
  - Conversão de asserções síncronas para chamadas assíncronas com tratamento de códigos de status HTTP (200, 201, 403, 422).

---

## 8. Saídas e Cenários Gherkin

Os cenários executáveis detalhados para cada fluxo crítico foram organizados nos seguintes arquivos de especificação:

1. [01-confirmacao-presenca.feature](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_tests/01-confirmacao-presenca.feature): Presença rápida em 1 toque, transbordamento para lista de espera e unicidade de camisa.
2. [02-trava-disciplinar-vestiario.feature](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_tests/02-trava-disciplinar-vestiario.feature): Linha do tempo regressiva T-X e corte disciplinar inegociável T-35.
3. [03-escalacao-prancheta.feature](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_tests/03-escalacao-prancheta.feature): Disposição 4-3-3, teto de 11 titulares e bloqueio de atletas não confirmados.
4. [04-arrecadacao-vaquinha.feature](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_tests/04-arrecadacao-vaquinha.feature): Rateio por confirmados, quitação auditada via PIX e saldo excedente no Caixa Geral.
5. [05-almoxarifado-trava-resenha.feature](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_tests/05-almoxarifado-trava-resenha.feature): Custódia de fardamento, camisas desviradas e liberação condicionada da resenha.
6. [06-scout-mvp.feature](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_tests/06-scout-mvp.feature): Contadores não negativos e eleição atômica exclusiva do Craque do Jogo (MVP).
