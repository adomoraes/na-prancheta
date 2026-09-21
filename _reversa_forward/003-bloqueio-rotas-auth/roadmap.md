# Roadmap: Bloqueio de Rotas e Recursos para Usuários Não Autenticados

> Identificador: `003-bloqueio-rotas-auth`  
> Data: `2026-09-21`  
> Requirements: `_reversa_forward/003-bloqueio-rotas-auth/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A abordagem implementa uma arquitetura de defesa em profundidade (*defense-in-depth*) combinando proteção estrita no backend e salvaguardas intuitivas na experiência do frontend:

1. **Backend (Laravel 11 & Sanctum):** Aplicação do middleware `auth:sanctum` em todas as rotas de mutação de estado (`POST /partidas/{id}/presencas`, `/escalacao`, `/vaquinha/*`, `/almoxarifado/*`, `/scouts/*`). Requisições desprovidas de Bearer token válido são sumariamente rejeitadas com HTTP 401 Unauthorized antes de tocar qualquer controller ou banco de dados. As rotas de leitura básica (`GET /partidas/{id}`) são mantidas públicas para garantir que atletas que recebem links pelo WhatsApp visualizem horário e GPS sem atrito.
2. **Frontend (React 19 & TypeScript):**
   - **Guards de Navegação e Ação:** Usuários não autenticados podem visualizar a Ficha de Jogo básica pública (cronômetro regressivo T-50, GPS do campo e adversário). Qualquer tentativa de alterar presença ou navegar para abas com poderes operacionais (`tatica`, `financeiro`, `almoxarifado`) é interceptada, abrindo o `LoginModal`.
   - **Interceptador HTTP 401 Global:** No cliente `api.ts`, qualquer resposta 401 recebida do servidor invalida a credencial local, dispara o evento desacoplado `auth:session-expired`, emite toast informativo de expiração de sessão e reabre o `LoginModal`.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| **Segurança por Padrão (Fail-Secure)** | Nenhuma mutação de dados pode ocorrer sem credencial autenticada validada pelo Sanctum. | respeita |
| **Resiliência Local-First & PWA** | Usuários não são bloqueados de ver dados essenciais (campo, horário) se estiverem sem login ou offline. | respeita |
| **Ergonomia e Simplicidade Mobile** | O bloqueio não gera mensagens de erro opacas; em vez disso, abre o modal de login contextual em 1 toque. | respeita |
| **Desacoplamento Frontend / Backend** | O cliente reage a status HTTP padrão (401 Unauthorized) via eventos decoupled sem depender de estado interno frágil. | respeita |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Proteger mutações da API via grupo `auth:sanctum` em `routes/api.php` | Bloqueia requisições anônimas diretamente no kernel de roteamento do Laravel antes da execução de controllers. | Validar autenticação manualmente dentro de cada método de Controller. | 🟢 |
| D-02 | Manter rotas `GET /partidas/{id}` e protocolo de vestiário públicas na API | Permite visualização imediata da ficha do jogo ao abrir links recebidos no WhatsApp sem exigir login prévio. | Exigir login até para visualizar horário e campo de jogo. | 🟢 |
| D-03 | Interceptador de 401 via `CustomEvent` desacoplado no cliente `api.ts` | Permite que o serviço de API notifique o `AuthContext` e a UI sem criar acoplamento circular entre módulos TypeScript. | Passar callbacks do React Context para dentro da instância do cliente de API. | 🟢 |
| D-04 | Interceptação de clique na confirmação de presença no frontend | Garante feedback imediato ao atleta visitante, disparando o `LoginModal` antes mesmo de fazer um POST inútil. | Deixar o POST falhar com 401 e só então abrir o modal. | 🟢 |
| D-05 | Reforço no middleware `CheckRole` para tratar ausência de usuário | Se uma rota protegida por perfil for atingida sem autenticação, retorna 401 Unauthorized imediatamente em vez de passar adiante. | Permitir passagem caso `$user` seja nulo. | 🟢 |

---

## 4. Premissas

> Nenhuma premissa não resolvida. Todas as dúvidas foram elucidadas na sessão de clarificação de requisitos em 2026-09-21.

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| **Roteamento API** | `backend/routes/api.php` | contrato-alterado | Adiciona `auth:sanctum` nas rotas de mutação de partidas, presenças, escalação, vaquinha, almoxarifado e scouts. |
| **Middleware de Papéis** | `backend/app/Http/Middleware/CheckRole.php` | regra-alterada | Garante rejeição com 401 caso a rota exija role e não haja usuário autenticado. |
| **Cliente de API Frontend** | `src/services/api.ts` | componente-alterado | Intercepta HTTP 401, remove token expirado e emite evento `auth:session-expired`. |
| **Contexto de Autenticação** | `src/contexts/AuthContext.tsx` | componente-alterado | Escuta evento `auth:session-expired`, reseta estado de autenticação e expõe guard de abas atualizado. |
| **Aplicação Raiz** | `src/App.tsx` | regra-alterada | Implementa verificação de autenticação ao tentar trocar para abas restritas e ao confirmar presença. |

---

## 6. Delta no modelo de dados

- Resumo das mudanças: Não há alterações de schema, migrações de banco ou novas tabelas. O controle de autenticação utiliza a estrutura existente de `users` e `personal_access_tokens` do Laravel Sanctum.
- Detalhe completo em: `_reversa_forward/003-bloqueio-rotas-auth/data-delta.md`

---

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| **API Guards & 401 Unauthorized** | HTTP REST | `_reversa_forward/003-bloqueio-rotas-auth/interfaces/api-guards.md` |

---

## 8. Plano de migração

1. **Passo 1 (Backend):** Atualizar `backend/app/Http/Middleware/CheckRole.php` e `backend/routes/api.php` aplicando os middlewares de proteção.
2. **Passo 2 (Testes de Regressão e Segurança):** Criar e executar testes automatizados no PHPUnit validando que requisições sem token retornam 401 nas rotas mutatórias e 200 nas rotas de leitura pública.
3. **Passo 3 (Frontend):** Atualizar `src/services/api.ts`, `src/contexts/AuthContext.tsx` e `src/App.tsx` com interceptador e guards visuais.
4. **Passo 4 (Validação E2E):** Validar fluxo no navegador simulando usuário anônimo, login com perfis e expiração de sessão.

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Bloquear visitante que só quer ver horário do jogo | alto | baixa | Manter `GET /partidas/{id}` e `/protocolo-vestiario` públicas na API. |
| Sessão expirar silenciosamente e usuário achar que salvou dados | médio | média | Interceptador 401 emite toast informativo explícito e reabre modal de login imediatamente. |
| Perda de estado de formulários durante reautenticação | baixo | baixa | O `LoginModal` renderiza sobreposto sem recarregar a página, preservando o estado local em memória. |

---

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas como concluídas
- [ ] Rotas de mutação na API rejeitando acessos anônimos com HTTP 401
- [ ] Rotas de leitura (`GET /partidas/{id}`) acessíveis publicamente
- [ ] Frontend interceptando 401 e limpando token/usuário com toast informativo
- [ ] Frontend bloqueando navegação de abas protegidas e confirmação de presença para anônimos
- [ ] Suite de testes automatizados do backend passando com 100% de sucesso
- [ ] Build do frontend (`npm run build`) passando sem erros de TypeScript

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial gerada por `/reversa-plan` | reversa-plan |
