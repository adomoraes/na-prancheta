# language: pt
# spec-id: PT-001
# rastreabilidade:
#   process_flows: _reversa_sdd/confirmacao-presenca/requirements.md § RF-CP-01..05, RN-CP-01..05
#   target_architecture: BC-01 (Elenco & Presença) / target_architecture.md § 3.1
#   paradigma_alvo: Laravel Eloquent Active Record + REST API + PostgreSQL ACID

Funcionalidade: Confirmação de Presença e Transbordamento para Lista de Espera
  Como atleta do elenco
  Quero responder minha disponibilidade para a partida com 1 toque
  Para que a comissão técnica organize o fardamento e a escalação

  @paridade @critico
  Cenário: Atleta mensalista confirma presença dentro do teto de vagas da partida
    Dado que existe uma partida cadastrada com capacidade máxima de 18 atletas
    E o atleta "Rodrigo Garro" é mensalista e está ativo no elenco
    E a partida possui atualmente 10 presenças confirmadas
    Quando o atleta envia a confirmação com status "confirmado" via API REST
    Então o sistema deve registrar a presença com status "confirmado"
    E a contagem de confirmados da partida deve ser atualizada para 11
    E a resposta da API deve retornar código HTTP 200 com payload estruturado

  @paridade @critico @invariante
  Cenário: Transbordamento atômico para lista de espera ao atingir a capacidade máxima
    Dado que uma partida possui capacidade máxima de 18 atletas
    E a partida já atingiu exatamente 18 presenças com status "confirmado"
    Quando o atleta "Ángel Romero" envia uma confirmação de presença com status "confirmado"
    Então o sistema deve transbordar o status automaticamente para "lista_espera"
    E a contagem de confirmados deve permanecer em 18
    E o atleta deve ser posicionado no final da fila de espera daquela partida

  @paridade @idempotencia
  Cenário: Reprocessamento de confirmação de presença com o mesmo status é idempotente
    Dado que o atleta "Cássio Ramos" já possui presença com status "confirmado" na partida
    Quando o atleta envia novamente uma requisição com status "confirmado"
    Então o sistema deve manter o status "confirmado" sem criar registros duplicados
    E o timestamp original da confirmação deve ser preservado para fins de ordem na fila

  @paridade @invariante
  Cenário: Bloqueio de cadastro com número de camisa duplicado no mesmo time
    Dado que o atleta "Yuri Alberto" já possui a camisa número 9 no time ativo
    Quando um novo cadastro de atleta tenta registrar a camisa número 9 para o mesmo time
    Então a API deve rejeitar a requisição com código HTTP 422 Unprocessable Entity
    E o erro de validação deve indicar violação da regra de camisa única
