# Requisitos: Cadastro de Patrimônio com Condicional para Uniformes e Refatoração de UX

> Feature: `008-patrimonio-uniformes-ux`  
> Data: `2026-09-21`  
> Cenário: `legado`  
> Status: `in-progress`

---

## 1. Visão Geral & Problema

Atualmente, o cadastro de itens de patrimônio/almoxarifado (`itens_almoxarifado`) trata todos os bens de forma genérica através de apenas 4 campos: `nome`, `categoria`, `quantidade_total` e `estado_conservacao`.
Para a gestão de **uniformes e fardamento esportivo**, isso era insuficiente, pois não permitia:
- Discriminar o tipo de peça específica (`camisa`, `meiao`, `calcao`);
- Controlar tamanhos (`P`, `M`, `G`, `GG`, `XG`);
- Identificar a cor do uniforme (evitando divergências de estoque de primeiro e segundo uniforme);
- Associar a numeração da peça (ex: Camisa 10);
- Registrar observações de fornecedor ou detalhes (ex: "Adidas", "Manga Longa", "Patrocínio Master").

Além disso, a experiência do usuário (UX) no modal de cadastro era plana e não guiava o gestor nas especificidades de cada categoria de material.

## 2. Requisitos Funcionais (RF)

- **RF001:** O esquema da tabela `itens_almoxarifado` deve suportar colunas adicionais para detalhamento de vestuário esportivo:
  - `tipo_uniforme`: VARCHAR(30), nullable (aceita `camisa`, `meiao`, `calcao`).
  - `tamanho`: VARCHAR(20), nullable (ex: `P`, `M`, `G`, `GG`, `XG`, etc.).
  - `cor`: VARCHAR(50), nullable (ex: `Azul`, `Branco`, etc.).
  - `numero`: VARCHAR(10), nullable (ex: `10`, `7`, etc.).
  - `observacoes`: TEXT, nullable (ex: `Adidas`, observações de conservação ou lote).
- **RF002:** Quando a categoria selecionada for `uniforme` ou `uniformes`:
  - O campo `tipo_uniforme` torna-se obrigatório (`camisa`, `meiao`, `calcao`).
  - Os campos de detalhamento (`quantidade_total`, `tamanho`, `cor`, `numero`, `observacoes`) devem ser expostos e validados.
- **RF003:** Para itens não-uniforme (ex: `bola`, `cone`, `apoio`, `farmacia`):
  - Os campos de uniforme são opcionais ou omitidos, preservando a retrocompatibilidade com o almoxarifado geral.
- **RF004:** O painel administrativo deve oferecer uma UX intuitiva:
  - Seletor visual de categoria (Bolas, Uniformes, Coletes, Apoio);
  - Seção condicional reativa para uniforme com chips de tipo (`Camisa`, `Meião`, `Calção`) e chips de tamanho rápido (`P`, `M`, `G`, `GG`, `XG`);
  - Sugestão inteligente de nome baseada na combinação (ex: "Camisa 10 Azul (GG)");
  - Cards no inventário com badges visuais de tipo, cor, tamanho e número, facilitando a contagem de fardamento no pré-jogo.

## 3. Requisitos Não Funcionais (RNF)

- **RNF001:** Retrocompatibilidade absoluta: itens legados sem dados de uniforme continuam funcionando sem regressão nas conferências de malas pós-jogo (`conferencias_malas`).
- **RNF002:** Resposta da API padronizada e protegida por RBAC (`role:root`).
- **RNF003:** Suíte de testes automatizados completa no backend (PHPUnit) e frontend compilando sem erros (`npm run build`).
