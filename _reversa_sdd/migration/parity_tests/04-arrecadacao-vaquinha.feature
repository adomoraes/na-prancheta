# language: pt
# spec-id: PT-004
# rastreabilidade:
#   process_flows: _reversa_sdd/tesoureiro-vaquinha/requirements.md § RF-TV-01..04, RN-TV-01..05
#   target_architecture: BC-04 (Tesouraria & Vaquinha) / target_architecture.md § 3.4
#   paradigma_alvo: Laravel Eloquent + DB Transactions ACID + BR-HUMANA-003

Funcionalidade: Arrecadação da Vaquinha, Quitação PIX e Gestão de Excedente
  Como tesoureiro da equipe
  Quero controlar a arrecadação da cota da arbitragem via PIX e auditar pagamentos
  Para quitar a taxa do jogo e destinar eventuais excedentes ao Caixa Geral da Equipe

  @paridade @critico
  Cenário: Geração automática de lançamento financeiro exclusivamente para atletas confirmados
    Dado que a partida possui cota individual fixada em R$ 25,00
    E 12 atletas confirmaram presença enquanto 3 atletas marcaram ausência
    Quando os lançamentos de cobrança da partida são gerados pelo sistema
    Então devem existir exatamente 12 cobranças com valor unitário de R$ 25,00 e status "pendente"
    E nenhum lançamento de taxa deve ser criado para os 3 atletas ausentes

  @paridade @critico
  Cenário: Baixa de pagamento auditada pelo tesoureiro com timestamp
    Dado que existe um lançamento pendente de R$ 25,00 para o atleta "Danilo Gabriel"
    E o tesoureiro autenticado no sistema confirma o recebimento do comprovante PIX
    Quando o tesoureiro efetua a baixa da taxa via API REST
    Então o status do lançamento deve mudar para "pago"
    E o campo "pago_em" deve ser preenchido com a data e hora do processamento
    E o ID do tesoureiro responsável deve ficar gravado no registro para fins de auditoria

  @paridade @critico @invariante
  Cenário: Destinação cumulativa do saldo excedente ao Caixa Geral da Equipe (BR-HUMANA-003)
    Dado que a meta financeira para pagamento da arbitragem na partida é de R$ 300,00
    E 14 atletas quitaram suas cotas de R$ 25,00, totalizando R$ 350,00 arrecadados
    Quando o tesoureiro encerra a vaquinha da partida
    Então o sistema deve quitar a despesa de R$ 300,00 da arbitragem
    E o saldo excedente de R$ 50,00 deve ser transferido e creditado no Caixa Geral da Equipe
    E o saldo cumulativo da equipe deve refletir exatamente o acréscimo de R$ 50,00

  @paridade @idempotencia
  Cenário: Confirmação repetida de pagamento já quitado não altera os totalizadores
    Dado que um atleta já possui seu lançamento com status "pago"
    Quando uma requisição redundante de quitação para o mesmo lançamento for enviada
    Então o sistema deve responder com sucesso HTTP 200 idempotente
    E o total arrecadado da partida não deve sofrer acréscimo duplicado
