# Interface de Contrato: Onboarding, Registro de Clube e Autenticação

> Identificador: `012-whitelabel-onboarding-planos`  
> Tipo: HTTP REST  
> Confidência: 🟢 CONFIRMADO  

---

## 1. `POST /api/onboarding`

Cadastra uma nova agremiação esportiva e o respectivo usuário gestor, ativando período de teste gratuito de 14 dias.

### Request
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "nome_clube": "União Futebol Clube",
  "sigla": "UFC",
  "modalidade": "futebol_campo",
  "nome_gestor": "Marcos Silva",
  "email": "marcos@uniaofc.com",
  "password": "SenhaSegura123!",
  "password_confirmation": "SenhaSegura123!"
}
```

### Response (201 Created)
```json
{
  "message": "Agremiação cadastrada com sucesso com período de avaliação de 14 dias.",
  "token": "1|sanctum_token_hash_a1b2c3d4...",
  "user": {
    "id": 15,
    "name": "Marcos Silva",
    "email": "marcos@uniaofc.com",
    "role": "gestor",
    "time_id": "a98e2170-1234-4567-89ab-cdef01234567"
  },
  "tenant": {
    "id": "a98e2170-1234-4567-89ab-cdef01234567",
    "nome": "União Futebol Clube",
    "sigla": "UFC",
    "slug": "uniao-futebol-clube",
    "cor_primaria": "#10b981",
    "cor_secundaria": "#0f172a",
    "escudo_url": null,
    "status": "trial",
    "trial_ends_at": "2026-10-20T23:59:59Z"
  }
}
```

### Erros Possíveis
- `422 Unprocessable Entity`: E-mail já utilizado, campos ausentes ou senha fraca.

---

## 2. `POST /api/auth/impersonate`

Permite a superusuários com papel ROOT personificarem a sessão de uma agremiação para suporte técnico.

### Request
- **Headers:** `Authorization: Bearer <TOKEN_ROOT>`, `Content-Type: application/json`
- **Body:**
```json
{
  "time_id": "a98e2170-1234-4567-89ab-cdef01234567"
}
```

### Response (200 OK)
```json
{
  "message": "Sessão de suporte iniciada com sucesso.",
  "token": "2|impersonation_token_hash...",
  "impersonating": true,
  "tenant": {
    "id": "a98e2170-1234-4567-89ab-cdef01234567",
    "nome": "União Futebol Clube",
    "cor_primaria": "#10b981",
    "cor_secundaria": "#0f172a"
  }
}
```

### Erros Possíveis
- `403 Forbidden`: Usuário autenticado não possui papel `root`.
- `404 Not Found`: Agremiação informada não existe.
