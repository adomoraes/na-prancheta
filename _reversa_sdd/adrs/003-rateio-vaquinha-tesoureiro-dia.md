# ADR-003: Rateio da Vaquinha da Rodada com Tesoureiro Rotativo do Dia e Integração WhatsApp

> Status: **Aprovado / Implementado** 🟢 CONFIRMADO  
> Data: 18/09/2026  
> Contexto: Gestão financeira e rateio de custos de arbitragem

---

## Contexto

As partidas de futebol amador demandam pagamento à vista do trio de arbitragem e locação do campo (em média R$ 300,00 por jogo). A cobrança informal frequentemente sobrecarregava sempre a mesma pessoa da diretoria, gerando inadimplência, constrangimento e prejuízos cobertos do próprio bolso.

## Decisão

Instituir o modelo de **Tesoureiro do Dia** rotativo, integrando a vaquinha diretamente à ficha do jogo:
1. O rateio é calculado automaticamente dividindo os custos pelos atletas que confirmaram presença.
2. O tesoureiro da rodada possui painel exclusivo com botões táteis de 1 toque (mínimo 44px) para alternar entre "Pago" e "Cobrar".
3. Cópia instantânea da chave PIX do tesoureiro para a área de transferência.
4. Gerador de resumo textual formatado com emojis estruturado em lista de pendentes e pagantes para compartilhamento imediato no grupo de WhatsApp da agremiação.

## Alternativas Consideradas

1. **Mensalidade Fixa Única Prévia**:
   - *Prós*: Previsibilidade de receita no início do mês.
   - *Contras*: Não contempla atletas convidados e gera sensação de injustiça para quem falta por lesão ou compromisso familiar.
2. **Integração com Gateway de Pagamento / Split de PIX via API Bancária**:
   - *Prós*: Baixa automática do pagamento sem intervenção humana.
   - *Contras*: Custos de taxas de intermediação bancária por transação e burocracia de abertura de conta jurídica (CNPJ) para agremiação amadora.

## Consequências

- **Positivas**:
  - Eliminação da inadimplência oculta através da transparência social no grupo de WhatsApp.
  - Baixa fricção com cópia rápida de PIX e conferência tátil em segundos pelo tesoureiro.
  - Rotatividade da função, descentralizando a responsabilidade financeira da agremiação.
- **Negativas**:
  - Necessidade de conferência manual pelo tesoureiro no aplicativo do banco antes de acionar o botão "Pago" no Na Prancheta.
