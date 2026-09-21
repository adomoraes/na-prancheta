# Regression Watch: Gestão de Patrimônio e Uniformes

> Feature: `008-patrimonio-uniformes-ux`  
> Data: `2026-09-21`

---

## Pontos de Atenção Contínua

| Área | Risco Potencial | Mitigação Implementada | Verificação |
|------|-----------------|------------------------|-------------|
| **Itens Não-Uniformes** | Exigir `tipo_uniforme` para itens comuns (bolas, cones). | A condicional só dispara quando `categoria` é `uniforme`, `uniformes` ou `fardamento`. | Teste `item comum pode ser criado sem campos de uniforme` passando. |
| **Conferência de Malas** | Quebra na contagem de peças no fechamento do almoxarifado pós-jogo. | A tabela `conferencias_malas` e seus contadores numéricos permanecem inalterados. | Teste de paridade `PT005` validado e aprovado. |
| **Tipagem e Build** | Erro de compilação no front devido a atributos opcionais em `AdminPatrimonioDTO`. | Atributos marcados como opcionais com união de strings em `src/types.ts`. | `npm run build` executado e aprovado. |
