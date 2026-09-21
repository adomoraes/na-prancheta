# Requirements: Painel Administrativo para Usuários ROOT com Gestão de CRUDs

> Identificador: `004-painel-adm-root`  
> Data: `2026-09-21`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta especificação define a criação do Painel Administrativo exclusivo para usuários com perfil ROOT (Superadministrador Técnico) na aplicação Na Prancheta. O painel é concebido como uma Dashboard administrativa isolada e desacoplada do fluxo operacional do dia de jogo, centralizando a governança e a gestão completa (CRUDs) das entidades fundamentais do sistema: Usuários & Papéis, Elenco & Atletas, Partidas & Parâmetros de Jogo, Lançamentos Financeiros e Patrimônio/Almoxarifado, adotando desativação lógica para preservação do histórico do clube.

---

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/permissions.md#2-matriz-de-permissões-rbac` | Mapeia os níveis de acesso (`geral`, `tecnico`, `financeiro`, `almoxarifado`, `atleta`) e destaca a necessidade de um superusuário com poderes de gestão cadastral plena. | 🟢 |
| `_reversa_sdd/architecture.md#2-arquitetura-do-backend-laravel-11` | Arquitetura REST desacoplada que processa regras de negócio e validações em Controllers/Middlewares com PostgreSQL. | 🟢 |
| `_reversa_sdd/domain.md#2-regras-de-negócio-do-legado` | Regras que regem Elenco (RN-03 teto de confirmados), Vestiário (trava T-35), Tesouraria (caixa) e Patrimônio (trava da resenha). | 🟢 |
| `_reversa_sdd/addenda/003-bloqueio-rotas-auth.md#vigência` | Entrega anterior que consolidou o middleware `auth:sanctum` e o guard de bloqueio de rotas não autenticadas. | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Usuário ROOT (Administrador Técnico)** | Gerenciar cadastros mestres, redefinir papéis, ajustar partidas e auditar registros estruturais do clube. | Acessa a Dashboard isolada `/admin` para criar novos jogos, gerenciar usuários/senhas, cadastrar atletas e inspecionar os cadastros de patrimônio e caixa. |
| **Diretoria Geral (`geral`)** | Conduzir e supervisionar todas as abas operacionais do dia de jogo no vestiário. | Opera com poderes universais na visão da partida (tática, presença, vaquinha, scout e malas), sem intervenção no backoffice de CRUDs do ROOT. |
| **Membros Operacionais (Técnico / Tesoureiro / Almoxarife)** | Operar estritamente suas abas no dia do jogo sem permissão no painel adm mestre. | Não têm acesso ao painel root; ao tentar acessar rotas `/admin` ou `/api/admin/*`, recebem status HTTP 403 Forbidden. |
| **Atletas / Visitantes** | Visualizar jogo e confirmar presença. | Ficam completamente isolados da existência e operação das rotas administrativas. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Perfil Canônico ROOT e Coexistência com GERAL):** 🟢
   - Origem no legado: `_reversa_sdd/permissions.md#2-matriz-de-permissões-rbac`
   - Tipo: nova
   - O perfil `root` é estabelecido como a autoridade técnica mestra do backoffice do sistema. O perfil `geral` é preservado com foco exclusivo na liderança operacional de todas as abas no dia de jogo. O acesso aos endpoints `/api/admin/*` e à rota de dashboard `/admin` é de exclusividade estrita do perfil `root`.

2. **RN-02 (Dashboard Isolada de Administração Desacoplada do Dia de Jogo):** 🟢
   - Origem no legado: n/a
   - Tipo: nova
   - O Painel Administrativo opera como uma tela/dashboard dedicada, desacoplada da barra de abas da partida, com navegação própria por módulos cadastrais (Menu Lateral / Tabs do Backoffice) e botão direto de retorno à interface do jogo.

3. **RN-03 (Centralização de CRUDs Modulares):** 🟢
   - Origem no legado: `_reversa_sdd/code-analysis.md`
   - Tipo: nova
   - O painel root disponibiliza operações completas de criação, leitura com paginação/busca, edição e desativação para:
     - **Usuários & Permissões:** listagem, criação, alteração de papel (`root`, `geral`, `tecnico`, `financeiro`, `almoxarifado`, `atleta`), redefinição de senha e bloqueio/desbloqueio.
     - **Atletas & Elenco:** cadastro completo, dados contratuais (mensalista, convidado, avulso), número de camisa, posições e associação com usuário.
     - **Partidas & Agenda:** criação de partidas, definição de horários oficiais de protocolo (T-50, T-35, T-25), adversário, link GPS, teto de confirmados e valor da taxa.
     - **Financeiro & Caixa:** manutenção de lançamentos de vaquinha e histórico do caixa geral.
     - **Patrimônio & Almoxarifado:** inventário e quantidades de bolas, coletes, kits de uniforme e cones.

4. **RN-04 (Política de Exclusão Lógica / Soft Delete):** 🟢
   - Origem no legado: `_reversa_sdd/erd-complete.md`
   - Tipo: nova
   - A exclusão de atletas, partidas e itens com vínculo relacional adota exclusivamente desativação lógica (campo `ativo: false`), preservando intacto todo o histórico estatístico (scouts), presenças e movimentações de caixa, com suporte a reativação pelo ROOT.

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Middleware de Autorização Exclusiva `role:root` no Backend | Must | Rotas do grupo `/api/admin/*` exigem autenticação Sanctum e papel `root`. Requisições de outros papéis retornam HTTP 403 com mensagem JSON clara. | 🟢 |
| RF-02 | CRUD de Usuários e Gestão de Roles | Must | Permite criar novos usuários, listar todos com filtros, alterar role RBAC, editar dados cadastrais e redefinir credenciais. | 🟢 |
| RF-03 | CRUD de Atletas e Elenco | Must | Permite criar atletas, editar dados desportivos (posições, camisa, vínculo), desativar/reativar e vincular a contas de usuários. | 🟢 |
| RF-04 | CRUD de Partidas e Configurações de Vestiário | Must | Permite criar novas partidas, definir adversário, endereço/GPS, teto de confirmados, taxa de jogo e cronogramas de vestiário. | 🟢 |
| RF-05 | Gestão Mestra de Caixa e Patrimônio | Must | Permite visualizar lançamentos e cadastrar/ajustar itens de patrimônio e saldo de caixa do time. | 🟢 |
| RF-06 | Dashboard Administrativa Isolada no Frontend | Must | Interface de gestão administrativa rica em Dark Mode, acessível via rota `/admin` ou botão de gestão no cabeçalho exclusivo para o perfil ROOT. | 🟢 |
| RF-07 | Guard de Rota no Cliente para o Painel ROOT | Must | Usuários não autenticados ou autenticados sem o perfil `root` que tentarem acessar a rota `/admin` são imediatamente bloqueados e redirecionados. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Segurança | Validação estrita de autorização no kernel de rotas | Impede escalação de privilégios de outros papéis operacionais. | 🟢 |
| Usabilidade | Design System consistente em Dark Mode (Zinc 950) | Interface profissional, densa para gestão de tabelas, com buscas e paginação intuitivas. | 🟢 |
| Integridade | Preservação histórica de dados de jogos anteriores | Soft delete garante que exclusões cadastrais não causem erros de integridade referencial ou perda de dados. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Usuário ROOT acessa a dashboard administrativa
  Dado que o usuário está autenticado com papel "root"
  Quando ele acessa a tela de Administração
  Então a dashboard deve apresentar os módulos de Usuários, Atletas, Partidas, Finanças e Patrimônio
  E ele consegue executar ações de criar, editar, desativar e reativar registros

Cenário: Usuário GERAL ou TÉCNICO tenta acessar a API administrativa
  Dado que o usuário está autenticado com o papel "geral" ou "tecnico"
  Quando ele envia uma requisição GET ou POST para "/api/admin/usuarios"
  Então a API deve responder com status HTTP 403 Forbidden
  E o corpo da resposta deve informar que a operação requer perfil de: root

Cenário: Desativação lógica de atleta com histórico
  Dado que o ROOT aciona a exclusão de um atleta que possui scouts anteriores
  Quando a operação é confirmada
  Então o atleta deve ter seu status alterado para "ativo: false"
  E os scouts e presenças históricas do atleta permanecem íntegros nas partidas anteriores
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Requisito fundamental de segurança para isolar o backoffice. |
| RF-02 | Must | Essencial para governança de credenciais e roles da equipe. |
| RF-03 | Must | Permite manter o elenco atualizado sem intervenção direta no banco. |
| RF-04 | Must | Vital para criar novos jogos e manter a temporada em andamento. |
| RF-05 | Must | Essencial para o controle mestre de estoque de materiais e caixa. |
| RF-06 | Must | Interface de usuário dedicada do painel administrativo. |
| RF-07 | Must | Proteção de navegação e isolamento no frontend. |

---

## 9. Esclarecimentos

### Sessão 2026-09-21
- **Q:** Como o Painel Administrativo deve ser integrado na navegação do Frontend?  
  **R:** Tela/Dashboard isolada em rota/visão exclusiva (ex: `/admin`), desacoplada do fluxo de abas do dia de jogo, com navegação própria entre os módulos cadastrais e botão de retorno à partida.
- **Q:** Como os perfis ROOT e GERAL (Diretoria) devem se relacionar no sistema?  
  **R:** Coexistência separada: o perfil `geral` continua operando todas as abas do dia de jogo (técnico, financeiro, almoxarifado), enquanto o `root` é um perfil técnico com exclusividade total sobre o backoffice de CRUDs mestres.
- **Q:** Qual a política de exclusão para registros com histórico (Atletas, Partidas, Lançamentos)?  
  **R:** Exclusão lógica com desativação (soft delete / flag `ativo: false`) para preservar a integridade histórica de scouts, presenças e fluxo de caixa, com opção de reativação pelo ROOT.

---

## 10. Lacunas

> Nenhuma lacuna ou dúvida pendente nesta especificação. Todos os pontos foram esclarecidos e validados.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial gerada por `/reversa-requirements` | reversa-requirements |
| 2026-09-21 | Integração das decisões de clarificação (Dashboard isolada, Coexistência ROOT/GERAL e Soft Delete) | reversa-clarify |
