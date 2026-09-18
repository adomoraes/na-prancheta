# language: pt
# spec-id: PT-003
# rastreabilidade:
#   process_flows: _reversa_sdd/prancheta-tatica/requirements.md § RF-PT-01..04, RN-PT-01..05
#   target_architecture: BC-03 (Prancheta Tática) / target_architecture.md § 3.3
#   paradigma_alvo: Laravel Eloquent Active Record + PostgreSQL Relational Constraints

Funcionalidade: Escalação Tática 4-3-3 e Teto Rígido de 11 Titulares
  Como treinador da equipe
  Quero dispor os 11 titulares no campo tático 4-3-3 respeitando as presenças confirmadas
  Para apresentar a preleção oficial da partida ao elenco

  @paridade @critico
  Cenário: Escalação bem-sucedida de formação 4-3-3 completa com 11 titulares elegíveis
    Dado que existem pelo menos 11 atletas confirmados na partida e pontuais antes de T-35
    Quando o treinador submete uma formação 4-3-3 com 1 Goleiro, 4 Defensores, 3 Meias e 3 Atacantes
    Então o sistema deve persistir a escalação na tabela de titulares
    E a API deve retornar código HTTP 200 com a lista dos 11 titulares indexados por posição
    E a formação tática deve ficar disponível para consulta de todos os membros do elenco

  @paridade @critico @invariante
  Cenário: Rejeição de tentativa de escalar mais de 11 titulares simultâneos
    Dado que a escalação da partida já conta com exatamente 11 titulares preenchidos
    Quando o treinador tenta adicionar um 12º atleta como titular no campo
    Então a API deve recusar a submissão com código HTTP 422 Unprocessable Entity
    E a mensagem de erro deve explicitar que o teto regulamentar é de exatamente 11 atletas

  @paridade @critico @invariante
  Cenário: Rejeição de escalação de atleta não elegível (ausente, em dúvida ou cortado por T-35)
    Dado que o atleta "Renato Augusto" está registrado com presença "duvida" na partida
    E o atleta "Gilmar Fubá" foi penalizado com "chegou_apos_t35 = true"
    Quando o treinador tenta escalar qualquer um desses atletas como titular no campo
    Então a API deve rejeitar a operação com código HTTP 422
    E a resposta deve indicar que apenas confirmados sem corte disciplinar podem iniciar a partida
