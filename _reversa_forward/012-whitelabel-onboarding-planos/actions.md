# Actions: Fluxo de Whitelabel com Onboarding, Autenticação, Planos e Pagamentos

> Identificador: `012-whitelabel-onboarding-planos`  
> Data: `2026-10-06`  
> Roadmap: `_reversa_forward/012-whitelabel-onboarding-planos/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 21 |
| Concluídas | 21 (100%) |
| Paralelizáveis (`[//]`) | 5 |
| Maior cadeia de dependência | 7 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar migração de extensão da tabela `times` (branding, cores, status, trial) e adicionar `time_id` em `users` | - | `[//]` | `backend/database/migrations/2026_10_06_180000_extend_times_and_users_for_whitelabel.php` | 🟢 | `[X]` |
| T002 | Criar migração para tabelas de billing e governança: `planos`, `assinaturas`, `faturas_cobranca`, `webhook_events` e `impersonation_logs` | - | `[//]` | `backend/database/migrations/2026_10_06_180001_create_whitelabel_billing_tables.php` | 🟢 | `[X]` |
| T003 | Atualizar modelo `Time.php` e criar modelos `Plano.php`, `Assinatura.php`, `FaturaCobranca.php`, `WebhookEvent.php` e `ImpersonationLog.php` | T001, T002 | - | `backend/app/Models/Plano.php` | 🟢 | `[X]` |
| T004 | Criar `PlanosSeeder.php` com o catálogo dos planos Amador, Campeão e Liga, garantindo plano ativo para o clube fundador legado | T003 | - | `backend/database/seeders/PlanosSeeder.php` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T005 | Criar testes de integração para auto-cadastro de agremiação e personificação ROOT (`POST /api/onboarding`, `POST /api/auth/impersonate`) | T003 | `[//]` | `backend/tests/Feature/WhitelabelOnboardingTest.php` | 🟢 | `[X]` |
| T006 | Criar testes de integração para catálogo de planos, checkout PIX e webhook com idempotência (`POST /api/assinaturas/checkout`, `POST /api/webhooks/pagamentos`) | T003 | `[//]` | `backend/tests/Feature/WhitelabelBillingWebhookTest.php` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Implementar `OnboardingController.php` para cadastro da agremiação, criação do gestor e ativação do trial de 14 dias | T003 | - | `backend/app/Http/Controllers/Api/OnboardingController.php` | 🟢 | `[X]` |
| T008 | Implementar middleware `EnsureTenantContext.php` com injeção do escopo da agremiação e bloqueio de mutações em clubes suspensos | T003 | - | `backend/app/Http/Middleware/EnsureTenantContext.php` | 🟢 | `[X]` |
| T009 | Implementar `TenantBrandingController.php` para leitura e atualização da paleta de cores e escudo oficial da agremiação | T003 | - | `backend/app/Http/Controllers/Api/TenantBrandingController.php` | 🟢 | `[X]` |
| T010 | Implementar `BillingController.php` para listagem de planos públicos, checkout de fatura com QR Code PIX e consulta de assinatura | T003 | - | `backend/app/Http/Controllers/Api/BillingController.php` | 🟢 | `[X]` |
| T011 | Implementar `WebhookController.php` com controle de idempotência via `webhook_events`, conciliação e ativação da assinatura | T003 | - | `backend/app/Http/Controllers/Api/WebhookController.php` | 🟢 | `[X]` |
| T012 | Implementar endpoints de personificação de agremiações no `AdminController.php` com emissão de token e auditoria em `impersonation_logs` | T003 | - | `backend/app/Http/Controllers/Api/AdminController.php` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T013 | Registrar rotas públicas e protegidas de onboarding, branding, billing, webhooks e personificação em `routes/api.php` | T007, T008, T009, T010, T011, T012 | - | `backend/routes/api.php` | 🟢 | `[X]` |
| T014 | Definir tipos TypeScript para Tenant, Branding, Planos, Assinaturas e Checkout em `src/types.ts` | - | - | `src/types.ts` | 🟢 | `[X]` |
| T015 | Implementar cliente de API frontend em `src/services/whitelabelService.ts` integrando todas as rotas whitelabel e billing | T013, T014 | - | `src/services/whitelabelService.ts` | 🟢 | `[X]` |
| T016 | Implementar componente `ClubOnboardingModal.tsx` com formulário guiado em etapas e ativação do trial de 14 dias | T015 | - | `src/components/whitelabel/ClubOnboardingModal.tsx` | 🟢 | `[X]` |
| T017 | Implementar componente `TenantBrandingModal.tsx` com seletor de cores, upload de escudo e injeção de CSS variables no DOM | T015 | - | `src/components/whitelabel/TenantBrandingModal.tsx` | 🟢 | `[X]` |
| T018 | Implementar componente `PlansCheckoutModal.tsx` com tabela comparativa de planos e modal de pagamento PIX com Copia-e-Cola | T015 | - | `src/components/whitelabel/PlansCheckoutModal.tsx` | 🟢 | `[X]` |
| T019 | Integrar contexto de tenant no `App.tsx` e `Header.tsx`, aplicando branding dinâmico e aviso de bloqueio em assinaturas suspensas | T016, T017, T018 | - | `src/App.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T020 | Implementar componente `ImpersonationBanner.tsx` com barra fixa de aviso de suporte e botão de encerramento da sessão ROOT | T015 | `[//]` | `src/components/whitelabel/ImpersonationBanner.tsx` | 🟢 | `[X]` |
| T021 | Atualizar documentação e roteiro de homologação em `onboarding.md` validando fluxo completo de ponta a ponta | T019, T020 | - | `_reversa_forward/012-whitelabel-onboarding-planos/onboarding.md` | 🟢 | `[X]` |

---

## Notas de execução

- **T001-T004:** Migrações `2026_10_06_180000_extend_times_and_users_for_whitelabel` e `2026_10_06_180001_create_whitelabel_billing_tables` aplicadas; modelos Eloquent `Time`, `User`, `Plano`, `Assinatura`, `FaturaCobranca`, `WebhookEvent`, `ImpersonationLog` criados; `PlanosSeeder` populado e integrado ao `DatabaseSeeder`.
- **T005-T006:** Testes `WhitelabelOnboardingTest` e `WhitelabelBillingWebhookTest` criados; cobrem onboarding com trial, validações, personificação por ROOT, proteção contra usuários comuns, branding, catálogo de planos, checkout PIX, idempotência do webhook e ativação de assinatura. Todos os 82 testes do backend passam (425 asserções).
- **T007-T012:** Controllers `OnboardingController`, `TenantBrandingController`, `BillingController`, `WebhookController`, `AdminController` e middleware `EnsureTenantContext` implementados e registrados.
- **T013-T015:** Rotas públicas e protegidas registradas em `routes/api.php`; tipos TypeScript exportados em `src/types.ts`; cliente de API `whitelabelService.ts` implementado com injeção de CSS vars no DOM.
- **T016-T018:** Modais `ClubOnboardingModal.tsx` (wizard com trial de 14 dias), `TenantBrandingModal.tsx` (prévia em tempo real de cores e escudo) e `PlansCheckoutModal.tsx` (tabela de planos, toggle mensal/anual e QR Code PIX com Copia-e-Cola) criados com design glassmorphism responsivo.
- **T019-T020:** Contexto de tenant integrado em `App.tsx` e `Header.tsx`, com badge de trial e alerta de suspensão; `ImpersonationBanner.tsx` implementado para suporte ROOT com encerramento de sessão; `AdminDashboard.tsx` atualizado com a aba "Clubes & Whitelabel" para personificação direta pelo superusuário.
- **T021:** Roteiro completo de testes e homologação documentado em `onboarding.md`.

---

## Histórico de alterações

| Data | Alteração | Autor |
|---|---|---|
| 2026-10-06 | Decomposição inicial do roadmap em 21 ações atômicas por `/reversa-to-do` | reversa |
| 2026-10-06 | Implementação completa de todas as 21 ações backend, testes e frontend | reversa |
