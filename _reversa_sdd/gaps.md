# Inventário de Lacunas e Oportunidades Técnicas (Gaps) — na-prancheta

> Nível de Documentação: **Detalhado**  
> Gerado pelo Revisor do Reversa em 2026-09-18  
> Status pós-revisão humana: 🟢 **TODAS AS LACUNAS CRÍTICAS RESOLVIDAS / DIRECIONADAS**

---

## 1. Visão Geral

Este documento consolida o inventário de lacunas e decisões de arquitetura após a validação humana formal em [`_reversa_sdd/questions.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/questions.md). Todas as pendências que bloqueavam entendimento de negócio foram resolvidas com o usuário Ado.

---

## 2. Status das Lacunas após Validação Humana

### 🟢 Resolvidas como Decisão Arquitetural de Migração para Backend Real

| ID Original | Módulo | Descrição | Resolução Validada com Usuário | Destino |
|---|---|---|---|:---:|
| **GAP-C-01** | `prancheta-tatica` | Volatilidade da Escalação Tática | A persistência definitiva da escalação tática será implementada na camada de backend durante a migração do sistema. | [`_reversa_migrate`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd) |
| **GAP-C-02** | `tesoureiro-vaquinha` | Chave PIX Chumbada no Componente | A parametrização dinâmica de chaves PIX e rotação de tesoureiro será provida por endpoint de backend com banco de dados. | [`_reversa_migrate`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd) |
| **GAP-C-03** | `almoxarifado-patrimonio` | Volatilidade do Checklist de Malas | A auditoria de fechamento de malas e liberação da resenha será persistida no banco de dados via backend. | [`_reversa_migrate`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd) |

---

### 🟢 Resolvidas como Regras de Domínio Confirmadas (Prontas para Forward)

| ID Original | Módulo | Descrição | Regra Formalizada pós-validação | Destino |
|---|---|---|---|:---:|
| **GAP-M-01** | `confirmacao-presenca` | Teto de Vagas e Lista de Espera | **RN-CP-05**: Implementar teto de confirmados na partida com transbordamento automático para `status: 'lista_espera'`. | `_reversa_forward` |
| **GAP-M-04** | `scout-pos-jogo` | Exclusividade Estrita de MVP | **RN-SPJ-04**: Eleição de MVP estritamente única. `toggleMvp()` desmarca concorrentes automaticamente. | `_reversa_forward` |
| **GAP-M-06** | `onboarding-elenco` | Validação de Camisa Única | **RN-OE-05**: Numeração de camisa é exclusiva por atleta no elenco ativo; duplicidades devem ser rejeitadas no formulário. | `_reversa_forward` |

---

### 🟡 Débitos Técnicos e Oportunidades de Refinamento (Severidade Baixa)

| ID | Módulo | Descrição | Evidência no Código | Sugestão de Melhoria |
|---|---|---|---|---|
| **GAP-L-01** | `scout-pos-jogo` | Campos de Súmula sem Interface | `src/types.ts:83,85` | Adicionar seletores para cartão vermelho e gols sofridos para goleiros. |
| **GAP-L-02** | `onboarding-elenco` | Máscara de Telefone WhatsApp | `src/components/SelfOnboardingModal.tsx:131-137` | Aplicar máscara `(XX) XXXXX-XXXX` no input telefônico. |
| **GAP-L-03** | `prancheta-tatica` | Notificações Nativas (`window.alert`) | `src/components/PranchetaTecnica.tsx:42,52` | Substituir `alert()` por componentes visuais de Toast/Modal. |
| **GAP-M-02** | `prancheta-tatica` | Posicionamento Tático por Slice | `src/components/PranchetaTecnica.tsx:128` | Mapear nós do campo dinamicamente conforme `posicao_principal`. |
| **GAP-M-03** | `tesoureiro-vaquinha` | Custo Fixo de Arbitragem | `src/components/TesoureiroColeta.tsx:38` | Parametrizar a meta de arbitragem na entidade `Evento`. |

---

## 3. Matriz de Priorização Atualizada

```mermaid
quadrantChart
    title Priorização Pós-Validação Humana
    x-axis Baixo Esforço --> Alto Esforço
    y-axis Baixo Impacto --> Alto Impacto
    quadrant-1 Quick Wins (Implementar no Forward)
    quadrant-2 Arquitetura de Migração (Backend Real)
    quadrant-3 Melhorias Cosméticas
    quadrant-4 Débito Técnico Moderado
    "Exclusividade de MVP (RN-SPJ-04)": [0.20, 0.85]
    "Camisa Única no Elenco (RN-OE-05)": [0.25, 0.80]
    "Lista de Espera (RN-CP-05)": [0.35, 0.85]
    "Backend: Persistência Tática": [0.80, 0.95]
    "Backend: Chave PIX Dinâmica": [0.70, 0.90]
    "Backend: Checklist Malas": [0.75, 0.90]
    "Máscara Telefone": [0.15, 0.35]
    "Substituir window.alert": [0.20, 0.40]
```
