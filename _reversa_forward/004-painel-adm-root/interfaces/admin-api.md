# Contrato de Interface: API Administrativa ROOT

> Identificador: `004-painel-adm-root`  
> Contrato: Endpoints de Gestão Master (Backoffice)  
> Protocolo: HTTP REST / JSON  
> Autorização: `Bearer <token>` com Role `root`  

---

## 1. Visão Geral

Este contrato especifica todas as rotas administrativas sob o prefixo `/api/admin/*`. Todas as rotas deste grupo exigem obrigatoriamente autenticação Sanctum válida e o papel exclusivo `root`. Qualquer requisição com token de papel diferente (`tecnico`, `financeiro`, `almoxarifado`, `atleta`, `geral`) ou sem token receberá `403 Forbidden` ou `401 Unauthorized`.

---

## 2. Endpoints e Parâmetros

### 2.1 Gestão de Usuários & Roles

#### `GET /api/admin/users`
Retorna a listagem de todos os usuários do sistema.
- **Resposta 200 OK:**
  ```json
  [
    {
      "id": 1,
      "name": "Administrador Root",
      "email": "root@naprancheta.com",
      "role": "root",
      "ativo": true,
      "created_at": "2026-09-20T12:00:00.000000Z"
    }
  ]
  ```

#### `POST /api/admin/users`
Cria um novo usuário no sistema.
- **Payload:**
  ```json
  {
    "name": "Carlos Técnico",
    "email": "carlos@naprancheta.com",
    "password": "password123",
    "role": "tecnico"
  }
  ```
- **Validações:**
  - `name`: string, obrigatório
  - `email`: email válido, obrigatório, único na tabela `users`
  - `password`: string, mín 6 caracteres, obrigatório
  - `role`: obrigatório, enum (`root`, `geral`, `tecnico`, `financeiro`, `almoxarifado`, `atleta`)
- **Resposta 201 Created:** Objeto do usuário criado (sem exibir senha).

#### `PUT /api/admin/users/{id}`
Atualiza dados cadastrais ou papel do usuário.
- **Payload:**
  ```json
  {
    "name": "Carlos Silva",
    "email": "carlos.silva@naprancheta.com",
    "role": "geral"
  }
  ```
- **Resposta 200 OK:** Objeto do usuário atualizado.

#### `PATCH /api/admin/users/{id}/password`
Redefine a senha de um usuário diretamente pelo ROOT.
- **Payload:**
  ```json
  {
    "password": "novaSenhaForte123"
  }
  ```
- **Resposta 200 OK:** `{"message": "Senha atualizada com sucesso."}`

#### `DELETE /api/admin/users/{id}`
Desativa (ou remove) o acesso do usuário.
- **Resposta 200 OK:** `{"message": "Usuário desativado com sucesso."}`

---

### 2.2 Gestão de Atletas & Elenco

#### `GET /api/admin/atletas`
Retorna a lista completa de atletas (incluindo ativos e inativos).
- **Resposta 200 OK:** Array com atletas e campo `ativo` booleano.

#### `POST /api/admin/atletas`
Cadastra um novo atleta no elenco.
- **Payload:**
  ```json
  {
    "nome": "Gabriel Barbosa",
    "apelido": "Gabigol",
    "numero": 9,
    "posicao": "ATA",
    "foto_url": null,
    "mensalista": true
  }
  ```
- **Resposta 201 Created:** Objeto do atleta criado.

#### `PUT /api/admin/atletas/{id}`
Atualiza dados do atleta.
- **Payload:** Campos a atualizar (`nome`, `apelido`, `numero`, `posicao`, `mensalista`).
- **Resposta 200 OK:** Atleta atualizado.

#### `PATCH /api/admin/atletas/{id}/status`
Alterna o status ativo/inativo (Soft Delete / Reativação).
- **Payload:**
  ```json
  {
    "ativo": false
  }
  ```
- **Resposta 200 OK:** `{"message": "Status do atleta atualizado com sucesso.", "atleta": {...}}`

---

### 2.3 Gestão de Partidas & Vestiário

#### `GET /api/admin/partidas`
Lista todas as partidas cadastradas no sistema.
- **Resposta 200 OK:** Array de partidas.

#### `POST /api/admin/partidas`
Cria uma nova partida com cronograma de vestiário e parâmetros de jogo.
- **Payload:**
  ```json
  {
    "data_hora": "2026-10-01 19:30:00",
    "adversario": "União da Vila",
    "local_nome": "Arena Fut7 Sintético",
    "local_endereco": "Av. dos Esportes, 500",
    "local_maps_url": "https://maps.google.com/?q=-23.5,-46.6",
    "teto_atletas": 14,
    "valor_total_campo": 350.00,
    "valor_por_atleta": 30.00
  }
  ```
- **Resposta 201 Created:** Objeto da partida criada com seus horários calculados.

#### `PUT /api/admin/partidas/{id}`
Edita informações gerais da partida.
- **Resposta 200 OK:** Objeto da partida atualizada.

#### `PATCH /api/admin/partidas/{id}/status`
Atualiza o status da partida (`agendada`, `em_andamento`, `encerrada`, `cancelada`).
- **Resposta 200 OK:** Partida atualizada.

---

### 2.4 Gestão de Caixa & Financeiro

#### `GET /api/admin/caixa`
Lista todas as movimentações gerais do caixa e resumo consolidado.
- **Resposta 200 OK:**
  ```json
  {
    "saldo_atual": 1450.50,
    "total_entradas": 3200.00,
    "total_saidas": 1749.50,
    "movimentacoes": [...]
  }
  ```

#### `POST /api/admin/caixa`
Lança uma entrada ou saída administrativa no caixa do clube.
- **Payload:**
  ```json
  {
    "tipo": "saida",
    "valor": 120.00,
    "descricao": "Compra de fita para meiões e gelo",
    "categoria": "material"
  }
  ```
- **Resposta 201 Created:** Movimentação registrada.

---

### 2.5 Gestão de Patrimônio & Almoxarifado

#### `GET /api/admin/patrimonio`
Lista todos os itens de patrimônio inventariados do clube.
- **Resposta 200 OK:** Array de itens de patrimônio com quantidade e estado de conservação.

#### `POST /api/admin/patrimonio`
Cadastra novo item ao inventário.
- **Payload:**
  ```json
  {
    "nome": "Bolas Penalty S11 Pro",
    "quantidade": 6,
    "categoria": "bola",
    "estado": "novo",
    "observacoes": "Lote adquirido em setembro"
  }
  ```
- **Resposta 201 Created:** Item de patrimônio criado.

#### `PUT /api/admin/patrimonio/{id}`
Atualiza quantidade, estado ou dados do item de patrimônio.
- **Resposta 200 OK:** Item atualizado.

#### `DELETE /api/admin/patrimonio/{id}`
Remove item do patrimônio (ou marca como baixado/descartado).
- **Resposta 200 OK:** `{"message": "Item de patrimônio removido com sucesso."}`

---

## 3. Códigos de Retorno e Tratamento de Erros

| Código | Condição | Exemplo de Resposta |
|--------|----------|---------------------|
| `401 Unauthorized` | Token ausente ou expirado | `{"message": "Unauthenticated."}` |
| `403 Forbidden` | Usuário autenticado, mas seu papel **não** é `root` | `{"message": "Acesso negado: recurso exclusivo para perfil ROOT."}` |
| `422 Unprocessable Entity` | Falha de validação nos campos do payload | `{"message": "Os dados fornecidos são inválidos.", "errors": {"email": ["O e-mail já está em uso."]}}` |
| `404 Not Found` | Recurso (usuário, atleta, partida etc.) não encontrado | `{"message": "Recurso não encontrado."}` |
