# Actions: Painel Administrativo para Usuários ROOT com Gestão de CRUDs

> Identificador: `004-painel-adm-root`  
> Data: `2026-09-21`  
> Roadmap: `_reversa_forward/004-painel-adm-root/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 11 |
| Concluídas (`[X]`) | 11 |
| Paralelizáveis (`[//]`) | 2 |
| Maior cadeia de dependência | 7 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Atualizar model `User.php` para validar e reconhecer o papel `'root'` como superusuário mestre | - | `[//]` | `backend/app/Models/User.php` | 🟢 | `[X]` |
| T002 | Configurar rota de dev-login para o perfil `root` em `AuthController.php` e registrar grupo de rotas `/api/admin/*` em `routes/api.php` protegido por `['auth:sanctum', 'role:root']` | T001 | - | `backend/routes/api.php` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Criar suíte de testes de integração `AdminCrudTest.php` cobrindo guards de autorização (403 para não-root, 200 para root) e operações de CRUD dos 5 módulos | T002 | - | `backend/tests/Feature/AdminCrudTest.php` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Implementar endpoints de CRUD para Usuários (list, create, update, reset password, delete) e Atletas (list com inativos, create, update, toggle status soft delete) em `AdminController.php` | T003 | - | `backend/app/Http/Controllers/Api/AdminController.php` | 🟢 | `[X]` |
| T005 | Implementar endpoints de CRUD para Partidas (list, create, update, status), Caixa (list com saldo consolidado, create movimentação) e Patrimônio (list, create, update, delete) em `AdminController.php` | T004 | - | `backend/app/Http/Controllers/Api/AdminController.php` | 🟢 | `[X]` |
| T006 | Atualizar tipos do frontend em `types.ts` adicionando `'root'` em `NivelAcesso` e as interfaces DTO dos 5 CRUDs administrativos | - | `[//]` | `src/types.ts` | 🟢 | `[X]` |
| T007 | Implementar os métodos do cliente HTTP `api.admin.*` para comunicação com todas as rotas de `/api/admin/*` | T005, T006 | - | `src/services/api.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T008 | Criar o componente `AdminDashboard.tsx` com visual Dark Mode (Zinc 950), navegação por abas modulares (Usuários, Atletas, Partidas, Caixa, Patrimônio), tabelas com busca e modais de edição | T007 | - | `src/components/admin/AdminDashboard.tsx` | 🟢 | `[X]` |
| T009 | Integrar botão de acesso ao "Painel Admin" no `Header.tsx` condicionado a `user?.role === 'root'` e adicionar o perfil rápido ROOT nos botões de demonstração do `LoginModal.tsx` | T008 | - | `src/components/Header.tsx` | 🟢 | `[X]` |
| T010 | Implementar guard de visão (`currentView: 'match' | 'admin'`) em `App.tsx` para alternância suave e segura entre o Dia de Jogo e a Dashboard Administrativa ROOT | T009 | - | `src/App.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T011 | Executar suite de testes do backend (`php artisan test`) e compilação do frontend (`npm run build`) validando a integridade completa do sistema e ausência de regressões | T010 | - | `backend/tests/Feature/AdminCrudTest.php` | 🟢 | `[X]` |

---

## Notas de execução

1. **Role ROOT Canônica:** O model `User.php` foi parametrizado com método `hasRole` que concede acesso total ao superusuário `root`, ao mesmo tempo em que restringe o perfil `geral` contra endpoints exclusivos de backoffice administrativo (`role:root`).
2. **Backoffice Exclusivo sob `/api/admin/*`:** O novo controlador `AdminController.php` unifica as 14 operações de CRUD dos 5 domínios operacionais (Usuários, Atletas, Partidas, Caixa e Patrimônio).
3. **Soft Delete de Atletas:** O toggle de status com `ativo: false` preserva 100% da integridade relacional de scouts e presenças pré-existentes.
4. **Dashboard Desacoplada:** O componente `AdminDashboard.tsx` oferece densidade de informação em Dark Mode elegante, permitindo que a tela do vestiário e dia de jogo continue leve e ágil.
5. **Automação e Validação:** 34 testes do backend passando (149 asserções no PHPUnit) e build de produção Vite gerado sem nenhum erro de tipagem.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial gerada por `/reversa-to-do` | reversa-to-do |
| 2026-09-21 | Conclusão das 11 ações (`T001` a `T011`) com testes e build validados | reversa-coding |
