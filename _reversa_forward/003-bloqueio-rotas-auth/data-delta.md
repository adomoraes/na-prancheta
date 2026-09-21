# Data Delta: Bloqueio de Rotas e Recursos

> Identificador: `003-bloqueio-rotas-auth`  
> Data: `2026-09-21`  
> Impacto no Banco de Dados: Nenhum (Zero Migrations)  

---

## 1. Resumo Executivo do Modelo de Dados

Esta entrega não introduz novas tabelas, colunas, índices ou alterações estruturais no banco de dados PostgreSQL. O bloqueio de rotas e o controle de acesso utilizam estritamente o ecossistema existente configurado na feature `002-autenticacao-google-rbac`:

- Tabela `users`: Armazena os usuários do sistema com seus respectivos papéis (`role: 'geral' | 'tecnico' | 'financeiro' | 'almoxarifado' | 'atleta'`).
- Tabela `personal_access_tokens`: Gerenciada nativamente pelo Laravel Sanctum para armazenamento de tokens Bearer gerados no login.

---

## 2. Tabelas Impactadas

| Tabela | Tipo de Impacto | Descrição |
|--------|-----------------|-----------|
| `personal_access_tokens` | Leitura / Validação | O middleware `auth:sanctum` consulta os tokens ativos para verificar autenticidade e expiração a cada requisição mutatória protegida. |
| `users` | Leitura | O middleware `CheckRole` consulta a coluna `role` do usuário autenticado para autorizar o acesso à rota requerida. |

---

## 3. Estrutura do Armazenamento Local (Client-Side Storage)

No navegador do cliente (`localStorage`), as chaves permanecem:

| Chave | Tipo | Finalidade | Comportamento no 401 |
|-------|------|------------|----------------------|
| `na_prancheta_token` | `string` | Bearer Token Sanctum | Removido imediatamente ao receber 401 Unauthorized. |
| `naprancheta_user` | `JSON string` | Dados do usuário logado | Removido imediatamente ao receber 401 Unauthorized. |

---

## 4. Migrações

- Nenhuma migração necessária (`n/a`).
