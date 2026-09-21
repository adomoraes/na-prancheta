# Adendo SDD: Feature 009 - Módulo Administrativo de Scouts & Estatísticas

## 1. Identificação da Mudança
- **Data:** 2026-09-21
- **Feature ID:** `009-modulo-admin-scout`
- **Contexto:** Expansão do módulo administrativo ROOT com controle global de scouts estatísticos, súmula por partida, leaderboard/ranking acumulado do clube e garantia canônica de exclusividade estrita de 1 MVP por partida.

## 2. Decisões Arquiteturais & Modelagem
1. **Reutilização da Tabela `scouts_partida`:**
   - Aproveitou a tabela existente com chave única composta `(partida_id, atleta_id)` e índice para MVP.
2. **Endpoints Administrativos:**
   - `GET /api/admin/scouts`: Listagem de scouts com filtros por partida e atleta, com eager loading de partida e atleta.
   - `GET /api/admin/scouts/leaderboard`: Agrupamento e consolidação histórica de desempenho por atleta (jogos, gols, assistências, participações, cartões amarelos/vermelhos, vezes MVP, minutos e gols sofridos).
   - `POST /api/admin/scouts`: Criação ou atualização idempotente de scout com validação de limites e garantia de exclusividade estrita de MVP na mesma partida.
   - `PUT /api/admin/scouts/{id}`: Atualização pontual de métricas.
   - `DELETE /api/admin/scouts/{id}`: Remoção segura de registros de scout.
3. **Frontend & UX (`AdminDashboard.tsx`):**
   - Nova aba dedicada: **⭐ Scouts & Stats**.
   - Subvisão 1: **Súmula por Partida**, com seletor de partida, resumo do confronto, cards de atletas com steppers rápidos (+/-), botão de Craque da Partida (MVP) e ações.
   - Subvisão 2: **Leaderboard Geral**, com 4 cards de destaque (Artilheiro, Líder em Assistências, Rei do MVP, Mais Minutos) e tabela completa de classificação filtrável por nome e posição.
   - Modal completo de lançamento e edição de scouts.

## 3. Rastreabilidade & Validação
- **Suíte de Testes:** `backend/tests/Feature/AdminScoutTest.php` (8 testes, 48 asserções).
- **Cobertura Total:** 65 testes passando (312 asserções) com 100% de sucesso.
- **Frontend Build:** `npm run build` compilado sem erros.
