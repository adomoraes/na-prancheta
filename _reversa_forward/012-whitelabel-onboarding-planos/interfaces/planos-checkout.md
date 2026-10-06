# Interface de Contrato: Planos e Checkout de Assinatura

> Identificador: `012-whitelabel-onboarding-planos`  
> Tipo: HTTP REST  
> Confidência: 🟢 CONFIRMADO  

---

## 1. `GET /api/planos`

Retorna o catálogo de planos públicos disponíveis para contratação.

### Request
- **Headers:** `Accept: application/json`

### Response (200 OK)
```json
[
  {
    "id": 1,
    "slug": "amador",
    "nome": "Plano Amador",
    "descricao": "Ideal para 1 elenco e até 25 atletas com gestão de jogos e vaquinha.",
    "preco_mensal_centavos": 4990,
    "preco_anual_centavos": 49900,
    "max_elencos": 1,
    "max_atletas": 25,
    "recursos": [
      "Prancheta Tática 4-3-3",
      "Controle de Vestiário T-35",
      "Vaquinha PIX de Arbitragem",
      "Almoxarifado e Fechamento de Malas"
    ]
  },
  {
    "id": 2,
    "slug": "campeao",
    "nome": "Plano Campeão",
    "descricao": "Até 3 elencos, 80 atletas e scouts avançados de finalizações e minutagem.",
    "preco_mensal_centavos": 9990,
    "preco_anual_centavos": 99900,
    "max_elencos": 3,
    "max_atletas": 80,
    "recursos": [
      "Tudo do Plano Amador",
      "Scouts Completos e Leaderboard",
      "Até 3 Elencos (Principal, Veterano, Quadro B)",
      "Histórico Completo de Partidas"
    ]
  },
  {
    "id": 3,
    "slug": "liga",
    "nome": "Plano Liga",
    "descricao": "Elencos ilimitados, atletas ilimitados e múltiplos gestores com suporte dedicado.",
    "preco_mensal_centavos": 19990,
    "preco_anual_centavos": 199900,
    "max_elencos": 999,
    "max_atletas": 9999,
    "recursos": [
      "Tudo do Plano Campeão",
      "Elencos e Atletas Ilimitados",
      "Múltiplos Administradores e Comissão Técnica",
      "Suporte Prioritário Via WhatsApp"
    ]
  }
]
```

---

## 2. `POST /api/assinaturas/checkout`

Gera a fatura de cobrança e emite o QR Code PIX dinâmico ou processa o token do cartão de crédito.

### Request
- **Headers:** `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`
- **Body (Exemplo PIX):**
```json
{
  "plano_slug": "campeao",
  "ciclo": "mensal",
  "metodo_pagamento": "pix"
}
```

### Response (200 OK - PIX)
```json
{
  "fatura_id": "98a123f4-1234-5678-abcd-ef0123456789",
  "valor_centavos": 9990,
  "metodo_pagamento": "pix",
  "status": "pendente",
  "pix_qrcode_url": "https://api.pagamentos.com/qrcode/98a123f4.png",
  "pix_copia_cola": "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540599.905802BR5925Na Prancheta Sports LTDA6009Sao Paulo62070503***6304ABCD",
  "expira_em": "2026-10-06T18:30:00Z"
}
```

---

## 3. `GET /api/assinaturas/minha`

Retorna os detalhes da assinatura vigente do clube autenticado.

### Response (200 OK)
```json
{
  "status": "ativa",
  "plano": {
    "slug": "campeao",
    "nome": "Plano Campeão",
    "ciclo": "mensal"
  },
  "data_proxima_cobranca": "2026-11-06T17:15:00Z",
  "em_carencia": false,
  "faturas_recentes": [
    {
      "id": "98a123f4-1234-5678-abcd-ef0123456789",
      "valor_centavos": 9990,
      "status": "paga",
      "metodo": "pix",
      "data_pagamento": "2026-10-06T17:20:00Z"
    }
  ]
}
```
