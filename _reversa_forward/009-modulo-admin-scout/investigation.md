# Investigação Técnica: Módulo Admin do Scout

## Estado Atual
1. **Banco de Dados:**
   - Tabela `scouts_partida`:
     - `id` (UUID PK)
     - `partida_id` (foreignUuid -> partidas)
     - `atleta_id` (foreignUuid -> atletas)
     - `gols` (int, default 0)
     - `assistencias` (int, default 0)
     - `cartoes_amarelos` (int, default 0)
     - `cartoes_vermelhos` (int, default 0)
     - `gols_sofridos_goleiro` (int, default 0)
     - `minutos_jogados` (int, default 0)
     - `foi_mvp` (boolean, default false)
     - Restrição de unicidade: `['partida_id', 'atleta_id']`
     - Índice: `['partida_id', 'foi_mvp']`

2. **Rotas Existentes:**
   - `GET /api/partidas/{id}/scouts`: Retorna scouts de uma partida específica (público).
   - `POST /api/partidas/{id}/scouts/{atletaId}`: Lança scout para uma partida/atleta (protegido por `role:tecnico,geral`).
   - Não havia rotas em `/api/admin/scouts` para o superusuário ROOT consultar todas as partidas, excluir registros ou consolidar o leaderboard geral.

3. **Frontend Atual:**
   - Componente `ScoutPosJogo.tsx`: Utilizado na aba de scout da partida ativa (técnico/vestiário).
   - `AdminDashboard.tsx`: Não possuía aba de scouts no painel administrativo.

## Decisões Arquiteturais
- Criar métodos em `AdminController.php` (ou controller específico):
  - `indexScouts(Request $request)`: Lista scouts com filtros por `partida_id` e `atleta_id` e eager loading de `partida` e `atleta`.
  - `leaderboardScouts()`: Agrupamento consolidado por atleta somando estatísticas históricas.
  - `storeScout(Request $request)`: Criação/upsert com garantia de MVP único.
  - `updateScout(Request $request, string $id)`: Atualização de registro existente.
  - `deleteScout(string $id)`: Exclusão de registro de scout.
- Manter total retrocompatibilidade com `ScoutController.php` e `ScoutPosJogo.tsx`.
