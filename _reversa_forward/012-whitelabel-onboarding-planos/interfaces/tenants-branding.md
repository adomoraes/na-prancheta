# Interface de Contrato: Identidade Visual e Branding do Clube

> Identificador: `012-whitelabel-onboarding-planos`  
> Tipo: HTTP REST  
> Confidência: 🟢 CONFIRMADO  

---

## 1. `GET /api/tenant/branding`

Retorna os atributos visuais e identidade de marca da agremiação do usuário autenticado.

### Request
- **Headers:** `Authorization: Bearer <TOKEN>`, `Accept: application/json`

### Response (200 OK)
```json
{
  "id": "a98e2170-1234-4567-89ab-cdef01234567",
  "nome": "União Futebol Clube",
  "sigla": "UFC",
  "escudo_url": "https://storage.naprancheta.com/escudos/uniao-fc.png",
  "cor_primaria": "#16a34a",
  "cor_secundaria": "#ffffff",
  "modalidade": "futebol_campo",
  "status": "trial",
  "dias_restantes_trial": 12
}
```

---

## 2. `PUT /api/tenant/branding`

Atualiza a identidade visual da agremiação (acessível exclusivamente por usuários com papel `gestor` ou `root`).

### Request
- **Headers:** `Authorization: Bearer <TOKEN>`, `Content-Type: multipart/form-data` ou `application/json`
- **Body:**
```json
{
  "cor_primaria": "#16a34a",
  "cor_secundaria": "#ffffff",
  "sigla": "UFC",
  "escudo_url": "https://storage.naprancheta.com/escudos/uniao-fc.png"
}
```

### Response (200 OK)
```json
{
  "message": "Identidade visual atualizada com sucesso.",
  "tenant": {
    "cor_primaria": "#16a34a",
    "cor_secundaria": "#ffffff",
    "sigla": "UFC",
    "escudo_url": "https://storage.naprancheta.com/escudos/uniao-fc.png"
  }
}
```

### Validações
- Cores devem obedecer ao padrão regex hexadecimal `^#([A-Fa-f0-9]{6})$`.
- Arquivo de imagem enviado não deve ultrapassar 2048 KB.
