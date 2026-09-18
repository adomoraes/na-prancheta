# language: pt
# spec-id: PT-002
# rastreabilidade:
#   process_flows: _reversa_sdd/protocolo-vestiario/requirements.md § RF-PV-01..03, RN-PV-01..03
#   target_architecture: BC-02 (Partidas & Vestiário) / target_architecture.md § 3.2
#   paradigma_alvo: Laravel Eloquent Active Record + Carbon Datetime + REST API

Funcionalidade: Protocolo Regressivo do Vestiário e Trava Disciplinar T-35
  Como membro da comissão técnica
  Quero aplicar rigidamente a linha do tempo do vestiário e o corte de atraso T-35
  Para garantir disciplina tática e aquecimento fisiológico adequado antes do jogo

  @paridade @critico
  Cenário: Consulta do protocolo regressivo com cálculo temporal canônico
    Dado que a partida possui horário de início agendado para as 10:00
    Quando a API de protocolo do vestiário é consultada às 09:10 (T-50)
    Então o sistema deve retornar o marco temporal ativo como "Fardamento e Uniforme"
    E o tempo restante calculado para o apito inicial deve ser de 50 minutos
    E as fases da sequência fisiológica devem estar acessíveis para leitura

  @paridade @critico @invariante
  Cenário: Atleta pontual presente antes de T-35 permanece elegível para titularidade
    Dado que o atleta "Fagner Conserva" confirma presença no vestiário às 09:20
    E a partida inicia às 10:00, correspondendo a T-40 min
    Quando o status de pontualidade do atleta é verificado no sistema
    Então o campo "chegou_apos_t35" deve ser registrado como false
    E o atleta deve permanecer elegível para ser escalado entre os 11 titulares

  @paridade @critico @invariante
  Cenário: Atleta que chega após T-35 sofre corte disciplinar e vai para o banco
    Dado que a preleção técnica inicia rigorosamente em T-35 min antes do apito inicial
    E o atleta "Paolo Guerrero" se apresenta no vestiário em T-20 min antes do apito inicial
    Quando o registro de entrada do atleta é processado no sistema
    Então o campo "chegou_apos_t35" deve ser registrado como true
    E a API deve marcar a restrição disciplinar ativa
    E qualquer tentativa subsequente de escalar o atleta como titular deve ser rejeitada com erro HTTP 422
