# Regression Watch: CRUD de Adversários

> Feature: `007-crud-adversarios`  
> Data: `2026-09-21`

---

## Pontos de Atenção Contínua

| Área | Risco Potencial | Mitigação Implementada | Verificação |
|------|-----------------|------------------------|-------------|
| **Criação de Partida** | Tentar inserir `adversario_id` inexistente no banco. | Validação `exists:adversarios,id` e constraint foreign key com `nullOnDelete`. | Teste `root pode criar partida vinculada a um adversario id` em `AdversarioCrudTest.php`. |
| **Integridade de Confrontos** | Renomear adversário e alterar histórico de jogos passados. | O nome textual do adversário na tabela `partidas` é imutável e atua como snapshot no momento do jogo. | Snapshot preservado em `partidas.adversario`. |
| **Nomes Duplicados** | Criar múltiplos registros do mesmo rival com pequenas variações. | Validação `unique:adversarios,nome` com escopo por `time_id`. | Teste `validacao rejeita adversario com nome duplicado no mesmo time` retorna 422. |
| **Desativação de Adversário** | Desativar um clube rival apagar partidas vinculadas. | Soft toggle de status (`ativo = false`), sem cascade delete. | Verificado na migration com `nullOnDelete()`. |
