# Contrato de Interface: API Guards & Erro 401 Unauthorized

> Identificador: `003-bloqueio-rotas-auth`  
> Contrato: HTTP REST API Guards  
> Protocolo: HTTP / JSON  

---

## 1. Visão Geral

Este documento formaliza as regras de autorização das rotas do backend Laravel 11, categorizando entre rotas públicas e rotas protegidas por autenticação via token Bearer (Sanctum).

---

## 2. Mapa de Rotas e Políticas de Acesso

| Método | Endpoint | Proteção | Resposta p/ Não Autenticado |
|--------|----------|----------|------------------------------|
| `POST` | `/api/auth/login` | Pública | Processa login e retorna token |
| `POST` | `/api/auth/google` | Pública | Processa credencial Google e retorna token |
| `POST` | `/api/auth/dev-login` | Pública | Gera token instantâneo para ambiente dev |
| `GET`  | `/api/auth/me` | `auth:sanctum` | `401 Unauthorized` |
| `POST` | `/api/auth/logout` | `auth:sanctum` | `401 Unauthorized` |
| `GET`  | `/api/atletas` | Pública | Retorna elenco |
| `GET`  | `/api/partidas/{id}` | Pública | Retorna detalhes do jogo e ficha pública |
| `GET`  | `/api/partidas/{id}/protocolo-vestiario` | Pública | Retorna status do cronômetro T-50 |
| `POST` | `/api/partidas/{id}/presencas` | `auth:sanctum` | `401 Unauthorized` |
| `POST` | `/api/partidas/{id}/presencas/{atletaId}/chegada` | `auth:sanctum` | `401 Unauthorized` |
| `GET`  | `/api/partidas/{id}/escalacao` | Pública | Retorna escalação cadastrada |
| `POST` | `/api/partidas/{id}/escalacao` | `auth:sanctum` + `role:tecnico,geral` | `401 Unauthorized` |
| `GET`  | `/api/partidas/{id}/vaquinha` | Pública | Retorna quadro da vaquinha |
| `POST` | `/api/partidas/{id}/vaquinha/{atletaId}/baixa` | `auth:sanctum` + `role:financeiro,geral` | `401 Unauthorized` |
| `POST` | `/api/partidas/{id}/vaquinha/encerrar` | `auth:sanctum` + `role:financeiro,geral` | `401 Unauthorized` |
| `GET`  | `/api/partidas/{id}/almoxarifado` | Pública | Retorna status do almoxarifado |
| `POST` | `/api/partidas/{id}/almoxarifado/fechar-malas` | `auth:sanctum` + `role:almoxarifado,geral` | `401 Unauthorized` |
| `GET`  | `/api/partidas/{id}/scouts` | Pública | Retorna scouts do jogo |
| `POST` | `/api/partidas/{id}/scouts/{atletaId}` | `auth:sanctum` + `role:tecnico,geral` | `401 Unauthorized` |

---

## 3. Especificação da Resposta 401 Unauthorized

### Headers da Requisição Esperados
```http
Authorization: Bearer <personal_access_token>
Accept: application/json
```

### Resposta Padrão em Caso de Ausência ou Token Inválido
- **Código HTTP:** `401 Unauthorized`
- **Header:** `Content-Type: application/json`
- **Payload:**
```json
{
  "message": "Unauthenticated."
}
```

---

## 4. Idempotência e Timeouts

- **Idempotência:** Tentativas repetidas de acesso sem token resultam sempre no mesmo código de status 401.
- **Timeouts:** O cliente frontend deve manter timeout padrão de 10 segundos para chamadas HTTP.
