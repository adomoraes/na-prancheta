# Investigação Técnica: Cadastro de Patrimônio com Condicional para Uniformes e Refatoração de UX

> Feature: `008-patrimonio-uniformes-ux`  
> Data: `2026-09-21`  
> Contexto: Gestão de almoxarifado esportivo, uniformes e fardamentos no Na Prancheta

---

## 1. Diagnóstico do Estado Inicial

Na versão original, a entidade `itens_almoxarifado` continha apenas quatro atributos básicos:
- `nome`: VARCHAR(100)
- `categoria`: VARCHAR(50)
- `quantidade_total`: INTEGER
- `estado_conservacao`: VARCHAR(30)

Essa estrutura plana impedia a gestão fina de fardamentos e uniformes esportivos de uma equipe amadora, onde cada peça possui características cruciais para a logística do dia de jogo:
1. **Tipo de Peça:** Dificuldade em distinguir camisas titulares/reservas, calções e meiões;
2. **Grade de Tamanhos:** Impossibilidade de saber a distribuição de tamanhos disponíveis (ex: P, M, G, GG);
3. **Cores e Numerações:** Falta de rastreio de peças individuais numeradas (ex: Camisa 10) ou cores predominantes para evitar choque de uniforme contra adversários;
4. **Detalhes do Fornecedor:** Ausência de campo para marca e observações técnicas (ex: "Adidas", "Manga Longa", "Patrocínio Master").

## 2. Decisões de Arquitetura

1. **Esquema de Dados Extensível e Retrocompatível:**
   - Adicionadas 5 colunas anuláveis à tabela `itens_almoxarifado`:
     - `tipo_uniforme` (VARCHAR(30)): aceita `camisa`, `meiao`, `calcao`.
     - `tamanho` (VARCHAR(20)): aceita `P`, `M`, `G`, `GG`, `XG`, etc.
     - `cor` (VARCHAR(50)): ex. `Azul`, `Branco`, etc.
     - `numero` (VARCHAR(10)): ex. `10`, `7`, etc.
     - `observacoes` (TEXT): observações de marca, fornecedor ou detalhes.
   - Itens não pertencentes à categoria uniforme continuam operando normalmente com esses campos nulos.

2. **Validação Condicional Inteligente:**
   - No `AdminController@storePatrimonio`, quando `categoria` for `uniforme`, `uniformes` ou `fardamento`:
     - O campo `tipo_uniforme` passa a ser obrigatório (`in:camisa,meiao,calcao`).
     - A quantidade mínima é validada (`min:1`).

3. **Refatoração de UX no Painel Administrativo:**
   - Modal com seleção visual de categorias por botões clicáveis.
   - Revelação reativa do bloco de especificações de uniforme com chips de seleção para o tipo da peça e tamanhos rápidos.
   - Botão de auto-geração de nomenclatura de item baseado na combinação das propriedades selecionadas.
   - Na visualização do inventário, inclusão de filtro rápido por categorias e badges de tipo, tamanho, cor e número em cada card.
