# language: pt
# spec-id: PT-005
# rastreabilidade:
#   process_flows: _reversa_sdd/almoxarifado-patrimonio/requirements.md § RF-AP-01..03, RN-AP-01..03
#   target_architecture: BC-05 (Almoxarifado & Resenha) / target_architecture.md § 3.5
#   paradigma_alvo: Laravel Eloquent + Domain Service + Invariante de Segurança

Funcionalidade: Custódia de Materiais, Desviramento de Fardamento e Trava da Resenha
  Como responsável pelo almoxarifado do time
  Quero auditar o recolhimento das camisas desviradas e das bolas calibradas
  Para liberar com segurança a resenha social e proteger o patrimônio da agremiação

  @paridade @critico @invariante
  Cenário: Bloqueio estrito da resenha social enquanto a tríplice conferência estiver incompleta
    Dado que a partida foi encerrada e o almoxarifado inicia a contagem de pós-jogo
    E o custodiante conferiu apenas 20 das 22 camisas e confirmou as 6 bolas
    Quando o custodiante tenta emitir o fechamento das malas para liberar a resenha
    Então a API deve recusar o fechamento com código HTTP 422 Unprocessable Entity
    E o status da resenha social da partida deve permanecer como "bloqueada"
    E o sistema deve alertar que faltam 2 camisas a serem recolhidas

  @paridade @critico @invariante
  Cenário: Liberação da resenha após tríplice checagem completa (22 camisas desviradas, 6 bolas e mala trancada)
    Dado que todas as 22 camisas oficiais foram recolhidas e verificadas como desviradas
    E todas as 6 bolas oficiais foram recolhidas na sacola
    E a mala de material esportivo foi trancada e guardada no porta-malas do veículo
    Quando o responsável pelo almoxarifado submete a tríplice confirmação via API
    Então a operação deve ser confirmada com código HTTP 200
    E o status da resenha social deve ser atualizado para "liberada"
    E deve ser emitido um timestamp de auditoria de liberação da resenha

  @paridade @invariante
  Cenário: Camisas recolhidas do avesso impedem a aprovação da conferência de fardamento
    Dado que foram recolhidas 22 camisas, mas 3 delas estão do avesso
    Quando o custodiante tenta confirmar o checklist de fardamento
    Então o sistema deve invalidar a checagem com erro de conformidade
    E exigir que todas as camisas estejam desviradas antes de permitir a baixa
