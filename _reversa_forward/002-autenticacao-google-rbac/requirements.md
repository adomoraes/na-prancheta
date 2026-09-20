# Requirements: Módulo de Autenticação, Login Google e RBAC (Roles)

> Identificador: `002-autenticacao-google-rbac`  
> Data: `2026-09-20`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

---

## 1. Resumo executivo

Esta especificação define a implementação do sistema completo de autenticação e governança de acessos por responsabilidades operacionais (RBAC) na aplicação **Na Prancheta**. A entrega substitui o seletor visual desprotegido de perfis no cabeçalho (apontado como lacuna em `_reversa_sdd/permissions.md`) por autenticação oficial via **Google (Google Identity Services)** e credenciais seguras, persistência com tokens **Laravel Sanctum**, proteção de rotas no backend via middleware `CheckRole` e direcionamento inteligente das abas e telas da SPA conforme o papel do usuário logado.

---

## 2. Contexto a partir do legado e especificações

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/permissions.md#3-segurança-e-lacunas-de-controle-de-acesso` | Ausência de Autenticação Segura (Client-Side Trust): alternância de perfil no Header era puramente visual sem validação de credenciais ou tokens. | 🟢 CONFIRMADO |
| `_reversa_sdd/permissions.md#1-descrição-dos-perfis-de-acesso-nivelacesso` | Definição das 5 roles operacionais: `atleta`, `tecnico`, `financeiro`, `almoxarifado` e `geral`. | 🟢 CONFIRMADO |
| `_reversa_sdd/permissions.md#2-matriz-de-permissões-rbac` | Tabela detalhada de ações permitidas e bloqueadas por perfil para cada módulo de dia de jogo. | 🟢 CONFIRMADO |
| `backend/database/migrations/0001_01_01_000000_create_users_table.php` | Tabela `users` existente no PostgreSQL com Sanctum (`HasApiTokens`). | 🟢 CONFIRMADO |

---

## 3. Personas e Matriz de Responsabilidades (RBAC)

| Perfil (`role`) | Responsabilidade Principal | Acesso Direcionado | Restrições Estritas |
|-----------------|----------------------------|--------------------|---------------------|
| **Atleta (`atleta`)** | Consulta da partida, protocolo de vestiário, scout e confirmação de própria presença. | Aba **Ficha & Presença** (`jogo`) | Bloqueado de alterar escalação tática, dar baixa na vaquinha, fechar malas ou editar scout. |
| **Comissão Técnica (`tecnico`)** | Escalação dos 11 titulares (4-3-3), liberação oficial no vestiário (T-35) e registro de scout. | Aba **Prancheta Tática** (`tatica`) | Bloqueado de movimentar finanças e fechar malas de patrimônio. |
| **Tesoureiro do Dia (`financeiro`)** | Gestão da vaquinha da arbitragem (R$ 300,00), baixa de pagamentos PIX e encerramento de caixa. | Aba **Tesoureiro do Dia** (`financeiro`) | Bloqueado de escalar atletas e liberar resenha do almoxarifado. |
| **Almoxarifado (`almoxarifado`)** | Custódia dos uniformes, bolsão de bolas, tranca de malas e liberação da trava da resenha. | Aba **Almoxarifado & Malas** (`almoxarifado`) | Bloqueado de alterar escalação e baixar vaquinha. |
| **Diretoria Geral (`geral`)** | Administração global da agremiação esportiva com acesso irrestrito a todos os módulos. | Visão global com acesso a todas as abas e capacidade de simular visões. | Nenhuma restrição operacional. |

---

## 4. Regras de Negócio Implementadas

1. **RN-AUTH-01: Autenticação via Google Identity Services (GIS)** 🟢
   - O usuário pode realizar login em 1 clique utilizando sua conta Google.
   - O frontend submete o ID Token (JWT) assinado pelo Google para o endpoint `POST /api/auth/google`.
   - O backend valida a assinatura do token junto à infraestrutura oficial do Google (`oauth2.googleapis.com/tokeninfo`), localiza ou provisiona a conta do usuário e emite o token Sanctum.

2. **RN-AUTH-02: Autenticação Clássica (Telefone/E-mail + Senha)** 🟢
   - Suporte a login tradicional digitando número de telefone (com ou sem máscara) ou e-mail cadastrado, acompanhado de senha criptografada em bcrypt.

3. **RN-AUTH-03: Direcionamento Automático pós-Login** 🟢
   - Ao autenticar com sucesso, a interface chaveia imediatamente para o módulo primário correspondente ao papel do usuário (`tecnico` -> Prancheta, `financeiro` -> Tesouraria, `almoxarifado` -> Almoxarifado, `atleta` -> Ficha do Jogo).

4. **RN-AUTH-04: Proteção de Módulos no Frontend e Backend** 🟢
   - No frontend, abas protegidas bloqueiam acesso de papéis não autorizados exibindo o componente `AcessoRestrito`.
   - No backend, o middleware `CheckRole` intercepta requisições de mutação e retorna HTTP 403 Forbidden caso o usuário autenticado não possua o papel exigido na rota.

5. **RN-AUTH-05: Modo Dev / Perfis Rápidos de Demonstração** 🟢
   - Disponibilização de atalhos rápidos para alternar entre os 5 perfis oficiais em ambiente local, acelerando testes de integração e validações funcionais.

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|------------|--------------------|
| RF-01 | Login com Google | Must | Validar Google ID Token na API e retornar token Sanctum + dados do perfil. |
| RF-02 | Login por Credenciais | Must | Autenticar por telefone ou e-mail com senha bcrypt na rota `/api/auth/login`. |
| RF-03 | Controle RBAC na API | Must | Middleware `role:...` retorna 403 Forbidden para usuários sem permissão em rotas restritas. |
| RF-04 | Widget de Perfil no Header | Must | Exibir avatar, nome, badge de role e menu de logout. |
| RF-05 | Tela de Acesso Restrito | Must | Exibir tela explicativa com botão de retorno quando o usuário tentar acessar aba proibida. |
| RF-06 | Atalhos Rápidos de Teste (Dev) | Should | Permitir comutação em 1 toque entre os 5 papéis no ambiente local. |
