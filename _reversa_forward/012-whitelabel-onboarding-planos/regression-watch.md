# Monitor de Regressão: Feature 012 - Whitelabel, Planos e Pagamentos

> Identificador: `012-whitelabel-onboarding-planos`  
> Data: `2026-10-06`  

## 1. Pontos de Atenção Monitorados

| Item | Risco Teórico | Mitigação Implementada | Status |
|------|---------------|------------------------|--------|
| Isolamento entre Clubes | Vazamento de dados de um clube para outro em rotas de listagem | Escopo baseado em `time_id` validado e autenticado via token Sanctum; middleware `EnsureTenantContext` | 🟢 Validado em testes |
| Clube Fundador Legado | Bloqueio indevido de funcionalidades do clube padrão | `PlanosSeeder` atribui plano Campeão ativo e `trial_ends_at = null` ao clube fundador existente | 🟢 Validado |
| Links Públicos de Partidas | Visitantes do WhatsApp serem barrados por middleware de tenant | Rotas públicas `/partidas/{id}` e leituras de presença continuam livres | 🟢 Validado |
| Idempotência de Webhook | Pagamentos duplicados acionarem múltiplas renovações | Tabela `webhook_events` com chave única `event_id` e verificação prévia | 🟢 Testado com 2 requisições consecutivas |
| Segurança de Personificação | Usuários comuns tentarem personificar outros clubes | Validação explícita de `$user->isRoot()` com retorno HTTP 403 e log de auditoria em `impersonation_logs` | 🟢 Testado |
| Compilação Frontend | Erros de TypeScript ou Vite com os novos modais | `npm run build` executado com sucesso e 0 erros | 🟢 Validado (1.83s build) |

## 2. Testes de Regressão Automatizados
- **Total de testes:** 82
- **Asserções:** 425
- **Status da suíte:** 100% Passando
