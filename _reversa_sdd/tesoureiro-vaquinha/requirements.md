# Requisitos da Feature: Painel do Tesoureiro e Vaquinha do Jogo

> Nível de Documentação: **Detalhado**  
> Unit: `tesoureiro-vaquinha`  
> Status: 🟢 CONFIRMADO

---

## 1. Visão Geral

A feature **Painel do Tesoureiro e Vaquinha do Jogo** gerencia a arrecadação financeira do dia da partida (rateio de arbitragem e custos operacionais de jogo). A cobrança é direcionada exclusivamente aos atletas com presença confirmada no evento. O módulo consolida métricas financeiras em tempo real (total arrecadado, total pendente e meta de cobertura da arbitragem estipulada em R$ 300,00), disponibiliza interface rápida com alternância de status de pagamento (1 toque), gera texto formatado com marcadores visuais para compartilhamento direto no grupo de WhatsApp e disponibiliza a chave PIX do tesoureiro para cópia imediata.

---

## 2. Responsabilidades

- Isolar a lista de cobrança para contemplar estritamente os atletas com status de presença `'confirmado'`.
- Computar dinamicamente os valores totais esperados, arrecadados e o montante pendente com base na taxa individual da partida (`evento.valor_taxa_jogo`).
- Exibir a barra de progresso da meta de arbitragem (meta fixa de R$ 300,00).
- Fornecer filtros rápidos para listagem de cobrança: `'todos'`, `'pendentes'` e `'pagos'`.
- Permitir ao tesoureiro alternar o status de pagamento de cada atleta com botão tátil ergonômico de 1 toque (mínimo 44px).
- Disponibilizar ferramenta de cópia da chave PIX do tesoureiro para a área de transferência.
- Compilar e copiar resumo padronizado para WhatsApp com contadores e listas nominais separadas entre pendentes (❌) e pagos (✅).

---

## 3. Regras de Negócio

- **RN-TV-01 (Rateio Exclusivo dos Confirmados)** 🟢 CONFIRMADO: Apenas atletas com `EventoPresenca.status === 'confirmado'` são elegíveis para cobrança da taxa do jogo. Dúvidas e ausências não geram expectativa financeira ativa na partida (`src/components/TesoureiroColeta.tsx:22-27`).
- **RN-TV-02 (Cálculo Financeiro Dinâmico)** 🟢 CONFIRMADO: O valor total esperado é calculado multiplicando a quantidade de confirmados pelo valor da taxa individual (`coletasConfirmados.length * evento.valor_taxa_jogo`). O montante pendente é a diferença exata entre o esperado e o total pago (`src/components/TesoureiroColeta.tsx:29-33`).
- **RN-TV-03 (Meta Fixa de Arbitragem)** 🟢 CONFIRMADO: O custo de arbitragem é fixado em R$ 300,00 para aferição da cobertura percentual das despesas essenciais do confronto amador (`src/components/TesoureiroColeta.tsx:38-39`).
- **RN-TV-04 (Alternância de Pagamento / Toggle)** 🟢 CONFIRMADO: Ao acionar o botão de pagamento de um atleta, seu estado booleano `pago` é invertido. Caso transite para `true`, registra-se o timestamp ISO corrente em `pago_em`; caso reverta para `false`, `pago_em` é limpo para `undefined` (`src/App.tsx:112-127`, `src/components/TesoureiroColeta.tsx:234-254`).
- **RN-TV-05 (Geração de Resumo WhatsApp Padronizado)** 🟢 CONFIRMADO: O texto gerado deve conter cabeçalho da partida, taxa individual, montantes acumulados, chave PIX com nome do tesoureiro, e as seções de atletas pendentes (prefixadas por ❌) e atletas pagos (prefixadas por ✅) (`src/components/TesoureiroColeta.tsx:49-73`).

---

## 4. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| **RF-TV-01** | Painel de métricas financeiras | Must | Exibir 3 cards: Total Arrecadado (verde), Pendente de Pagamento (âmbar) e Meta de Arbitragem com barra de progresso percentual. |
| **RF-TV-02** | Botão de cópia de chave PIX | Must | Copiar chave para o clipboard e exibir feedback transitório "PIX Copiado!" por 2 segundos. |
| **RF-TV-03** | Botão de resumo para WhatsApp | Must | Montar mensagem padronizada no clipboard e exibir feedback transitório "Copiado p/ Zap!" por 2 segundos. |
| **RF-TV-04** | Filtro de lista de cobrança | Should | Permitir alternar visualização entre 'Todos', 'Pendentes' e 'Pagos' com contadores no label dos botões. |
| **RF-TV-05** | Alternância rápida de pagamento por atleta | Must | Botão tátil para cada atleta: quando pendente exibe 'Cobrar' (âmbar); quando liquidado exibe 'Pago' (verde). |

---

## 5. Requisitos Não Funcionais

| Tipo | Requisito Inferido | Evidência no Código | Confiança |
|---|---|---|---|
| **Ergonomia Mobile** | Botão de alternância com área de toque mínima de 44px de altura | `src/components/TesoureiroColeta.tsx:235` (`min-h-[44px]`) | 🟢 |
| **Tipografia Financeira** | Valores monetários renderizados com fonte monoespaçada e alto contraste | `src/components/TesoureiroColeta.tsx:124,136,148` (`font-mono text-xl font-black`) | 🟢 |
| **Feedback Transitório** | Confirmação de cópia temporizada com timeout de 2.000 ms | `src/components/TesoureiroColeta.tsx:46,72` (`setTimeout(..., 2000)`) | 🟢 |
| **Performance de Scroll** | Lista de cobrança com scroll interno otimizado e altura máxima de 384px | `src/components/TesoureiroColeta.tsx:195` (`max-h-96 overflow-y-auto`) | 🟢 |

---

## 6. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: Tesoureiro registra recebimento de taxa de atleta pendente
  Dado que o atleta "Vitinho" confirmou presença no jogo
  E sua taxa de R$ 15,00 consta como pendente (pago = false)
  Quando o tesoureiro clica no botão "Cobrar" do card de "Vitinho"
  Então o status do atleta deve ser atualizado para pago = true
  E o timestamp pago_em deve ser registrado com a hora atual
  E o card deve alternar o botão para "Pago" com badge verde
  E o Total Arrecadado deve ser acrescido de R$ 15,00
  E o Pendente de Pagamento deve ser reduzido de R$ 15,00

Cenário: Geração e cópia de resumo para grupo de WhatsApp
  Dado que existem 3 atletas pendentes e 15 atletas com taxa paga
  Quando o tesoureiro clica no botão "Resumo WhatsApp"
  Então a área de transferência deve receber o texto estruturado:
    Contendo o título "NA PRANCHETA — VAQUINHA DO JOGO"
    Contendo a chave PIX do tesoureiro
    Listando os 3 atletas pendentes com o emoji ❌
    Listando os 15 atletas quitados com o emoji ✅
  E o botão deve exibir temporariamente o rótulo "Copiado p/ Zap!"
```

---

## 7. Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|---|---|---|
| Rateio restrito aos confirmados e cálculo dinâmico de totais | **Must** | Evita distorções de cobrança sobre atletas ausentes. |
| Toggle de status de pagamento (1 toque mobile) | **Must** | Operação de campo no vestiário com alta agilidade. |
| Geração e cópia do resumo para WhatsApp | **Must** | Canal principal de transparência e cobrança social no futebol amador. |
| Cópia instantânea da chave PIX | **Must** | Facilita a transferência imediata no momento do encontro. |
| Filtros por status de quitação ('todos', 'pendentes', 'pagos') | **Should** | Melhora a produtividade do tesoureiro em grupos volumosos. |

---

## 8. Rastreabilidade de Código

| Arquivo do Legado | Linhas | Símbolo / Responsabilidade | Confiança |
|---|---|---|---|
| [`src/components/TesoureiroColeta.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/TesoureiroColeta.tsx) | 1-262 | Componente `TesoureiroColeta`, métricas e resumo WhatsApp | 🟢 CONFIRMADO |
| [`src/App.tsx`](file:///home/adomoraes/projects/na-prancheta/src/App.tsx) | 112-127 | Handler `handleTogglePago` e persistência em `localStorage` | 🟢 CONFIRMADO |
| [`src/types.ts`](file:///home/adomoraes/projects/na-prancheta/src/types.ts) | 66-74 | Interface `EventoColetaDia` | 🟢 CONFIRMADO |
