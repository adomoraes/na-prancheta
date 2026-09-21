# Impacto no Legado: CRUD de Locais e Campos da Partida

> Identificador: `006-crud-locais-campos`  
> Data: `2026-09-21`  
> Política de edição do legado: `allowLegacyEdits: true`, `allowedPaths: []` (irrestrito)  

---

## 1. Arquivos Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|---|---|---|---|---|
| `backend/database/migrations/2026_09_21_200000_create_locais_table_and_add_local_id_to_partidas.php` | Esquema de Dados | `delta-de-dados` | LOW | Migration incremental criando tabela `locais` e adicionando chave estrangeira `partidas.local_id` com `nullOnDelete()`. |
| `backend/app/Models/Local.php` | Entidade Local | `componente-novo` | LOW | Model Eloquent representando o catálogo de campos, com `HasUuids` e relação com `partidas()`. |
| `backend/app/Models/Partida.php` | Entidade Partida | `regra-alterada` | LOW | Inclusão de `local_id` em `$fillable` e relação `local()`. |
| `backend/app/Http/Controllers/Api/AdminController.php` | Backoffice ROOT | `regra-nova` | LOW | CRUD de locais (`indexLocais`, `storeLocal`, `updateLocal`, `toggleLocalStatus`) e suporte a `local_id` em partidas. |
| `backend/app/Http/Controllers/Api/LocalController.php` | Catálogo de Locais | `componente-novo` | LOW | Endpoint público `index` listando locais ativos para agendamento. |
| `backend/routes/api.php` | Roteamento | `regra-nova` | LOW | Rotas registradas sob `/api/locais` e `/api/admin/locais`. |
| `backend/tests/Feature/LocalCrudTest.php` | Suíte de Testes | `componente-novo` | LOW | 6 novos testes de integração cobrindo autorização, unicidade e vinculação com partidas. |
| `src/types.ts` | Tipagem TypeScript | `delta-de-contrato-externo` | LOW | Novas interfaces `Local`, `AdminLocalDTO` e `local_id?: string | null` em `AdminPartidaDTO`. |
| `src/services/api.ts` | Cliente API | `delta-de-contrato-externo` | LOW | Métodos `getLocais`, `admin.getLocais`, `admin.createLocal`, `admin.updateLocal`, `admin.toggleLocalStatus`. |
| `src/components/admin/AdminDashboard.tsx` | Dashboard ROOT | `componente-novo` | LOW | Nova aba "Locais & Campos" com busca e modais; seletor inteligente com auto-preenchimento no modal de criação de partidas. |

---

## 2. Diff Conceitual por Componente

### Backend & Banco de Dados
A tabela `locais` foi criada para armazenar o cadastro mestre de arenas, sedes e quadras com suporte a tipos de piso, links de mapas e notas. A tabela `partidas` foi enriquecida com `local_id`, mas preserva integralmente os atributos de texto livre como snapshot histórico imutável para não alterar partidas já concluídas.

### Frontend & Experiência do Usuário
O painel administrativo ROOT recebeu uma aba dedicada com listagem em tempo real, links de geolocalização e controle de status. No modal de criação de partida, a seleção de um local cadastrado popula instantaneamente os campos de nome, endereço e link GPS, reduzindo erros de digitação e poupando tempo do administrador.

---

## 3. Regras de Negócio Preservadas

| Regra | Descrição no Legado | Status |
|---|---|---|
| `Snapshot de Partida` | Dados do local gravados na partida permanecem imutáveis caso o local mude de nome | Preservada 🟢 |
| `Integridade de Partidas` | Exclusão de local nunca apaga partidas (`nullOnDelete`) | Preservada 🟢 |
| `RBAC ROOT Exclusivo` | Rotas `/api/admin/*` restritas a `role:root` | Preservada 🟢 |
| `Filtro de Ativos` | Consulta de agendamento filtra apenas locais ativos | Preservada 🟢 |

---

## 4. Regras de Negócio Modificadas / Novas

| Regra | Natureza da Modificação |
|---|---|
| Catálogo Centralizado de Locais | Permite criar, atualizar e desativar sedes esportivas com unicidade de nome por clube. |
| Seletor com Auto-preenchimento | Agiliza o agendamento de partidas com dados completos de GPS e endereço. |
