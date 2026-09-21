# Impacto no Legado: Bloqueio de Rotas e Recursos para Não Autenticados

> Identificador: `003-bloqueio-rotas-auth`  
> Data: `2026-09-21`  
> Política de Edição do Legado: `allowLegacyEdits: true`, `allowedPaths: []` (liberação irrestrita)  
> Âncora: Legado (`_reversa_sdd/architecture.md` e `_reversa_sdd/domain.md`)  

---

## 1. Arquivos Afetados e Severidade

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|-----------------|------------|------|------------|---------------|
| `backend/routes/api.php` | `_reversa_sdd/architecture.md#2-arquitetura-do-backend-laravel-11` | delta-de-contrato-externo | HIGH | Envolve rotas de mutação sob middleware `auth:sanctum`, retornando 401 para acessos anônimos. |
| `backend/app/Http/Middleware/CheckRole.php` | `_reversa_sdd/permissions.md#2-matriz-de-permissões-rbac` | regra-alterada | HIGH | Rejeita chamadas anônimas com status 401 antes de validar roles. |
| `backend/tests/Feature/RouteAuthProtectionTest.php` | `_reversa_sdd/architecture.md#4-dívidas-técnicas` | componente-novo | LOW | Suite de testes automatizados de integração cobrindo guards de rotas. |
| `src/services/api.ts` | `_reversa_sdd/architecture.md#21-padrão-single-page-application` | componente-alterado | MEDIUM | Interceptador HTTP para detecção de 401, purga de token e emissão do evento `auth:session-expired`. |
| `src/contexts/AuthContext.tsx` | `_reversa_sdd/architecture.md#21-padrão-single-page-application` | regra-alterada | MEDIUM | Trata evento de sessão expirada e restringe `canAccessTab` quando `!user`. |
| `src/App.tsx` | `_reversa_sdd/architecture.md#21-padrão-single-page-application` | regra-alterada | MEDIUM | Guards de navegação nas abas e guards de ação na confirmação de presença e inclusão de atletas. |

---

## 2. Diff Conceitual por Componente

### Backend (Laravel 11 REST API)
- **Antes:** Endpoints como `POST /api/partidas/{id}/presencas` e endpoints com middleware `role` permitiam que requisições anônimas passassem caso `$user` fosse nulo.
- **Depois:** Todas as mutações de partida e cadastro de atletas exigem `auth:sanctum`. Chamadas sem token Bearer recebem HTTP 401 Unauthorized imediatamente. Endpoints `GET` continuam públicos para viabilizar compartilhamento em mensageiros.

### Frontend (React 19 SPA)
- **Antes:** Cliques em abas e botões de presença podiam ser realizados livremente por usuários não autenticados na interface.
- **Depois:** Ficha básica pública é mantida (cronômetro, GPS, adversário). Tentativas de interagir com presença, cadastrar atletas ou navegar para `tatica`, `financeiro`, `scout` e `almoxarifado` interceptam a ação e abrem o `LoginModal`. Erros 401 da API limpam credenciais inválidas, exibem toast e reabrem o modal.

---

## 3. Regras Preservadas

- `_reversa_sdd/domain.md#21-regras-de-presença-e-escalação` (RN-03 Teto Regulamentar de 14 Atletas): Preservada intacta.
- `_reversa_sdd/domain.md#21-regras-de-presença-e-escalação` (RN-04 Ergonomia Mobile): Preservada intacta.
- `_reversa_sdd/domain.md#21-regras-de-presença-e-escalação` (RN-01 Trava de Horário T-35): Preservada intacta.
- `_reversa_sdd/domain.md#22-regras-de-rateio-e-tesouraria` (RN-02 Exclusividade do Tesoureiro): Preservada intacta.
- `_reversa_sdd/domain.md#23-regras-de-patrimônio-e-resenha` (RN-01 Trava da Resenha): Preservada intacta.
- `_reversa_sdd/domain.md#24-regras-de-scout-e-eleição-de-mvp` (RN-02 Unicidade de MVP): Preservada intacta.

---

## 4. Regras Modificadas

- `_reversa_sdd/permissions.md#3-segurança-e-lacunas-de-controle-de-acesso` (Acesso Anônimo a Recursos do Vestiário):
  - **Antes:** Chamadas operacionais da API podiam ser executadas sem autenticação ativa.
  - **Depois:** Mutações exigem token Bearer Sanctum ativo. Rejeição sumária com HTTP 401 Unauthorized.
