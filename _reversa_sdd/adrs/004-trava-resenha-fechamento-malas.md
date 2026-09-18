# ADR-004: Condicionamento Programático da Resenha Social ao Checklist Tríplice do Almoxarifado

> Status: **Aprovado / Implementado** 🟢 CONFIRMADO  
> Data: 18/09/2026  
> Contexto: Governança e conservação do patrimônio esportivo

---

## Contexto

Um dos problemas operacionais mais recorrentes no futebol amador é o extravio de materiais (bolas esquecidas no campo após o jogo, camisas oficiais levadas inadvertidamente para casa por atletas ou devolvidas do avesso, danificando os números na lavagem). Após o apito final, a dispersão para a resenha social e consumo de bebidas costuma provocar negligência na guarda dos equipamentos.

## Decisão

Instituir no software a **Regra de Ouro do Vestiário**, que bloqueia a resenha social do clube até a conclusão de uma validação booleana tríplice operada pelo responsável de almoxarifado/custódia:
1. Todas as 22 camisas da mala depositadas do lado correto (não do avesso) para lavagem.
2. Bolsão completo com as 6 bolas oficiais recolhido e conferido no gramado.
3. Mala 1 conferida, trancada e guardada no veículo oficial de transporte.

O status da resenha no sistema permanece como `"BLOQUEADA (Aguardando malas) ⏳"` e só comuta para `"LIBERADA ✅"` quando `tudoConferido === true`.

## Alternativas Consideradas

1. **Confiança Mútua Sem Checklist Formal**:
   - *Prós*: Nenhuma burocracia no pós-jogo.
   - *Contras*: Histórico comprovado de camisas e bolas perdidas ao longo da temporada, gerando prejuízos de reposição.
2. **Cobrança de Caução Individual por Fardamento**:
   - *Prós*: Garantia financeira do material.
   - *Contras*: Excessivamente burocrático e hostil para a cultura do futebol de várzea / amador.

## Consequências

- **Positivas**:
  - Preservação total do patrimônio da agremiação esportiva.
  - O condicionamento da resenha cria pressão social positiva entre o próprio elenco para agilizar a organização dos kits.
  - Aumento da vida útil dos fardamentos oficiais pelo cuidado de desvirar antes da lavagem.
- **Negativas**:
  - O almoxarife deve permanecer focado nos primeiros 10 minutos após o jogo para conferir e dar baixa no checklist antes de relaxar.
