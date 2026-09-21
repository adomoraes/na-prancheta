# Adendo: Bloqueio de Rotas e Recursos para Usuários Não Autenticados

> Identificador: `003-bloqueio-rotas-auth`  
> Data: `2026-09-21`  
> Cenário: `legado`  
> Origem: `_reversa_forward/003-bloqueio-rotas-auth/`  

---

## 1. Vigência

Vigente desde 2026-09-21.

---

## 2. Resumo da entrega

Implementação sistemática do bloqueio de rotas e recursos protegidos contra acessos de usuários não autenticados na aplicação Na Prancheta. A entrega assegura que qualquer requisição mutatória enviada à API sem Bearer token Sanctum válido seja sumariamente rejeitada com HTTP 401 Unauthorized, enquanto a interface do usuário restringe a confirmação de presença e a navegação em abas operacionais (`tatica`, `financeiro`, `almoxarifado`, `scout`) ao usuário autenticado, mantendo aberta apenas a Ficha de Jogo básica pública (cronômetro T-50, endereço GPS e adversário) para visualização de visitantes. Também inclui interceptador global no cliente HTTP para captura de 401, limpeza do storage local, toast de sessão expirada e reabertura automática do `LoginModal`.

Todas as **9 ações atômicas** planejadas em `_reversa_forward/003-bloqueio-rotas-auth/actions.md` foram concluídas e testadas com 100% de sucesso.

---

## 3. Impacto por artefato da extração

| Artefato | Seção | Tipo de impacto | Delta |
|---|---|---|---|
| `_reversa_sdd/architecture.md` | `#2-arquitetura-do-backend-laravel-11` | `delta-de-contrato-externo` | Todas as rotas de mutação (`POST /partidas/{id}/*` e `POST /atletas`) exigem middleware `auth:sanctum`, retornando 401 para anônimos. Consultas `GET` permanecem públicas. |
| `_reversa_sdd/permissions.md` | `#2-matriz-de-permissões-rbac` | `regra-alterada` | O middleware `CheckRole` agora rejeita imediatamente com HTTP 401 caso uma rota restrita por perfil seja acessada sem usuário autenticado. |
| `_reversa_sdd/permissions.md` | `#3-segurança-e-lacunas-de-controle-de-acesso` | `regra-alterada` | A lacuna crítica de segurança sobre ausência de autenticação nas mutações foi sanada; nenhuma ação operacional ocorre sem credencial verificada. |
| `_reversa_sdd/architecture.md` | `#21-padrão-single-page-application` | `componente-alterado` | O cliente `api.ts` agora captura status 401, expurga o token expirado e emite o evento desacoplado `auth:session-expired` tratado no `AuthContext`. |
| `_reversa_sdd/domain.md` | `#21-regras-de-presença-e-escalação` | `regra-nova` | Introduzida a regra RN-01AUTH (Guards de Acesso): abas operacionais e ações de presença exigem identificação prévia, abrindo o modal de login sem quebrar a navegação da ficha pública. |

---

## 4. Regras sob vigilância

Os seguintes itens de monitoramento de regressão foram definidos para auditoria nas próximas re-extrações do sistema:

- [`W001`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/003-bloqueio-rotas-auth/regression-watch.md): Rejeição estrita com HTTP 401 Unauthorized nas rotas mutatórias da API para requisições sem token.
- [`W002`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/003-bloqueio-rotas-auth/regression-watch.md): Preservação pública das rotas de leitura `GET /partidas/{id}` e protocolo de vestiário para compartilhamento via links de WhatsApp.
- [`W003`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/003-bloqueio-rotas-auth/regression-watch.md): Interceptação de navegação em abas restritas e ação de presença no frontend para anônimos, acionando o modal de login.

Detalhes completos em: [`_reversa_forward/003-bloqueio-rotas-auth/regression-watch.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/003-bloqueio-rotas-auth/regression-watch.md).

---

## 5. Fontes

- `_reversa_forward/003-bloqueio-rotas-auth/requirements.md`
- `_reversa_forward/003-bloqueio-rotas-auth/roadmap.md`
- `_reversa_forward/003-bloqueio-rotas-auth/actions.md`
- `_reversa_forward/003-bloqueio-rotas-auth/progress.jsonl`
- `_reversa_forward/003-bloqueio-rotas-auth/legacy-impact.md`
- `_reversa_forward/003-bloqueio-rotas-auth/regression-watch.md`
- `_reversa_forward/003-bloqueio-rotas-auth/interfaces/api-guards.md`
