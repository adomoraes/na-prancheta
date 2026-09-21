# Contrato de Interface: API de Atletas com Número de Calçado

> Identificador: `005-numero-calcado-atleta`  
> Data: `2026-09-21`  
> Protocolo: HTTP REST / JSON  

---

## 1. Visão Geral

Este documento formaliza as alterações no contrato de endpoints de atletas para contemplar o atributo `numero_calcado`.

---

## 2. Endpoints Afetados

### 2.1. `GET /api/admin/atletas`
- **Autenticação:** Obrigatória (`Bearer Token`, Role: `root`)
- **Descrição:** Retorna a listagem de todos os atletas com relacionamento `user`.
- **Payload de Resposta (200 OK):**
```json
[
  {
    "id": "9d901f4c-1234-4567-89ab-cdef01234567",
    "time_id": "11111111-1111-1111-1111-111111111111",
    "user_id": null,
    "nome": "Carlos Silva",
    "apelido": "Carlão",
    "numero_camisa": 10,
    "numero_calcado": 41,
    "posicao_principal": "MEI",
    "posicao_secundaria": "VOL",
    "tipo_vinculo": "mensalista",
    "ativo": true,
    "created_at": "2026-09-21T03:00:00.000000Z",
    "updated_at": "2026-09-21T03:00:00.000000Z"
  }
]
```

---

### 2.2. `POST /api/admin/atletas`
- **Autenticação:** Obrigatória (`Bearer Token`, Role: `root`)
- **Descrição:** Criação de um novo atleta pelo administrador.
- **Payload de Requisição:**
```json
{
  "nome": "Carlos Silva",
  "apelido": "Carlão",
  "numero_camisa": 10,
  "numero_calcado": 41,
  "posicao_principal": "MEI",
  "posicao_secundaria": "VOL",
  "tipo_vinculo": "mensalista",
  "user_id": null
}
```
- **Regras de Validação:**
  - `numero_calcado`: `nullable|integer|min:25|max:50`
- **Resposta de Sucesso (201 Created):**
```json
{
  "message": "Atleta cadastrado com sucesso.",
  "atleta": {
    "id": "...",
    "nome": "Carlos Silva",
    "numero_calcado": 41,
    ...
  }
}
```
- **Resposta de Erro de Validação (422 Unprocessable Content):**
```json
{
  "message": "The numero calcado field must be between 25 and 50.",
  "errors": {
    "numero_calcado": [
      "O número do calçado deve estar entre 25 e 50."
    ]
  }
}
```

---

### 2.3. `PUT /api/admin/atletas/{id}`
- **Autenticação:** Obrigatória (`Bearer Token`, Role: `root`)
- **Descrição:** Atualização cadastral dos dados do atleta.
- **Payload de Requisição:**
```json
{
  "numero_calcado": 42
}
```
- **Regras de Validação:**
  - `numero_calcado`: `nullable|integer|min:25|max:50`
- **Resposta de Sucesso (200 OK):**
```json
{
  "message": "Atleta atualizado com sucesso.",
  "atleta": {
    "id": "...",
    "numero_calcado": 42,
    ...
  }
}
```

---

### 2.4. `GET /api/atletas` e `POST /api/atletas` (Público/Atletas)
- `GET /api/atletas`: O retorno em JSON inclui a propriedade `numero_calcado` (tipo `integer` ou `null`).
- `POST /api/atletas`: Aceita o parâmetro opcional `numero_calcado` com a mesma validação `nullable|integer|min:25|max:50`.
