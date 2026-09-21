# Regression Watch: Bloqueio de Rotas e Recursos para Não Autenticados

> Identificador: `003-bloqueio-rotas-auth`  
> Data de Criação: `2026-09-21`  
> Finalidade: Monitorar invariantes e regras que devem permanecer válidas em futuras extrações reversas  

---

## 1. Regras em Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|--------------------------|-----------------------------|---------------------|-------------------|
| W001 | `_reversa_sdd/permissions.md#3-segurança-e-lacunas-de-controle-de-acesso` | Requisições sem token nas rotas mutatórias da API devem sempre retornar HTTP 401 Unauthorized. | presença | Resposta 200 OK ou 500 para chamada POST anônima em `/partidas/{id}/presencas` ou `/escalacao`. |
| W002 | `_reversa_forward/003-bloqueio-rotas-auth/requirements.md#4-regras-de-negócio-novas-ou-alteradas` | A rota `GET /partidas/{id}` deve permanecer aberta e pública para links de WhatsApp. | presença | Resposta 401 ou redirecionamento forçado para a tela de login ao consultar partida via GET. |
| W003 | `_reversa_forward/003-bloqueio-rotas-auth/requirements.md#4-regras-de-negócio-novas-ou-alteradas` | Acesso a abas restritas e confirmação de presença no frontend por usuário sem login devem abrir o modal de login. | presença | Usuário anônimo conseguindo alterar estado de presença ou visualizar prancheta/vaquinha diretamente. |

---

## 2. Histórico de Re-extrações

> Esta seção será populada pelos agentes do Reversa nas próximas rodadas de extração/revisão.

---

## 3. Arquivadas

> Nenhuma regra arquivada no momento.
