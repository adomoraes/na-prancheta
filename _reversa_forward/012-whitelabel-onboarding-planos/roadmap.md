# Roadmap: Fluxo de Whitelabel com Onboarding, Autenticação, Planos e Pagamentos

> Identificador: `012-whitelabel-onboarding-planos`  
> Data: `2026-10-06`  
> Requirements: `_reversa_forward/012-whitelabel-onboarding-planos/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A abordagem consolida a plataforma Na Prancheta como um ecossistema Whitelabel Multi-tenant de alto desempenho, preservando a agilidade da SPA React e do backend Laravel 11. O auto-cadastro (onboarding) é disponibilizado na interface web ativando imediatamente 14 dias de teste gratuito no Plano Campeão para o novo clube, sem exigência de cartão de crédito. A agremiação (`times`) passa a conter atributos de branding (emblema, cores primárias/secundárias) e status de assinatura. A identificação do clube e a injeção do tema visual ocorrem dinamicamente no frontend após a autenticação em URL unificada, enquanto o backend aplica escopo de isolamento obrigatório por `time_id`. O checkout integra pagamentos recorrentes com foco nacional em PIX e Cartão de Crédito, com atualização de vigência de planos por webhooks com proteção de idempotência. Superusuários ROOT ganham recurso de personificação de agremiações para suporte técnico.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|---|---|---|
| I. Isolamento Estrito de Dados entre Clubes | Garante que nenhuma consulta, mutação ou relatório misture dados de agremiações esportivas distintas. | Respeita |
| II. Mobile-First e Ergonomia no Vestiário | Preserva a URL única sem complexidade de subdomínios, mantendo tempo de carregamento inferior a 150ms na hidratação de temas. | Respeita |
| III. Confiança Financeira e Conciliação Transparente | Implementa controle de idempotência em webhooks e geração de faturas claras com conciliação automática por PIX dinâmico. | Respeita |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|---|---|---|---|---|
| D-01 | Multi-tenancy por Coluna Discriminadora com Escopo Global | A tabela `times` já existe e se relaciona com `atletas` e `partidas`. O uso de Global Scopes no Eloquent garante isolamento sem custo de múltiplos bancos. | Database-per-tenant, Schema-per-tenant. | 🟢 CONFIRMADO |
| D-02 | Roteamento em URL Única com Contexto Dinâmico | Elimina a necessidade de configuração de DNS wildcard e subdomínios, permitindo acesso fluido em PWA e mobile. | Subdomínios dedicados (`clube.naprancheta.com`), prefixos de slug na URL (`/c/clube`). | 🟢 CONFIRMADO |
| D-03 | Período de Teste Gratuito de 14 Dias sem Cartão | Minimiza a fricção de entrada e impulsiona a adesão de novos clubes, permitindo comprovação imediata do valor no dia de jogo. | Cartão obrigatório no cadastro, ausência de trial com pagamento antecipado obrigatório. | 🟢 CONFIRMADO |
| D-04 | Gateway Nacional com PIX Instantâneo e Cartão Recorrente | Máxima conversão e aderência cultural entre dirigentes esportivos brasileiros através de PIX QR Code e split automático. | Gateways internacionais exclusivamente em moeda estrangeira. | 🟢 CONFIRMADO |
| D-05 | Personificação Segura para Suporte ROOT | Permite que operadores da plataforma diagnostiquem problemas de configuração sem solicitar senhas a gestores. | Acesso direto ao banco de dados, compartilhamento de senhas de usuários. | 🟢 CONFIRMADO |

---

## 4. Premissas

> Nenhuma premissa ambígua adotada. Todas as 4 dúvidas levantadas na concepção dos requisitos foram 100% esclarecidas e validadas com o usuário na etapa de esclarecimentos.

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|---|---|---|---|
| Autenticação & Sessão | `_reversa_sdd/architecture.md#21-padrão-single-page-application` | componente-alterado | `AuthContext` e `Header.tsx` passam a armazenar e aplicar dinamicamente o branding do tenant (`tenantContext`). |
| Middleware de Tenant | `_reversa_sdd/architecture.md#2-padrões-arquiteturais-e-decisões-estruturais` | componente-novo | Adição do middleware `EnsureTenantContext` injetando escopo do clube e bloqueando mutações em assinaturas suspensas. |
| Catálogo & Gestão de Planos | `_reversa_sdd/architecture.md#2-padrões-arquiteturais-e-decisões-estruturais` | componente-novo | Módulo de billing com catálogo de planos, geração de cobrança PIX/Cartão e recebimento de webhooks. |
| Painel Administrativo ROOT | `_reversa_sdd/addenda/004-painel-adm-root.md#2-resumo-da-entrega` | componente-alterado | Adição de gerenciamento de clubes cadastrados, métricas de assinaturas e botão de personificação para suporte. |
| Modal de Onboarding | `_reversa_sdd/inventory.md#3-catálogo-de-arquivos` | componente-novo | Componente React `ClubOnboardingModal.tsx` integrado ao fluxo inicial para registro do clube e início do trial. |

---

## 6. Delta no modelo de dados

- **Resumo das mudanças:** A tabela existente `times` recebe atributos de branding visual (cores, sigla, slug) e controle de ciclo de assinatura (`status`, `trial_ends_at`, `plano_id`). São criadas quatro novas tabelas: `planos` (catálogo), `assinaturas` (vínculos contratuais), `faturas_cobranca` (cobranças e QR Code PIX), `webhook_events` (idempotência) e `impersonation_logs` (auditoria ROOT).
- **Detalhe completo em:** [`_reversa_forward/012-whitelabel-onboarding-planos/data-delta.md`](file:///home/eduardo-moraes/Projects/na-prancheta/_reversa_forward/012-whitelabel-onboarding-planos/data-delta.md)

---

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|---|---|---|
| Onboarding & Autenticação Multi-tenant | HTTP REST | [`_reversa_forward/012-whitelabel-onboarding-planos/interfaces/onboarding-auth.md`](file:///home/eduardo-moraes/Projects/na-prancheta/_reversa_forward/012-whitelabel-onboarding-planos/interfaces/onboarding-auth.md) |
| Branding & Identidade Visual | HTTP REST | [`_reversa_forward/012-whitelabel-onboarding-planos/interfaces/tenants-branding.md`](file:///home/eduardo-moraes/Projects/na-prancheta/_reversa_forward/012-whitelabel-onboarding-planos/interfaces/tenants-branding.md) |
| Planos & Checkout | HTTP REST | [`_reversa_forward/012-whitelabel-onboarding-planos/interfaces/planos-checkout.md`](file:///home/eduardo-moraes/Projects/na-prancheta/_reversa_forward/012-whitelabel-onboarding-planos/interfaces/planos-checkout.md) |
| Webhooks de Notificação de Pagamento | HTTP Callback | [`_reversa_forward/012-whitelabel-onboarding-planos/interfaces/webhooks-pagamento.md`](file:///home/eduardo-moraes/Projects/na-prancheta/_reversa_forward/012-whitelabel-onboarding-planos/interfaces/webhooks-pagamento.md) |

---

## 8. Plano de migração

1. **Migração do Banco de Dados:** Executar `php artisan migrate` adicionando as novas colunas à tabela `times`, `users` e criando as tabelas `planos`, `assinaturas`, `faturas_cobranca`, `webhook_events` e `impersonation_logs`.
2. **Seeder de Dados Iniciais:** Executar `php artisan db:seed --class=PlanosSeeder` para popular os planos Amador, Campeão e Liga, e associar o time fundador já cadastrado ao Plano Liga com status `ativo`.
3. **Atualização da Camada de Serviços:** Implantar controladores e serviços de billing, webhooks e context middleware.
4. **Deploy do Frontend:** Atualizar a SPA React com o `ClubOnboardingModal`, temas visuais dinâmicos em CSS variables e painel de faturamento.

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Vazamento acidental de dados entre clubes | Alto | Baixa | Aplicação de Global Scope no Eloquent e validação de `time_id` em middleware de roteamento em 100% das rotas operacionais. |
| Webhook de pagamento recebido mais de uma vez | Médio | Média | Tabela dedicada `webhook_events` com chave única `event_id` garantindo retorno imediato de sucesso para duplicidades. |
| Inadimplência gerando interrupção abrupta no dia do jogo | Médio | Média | Concessão de 5 dias corridos de carência e preservação da visualização pública da ficha da partida para não prejudicar atletas convocados. |

---

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas com `[X]`
- [ ] Testes de integração cobrindo onboarding, checkout PIX, webhook idempotente e personificação ROOT com 100% de aprovação
- [ ] Interface visual do clube reagindo dinamicamente a alterações de cores e escudo
- [ ] `regression-watch.md` gerado e registrado para monitoramento

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|---|---|---|
| 2026-10-06 | Versão inicial do plano gerada por `/reversa-plan` para a Feature 012 | reversa |
