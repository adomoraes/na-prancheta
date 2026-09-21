# Adendo: Painel Administrativo para Usuários ROOT com Gestão de CRUDs

> Identificador: `004-painel-adm-root`  
> Data: `2026-09-21`  
> Cenário: `legado`  
> Origem: `_reversa_forward/004-painel-adm-root/`  

---

## 1. Vigência

Vigente desde 2026-09-21.

---

## 2. Resumo da entrega

Implementação da **Dashboard Administrativa Master** voltada com exclusividade para superusuários com papel **ROOT**, centralizando o gerenciamento dos 5 CRUDs fundamentais do sistema (`Usuários & Roles`, `Elenco & Atletas com Soft Delete`, `Partidas & Vestiário`, `Caixa Geral & Financeiro`, e `Patrimônio Esportivo & Almoxarifado`) de forma desacoplada do fluxo do dia de jogo.

A entrega incluiu:
1. **Segregação de Papéis e Permissões:** O papel `root` opera com exclusividade sobre as rotas `/api/admin/*`, rejeitando outros perfis (inclusive o perfil executivo `geral`) com HTTP 403 Forbidden.
2. **Soft Delete de Atletas:** Implementação de comutação lógica (`ativo: false`) para preservar integralmente os relacionamentos históricos de scouts e presenças prévias.
3. **Dashboard Desacoplada:** Interface moderna em Dark Mode (Zinc 950) com abas modulares, tabelas com busca e modais de criação/edição.
4. **Testes Automatizados:** Suíte de 8 testes de integração no backend com 41 asserções cobrindo todos os módulos do painel.

Todas as **11 ações atômicas** planejadas em `_reversa_forward/004-painel-adm-root/actions.md` foram concluídas, testadas e validadas com 100% de sucesso.

---

## 3. Impacto por artefato da extração

| Artefato | Seção | Tipo de impacto | Delta |
|---|---|---|---|
| `_reversa_sdd/architecture.md` | `#2-arquitetura-do-backend-laravel-11` | `delta-de-contrato-externo` | Adição do grupo de rotas `/api/admin/*` sob o controlador `AdminController.php`, protegido por `['auth:sanctum', 'role:root']`. |
| `_reversa_sdd/permissions.md` | `#2-matriz-de-permissões-rbac` | `regra-nova` | Formalização da role `root` como autoridade mestre de backoffice, com exclusividade nas rotas administrativas frente ao perfil `geral`. |
| `_reversa_sdd/domain.md` | `#21-regras-de-presença-e-escalação` | `regra-alterada` | O ciclo de vida do atleta agora contempla desativação lógica (`ativo: false`) pelo ROOT, preservando histórico estatístico. |
| `_reversa_sdd/architecture.md` | `#21-padrão-single-page-application` | `componente-novo` | Adição do componente `AdminDashboard.tsx` acessível via `/admin` e integrado ao `Header.tsx` e `App.tsx` através de guard de visão. |
| `_reversa_sdd/data-dictionary.md` | `#2-entidades-e-tabelas` | `delta-de-dados` | Documentada a coluna `ativo` em `atletas` como mecanismo oficial de exclusão lógica nos CRUDs administrativos. |

---

## 4. Regras sob vigilância

Os seguintes itens de monitoramento de regressão foram definidos para auditoria nas próximas re-extrações do sistema:

- [`W001`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/004-painel-adm-root/regression-watch.md): Rotas sob `/api/admin/*` devem exigir token com role `root`, rejeitando outros perfis com HTTP 403 Forbidden.
- [`W002`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/004-painel-adm-root/regression-watch.md): Atletas inativados pelo painel ROOT não devem ser excluídos fisicamente do banco de dados (devem ter `ativo: false`).
- [`W003`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/004-painel-adm-root/regression-watch.md): A visualização da dashboard administrativa ROOT não deve poluir a navegação de abas do fluxo de jogo do vestiário.

Detalhes completos em: [`_reversa_forward/004-painel-adm-root/regression-watch.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/004-painel-adm-root/regression-watch.md).

---

## 5. Fontes

- `_reversa_forward/004-painel-adm-root/requirements.md`
- `_reversa_forward/004-painel-adm-root/roadmap.md`
- `_reversa_forward/004-painel-adm-root/actions.md`
- `_reversa_forward/004-painel-adm-root/progress.jsonl`
- `_reversa_forward/004-painel-adm-root/legacy-impact.md`
- `_reversa_forward/004-painel-adm-root/regression-watch.md`
- `_reversa_forward/004-painel-adm-root/interfaces/admin-api.md`
- `_reversa_forward/004-painel-adm-root/onboarding.md`
