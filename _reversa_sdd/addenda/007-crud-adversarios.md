# Adendo: CRUD de Adversários e Seleção no Formulário da Partida

> Identificador: `007-crud-adversarios`  
> Data: `2026-09-21`  
> Cenário: `legado`  
> Origem: `_reversa_forward/007-crud-adversarios/`  

---

## 1. Vigência

Vigente desde 2026-09-21.

---

## 2. Resumo da entrega

Implementação do módulo de **CRUD de Adversários e Seleção no Formulário da Partida**, centralizando a gestão de equipes rivais e parceiras de confronto, e integrando o seletor com auto-preenchimento e preservação de snapshot histórico no agendamento de partidas.

A entrega contemplou:
1. **Esquema de Dados:** Migration incremental criando a tabela `adversarios` (UUID, `time_id`, `nome`, `responsavel_nome`, `responsavel_telefone`, `cor_uniforme_principal`, `escudo_url`, `observacoes`, `ativo`) e adicionando a coluna `adversario_id` (`foreignUuid`, nullable, `nullOnDelete()`) na tabela `partidas`.
2. **Modelagem Eloquent:** Criação do Model `Adversario` e atualização de `Partida` com relacionamento `adversarioRel(): BelongsTo` (evitando colisão com a coluna string `adversario`), além da relação inversa `Adversario::partidas()`.
3. **Controladores e Rotas da API:**
   - Métodos administrativos no `AdminController` sob middleware `role:root` (`indexAdversarios`, `storeAdversario`, `updateAdversario`, `toggleAdversarioStatus`).
   - Controlador público/geral `AdversarioController` com endpoint `GET /api/adversarios` para abastecimento de seletores de agendamento de confrontos.
   - Atualização de `storePartida` e `updatePartida` para suportar `adversario_id` sem perder os dados de snapshot imutável (`adversario`).
4. **Camada de Serviços Frontend:** Expansão de `src/types.ts` e `src/services/api.ts` com tipagem e endpoints (`api.getAdversarios`, `api.admin.getAdversarios`, `api.admin.createAdversario`, `api.admin.updateAdversario`, `api.admin.toggleAdversarioStatus`).
5. **Painel Administrativo:**
   - Nova aba dedicada "Adversários" no `AdminDashboard.tsx`, com contadores, busca rápida, badges de cor de uniforme principal, dados de contato do responsável, escudo/distintivo e modais de criação/edição e alternância de status.
   - Integração do seletor inteligente de adversários no modal de criação de partida com auto-preenchimento simultâneo do nome e do `adversario_id`.
6. **Qualidade e Testes:** Nova suíte de testes de integração automatizados `AdversarioCrudTest.php` com 6 testes (rejeição de anônimo 401, rejeição de não-root 403, CRUD completo, unicidade por time, listagem pública de ativos e criação de partida associada), elevando a suíte total para 51 testes e 233 asserções com 100% de aprovação.

Todas as **13 ações atômicas** planejadas em `_reversa_forward/007-crud-adversarios/actions.md` foram concluídas com êxito.

---

## 3. Impacto por artefato da extração

| Artefato | Seção | Tipo de impacto | Delta |
|---|---|---|---|
| `_reversa_sdd/architecture.md` | `#2-arquitetura-do-backend-laravel-11` | `componente-novo` | Nova tabela `adversarios` e chave estrangeira `partidas.adversario_id`. Novo controlador `AdversarioController` e rotas em `/api/adversarios` e `/api/admin/adversarios`. |
| `_reversa_sdd/data-dictionary.md` | `#2-entidades-e-tabelas` | `tabela-nova` | Entidade `adversarios` documentada com restrição de unicidade `(time_id, nome)` e índices de busca. |
| `_reversa_sdd/domain.md` | `#1-glossário-do-domínio` | `regra-nova` | Entidade "Adversário / Clube Rival" formalizada como catálogo com dados de uniforme e contato, com auto-preenchimento e snapshot histórico imutável na partida. |
| `_reversa_sdd/architecture.md` | `#21-padrão-single-page-application` | `componente-novo` | Aba "Adversários" e modal de cadastro no `AdminDashboard.tsx`; seletor com auto-preenchimento no agendamento de partidas. |

---

## 4. Regras sob vigilância

- **W001:** Exclusão ou renomeação de adversário nunca apaga nem altera o histórico de partidas passadas (`nullOnDelete` na FK e snapshot textual preservado).
- **W002:** Unicidade de nome por agremiação (`time_id` + `nome`) validada no banco e na API.
- **W003:** Rota de backoffice `/api/admin/adversarios` restrita a usuários com role `root`.
- **W004:** Rota de agendamento `/api/adversarios` filtra apenas registros com `ativo = true`.

---

## 5. Fontes

- `_reversa_forward/007-crud-adversarios/requirements.md`
- `_reversa_forward/007-crud-adversarios/actions.md`
- `_reversa_forward/007-crud-adversarios/investigation.md`
- `_reversa_forward/007-crud-adversarios/legacy-impact.md`
- `_reversa_forward/007-crud-adversarios/regression-watch.md`
