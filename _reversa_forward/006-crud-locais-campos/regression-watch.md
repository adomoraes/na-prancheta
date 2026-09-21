# Regression Watch: CRUD de Locais e Campos da Partida

> Identificador: `006-crud-locais-campos`  
> Data: `2026-09-21`  
> Feature: CRUD de Locais e Campos da Partida  

---

## 1. Itens sob Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|---|---|---|---|---|
| `W001` | `backend/database/migrations/2026_09_21_200000_create_locais_table_and_add_local_id_to_partidas.php` | A coluna `partidas.local_id` deve ser nullable com `nullOnDelete`; exclusão ou inativação de local nunca apaga partidas passadas. | Integridade referencial | Partida excluída em cascata ao apagar um local de jogo. |
| `W002` | `backend/app/Http/Controllers/Api/AdminController.php:storeLocal` | O nome do local deve ser único por agremiação esportiva (`time_id`). | Unicidade | Criação duplicada de locais com mesmo nome no mesmo time retornando 200/201. |
| `W003` | `backend/routes/api.php` | O endpoint `/api/admin/locais` deve exigir role `root`. | Autorização | Usuários com papéis `atleta`, `tecnico`, `financeiro` ou anônimos acessando `/api/admin/locais`. |
| `W004` | `backend/app/Http/Controllers/Api/LocalController.php:index` | A listagem pública `/api/locais` deve retornar estritamente locais com `ativo = true`. | Filtro de status | Locais inativos aparecendo no seletor de agendamento de partidas. |

---

## 2. Histórico de Re-extrações

*(Vazio no momento da criação. Será preenchido nas próximas execuções do `/reversa` pelo agente de descoberta).*

---

## 3. Arquivadas

*(Nenhum item arquivado).*
