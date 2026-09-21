# Investigação Técnica: Painel Administrativo ROOT e Gestão de CRUDs

> Identificador: `004-painel-adm-root`  
> Data: `2026-09-21`  
> Contexto: Arquitetura de Backoffice, RBAC Hierárquico e Integridade Relacional  

---

## 1. Contexto e Motivação

Com a consolidação da autenticação Google e RBAC (feature 002) e a blindagem de rotas contra não autenticados (feature 003), a aplicação Na Prancheta passou a operar com controle de acesso para os papéis de campo (`tecnico`, `financeiro`, `almoxarifado`, `atleta`, `geral`).

No entanto, o sistema ainda carecia de uma interface e endpoints para manutenção cadastral contínua:
- Não havia como cadastrar novos jogos após o término da partida ativa.
- Não havia como alterar o papel de um usuário sem acessar o banco de dados diretamente via SQL.
- Não havia como cadastrar novos atletas ou desativar membros afastados.

A criação do perfil **ROOT** e de uma **Dashboard Administrativa** desacoplada atende diretamente a essa necessidade operacional.

---

## 2. Decisões Estruturais e Alternativas

### 2.1 Separação entre ROOT (Backoffice) e GERAL (Dia de Jogo)
- **Alternativa A (Unificação total):** Transformar o GERAL em ROOT, acumulando poderes de vestiário e de administração.
  - *Problema:* Risco de complexidade desnecessária e poluição da tela do celular no dia de jogo.
- **Alternativa B (Coexistência Separada):** O GERAL lidera a operação do dia de jogo com acesso universal às abas da partida, enquanto o ROOT é o perfil técnico com poderes sobre os CRUDs mestres.
  - *Decisão:* **Adotada.** Clarificada na sessão de requisitos com o usuário.

### 2.2 Política de Exclusão (Soft Delete vs Hard Delete)
- **Problema:** Um atleta excluído fisicamente com `DELETE FROM atletas WHERE id = ?` quebra o relacionamento com `scout_partidas` e `confirmacoes_presenca` ou força a eliminação do histórico desportivo do time.
- **Solução:** Exclusão lógica (`ativo = false`). O atleta deixa de aparecer na lista de presença dos novos jogos, mas seu histórico de gols, presenças e participações em jogos anteriores é preservado. O ROOT pode reativá-lo com um clique.

### 2.3 Padrão de Controladores no Backend
- Centralização dos endpoints administrativos em um controlador `AdminController` com métodos REST dedicados (`users`, `atletas`, `partidas`, `caixa`, `patrimonio`). Isso evita proliferação de controllers de apoio para operações que compartilham exatamente o mesmo escopo de autorização `role:root`.

---

## 3. Referências Técnicas

- Laravel 11 — *Eloquent Soft Deletes & Resource Controllers*: `https://laravel.com/docs/11.x/eloquent`
- OWASP Access Control Cheat Sheet: Separação de privilégios e validação de papéis no kernel de rotas.
- Reversa SDD — `_reversa_sdd/permissions.md` e `_reversa_sdd/erd-complete.md`.
