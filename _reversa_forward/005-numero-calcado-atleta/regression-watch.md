# Regression Watch: Número do Calçado na Ficha do Atleta

> Identificador: `005-numero-calcado-atleta`  
> Data: `2026-09-21`  
> Feature: Inclusão do campo número do calçado na ficha do atleta  

---

## 1. Itens sob Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|---|---|---|---|---|
| `W001` | `backend/database/migrations/2026_09_21_100000_add_numero_calcado_to_atletas_table.php` | A coluna `numero_calcado` deve ser nullable; atletas sem o valor preenchido não devem quebrar listagens na API ou no front. | Presença / Nullable | Falha 500 ao listar atletas com calçado nulo ou erro de renderização no frontend. |
| `W002` | `backend/app/Http/Controllers/Api/AdminController.php:storeAtleta` | O número do calçado, quando informado, deve estar estritamente entre 25 e 50. | Validação | Aceitação de números irreais (ex.: negativos, 0 ou > 50) no banco de dados. |
| `W003` | `backend/app/Http/Controllers/Api/AdminController.php:updateAtleta` | O endpoint de edição de atleta deve permitir atualização atômica de outros campos sem exigir o reenvio de `numero_calcado`. | Idempotência / Opcionalidade | Erro de validação ao atualizar apenas nome ou posição de um atleta existente. |

---

## 2. Histórico de Re-extrações

*(Vazio no momento da criação. Será preenchido nas próximas execuções do `/reversa` pelo agente de descoberta).*

---

## 3. Arquivadas

*(Nenhum item arquivado).*
