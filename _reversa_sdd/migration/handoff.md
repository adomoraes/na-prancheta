---
schemaVersion: 1
generatedAt: 2026-09-18T17:16:30-03:00
reversa:
  version: "1.3.3"
kind: handoff
producedBy: orchestrator
hash: "sha256:04206a2bde7152c6657c8b069caad9180f071b74574fd0c1f1adb4658020b223"
---

# Handoff para o Agente de Codificação — Na Prancheta

> Este documento é a porta de entrada executiva para o agente de codificação (Claude Code, Codex, Cursor, Antigravity, etc.) que irá implementar o sistema novo a partir das especificações do **Reversa**.

---

## ⚠️ Leitura Obrigatória Primeiro

Antes de escrever qualquer linha de código ou criar arquivos no novo projeto, o agente de codificação **DEVE** ler e internalizar os 3 artefatos fundamentais:

1. **[paradigm_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/paradigm_decision.md)** *(Leitura Inegociável)*:
   O paradigma alvo é **Transformacional** (Orientação a Objetos, Eloquent Active Record no Laravel 11, persistência relacional ACID no PostgreSQL 16 e API RESTful desacoplada). O código não deve imitar o estilo procedural nem o estado monolítico síncrono do legado.
2. **[topology_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/topology_decision.md)** *(Leitura Inegociável)*:
   A topologia definida é **Moderna por Bounded Contexts** (Modular Monolith no backend Laravel em `app/Contexts/` e arquitetura feature-based no frontend React em `src/features/`). A árvore de diretórios do sistema novo deve espelhar estritamente essa estrutura.
3. **[screen_modernization_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_modernization_decision.md)** *(Leitura Inegociável)*:
   O modo de telas aprovado é **Modernizado**. As interfaces em React 19 devem implementar os 4 estados assíncronos (`idle`, `loading`, `error`, `success`), skeletons de carregamento e mutações otimistas com TanStack Query, honrando a component-tree de [target_screens.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_screens.md).

---

## Ordem de Leitura Recomendada

1. [paradigm_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/paradigm_decision.md) *(Obrigatório, 1º)*
2. [topology_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/topology_decision.md) *(Obrigatório, 2º)*
3. [screen_modernization_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_modernization_decision.md) *(Obrigatório, 3º)*
4. [migration_brief.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/migration_brief.md) *(Briefing e metas do projeto)*
5. [target_business_rules.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md) *(Catálogo das 22 regras MIGRAR)*
6. [migration_strategy.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/migration_strategy.md) *(Estratégia de Cutover Modular por 3 Ondas)*
7. [target_architecture.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_architecture.md) *(Diagrama C4, Bounded Contexts e ADRs)*
8. [target_domain_model.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_domain_model.md) *(Aggregates, Value Objects e Invariantes)*
9. [target_data_model.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_data_model.md) *(DDL PostgreSQL 16 com 12 tabelas e constraints)*
10. [data_migration_plan.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/data_migration_plan.md) *(ETL idempotente e seeder inicial)*
11. [target_screens.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_screens.md) *(Especificação das 8 telas modernizadas)*
12. [parity_specs.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_specs.md) + [parity_tests/](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_tests/) *(Specs Gherkin e validação de paridade)*
13. [screen_deviation_log.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_deviation_log.md) *(Registro das 5 deviations aprovadas)*
14. [risk_register.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/risk_register.md) + [cutover_plan.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/cutover_plan.md) *(Mitigação de riscos e plano Go/No-Go)*
15. [discard_log.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/discard_log.md) *(Débitos legados descartados)*
16. [ambiguity_log.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/ambiguity_log.md) *(Histórico de decisões tomadas)*

---

## Lista de Artefatos Produzidos

| Artefato | Produzido Por | Status |
|---|---|:---:|
| [migration_brief.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/migration_brief.md) | `orchestrator` | criado |
| [paradigm_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/paradigm_decision.md) | `paradigm_advisor` | criado |
| [target_business_rules.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md) | `curator` | criado |
| [discard_log.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/discard_log.md) | `curator` | criado |
| [migration_strategy.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/migration_strategy.md) | `strategist` | criado |
| [risk_register.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/risk_register.md) | `strategist` | criado |
| [cutover_plan.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/cutover_plan.md) | `strategist` | criado |
| [topology_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/topology_decision.md) | `designer` (Fase 1) | criado |
| [target_architecture.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_architecture.md) | `designer` | criado |
| [target_domain_model.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_domain_model.md) | `designer` | criado |
| [target_data_model.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_data_model.md) | `designer` | criado |
| [data_migration_plan.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/data_migration_plan.md) | `designer` | criado |
| [screen_modernization_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_modernization_decision.md) | `screen_translator` (Fase 1) | criado |
| [inventory.json](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/screens/inventory.json) | `screen_translator` | criado |
| [target_screens.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_screens.md) | `screen_translator` | criado |
| [screen_deviation_log.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_deviation_log.md) | `screen_translator` | criado (5 aprovadas) |
| [parity_specs.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_specs.md) | `inspector` | criado |
| [parity_tests/*.feature](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_tests/) | `inspector` | 6 arquivos criados |
| [ambiguity_log.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/ambiguity_log.md) | `orchestrator` | consolidado |

---

## Bloqueadores para Começar a Implementação

> **Nenhum bloqueador ativo.** Todas as ambiguidades e checkpoints humanos foram formalmente resolvidos e aprovados pelo usuário Ado.

---

## Próximos Passos para o Agente de Codificação

1. **Configurar o Repositório Backend (Laravel 11)**:
   - Inicializar o projeto Laravel 11 com PHP 8.3+ e PostgreSQL 16.
   - Instalar `laravel/sanctum` para emissão de tokens de API.
   - Configurar a estrutura de diretórios em Bounded Contexts (`app/Contexts/{Elenco,Partidas,Tatica,Financeiro,Materiais,Scout}/`).
2. **Executar as Migrations do Banco de Dados**:
   - Criar as migrations na ordem estrita de dependências declarada em [target_data_model.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_data_model.md).
   - Aplicar todas as constraints `UNIQUE`, `FOREIGN KEY` e `CHECK (>= 0)`.
3. **Implementar o Seeder de Dados Iniciais**:
   - Implementar `database/seeders/LegacyInitialDataSeeder.php` conforme especificado em [data_migration_plan.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/data_migration_plan.md), importando o dataset de [initialData.ts](file:///home/adomoraes/projects/na-prancheta/src/data/initialData.ts).
4. **Implementar Bottom-Up por Bounded Context**:
   - **Onda 1 (Fundação & Presença)**: Contexto de Elenco e Partidas (Auth Sanctum, modelos `Atleta`, `Partida`, `Presenca`, Form Requests e endpoints de presença em 1 toque).
   - **Onda 2 (Tática & Vestiário)**: Protocolo disciplinar T-35 e Prancheta Tática 4-3-3 com validação de 11 titulares.
   - **Onda 3 (Vaquinha, Scout & Almoxarifado)**: Rateio financeiro com PIX, trava da resenha por tríplice checagem e scout estatístico com exclusividade de MVP.
5. **Configurar e Conectar o Frontend React 19**:
   - Reorganizar o frontend na topologia feature-based (`src/features/`).
   - Implementar cliente HTTP com Axios/Fetch injetando o Bearer Token do Sanctum.
   - Configurar TanStack Query com polling de 5–10s para dados voláteis (presenças e vaquinha).
   - Materializar as 8 telas de [target_screens.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_screens.md) com os 4 estados assíncronos e Toasts visuais.
6. **Escrever e Executar os Testes de Paridade**:
   - Implementar os testes de feature no PHPUnit cobrindo os cenários Gherkin de [parity_tests/](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/parity_tests/).
   - Validar que as 5 deviations de [screen_deviation_log.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_deviation_log.md) estão cobertas como exceções acordadas.
7. **Executar o Cutover**:
   - Seguir o checklist Go/No-Go e o procedimento de rollback em [cutover_plan.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/cutover_plan.md).

---

## Itens Referidos à Codificação

- **COD-001 (WhatsApp Gateway)**: Configurar as credenciais da Evolution API ou Z-API no arquivo `.env` para envio de Magic Links e prestação de contas da vaquinha.
- **COD-002 (Google Maps Key)**: Configurar a chave de API da Google Maps Platform no frontend para renderização do mapa de localização do campo.

---

## Itens Auto-Decididos
> O pipeline foi executado 100% em modo interativo com decisões humanas explícitas do decisor **Ado**. Nenhum item foi resolvido por valor default não supervisionado.

---

## Notas Finais
O framework **Reversa** entrega este conjunto completo de especificações técnicas executáveis com rastreabilidade total desde o código legado até a arquitetura alvo. O agente de codificação tem em mãos todos os insumos necessários para uma implementação limpa, robusta e segura.
