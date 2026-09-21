# Requirements: Bloqueio de Rotas e Recursos para Usuários Não Autenticados

> Identificador: `003-bloqueio-rotas-auth`  
> Data: `2026-09-21`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta especificação define o bloqueio sistemático de rotas e recursos protegidos contra acessos de usuários não autenticados na aplicação Na Prancheta. A entrega assegura que requisições na API sem credencial válida sejam rejeitadas com erro 401 Unauthorized e que a interface de usuário restrinja ações operacionais de vestiário, vaquinha, prancheta e presença, exigindo autenticação prévia obrigatória.

---

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/permissions.md#3-segurança-e-lacunas-de-controle-de-acesso` | Aponta como lacuna crítica a ausência de autenticação segura e a necessidade de barrar acessos anônimos em recursos operacionais do vestiário. | 🟢 |
| `_reversa_sdd/permissions.md#2-matriz-de-permissões-rbac` | Define as permissões por perfil, pressupondo a identificação inequívoca do autor de cada operação. | 🟢 |
| `_reversa_sdd/architecture.md#2-arquitetura-do-backend-laravel-11` | Arquitetura REST desacoplada que utiliza tokens de acesso pessoal (Sanctum) para autenticação das requisições. | 🟢 |
| `_reversa_sdd/domain.md#21-regras-de-presença-e-escalação` | RN-04 (Ergonomia Mobile) e RN-03 (Teto Regulamentar de 14 Atletas), que exigem identificação de quem está confirmando presença. | 🟢 |
| `_reversa_sdd/addenda/001-implementar-pwa.md#vigência` | Entrega de PWA que requer tratamento de autenticação resiliente a quedas de conexão e modo offline. | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Visitante / Não Autenticado** | Visualizar ficha básica do jogo (GPS, cronômetro, adversário) e ser orientado ao login caso queira interagir. | Acessa o link do jogo pelo WhatsApp, consulta horário e local; ao tentar confirmar presença ou ver abas internas, é acionado o modal de identificação. |
| **Atleta Cadastrado** | Confirmar presença e consultar seu status de jogo. | Acessa o sistema autenticado e tem suas operações liberadas de acordo com seu papel. |
| **Comissão Técnica / Tesoureiro** | Executar rotas administrativas e financeiras com segurança. | Realiza mutações protegidas na API garantindo que agentes não identificados não possam alterar escalação ou caixa. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Rejeição Estrita de Acessos Anônimos na API):** 🟢
   - Origem no legado: `_reversa_sdd/permissions.md#3-segurança-e-lacunas-de-controle-de-acesso`
   - Tipo: nova
   - Qualquer requisição enviada aos endpoints de mutação (`POST /partidas/{id}/presencas`, `POST /partidas/{id}/escalacao`, `POST /partidas/{id}/vaquinha/*`, `POST /partidas/{id}/almoxarifado/*`, `POST /partidas/{id}/scouts/*`) desprovida de token de autorização válido deve ser sumariamente rejeitada com status HTTP 401 Unauthorized. Rotas de leitura básica (`GET /partidas/{id}`) permanecem públicas para links compartilhados.

2. **RN-02 (Interceptação e Redirecionamento no Cliente):** 🟢
   - Origem no legado: n/a
   - Tipo: nova
   - A interface do usuário permite visualização da ficha básica pública do jogo (cronômetro T-50, adversário, endereço GPS), mas intercepta qualquer tentativa de confirmação de presença ou troca para abas restritas (`tatica`, `financeiro`, `almoxarifado`), abrindo imediatamente o modal de login.

3. **RN-03 (Tratamento de Expiração de Sessão / Erro 401):** 🟢
   - Origem no legado: n/a
   - Tipo: nova
   - Quando o cliente HTTP receber uma resposta 401 Unauthorized de uma chamada da API, a aplicação deve invalidar os tokens expirados no armazenamento local (`localStorage`), redefinir `isAuthenticated` para falso, notificar o usuário via toast informativo ("Sessão expirada. Faça login novamente.") e abrir o `LoginModal`.

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Proteção com Guard de Autenticação nas Rotas de Mutação da API | Must | Requisições sem cabeçalho `Authorization: Bearer <token>` nas rotas de presença, escalação, vaquinha, almoxarifado e scout devem retornar HTTP 401 com mensagem descritiva em JSON. | 🟢 |
| RF-02 | Guard de Navegação para Abas Protegidas no Frontend | Must | Usuários com estado não autenticado (`isAuthenticated == false`) que tentarem acessar as abas de Prancheta, Vaquinha ou Almoxarifado são barrados e direcionados ao modal de login. | 🟢 |
| RF-03 | Interceptador Global de Erro 401 no Cliente HTTP | Must | Respostas 401 recebidas pelo cliente de API disparam automaticamente a limpeza do token local, toast de expiração e abrem o modal de autenticação. | 🟢 |
| RF-04 | Preservação de Rotas de Leitura Pública Básica | Should | Permitir que visitantes não logados visualizem o cronômetro oficial do vestiário e detalhes de localização/GPS da partida sem bloqueio impeditivo. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Segurança | Rejeição em nível de middleware antes da execução do controller | Evita processamento e consumo de banco de dados por requisições anônimas. | 🟢 |
| Usabilidade | Feedback imediato ao usuário com abertura contextual do modal de login | Garante que o atleta entenda por que a ação foi retida e consiga autenticar em 1 clique. | 🟢 |
| Resiliência | Não deslogar o usuário em falhas de conectividade offline | Compatibilidade com a arquitetura local-first e PWA documentada no adendo 001. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Usuário não autenticado tenta confirmar presença na partida
  Dado que o usuário não possui token de autenticação ativo
  Quando ele envia uma requisição POST para "/api/partidas/{id}/presencas"
  Então a API deve responder com código de status HTTP 401 Unauthorized
  E o corpo da resposta deve conter a mensagem "Unauthenticated." ou JSON equivalente

Cenário: Visitante visualiza ficha pública da partida
  Dado que o visitante abre o link da partida sem estar autenticado
  Quando a página carrega
  Então ele deve visualizar o adversário, endereço do campo e cronômetro T-50
  E ao clicar no botão "Confirmar Presença" ou nas abas restritas, o modal de login deve ser exibido

Cenário: Usuário autenticado com credencial válida executa operação permitida
  Dado que o usuário está autenticado com token válido
  Quando ele aciona um recurso compatível com suas permissões
  Então a API processa a operação com sucesso retornando HTTP 200 OK

Cenário: Sessão expirada durante uso da aplicação
  Dado que o usuário possui um token local expirado ou revogado
  Quando qualquer requisição disparada pelo frontend retornar HTTP 401
  Então o token local deve ser removido
  E um toast "Sessão expirada. Faça login novamente." deve ser exibido
  E o modal de login deve ser aberto automaticamente
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Requisito primordial de segurança para impedir adulterações anônimas nos dados do vestiário. |
| RF-02 | Must | Requisito de usabilidade essencial para não frustrar o usuário com erros opacos da API. |
| RF-03 | Must | Mecanismo de auto-recuperação e feedback claro de sessão quando o token for invalidado. |
| RF-04 | Should | Permite engajamento de atletas novos que recebem o link do jogo antes de terem conta. |

---

## 9. Esclarecimentos

### Sessão 2026-09-21
- **Q:** Como deve se comportar o bloqueio visual no Frontend para usuários não autenticados?  
  **R:** Ficha básica pública (cronômetro T-50, endereço GPS, adversário) para engajar atletas que chegam via link do WhatsApp, mas bloqueio estrito com acionamento do `LoginModal` em qualquer tentativa de confirmação de presença ou troca para abas restritas (`tatica`, `financeiro`, `almoxarifado`).
- **Q:** Como o sistema deve reagir a respostas HTTP 401 (sessão expirada / token inválido) nas chamadas de API?  
  **R:** Limpar credenciais locais inválidas, marcar usuário como deslogado (`isAuthenticated = false`), exibir toast explicativo avisando que a sessão expirou e abrir o modal de login para reautenticação imediata.
- **Q:** Qual o nível de restrição para as rotas de leitura (GET) da API?  
  **R:** Manter rotas básicas de leitura públicas (`GET /partidas/{id}` e protocolo de vestiário) para permitir compartilhamento de links de jogo via WhatsApp, protegendo com middleware `auth:sanctum` todas as rotas de mutação (`POST`, `PUT`, `DELETE`).

---

## 10. Lacunas

> Nenhuma lacuna ou dúvida pendente nesta especificação. Todos os pontos foram esclarecidos e validados.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-09-21 | Integração das decisões de clarificação (Frontend, Sessão 401 e Escopo GET/POST da API) | reversa-clarify |
