# Regression Watch: Painel Administrativo ROOT

> Identificador: `004-painel-adm-root`  
> Data: `2026-09-21`  
> Finalidade: Rastreabilidade para futuras re-extrações e auditorias do Reversa  

---

## 1. Watch Items Ativos

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|--------------------------|-----------------------------|---------------------|-------------------|
| W001 | `_reversa_sdd/domain.md`, Perfis e Papéis | Rotas sob `/api/admin/*` devem exigir token com role `root`, rejeitando outros perfis com HTTP 403 Forbidden. | presença | Usuário comum ou perfil `geral` conseguir acessar ou mutar dados via `/api/admin/*`. |
| W002 | `_reversa_sdd/domain.md`, Elenco de Atletas | Atletas inativados pelo painel ROOT não devem ser excluídos fisicamente do banco de dados (devem ter `ativo: false`). | presença | Atleta ser removido via `DELETE` causando erro de chave estrangeira com scouts ou presenças. |
| W003 | `_reversa_sdd/domain.md`, Backoffice Desacoplado | A visualização da dashboard administrativa ROOT não deve poluir a navegação de abas do fluxo de jogo do vestiário. | presença | Painel de controle administrativo ser renderizado como aba comum na barra móvel inferior de atletas. |

---

## 2. Histórico de Re-extrações

<!--
Esta seção será preenchida automaticamente pelo agente de engenharia reversa quando uma nova extração (/reversa) for executada sobre a base de código.
-->

---

## 3. Arquivadas

<!--
Itens resolvidos ou obsoletos após migrações de arquitetura futuras.
-->
