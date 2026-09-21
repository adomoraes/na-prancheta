# Adendo: CRUD de Locais e Campos da Partida

> Identificador: `006-crud-locais-campos`  
> Data: `2026-09-21`  
> Cenário: `legado`  
> Origem: `_reversa_forward/006-crud-locais-campos/`  

---

## 1. Vigência

Vigente desde 2026-09-21.

---

## 2. Resumo da entrega

Implementação do módulo de **CRUD de Locais e Campos da Partida**, centralizando a gestão de arenas, sedes e quadras esportivas e integrando o seletor com auto-preenchimento e preservação de snapshot histórico no agendamento de partidas.

A entrega contemplou:
1. **Esquema de Dados:** Migration incremental criando a tabela `locais` (UUID, `time_id`, `nome`, `endereco`, `maps_url`, `tipo_piso`, `observacoes`, `ativo`) e adicionando a coluna `local_id` (`foreignUuid`, nullable, `nullOnDelete()`) na tabela `partidas`.
2. **Modelagem Eloquent:** Criação do Model `Local` e atualização de `Partida` com relacionamentos bidirecionais (`Local::partidas()` e `Partida::local()`).
3. **Controladores e Rotas da API:**
   - Métodos administrativos no `AdminController` sob middleware `role:root` (`indexLocais`, `storeLocal`, `updateLocal`, `toggleLocalStatus`).
   - Controlador público/geral `LocalController` com endpoint `GET /api/locais` para abastecimento de seletores de agendamento.
   - Atualização de `storePartida` e `updatePartida` para suportar `local_id` sem perder os dados de snapshot imutável (`local_nome`, `local_endereco`, `local_maps_url`).
4. **Camada de Serviços Frontend:** Expansão de `src/types.ts` e `src/services/api.ts` com tipagem e endpoints (`api.getLocais`, `api.admin.getLocais`, etc.).
5. **Painel Administrativo:**
   - Nova aba dedicada "Locais & Campos" no `AdminDashboard.tsx`, com contadores, busca rápida, cards informativos, links para Google Maps/Waze e modais de criação/edição e alternância de status.
   - Integração do seletor inteligente de locais no modal de criação de partida com auto-preenchimento de nome, endereço e link GPS.
6. **Qualidade e Testes:** Nova suíte de testes de integração automatizados `LocalCrudTest.php` com 6 testes (rejeição de anônimo 401, rejeição de não-root 403, CRUD completo, unicidade por time, listagem pública de ativos e criação de partida associada), elevando a suíte total para 45 testes e 203 asserções com 100% de aprovação.

Todas as **13 ações atômicas** planejadas em `_reversa_forward/006-crud-locais-campos/actions.md` foram concluídas com êxito.

---

## 3. Impacto por artefato da extração

| Artefato | Seção | Tipo de impacto | Delta |
|---|---|---|---|
| `_reversa_sdd/architecture.md` | `#2-arquitetura-do-backend-laravel-11` | `componente-novo` | Nova tabela `locais` e chave estrangeira `partidas.local_id`. Novo controlador `LocalController` e rotas em `/api/locais` e `/api/admin/locais`. |
| `_reversa_sdd/data-dictionary.md` | `#2-entidades-e-tabelas` | `tabela-nova` | Entidade `locais` documentada com restrição de unicidade `(time_id, nome)` e índices de busca. |
| `_reversa_sdd/domain.md` | `#1-glossário-do-domínio` | `regra-nova` | Entidade "Local / Campo de Jogo" formalizada como catálogo de sedes com suporte a auto-preenchimento e snapshot histórico imutável na partida. |
| `_reversa_sdd/architecture.md` | `#21-padrão-single-page-application` | `componente-novo` | Aba "Locais & Campos" e modal de cadastro de local no `AdminDashboard.tsx`; seletor com auto-preenchimento no agendamento de partidas. |

---

## 4. Regras sob vigilância

- **W001:** Exclusão de local nunca apaga partidas históricas (`nullOnDelete` na FK e snapshot imutável preservado).
- **W002:** Unicidade de nome por agremiação (`time_id` + `nome`) validada no banco e na API.
- **W003:** Rota de backoffice `/api/admin/locais` restrita a usuários com role `root`.
- **W004:** Rota de agendamento `/api/locais` filtra apenas registros com `ativo = true`.

---

## 5. Fontes

- `_reversa_forward/006-crud-locais-campos/requirements.md`
- `_reversa_forward/006-crud-locais-campos/roadmap.md`
- `_reversa_forward/006-crud-locais-campos/actions.md`
- `_reversa_forward/006-crud-locais-campos/data-delta.md`
- `_reversa_forward/006-crud-locais-campos/interfaces/locais-api.md`
