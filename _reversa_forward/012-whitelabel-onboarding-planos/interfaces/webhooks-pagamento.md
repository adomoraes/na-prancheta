# Interface de Contrato: Webhooks de Notificação de Pagamento

> Identificador: `012-whitelabel-onboarding-planos`  
> Tipo: HTTP POST (Callback Assíncrono do Provedor de Pagamentos)  
> Confidência: 🟢 CONFIRMADO  

---

## 1. `POST /api/webhooks/pagamentos`

Endpoint público para recebimento de eventos disparados pelo gateway de pagamento nacional após conciliação ou cobrança.

### Requisitos de Segurança
- Validação de assinatura criptográfica nos headers (ex.: `X-Signature-Token` ou segredo de webhook pré-configurado).
- Controle de idempotência rigoroso utilizando o `event_id` recebido no corpo da mensagem.

---

### Request Payload (Exemplo Pagamento PIX / Cartão Confirmado)
```json
{
  "event_id": "EVT-ASAAS-998877",
  "event": "PAYMENT_RECEIVED",
  "payment": {
    "id": "PAY-123456",
    "externalReference": "98a123f4-1234-5678-abcd-ef0123456789",
    "value": 99.90,
    "netValue": 98.91,
    "billingType": "PIX",
    "status": "RECEIVED",
    "confirmedDate": "2026-10-06T17:18:22Z"
  }
}
```

---

### Comportamento do Sistema e Respostas HTTP

1. **Primeiro Processamento (Sucesso):**
   - O sistema verifica se `event_id` já existe em `webhook_events`.
   - Como não existe, registra o evento.
   - Localiza a `FaturaCobranca` pelo identificador `externalReference`.
   - Comuta o status da fatura para `paga` e registra `data_pagamento`.
   - Atualiza a `Assinatura` correspondente e a agremiação `times` para status `ativo`, estendendo a data de vigência por 30 dias (mensal) ou 365 dias (anual).
   - Retorna: `200 OK`
     ```json
     {
       "status": "processed",
       "event_id": "EVT-ASAAS-998877"
     }
     ```

2. **Reenvio de Evento Duplicado (Idempotência Ativa):**
   - O sistema detecta que `event_id` já consta registrado em `webhook_events`.
   - Nenhuma mutação de banco de dados ou reativação de plano é executada.
   - Retorna imediatamente: `200 OK`
     ```json
     {
       "status": "already_processed",
       "event_id": "EVT-ASAAS-998877"
     }
     ```

3. **Fatura Não Encontrada:**
   - Retorna `404 Not Found` registrando log de inconsistência para investigação de suporte.
