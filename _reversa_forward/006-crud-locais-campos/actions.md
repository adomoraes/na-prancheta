# Actions: CRUD de Locais e Campos da Partida

> Identificador: `006-crud-locais-campos`  
> Data: `2026-09-21`  
> Roadmap: `_reversa_forward/006-crud-locais-campos/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 13 |
| Paralelizáveis (`[//]`) | 3 |
| Maior cadeia de dependência | 6 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar migration `create_locais_table_and_add_local_id_to_partidas` criando tabela `locais` e adicionando `local_id` nullable em `partidas`. | - | `[//]` | `backend/database/migrations/2026_09_21_200000_create_locais_table_and_add_local_id_to_partidas.php` | 🟢 | `[X]` |
| T002 | Atualizar tipagem TypeScript em `src/types.ts` adicionando `Local`, `AdminLocalDTO` e campo opcional `local_id` em `AdminPartidaDTO`. | - | `[//]` | `src/types.ts` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Criar suíte de testes de integração `LocalCrudTest.php` cobrindo o CRUD de locais pelo ROOT, rejeição de não-root e criação de partida vinculada a um local. | T001 | - | `backend/tests/Feature/LocalCrudTest.php` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Criar Model Eloquent `Local.php` com `$fillable`, `$casts` e relacionamento `partidas()`. | T001 | - | `backend/app/Models/Local.php` | 🟢 | `[X]` |
| T005 | Atualizar Model `Partida.php` adicionando `local_id` ao `$fillable` e relacionamento `belongsTo(Local::class, 'local_id')`. | T004 | - | `backend/app/Models/Partida.php` | 🟢 | `[X]` |
| T006 | Implementar métodos de CRUD de locais (`indexLocais`, `storeLocal`, `updateLocal`, `toggleLocalStatus`) e suporte a `local_id` em partidas no `AdminController.php`. | T005 | - | `backend/app/Http/Controllers/Api/AdminController.php` | 🟢 | `[X]` |
| T007 | Criar controlador `LocalController.php` para listagem pública de locais ativos para agendamento. | T004 | `[//]` | `backend/app/Http/Controllers/Api/LocalController.php` | 🟢 | `[X]` |
| T008 | Registrar rotas em `backend/routes/api.php` para `/api/locais` e grupo `/api/admin/locais`. | T006, T007 | - | `backend/routes/api.php` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T009 | Atualizar `src/services/api.ts` com métodos de serviço para locais no client geral e no namespace admin. | T002, T008 | - | `src/services/api.ts` | 🟢 | `[X]` |
| T010 | Implementar aba "Locais & Campos" no `AdminDashboard.tsx` com visualização em tabela, busca e modal de cadastro/edição. | T009 | - | `src/components/admin/AdminDashboard.tsx` | 🟢 | `[X]` |
| T011 | Integrar o seletor de locais no modal de criação e edição de partidas em `AdminDashboard.tsx` com auto-preenchimento de endereço e link GPS. | T010 | - | `src/components/admin/AdminDashboard.tsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T012 | Executar migrations locais e rodar suíte de testes com `php artisan test`, garantindo 100% de aprovação. | T003, T008 | - | `backend/tests/Feature/LocalCrudTest.php` | 🟢 | `[X]` |
| T013 | Validar build de frontend com `npm run build`, atualizar `README.md` e preparar commit/PR no GitHub. | T011, T012 | - | `README.md` | 🟢 | `[X]` |

## Notas de execução

- Migration executada e validada em Postgres.
- Testes de Feature (LocalCrudTest) com 6 asserções específicas e 45 testes passando no total.
- Build do frontend Vite executado com sucesso e sem erros de tipagem.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Decomposição inicial em 13 ações atômicas | reversa |
