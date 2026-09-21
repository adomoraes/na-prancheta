# Contrato de Interface: Submissão de Leads de Investidores

> Endpoint: `POST /api/leads/investor`  
> Protocolo: HTTP/1.1 REST (JSON)  
> Autenticação: Nenhuma (Rota pública com Rate Limiting: 10 req/min por IP)  
> Confidência: 🟢 CONFIRMADO  

---

## 1. Visão Geral

Permite que potenciais investidores, fundos de capital de risco e gestores de arenas esportivas submetam seus dados na Landing Page comercial para solicitação de Pitch Deck e agendamento de reuniões com os fundadores do Na Prancheta.

---

## 2. Request

### Headers
```http
Content-Type: application/json
Accept: application/json
```

### Payload (JSON)
```json
{
  "nome": "Carlos Silva",
  "email": "carlos.silva@sportsfund.vc",
  "telefone": "+55 11 99999-8888",
  "tipo_investidor": "fundo_vc",
  "ticket_estimado": "200k_1m",
  "mensagem": "Gostaria de conhecer o unit economics e agendar uma call com o time."
}
```

### Schema de Validação dos Campos
| Campo | Tipo | Obrigatório | Regras | Descrição |
|---|---|---|---|---|
| `nome` | string | Sim | `required\|string\|max:255` | Nome completo do investidor ou representante |
| `email` | string | Sim | `required\|email\|max:255` | E-mail corporativo ou pessoal válido |
| `telefone` | string | Sim | `required\|string\|max:50` | WhatsApp / Telefone com DDD |
| `tipo_investidor` | string | Sim | `required\|in:anjo,fundo_vc,arena_liga,outro` | Classificação do perfil do lead |
| `ticket_estimado` | string | Não | `nullable\|string\|max:100` | Faixa de ticket pretendida ou interesse comercial |
| `mensagem` | string | Não | `nullable\|string\|max:2000` | Contexto ou detalhes da proposta |

---

## 3. Responses

### 201 Created (Sucesso)
```json
{
  "success": true,
  "message": "Lead registrado com sucesso. Nossa equipe entrará em contato em breve.",
  "data": {
    "id": 1,
    "nome": "Carlos Silva",
    "tipo_investidor": "fundo_vc",
    "created_at": "2026-09-21T14:45:00.000000Z"
  }
}
```

### 422 Unprocessable Entity (Falha de Validação)
```json
{
  "message": "Os dados fornecidos são inválidos.",
  "errors": {
    "email": ["O campo email deve ser um endereço de e-mail válido."],
    "tipo_investidor": ["O campo tipo_investidor selecionado é inválido."]
  }
}
```

### 429 Too Many Requests (Rate Limit Excedido)
```json
{
  "message": "Muitas tentativas. Por favor, tente novamente em alguns instantes."
}
```

---

## 4. Idempotência e Tratamento de Erros

- O endpoint registra o IP de origem (`$request->ip()`) para fins de auditoria e mitigação de bots.
- Caso o e-mail já tenha sido cadastrado recentemente (mesmo dia), o registro é recepcionado como atualização de contato para evitar descarte de tentativas subsequentes do investidor.
