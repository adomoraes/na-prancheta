# Actions: CRUD de Adversários e Seleção no Formulário da Partida

> Identificador: `007-crud-adversarios`  
> Data: `2026-09-21`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 13 |
| Paralelizáveis (`[//]`) | 3 |
| Maior cadeia de dependência | 6 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar migration `create_adversarios_table_and_add_adversario_id_to_partidas` criando a tabela `adversarios` e adicionando `adversario_id` em `partidas`. | - | `[//]` | `backend/database/migrations/2026_09_21_300000_create_adversarios_table_and_add_adversario_id_to_partidas.php` | 🟢 | `[X]` |
| T002 | Atualizar tipagem TypeScript em `src/types.ts` adicionando `Adversario`, `AdminAdversarioDTO` e `adversario_id?: string | null` em `AdminPartidaDTO`. | - | `[//]` | `src/types.ts` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Criar suíte de testes `AdversarioCrudTest.php` cobrindo 401 para anônimos, 403 para não-root, CRUD completo, duplicidade 422 e vinculação com partidas. | T001 | - | `backend/tests/Feature/AdversarioCrudTest.php` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Criar Model Eloquent `Adversario.php` com `$fillable`, `$casts` e relacionamentos `time()` e `partidas()`. | T001 | - | `backend/app/Models/Adversario.php` | 🟢 | `[X]` |
| T005 | Atualizar Model `Partida.php` adicionando `adversario_id` ao `$fillable` e relacionamento `adversarioRel()`. | T004 | - | `backend/app/Models/Partida.php` | 🟢 | `[X]` |
| T006 | Implementar métodos de CRUD no `AdminController.php` (`indexAdversarios`, `storeAdversario`, `updateAdversario`, `toggleAdversarioStatus`) e persistência de `adversario_id` em partidas. | T005 | - | `backend/app/Http/Controllers/Api/AdminController.php` | 🟢 | `[X]` |
| T007 | Criar controlador `AdversarioController.php` para listagem pública de adversários ativos. | T004 | `[//]` | `backend/app/Http/Controllers/Api/AdversarioController.php` | 🟢 | `[X]` |
| T008 | Registrar rotas em `backend/routes/api.php` para `/api/adversarios` e grupo `/api/admin/adversarios`. | T006, T007 | - | `backend/routes/api.php` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T009 | Atualizar `src/services/api.ts` com métodos para adversários no client público e admin. | T002, T008 | - | `src/services/api.ts` | 🟢 | `[X]` |
| T010 | Implementar aba "Adversários" no `AdminDashboard.tsx` com listagem, busca e modal de criação/edição. | T009 | - | `src/components/admin/AdminDashboard.tsx` | 🟢 | `[X]` |
| T011 | Integrar o seletor de adversários no modal de agendamento de partidas com auto-preenchimento do nome. | T010 | - | `src/components/admin/AdminDashboard.tsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T012 | Executar migrations locais e validar suíte com `php artisan test`. | T003, T008 | - | `backend/tests/Feature/AdversarioCrudTest.php` | 🟢 | `[X]` |
| T013 | Validar build de frontend com `npm run build`, atualizar `README.md` e preparar commit/PR. | T011, T012 | - | `README.md` | 🟢 | `[X]` |
