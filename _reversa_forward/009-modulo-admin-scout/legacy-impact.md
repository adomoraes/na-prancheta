# Impacto no Legado: Módulo Admin do Scout

## Avaliação de Risco
- **Nível de Risco:** Baixo a Nulo.
- **Estrutura de Dados:** Não altera schema de banco de dados; reutiliza a tabela `scouts_partida` existente.
- **Rotas Públicas e de Partida:** `GET /api/partidas/{id}/scouts` e `POST /api/partidas/{id}/scouts/{atletaId}` permanecem 100% inalteradas e continuam funcionando para a tela de vestiário e técnico.
- **Regra Canônica PT-006:** A exclusividade de MVP é rigorosamente respeitada e reforçada nas operações do Admin.
- **Permissões RBAC:** As novas rotas administrativas ficam sob `/api/admin/scouts` protegidas por `auth:sanctum` e `role:root`.
