# Roadmap: Painel Administrativo para Usuários ROOT com Gestão de CRUDs

> Identificador: `004-painel-adm-root`  
> Data: `2026-09-21`  
> Requirements: `_reversa_forward/004-painel-adm-root/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A entrega implementa uma Dashboard Administrativa completa e desacoplada do fluxo de dia de jogo, destinada com exclusividade a usuários com perfil ROOT:

1. **Backend (Laravel 11 & Sanctum):**
   - Criação da role canônica `root` e do namespace de controladores administrativos `App\Http\Controllers\Api\Admin\*`.
   - Rotas agrupadas sob o prefixo `/api/admin` protegidas com os middlewares `['auth:sanctum', 'role:root']`.
   - Endpoints REST para gerenciamento dos CRUDs mestres:
     - **Usuários & Roles:** listagem, criação, alteração de papel, redefinição de senha e desativação.
     - **Atletas & Elenco:** criação, edição esportiva/contratual e desativação lógica (`ativo: false`).
     - **Partidas & Vestiário:** criação de novos jogos, agenda, horários de vestiário (T-50/T-35/T-25), link GPS e teto regulamentar.
     - **Financeiro & Caixa:** manutenção de movimentações financeiras gerais.
     - **Patrimônio & Materiais:** controle de inventário de bens esportivos (bolas, coletes, cones).
2. **Frontend (React 19 & TypeScript):**
   - Atualização do tipo `NivelAcesso` para incluir `'root'`.
   - Botão de acesso ao Painel ROOT no cabeçalho visível estritamente para usuários com role `root`.
   - Componente `AdminDashboard.tsx`: layout em Dark Mode (Zinc 950) com navegação em abas modulares, tabelas com busca/filtros, modais de criação/edição e desativação com preservação histórica.
   - Guards de rota e proteção contextual no cliente.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| **Segurança por Padrão (Fail-Secure)** | Endpoints administrativos só respondem para tokens Sanctum válidos com papel `root`. Demais perfis recebem 403 Forbidden. | respeita |
| **Integridade Histórica (Soft Delete)** | Exclusão de atletas e partidas adota desativação lógica para não quebrar scouts ou registros de vaquinha prévios. | respeita |
| **Desacoplamento e Ergonomia** | A interface de gestão do ROOT fica separada do dia de jogo, permitindo que a tela da partida permaneça leve e rápida. | respeita |
| **Design System Consistente** | Segue a identidade visual moderna em Dark Mode com feedback imediato para o administrador. | respeita |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Estabelecer papel `root` dedicado para backoffice | Isola as atribuições de gestão cadastral das operações desportivas do papel `geral`. | Usar `geral` para tudo, misturando visão tática com backoffice. | 🟢 |
| D-02 | Dashboard administrativa desacoplada da visão da partida | Proporciona densidade de informação para formulários e tabelas sem poluir o app mobile do vestiário. | Criar mais uma aba na barra inferior do celular do vestiário. | 🟢 |
| D-03 | Endpoints sob prefixo `/api/admin/*` com middleware `role:root` | Centraliza o escopo de autorização no roteador, facilitando auditoria e testes de segurança. | Distribuir verificações condicionais dentro dos controladores normais. | 🟢 |
| D-04 | Soft delete nos CRUDs de atletas e partidas | Evita violações de chave estrangeira com tabelas de presenças, scouts e movimentações de caixa. | Exclusão física com CASCADE, que apagaria o histórico estatístico. | 🟢 |
| D-05 | Atalho de perfil ROOT no modal de login de demonstração | Permite testar e demonstrar instantaneamente a dashboard em ambiente local. | Exigir criação manual de usuário no banco via tinker para testar. | 🟢 |

---

## 4. Premissas

> Nenhuma premissa não resolvida. Todas as dúvidas foram esclarecidas e validadas na sessão de clarificação.

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| **Model User & Roles** | `backend/app/Models/User.php` | regra-alterada | Reconhece o papel `root` como superusuário administrativo. |
| **Roteamento API** | `backend/routes/api.php` | contrato-novo | Adiciona o grupo `/api/admin/*` protegido por `['auth:sanctum', 'role:root']`. |
| **Controlador Administrativo** | `backend/app/Http/Controllers/Api/AdminController.php` | componente-novo | Concentra as operações de CRUD para Usuários, Atletas, Partidas, Caixa e Patrimônio. |
| **Tipos Frontend** | `src/types.ts` | componente-alterado | Expande `NivelAcesso` com `'root'` e define DTOs administrativos. |
| **Cliente de API** | `src/services/api.ts` | componente-alterado | Adiciona métodos do namespace `api.admin.*`. |
| **Dashboard Administrativa** | `src/components/admin/AdminDashboard.tsx` | componente-novo | Interface visual com abas modulares de gestão para o ROOT. |
| **Header & App Navegação** | `src/components/Header.tsx` e `src/App.tsx` | componente-alterado | Adiciona alternância entre Dia de Jogo e Painel ROOT com guard estrito. |

---

## 6. Delta no modelo de dados

- Resumo das mudanças: Não são necessárias migrations de novas tabelas. Os modelos existentes `users`, `atletas`, `partidas`, `caixa_movimentacoes` e a estrutura de patrimônio suportam as operações do CRUD. É assegurado o uso do atributo `ativo` para desativação lógica.
- Detalhe completo em: `_reversa_forward/004-painel-adm-root/data-delta.md`

---

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| **API Administrativa ROOT** | HTTP REST | `_reversa_forward/004-painel-adm-root/interfaces/admin-api.md` |

---

## 8. Plano de migração

1. **Passo 1 (Backend):** Atualizar `User.php` para suporte a `root` e criar `AdminController.php` com os endpoints CRUD.
2. **Passo 2 (Rotas & Middleware):** Registrar as rotas `/api/admin/*` em `routes/api.php` sob `auth:sanctum` e `role:root`.
3. **Passo 3 (Testes Automatizados Backend):** Criar `backend/tests/Feature/AdminCrudTest.php` cobrindo autorização (403 para não-root, 200 para root) e operações CRUD.
4. **Passo 4 (Frontend Services & Types):** Adicionar tipos e métodos de API para os CRUDs administrativos.
5. **Passo 5 (Frontend UI):** Criar `AdminDashboard.tsx` e integrar no `Header.tsx` e `App.tsx`.
6. **Passo 6 (Validação E2E):** Testar fluxos de cadastro, edição e desativação em cada módulo.

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Usuário comum tentar acessar endpoints administrativos via API | alto | baixa | Middleware `role:root` no kernel do Laravel bloqueia com 403 Forbidden antes do controller. |
| Excluir acidentalmente atleta ou partida com histórico | médio | média | Política estrita de soft delete (`ativo: false`) sem exclusão física. |
| Complexidade excessiva de navegação para o ROOT | baixo | baixa | Botão claro de "Voltar ao Jogo" no topo da dashboard administrativa. |

---

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Rotas `/api/admin/*` funcionando e protegidas contra acesso de outros perfis (403)
- [ ] CRUDs de Usuários, Atletas, Partidas, Caixa e Patrimônio testados
- [ ] Dashboard administrativa funcional em Dark Mode acessível apenas para o ROOT
- [ ] Testes automatizados do backend passando com 100% de sucesso
- [ ] Compilação do frontend (`npm run build`) concluída sem erros de tipagem

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial gerada por `/reversa-plan` | reversa-plan |
