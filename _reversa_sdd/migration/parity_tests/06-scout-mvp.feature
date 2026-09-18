# language: pt
# spec-id: PT-006
# rastreabilidade:
#   process_flows: _reversa_sdd/scout-pos-jogo/requirements.md § RF-SPJ-01..04, RN-SPJ-01..04
#   target_architecture: BC-06 (Scout & Estatísticas) / target_architecture.md § 3.6
#   paradigma_alvo: Laravel Eloquent + DB Check Constraints + Transação Atômica

Funcionalidade: Scout Estatístico Pós-Jogo e Exclusividade do Craque do Jogo (MVP)
  Como anotador de súmula da equipe
  Quero registrar gols, assistências, cartões e eleger o MVP da partida
  Para consolidar as estatísticas individuais da temporada com integridade

  @paridade @critico
  Cenário: Registro consistente de dados estatísticos com validação de valores não negativos
    Dado que a partida foi encerrada e está aberta para inserção de súmula
    Quando o anotador envia o scout do atleta "Marcelinho Carioca" com 2 gols, 1 assistência e 1 cartão amarelo
    Então o sistema deve persistir as estatísticas com sucesso
    E os valores de gols, assistências e cartões devem ser validados como números inteiros maiores ou iguais a zero
    E a API deve retornar código HTTP 200 com o resumo estatístico atualizado

  @paridade @critico @invariante
  Cenário: Exclusividade estrita do Craque do Jogo (MVP) com revogação atômica automática
    Dado que o atleta "Carlos Tevez" está atualmente registrado como MVP da partida
    Quando o anotador elege o atleta "Ronaldo Nazário" como o novo MVP da mesma partida
    Então o sistema deve executar a troca dentro de uma transação atômica
    E o atleta "Ronaldo Nazário" deve passar a ter o campo "foi_mvp" igual a true
    E o atleta "Carlos Tevez" deve ter seu campo "foi_mvp" atualizado automaticamente para false
    E em nenhum momento devem existir dois atletas marcados como MVP simultaneamente na partida

  @paridade @invariante
  Cenário: Rejeição de tentativa de submeter valores negativos em scouts
    Dado uma partida ativa com súmula aberta
    Quando uma requisição tenta enviar "-1" no campo de gols sofridos para um goleiro
    Então a API deve rejeitar o payload com código HTTP 422 Unprocessable Entity
    E o banco de dados PostgreSQL deve assegurar a constraint CHECK (gols_sofridos >= 0)
