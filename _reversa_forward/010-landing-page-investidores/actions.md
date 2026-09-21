# Actions: Landing Page Comercial & Pitch para Investidores

> Identificador: `010-landing-page-investidores`  
> Data: `2026-09-21`  
> Roadmap: `_reversa_forward/010-landing-page-investidores/roadmap.md`  

---

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 13 |
| Paralelizáveis (`[//]`) | 5 |
| Maior cadeia de dependência | 6 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar migração Laravel para a tabela `investor_leads` com campos completos e índices | - | `[//]` | `backend/database/migrations/2026_09_21_500000_create_investor_leads_table.php` | 🟢 | `[X]` |
| T002 | Criar Model Eloquent `InvestorLead.php` com `$fillable` e casts | - | `[//]` | `backend/app/Models/InvestorLead.php` | 🟢 | `[X]` |
| T003 | Executar migrações do banco de dados no Laravel (`php artisan migrate`) | T001 | - | `backend/database/migrations/` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Criar teste de integração `InvestorLeadTest.php` cobrindo submissão válida (201), validação de campos (422), rate limit e proteção da listagem admin | T001, T002 | `[//]` | `backend/tests/Feature/InvestorLeadTest.php` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T005 | Implementar `InvestorLeadController.php` com métodos `store` (público) e `index` (admin) | T002 | - | `backend/app/Http/Controllers/Api/InvestorLeadController.php` | 🟢 | `[X]` |
| T006 | Registrar rotas públicas e administrativas em `backend/routes/api.php` com rate limiter | T005 | - | `backend/routes/api.php` | 🟢 | `[X]` |
| T007 | Criar tipos TypeScript e DTOs para formulário e resposta de leads de investidores | - | `[//]` | `src/types.ts` | 🟢 | `[X]` |
| T008 | Adicionar métodos `api.leads.submitInvestorLead` em `src/services/api.ts` | T007 | - | `src/services/api.ts` | 🟢 | `[X]` |
| T009 | Implementar componentes visuais especializados da Landing Page (Hero, Showcase dos 5 Pilares, Problema/Solução, Tese de Mercado, Simulador ROI, Prova Social, Modal Lead e Footer) | T007, T008 | `[//]` | `src/components/landing/*` | 🟢 | `[X]` |
| T010 | Criar componente orquestrador `src/components/landing/LandingPage.tsx` com Navbar, navegação suave por âncoras e controle de modal | T009 | - | `src/components/landing/LandingPage.tsx` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T011 | Integrar alternância de tela em `src/App.tsx` (`viewMode: 'landing' \| 'app'`), com rota raiz na Landing Page, atalhos de transição bi-direcionais e suporte a parâmetros de URL | T010 | - | `src/App.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T012 | Executar suíte de testes de backend (`php artisan test`) e validação de compilação do frontend (`npm run build`) | T004, T006, T011 | - | `backend/tests/`, `src/` | 🟢 | `[X]` |
| T013 | Gerar adendo da documentação em `_reversa_sdd/addenda/010-landing-page-investidores.md` e atualizar `README.md` | T012 | - | `_reversa_sdd/addenda/`, `README.md` | 🟢 | `[X]` |

---

## Notas de execução

- Todos os 70 testes de backend (`php artisan test`) foram validados com 353 asserções e 100% de sucesso.
- O build do frontend (`npm run build`) foi compilado em 3.02s com Service Worker e manifest PWA ativos.
- O lead capture híbrido envia `POST /api/leads/investor` e inicia conversa pré-estruturada no WhatsApp oficial dos fundadores.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial gerada por `/reversa-to-do` | Reversa To-Do |
| 2026-09-21 | Execução integral de T001 a T013 concluída com sucesso | Reversa Coding |
