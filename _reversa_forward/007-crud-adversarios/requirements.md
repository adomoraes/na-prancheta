# Requirements: CRUD de Adversários e Seleção no Formulário da Partida

> Identificador: `007-crud-adversarios`  
> Data: `2026-09-21`  
> Status: `aprovado`  

---

## 1. Contexto & Problema

No futebol amador, o agendamento de partidas frequentemente envolvia redigitar manualmente o nome do clube rival a cada jogo. Isso acarretava:
1. Discrepâncias de grafia (ex.: "União Alvinegra", "Uniao Alvinegra FC", "U. Alvinegra"), prejudicando o histórico de confrontos.
2. Perda de contatos do responsável da equipe rival (diretor, capitão) e das cores de uniforme do adversário (essencial para evitar conflito de cores de camisas no dia do jogo).
3. Falta de um módulo administrativo para cadastrar e gerenciar a lista de adversários frequentes.

## 2. Escopo da Feature

1. **Gestão de Adversários (Backoffice ROOT):**
   - Criação, edição, listagem e inativação de adversários.
   - Atributos: Nome, Responsável (nome e WhatsApp), Cor do Uniforme Principal, Escudo/Logo URL, Observações táticas/gerais e Status Ativo/Inativo.
   - Restrição de unicidade de nome do adversário por clube (`time_id`).
2. **Integração no Agendamento de Partidas:**
   - Dropdown inteligente no modal de partidas carregando adversários ativos.
   - Auto-preenchimento do nome do adversário e sugestão de informações.
   - Preservação do snapshot imutável em `partidas.adversario` (caso o adversário seja renomeado ou excluído futuramente, o registro da partida permanece inalterado).
3. **API e Segurança:**
   - Endpoint público `GET /api/adversarios` (ativos).
   - Endpoints sob `/api/admin/adversarios` restritos a `role:root`.
4. **Qualidade e Testes:**
   - Suíte de integração cobrindo autorização, validações e persistência relacional.
