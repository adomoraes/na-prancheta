# Contrato de Interface: API de Locais e Campos

> Identificador: `006-crud-locais-campos`  
> Data: `2026-09-21`  
> Protocolo: HTTP REST / JSON  

---

## 1. Endpoints Administrativos (Role `root`)

### 1.1. `GET /api/admin/locais`
- **Autenticação:** Obrigatória (`Bearer Token`, Role: `root`)
- **Descrição:** Lista todos os locais cadastrados (ativos e inativos).
- **Resposta (200 OK):**
```json
[
  {
    "id": "7b8e901f-0000-0000-0000-000000000001",
    "time_id": "11111111-1111-1111-1111-111111111111",
    "nome": "Arena Fut7 Central",
    "endereco": "Av. das Américas, 1500",
    "maps_url": "https://maps.google.com/?q=ArenaCentral",
    "tipo_piso": "Grama Sintética",
    "observacoes": "Estacionamento próprio",
    "ativo": true,
    "created_at": "2026-09-21T04:00:00.000000Z",
    "updated_at": "2026-09-21T04:00:00.000000Z"
  }
]
```

---

### 1.2. `POST /api/admin/locais`
- **Autenticação:** Obrigatória (`Bearer Token`, Role: `root`)
- **Payload:**
```json
{
  "nome": "Campo do Estrela",
  "endereco": "Rua do Esporte, 100",
  "maps_url": "https://maps.google.com/?q=CampoEstrela",
  "tipo_piso": "Grama Sintética",
  "observacoes": "Chave com o caseiro"
}
```
- **Validações:**
  - `nome`: `required|string|max:150`
  - `endereco`: `required|string|max:255`
  - `maps_url`: `nullable|string`
  - `tipo_piso`: `nullable|string|max:50`
  - `observacoes`: `nullable|string`
- **Resposta (201 Created):**
```json
{
  "message": "Local cadastrado com sucesso.",
  "local": { ... }
}
```

---

### 1.3. `PUT /api/admin/locais/{id}`
- **Autenticação:** Obrigatória (`Bearer Token`, Role: `root`)
- **Payload:** Campos a atualizar (opcionais).
- **Resposta (200 OK):** Objeto do local atualizado.

---

### 1.4. `PATCH /api/admin/locais/{id}/status`
- **Autenticação:** Obrigatória (`Bearer Token`, Role: `root`)
- **Payload:** `{ "ativo": boolean }` (ou comutação automática).
- **Resposta (200 OK):** Mensagem de status e objeto do local.

---

## 2. Endpoints Públicos / Consulta de Partidas

### 2.1. `GET /api/locais`
- **Autenticação:** Opcional / Aberta para formulários.
- **Descrição:** Retorna lista de locais ativos para preenchimento de seletores.
- **Resposta (200 OK):** Lista de objetos simplificados com `id`, `nome`, `endereco`, `maps_url`, `tipo_piso`.
