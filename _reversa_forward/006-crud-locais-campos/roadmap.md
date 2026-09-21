# Roadmap: CRUD de Locais e Campos da Partida

> Identificador: `006-crud-locais-campos`  
> Data: `2026-09-21`  
> Requirements: `_reversa_forward/006-crud-locais-campos/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

## 1. Resumo da abordagem

A gestão de locais esportivos e campos será introduzida como uma nova entidade relacional no backend Laravel (`locais`) com chave primária UUID e campos `nome`, `endereco`, `maps_url`, `tipo_piso`, `observacoes` e `ativo`. 

A tabela `partidas` receberá a chave estrangeira opcional `local_id` (`foreignUuid('local_id')->nullable()->constrained('locais')->nullOnDelete()`), preservando integralmente as colunas `local_nome`, `local_endereco` e `local_maps_url` como snapshot histórico do dia do jogo.

No backend, o `AdminController` receberá 4 novos métodos: `indexLocais`, `storeLocal`, `updateLocal` e `deleteLocal` (ou `toggleLocalStatus`), e haverá endpoint público/autenticado em `GET /api/locais` para alimentar seletores de partida.

No frontend React (`AdminDashboard.tsx`), será adicionada uma nova aba ou sub-seção administrativa para gerenciar o CRUD de Locais/Campos. No formulário de agendamento de partidas, o campo de texto livre de "Campo" será substituído por um seletor inteligente que carrega os locais ativos, preenchendo automaticamente endereço e link do GPS, ao mesmo tempo em que permite entrada manual opcional ou cadastro rápido.

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Não-destrutividade de dados legados | A foreign key `local_id` em `partidas` é estritamente `nullable`, e colunas textuais históricas são mantidas intactas. | Respeita 🟢 |
| Segregação de responsabilidade (RBAC) | Mutações de catálogo de locais restritas a `role:root`, com consulta de locais aberta para agendamento. | Respeita 🟢 |
| Imutabilidade de histórico de partidas | Alterações posteriores de endereço do local não alteram o histórico congelado de partidas passadas. | Respeita 🟢 |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Tabela dedicada `locais` com UUID | Permite associar campos a múltiplas partidas e armazenar metadados ricos (piso, observações, GPS). | Manter apenas strings livres em partidas; usar tabela genérica de tags/metadados. | 🟢 |
| D-02 | Padrão Snapshot em `partidas` (guardar `local_id` + cópia de `local_nome`) | Preserva o registro fiel de como o campo se chamava na data do evento caso ele mude de nome ou seja inativado anos depois. | Normalização estrita (remover colunas de texto de partidas e depender 100% de joins). | 🟢 |
| D-03 | Chave estrangeira com `nullOnDelete` | Se um local for deletado fisicamente, as partidas não são excluídas em cascata nem quebram. | `cascadeOnDelete` (destruiria partidas); `restrict` (impediria limpeza administrativa). | 🟢 |
| D-04 | Seletor com fallback para digitação manual | Permite que partidas excepcionais (ex.: campo neutro improvisado em viagem) sejam salvas sem forçar cadastro prévio. | Travar o cadastro de partida 100% no dropdown sem opção de texto livre. | 🟢 |

## 4. Premissas

Não há marcadores `[DÚVIDA]` no `requirements.md`. Todas as regras de negócio foram previamente alinhadas.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| Migration Locais | `backend/database/migrations/` | componente-novo | Migration criando tabela `locais` e adicionando `local_id` em `partidas`. |
| Model Local | `backend/app/Models/Local.php` | componente-novo | Model Eloquent para a entidade `Local` com relação `hasMany(Partida::class)`. |
| Model Partida | `backend/app/Models/Partida.php` | regra-alterada | Inclusão da relação `belongsTo(Local::class, 'local_id')` e `$fillable`. |
| AdminController | `backend/app/Http/Controllers/Api/AdminController.php` | regra-nova | Métodos de CRUD de locais e suporte a `local_id` em `storePartida` e `updatePartida`. |
| LocalController | `backend/app/Http/Controllers/Api/LocalController.php` | componente-novo | Endpoint público/autenticado `GET /api/locais` para alimentar o formulário. |
| Rotas API | `backend/routes/api.php` | contrato-novo | Registro das rotas `/api/locais` e grupo `/api/admin/locais`. |
| Tipos TypeScript | `src/types.ts` | contrato-alterado | Interfaces `Local`, `AdminLocalDTO` e atualização de `AdminPartidaDTO`. |
| Cliente API | `src/services/api.ts` | contrato-alterado | Métodos de serviço para gestão de locais e busca. |
| AdminDashboard | `src/components/admin/AdminDashboard.tsx` | componente-alterado | Nova aba de gestão de Locais/Campos e dropdown inteligente no modal de Partidas. |

## 6. Delta no modelo de dados

- **Resumo das mudanças:** Criação da tabela `locais` e acréscimo da coluna `local_id` (`foreignUuid`, `nullable`) na tabela `partidas`.
- **Detalhe completo em:** `_reversa_forward/006-crud-locais-campos/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| API de Locais & Administração | HTTP REST | `_reversa_forward/006-crud-locais-campos/interfaces/locais-api.md` |

## 8. Plano de migração

1. Criar migration `YYYY_MM_DD_HHMMSS_create_locais_table.php`.
2. Executar `php artisan migrate` localmente.
3. Testar reversibilidade com rollback e re-aplicação.
4. Criar Model `Local` e atualizar Model `Partida`.
5. Implementar rotas e métodos no `AdminController` e `LocalController`.
6. Criar suíte de testes de integração `LocalCrudTest.php`.
7. Atualizar interfaces e componentes no frontend React.
8. Validar 100% dos testes e build do Vite.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Partidas legadas sem local associado | Médio | Baixa | `local_id` é estritamente nullable; se for null, o front exibe `local_nome`. |
| Exclusão acidental de campo em uso | Médio | Baixa | Foreign key usa `nullOnDelete()`, e a exclusão padrão é inativação lógica (`ativo: false`). |
| URL de GPS inválida | Baixo | Baixa | Validação com `nullable|string|url` ou permissão de texto de link válido. |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Migration de locais aplicada e testada nos dois sentidos (up/down)
- [ ] CRUD de locais operando no backend e frontend
- [ ] Modal de partidas preenchendo endereço/maps automaticamente a partir do seletor
- [ ] Suíte de testes do backend executada com 100% de aprovação
- [ ] Build de produção frontend validado
- [ ] Pull Request criado no repositório com descrição detalhada para revisão manual do usuário

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial do Roadmap técnico para CRUD de Locais e Campos | reversa |
