# Actions: Bloqueio de Rotas e Recursos para Usuários Não Autenticados

> Identificador: `003-bloqueio-rotas-auth`  
> Data: `2026-09-21`  
> Roadmap: `_reversa_forward/003-bloqueio-rotas-auth/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 9 |
| Concluídas (`[X]`) | 9 |
| Paralelizáveis (`[//]`) | 2 |
| Maior cadeia de dependência | 6 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Ajustar middleware `CheckRole` para rejeitar requisições com HTTP 401 caso usuário não esteja autenticado em rotas com restrição de perfil | - | `[//]` | `backend/app/Http/Middleware/CheckRole.php` | 🟢 | `[X]` |
| T002 | Proteger rotas de mutação na API com `auth:sanctum` em `routes/api.php`, preservando rotas `GET /partidas/{id}` e vestiário públicas | T001 | - | `backend/routes/api.php` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Criar suite de testes de integração `RouteAuthProtectionTest` validando retorno 401 para requisições anônimas de mutação e 200 para leituras públicas | T002 | - | `backend/tests/Feature/RouteAuthProtectionTest.php` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Implementar interceptador HTTP no método `request` de `api.ts` para capturar status 401, expurgar token e emitir `auth:session-expired` | - | `[//]` | `src/services/api.ts` | 🟢 | `[X]` |
| T005 | Adicionar listener do evento `auth:session-expired` no `AuthContext` para redefinir estado de autenticação, exibir toast de expiração e abrir modal de login | T004 | - | `src/contexts/AuthContext.tsx` | 🟢 | `[X]` |
| T006 | Atualizar `canAccessTab` no `AuthContext` para restringir abas operacionais (`tatica`, `financeiro`, `almoxarifado`, `scout`) quando `!isAuthenticated` | T005 | - | `src/contexts/AuthContext.tsx` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Implementar guard de navegação na alternância de abas em `App.tsx` para abrir o `LoginModal` ao tentar acessar aba restrita deslogado | T006 | - | `src/App.tsx` | 🟢 | `[X]` |
| T008 | Implementar guard de ação no handler de presença em `App.tsx` para abrir o `LoginModal` ao tentar confirmar presença sem login ativo | T007 | - | `src/App.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T009 | Executar bateria completa de testes automatizados do backend (`artisan test`) e compilação do frontend (`npm run build`) validando a integridade do sistema | T003, T008 | - | `backend/tests/Feature/RouteAuthProtectionTest.php` | 🟢 | `[X]` |

---

## Notas de execução

1. Todas as mutações da API (`POST /partidas/{id}/*` e `POST /atletas`) foram encapsuladas sob `auth:sanctum`. Rotas de leitura `GET` permaneceram públicas para viabilizar compartilhamento em links de WhatsApp.
2. `CheckRole.php` agora rejeita imediatamente com HTTP 401 caso não haja usuário autenticado antes de validar roles.
3. No frontend, qualquer resposta 401 dispara o evento `auth:session-expired`, que aciona um toast visual e reabre o `LoginModal` sem perder o estado da página.
4. Tentativas anônimas de trocar abas restritas ou confirmar presença abrem diretamente o `LoginModal`.
5. 26 testes passando (108 asserções no PHPUnit) e build de produção do Vite/PWA gerado sem erros.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial gerada por `/reversa-to-do` | reversa-to-do |
| 2026-09-21 | Conclusão de todas as 9 tarefas da feature (`T001` a `T009`) | reversa-coding |
