# Requisitos: Módulo Admin do Scout com Todas as Funcionalidades

## 1. Contexto & Objetivo
No sistema "Na Prancheta", os scouts estatísticos pós-jogo eram gerenciados prioritariamente na visão do técnico/vestiário em uma única partida ativa (`/api/partidas/{id}/scouts`). No entanto, a administração central do clube (`root`) precisa de um painel de controle completo para:
1. Visualizar e auditar scouts de qualquer partida passada ou em andamento.
2. Lançar, editar ou remover scouts de atletas por partida diretamente pelo painel administrativo.
3. Garantir a integridade da regra canônica de negócio PT-006: exclusividade estrita de 1 MVP por partida.
4. Acessar o Leaderboard e Estatísticas Consolidadas do clube (Artilharia, Garçons de Assistências, Fair Play/Cartões, Minutos e mais vezes Craque/MVP).

## 2. Requisitos Funcionais

### RF-001: Gestão de Scouts por Partida no Backoffice
- O administrador autenticado com perfil `root` pode listar os scouts filtrando por `partida_id` e/ou `atleta_id`.
- Permite selecionar qualquer partida do clube e inspecionar a súmula estatística completa daquele confronto.

### RF-002: Lançamento e Edição de Scouts no Painel
- Endpoint `POST /api/admin/scouts` para cadastrar ou atualizar o scout de um atleta em uma partida.
- Endpoint `PUT /api/admin/scouts/{id}` para atualizar dados pontuais de um registro de scout existente.
- Atributos estatísticos suportados:
  - `gols` (inteiro >= 0)
  - `assistencias` (inteiro >= 0)
  - `cartoes_amarelos` (inteiro >= 0)
  - `cartoes_vermelhos` (inteiro >= 0)
  - `gols_sofridos_goleiro` (inteiro >= 0)
  - `minutos_jogados` (inteiro >= 0)
  - `foi_mvp` (booleano)

### RF-003: Exclusividade Estrita de MVP (Regra Canônica PT-006)
- Ao definir `foi_mvp: true` para um atleta na partida, qualquer outro atleta anteriormente marcado como MVP na mesma partida deve ter seu status revogado automaticamente dentro de uma transação de banco de dados.

### RF-004: Exclusão de Scout
- Endpoint `DELETE /api/admin/scouts/{id}` permitindo ao superusuário expurgar registros de scout incorretos ou lançados por engano.

### RF-005: Leaderboard & Estatísticas Consolidadas do Clube
- Endpoint `GET /api/admin/scouts/leaderboard` consolidando os totais históricos de cada atleta:
  - Total de jogos com scout
  - Total de gols marcados
  - Total de assistências concedidas
  - Participações em gols (`gols + assistências`)
  - Cartões amarelos e vermelhos recebidos
  - Quantidade de vezes eleito MVP da partida
  - Total de minutos jogados
  - Gols sofridos (específico para goleiros)

### RF-006: Interface de Usuário Rica e Responsiva (UX/UI)
- Nova aba no `AdminDashboard`: **Scouts & Stats**.
- Subvisões:
  - **Súmula da Partida**: Seletor de partida, cards de resumo e listagem rápida com steppers (+/-) e toggle de MVP com feedback visual.
  - **Ranking & Estatísticas Gerais**: Cards de destaque (Artilheiro, Líder em Assistências, Mais vezes MVP, Fair Play) e tabela completa filtrável por nome e posição.
- Modal de lançamento/edição com seleção de partida e atleta, validações e alertas.

## 3. Requisitos de Segurança & Permissões
- Todas as rotas `/api/admin/scouts*` exigem autenticação Sanctum e verificação de perfil `role:root`.
- Usuários anônimos recebem `401 Unauthorized`.
- Usuários autenticados sem perfil `root` (ex.: técnico, atleta, almoxarifado, financeiro) recebem `403 Forbidden`.
