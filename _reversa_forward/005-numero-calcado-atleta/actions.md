# Actions: Número do Calçado na Ficha do Atleta

> Identificador: `005-numero-calcado-atleta`  
> Data: `2026-09-21`  
> Roadmap: `_reversa_forward/005-numero-calcado-atleta/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 10 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 5 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar migration incremental `add_numero_calcado_to_atletas_table` com coluna `numero_calcado` (`smallInteger`, `nullable`) e método `down`. | - | `[//]` | `backend/database/migrations/2026_09_21_100000_add_numero_calcado_to_atletas_table.php` | 🟢 | `[X]` |
| T002 | Atualizar tipagem TypeScript da interface `Atleta` com a propriedade opcional `numero_calcado?: number \| null`. | - | `[//]` | `src/types.ts` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Criar suíte de testes de integração `AtletaCalcadoTest.php` cobrindo persistência com calçado (41), persistência nula, limites 25-50 e atualização cadastral. | T001 | - | `backend/tests/Feature/AtletaCalcadoTest.php` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Atualizar Model `Atleta` incluindo `numero_calcado` no array `$fillable` e em `$casts` como `integer`. | T001 | - | `backend/app/Models/Atleta.php` | 🟢 | `[X]` |
| T005 | Adicionar validação `min:25\|max:50` e persistência de `numero_calcado` nos métodos `storeAtleta` e `updateAtleta` do `AdminController`. | T004 | - | `backend/app/Http/Controllers/Api/AdminController.php` | 🟢 | `[X]` |
| T006 | Adicionar validação e persistência de `numero_calcado` no método `store` do `AtletaController`. | T004 | `[//]` | `backend/app/Http/Controllers/Api/AtletaController.php` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Integrar campo "Número do Calçado" no modal de criação/edição e exibir coluna "Calçado" na tabela de elenco do `AdminDashboard.tsx`. | T002, T005 | - | `src/components/admin/AdminDashboard.tsx` | 🟢 | `[X]` |
| T008 | Integrar campo de número do calçado na seção de medidas do formulário `SelfOnboardingModal.tsx`. | T002 | `[//]` | `src/components/SelfOnboardingModal.tsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T009 | Executar migrations locais e rodar suíte de testes automatizados com `php artisan test`, garantindo 100% de aprovação. | T003, T005, T006 | - | `backend/tests/Feature/AtletaCalcadoTest.php` | 🟢 | `[X]` |
| T010 | Atualizar documentação no `README.md` e preparar commit/PR com descrição detalhada para revisão manual do usuário. | T007, T008, T009 | - | `README.md` | 🟢 | `[X]` |

## Notas de execução

<!-- Reservado para /reversa-coding registrar avisos ou observações que surgirem durante a execução. -->

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Decomposição inicial em 10 ações atômicas | reversa |
