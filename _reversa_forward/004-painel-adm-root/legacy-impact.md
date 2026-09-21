# Impacto no Legado: Painel Administrativo ROOT

> Identificador: `004-painel-adm-root`  
> Data: `2026-09-21`  
> Política de Edição: `allowLegacyEdits: true` com `allowedPaths: []` (Liberação irrestrita pelo usuário)  

---

## 1. Mapeamento de Arquivos e Componentes Afetados

| Arquivo Afetado | Componente | Tipo de Impacto | Severidade | Justificativa |
|-----------------|------------|-----------------|------------|---------------|
| `backend/app/Models/User.php` | Backend - Models & Auth | `regra-alterada` | LOW | Introduz reconhecimento do papel `root` e restringe o papel `geral` contra rotas de backoffice exclusivo. |
| `backend/routes/api.php` | Backend - HTTP Routing | `delta-de-contrato-externo` | MEDIUM | Adiciona o grupo `/api/admin/*` protegido com `auth:sanctum` e middleware `role:root`. |
| `backend/app/Http/Controllers/Api/AdminController.php` | Backend - Controladores | `componente-novo` | LOW | Implementa endpoints de backoffice para 5 CRUDs mestres sem alterar controladores legados. |
| `backend/tests/Feature/AdminCrudTest.php` | Backend - Testes de Integração | `componente-novo` | LOW | Testes automatizados cobrindo permissões 401/403/200 e integridade dos dados dos 5 módulos. |
| `src/types.ts` | Frontend - Tipagem TypeScript | `delta-de-dados` | LOW | Expande união `NivelAcesso` com `'root'` e adiciona interfaces DTO dos CRUDs. |
| `src/services/api.ts` | Frontend - Camada de Serviços | `componente-alterado` | LOW | Adiciona métodos do namespace `api.admin.*` para comunicação com os endpoints administrativos. |
| `src/components/admin/AdminDashboard.tsx` | Frontend - Componentes | `componente-novo` | LOW | Dashboard em Dark Mode desacoplada da visão da partida para gestão dos 5 CRUDs. |
| `src/components/Header.tsx` | Frontend - Shell de Navegação | `componente-alterado` | LOW | Adiciona botão de acesso ao Painel Admin exclusivo para o papel ROOT. |
| `src/components/auth/LoginModal.tsx` | Frontend - Autenticação | `componente-alterado` | LOW | Inclui o perfil demonstrativo ROOT para facilidade de testes em ambiente de desenvolvimento. |
| `src/App.tsx` | Frontend - Orquestrador Raiz | `componente-alterado` | MEDIUM | Gerencia guard de visão entre jogo e painel administrativo (`currentView: 'match' \| 'admin'`). |

---

## 2. Diff Conceitual por Componente

### Backend (Laravel 11 & Sanctum)
- **Autorização e Papéis:** A role `root` foi estabelecida como o nível mestre de infraestrutura e backoffice. Ao avaliar `$user->hasRole('root')`, apenas usuários autenticados com o atributo `role === 'root'` recebem autorização. O papel `geral` continua operando com plenos poderes nas decisões desportivas do dia de jogo, mas recebe `403 Forbidden` ao tentar intervir nas rotas do grupo `/api/admin/*`.
- **Soft Delete em Atletas:** A rota `PATCH /api/admin/atletas/{id}/status` comuta a flag booleana `ativo`, permitindo que atletas afastados ou desligados deixem de aparecer na convocação sem corromper scouts históricos, presenças em jogos passados ou lançamentos na vaquinha.

### Frontend (React 19 & TypeScript)
- **Desacoplamento Visual:** A dashboard administrativa não foi introduzida como mais uma aba na barra inferior do celular do vestiário. Ela reside em uma visão desacoplada (`AdminDashboard`), acessível apenas quando o usuário ROOT clica no botão "Painel Admin" no cabeçalho.
- **Transição Fluida e Segura:** O ROOT pode transicionar livremente entre o Painel Admin e o fluxo da partida ativa com um clique em "Voltar ao Jogo", mantendo o estado de sincronização e integridade de cache.

---

## 3. Regras de Negócio Preservadas

| Regra Preservada (de `domain.md`) | Como foi mantida |
|-----------------------------------|-------------------|
| **RF-001 (Teto de Atletas Confirmados)** | Preservada integralmente na ficha do jogo e respeitada no cadastro de partidas. |
| **RF-002 (Protocolo Oficial de Vestiário T-50 / T-35 / T-25)** | O cálculo automático dos horários foi incorporado ao `storePartida` do painel ROOT. |
| **RF-003 (Prancheta Tática & Teto de 11 Titulares)** | Não afetada; fluxo tático mantido sem modificações. |
| **RF-004 (Vaquinha da Arbitragem & PIX)** | Mantida intacta; novos lançamentos no caixa apenas expandem o extrato consolidado. |
| **RF-005 (Almoxarifado & Trava da Resenha)** | Itens de conferência de malas continuam associados à partida. |
| **RF-006 (Scout Estatístico & Exclusividade de MVP)** | Histórico estatístico protegido pelo uso de exclusão lógica (soft delete). |

---

## 4. Regras de Negócio Modificadas

| Regra Modificada | O que mudou | Justificativa |
|------------------|-------------|---------------|
| **Taxonomia de Acesso e Permissões** | O papel `root` passou a existir formalmente como perfil mestre de backoffice exclusivo sobre `/api/admin/*`. | Necessidade de centralizar a manutenção cadastral e financeira em perfil com poderes superiores ao perfil `geral`. |
| **Gestão do Ciclo de Vida do Atleta** | Atletas podem ser ativados/desativados logicamente pelo ROOT via API/painel. | Manter a consistência histórica de estatísticas e presenças passadas. |
