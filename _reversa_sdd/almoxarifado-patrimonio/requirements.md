# Requisitos da Feature: Almoxarifado, Custódia de Malas e Patrimônio

> Nível de Documentação: **Detalhado**  
> Unit: `almoxarifado-patrimonio`  
> Status: 🟢 CONFIRMADO

---

## 1. Visão Geral

A feature **Almoxarifado, Custódia de Malas e Patrimônio** estabelece a governança física dos materiais esportivos do clube amador (conjuntos de uniformes oficiais, bolas de jogo, coletes de treino e mala de transporte). O módulo implementa a **Regra de Ouro do Vestiário** através de um checklist de 3 condições mandatórias pós-jogo (22 camisas desviradas, 6 bolas recolhidas e mala guardada no veículo de transporte), mantendo a confraternização social ("resenha") e o consumo de bebidas bloqueados até a quitação integral do checklist pelo custodiante oficial.

---

## 2. Responsabilidades

- Apresentar a identificação formal do responsável pela custódia do patrimônio na rodada (ex: Carlos Eduardo - Kadu).
- Exibir com destaque a diretriz disciplinar institucional da "Regra de Ouro de Fechamento de Malas".
- Disponibilizar um checklist interativo pós-jogo composto por 3 validações físicas críticas.
- Avaliar a conjunção lógica tríplice (`AND`) dos itens de devolução para alternar reativamente o status da resenha entre `BLOQUEADA` e `LIBERADA`.
- Renderizar o catálogo de inventário de patrimônio ativo, indicando quantidades totais, disponíveis e notas de conservação.

---

## 3. Regras de Negócio

- **RN-AP-01 (Trava da Resenha Social / Condição Tríplice)** 🟢 CONFIRMADO: A liberação da resenha social e do consumo de bebidas para o elenco é estritamente condicionada à marcação simultânea das 3 etapas de devolução: `uniformesLadoCorreto === true && bolasRecolhidas === true && malaConferida === true`. Se qualquer item estiver pendente, o status permanece `"BLOQUEADA (Aguardando malas) ⏳"` (`src/components/AlmoxarifadoView.tsx:15, 99-105`).
- **RN-AP-02 (Custódia Designada)** 🟢 CONFIRMADO: A guarda e a condução da mala oficial de fardamento recaem sobre um membro específico designado, com identificação visível no topo do módulo (`src/components/AlmoxarifadoView.tsx:36-39`).
- **RN-AP-03 (Protocolo de Lavagem - Camisas Desviradas)** 🟢 CONFIRMADO: As 22 camisas oficiais devem ser depositadas na mala obrigatoriamente do lado correto (não do avesso), sob pena de não validação da devolução pelo responsável da lavanderia (`src/components/AlmoxarifadoView.tsx:48-50, 68-69`).
- **RN-AP-04 (Conferência do Bolsão de Bolas)** 🟢 CONFIRMADO: Todas as 6 bolas oficiais utilizadas no aquecimento e na partida devem ser recolhidas e contadas no gramado antes da liberação do vestiário (`src/components/AlmoxarifadoView.tsx:80-81`).
- **RN-AP-05 (Visibilidade de Disponibilidade de Patrimônio)** 🟢 CONFIRMADO: Cada item do patrimônio deve expressar sua fração de disponibilidade (`quantidade_disponivel / quantidade_total`) acompanhada das observações de conservação (`src/components/AlmoxarifadoView.tsx:118-123`).

---

## 4. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| **RF-AP-01** | Exibir banner da Regra de Ouro do Vestiário | Must | Apresentar texto institucional de alta visibilidade alertando sobre a dependência da conferência da mala para abertura da resenha. |
| **RF-AP-02** | Checklist com 3 validações de devolução | Must | Checkboxes individuais para: camisas desviradas, bolsão de 6 bolas e mala guardada no veículo oficial. |
| **RF-AP-03** | Indicador dinâmico de status da resenha | Must | Exibir "BLOQUEADA (Aguardando malas) ⏳" em âmbar quando houver pendência; exibir "LIBERADA ✅" em verde esmeralda quando os 3 itens estiverem marcados. |
| **RF-AP-04** | Grade de catálogo de patrimônio ativo | Should | Listar todos os itens cadastrados com nome, badge de quantidade disponível vs. total e observações. |

---

## 5. Requisitos Não Funcionais

| Tipo | Requisito Inferido | Evidência no Código | Confiança |
|---|---|---|---|
| **Acessibilidade Tátil** | Labels de checkbox com padding e área clicável expandida (`p-2.5 rounded-lg`) | `src/components/AlmoxarifadoView.tsx:60, 72, 84` | 🟢 |
| **Clareza Semântica de Alertas** | Cores contrastantes: Âmbar para resenha bloqueada e Esmeralda para liberada | `src/components/AlmoxarifadoView.tsx:101-103` | 🟢 |
| **Layout Adaptativo** | Grid de patrimônio em 1 coluna mobile e 2 colunas desktop (`grid-cols-1 sm:grid-cols-2`) | `src/components/AlmoxarifadoView.tsx:113` | 🟢 |

---

## 6. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: Tentativa de liberar resenha com bolas ainda em campo
  Dado que o almoxarifado conferiu as 22 camisas desviradas na mala (uniformesLadoCorreto = true)
  E a mala oficial já foi guardada no veículo (malaConferida = true)
  Mas o bolsão de 6 bolas ainda não foi recolhido (bolasRecolhidas = false)
  Quando a tela do almoxarifado avalia o status da resenha
  Então o status deve exibir "BLOQUEADA (Aguardando malas) ⏳" com tipografia em âmbar
  E a resenha não deve ser considerada autorizada

Cenário: Cumprimento integral do checklist de devolução
  Dado que os itens de camisas desviradas, bolsão de bolas e mala fechada estão todos checados (true)
  Quando o terceiro checkbox é marcado
  Então o status da resenha deve alternar imediatamente para "LIBERADA ✅" com cor verde esmeralda
```

---

## 7. Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|---|---|---|
| Checklist tríplice de devolução pós-jogo | **Must** | Mecanismo nuclear de combate à perda de materiais e camisas extraviadas. |
| Indicador visual de bloqueio/liberação da resenha | **Must** | Comunicação social clara para alinhamento entre elenco e diretoria. |
| Banner explicativo da Regra de Ouro | **Should** | Reforço cultural pedagógico para novatos e convidados. |
| Catálogo de patrimônio e estoque disponível | **Should** | Rastreabilidade do acervo patrimonial do clube. |

---

## 8. Rastreabilidade de Código

| Arquivo do Legado | Linhas | Símbolo / Responsabilidade | Confiança |
|---|---|---|---|
| [`src/components/AlmoxarifadoView.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/AlmoxarifadoView.tsx) | 1-129 | Componente `AlmoxarifadoView`, checklist tríplice e trava da resenha | 🟢 CONFIRMADO |
| [`src/data/initialData.ts`](file:///home/adomoraes/projects/na-prancheta/src/data/initialData.ts) | 179-204 | Mock do inventário inicial de patrimônio (`initialPatrimonio`) | 🟢 CONFIRMADO |
| [`src/types.ts`](file:///home/adomoraes/projects/na-prancheta/src/types.ts) | 90-99 | Interface `PatrimonioItem` | 🟢 CONFIRMADO |
