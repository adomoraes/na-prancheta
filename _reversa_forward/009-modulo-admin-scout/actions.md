# Plano de Ação: Feature 009 - Módulo Admin do Scout

- [x] T001: Implementar endpoints administrativos de scouts em `backend/app/Http/Controllers/Api/AdminController.php` (`indexScouts`, `leaderboardScouts`, `storeScout`, `updateScout`, `deleteScout`).
- [x] T002: Registrar rotas em `backend/routes/api.php` sob o grupo de middleware `admin` (`GET /admin/scouts`, `GET /admin/scouts/leaderboard`, `POST /admin/scouts`, `PUT /admin/scouts/{id}`, `DELETE /admin/scouts/{id}`).
- [x] T003: Criar suíte de testes de integração `backend/tests/Feature/AdminScoutTest.php` cobrindo proteção 401/403, listagem, filtros, leaderboard consolidado, criação, exclusividade estrita de MVP, atualização e exclusão.
- [x] T004: Atualizar contratos e DTOs em `src/types.ts` (`AdminScoutDTO`, `AdminScoutLeaderboardDTO`).
- [x] T005: Adicionar métodos correspondentes em `src/services/api.ts` sob `api.admin`.
- [x] T006: Implementar interface do usuário no `src/components/admin/AdminDashboard.tsx`:
  - Nova aba "Scouts & Stats" no menu e navegação.
  - Seletor de partida e sumário rápido da partida com cards de estatísticas.
  - Tabela/grid interativo de atletas por partida com steppers (+/-) para gols, assistências, cartões, minutos e botão para craque da partida.
  - Visão Leaderboard com rankings do clube (artilharia, garçons, disciplina, MVP) e filtros.
  - Modal para lançamento ou edição detalhada de scout.
- [x] T007: Executar bateria completa de testes automatizados (`php artisan test`) e validação de build (`npm run build`).
- [x] T008: Documentar adendo Reversa em `_reversa_sdd/addenda/009-modulo-admin-scout.md` e atualizar `README.md`.
