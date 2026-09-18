# Inventário de Lacunas e Oportunidades Técnicas (Gaps) — na-prancheta

> Nível de Documentação: **Detalhado**  
> Gerado pelo Revisor do Reversa em 2026-09-18  
> Categorização por Severidade: **Crítico** | **Moderado** | **Cosmético**

---

## 1. Visão Geral

Este documento inventaria todas as omissões arquiteturais, estados voláteis não persistidos, acoplamentos diretos e lacunas de domínio identificadas durante a auditoria reversa do código-fonte legado do **Na Prancheta**.

---

## 2. Lacunas por Severidade

### 🔴 Severidade Alta: Crítico (Bloqueadores de Escalabilidade / Risco de Perda de Dados)

| ID | Módulo | Descrição da Lacuna | Evidência no Código | Impacto |
|---|---|---|---|---|
| **GAP-C-01** | `prancheta-tatica` | **Volatilidade da Escalação Tática** | [`src/components/PranchetaTecnica.tsx:23-35`](file:///home/adomoraes/projects/na-prancheta/src/components/PranchetaTecnica.tsx#L23-L35) | A formação definida pelo treinador é mantida apenas no estado local do React (`useState`). Um recarregamento de página (F5) descarta todas as alterações táticas, restaurando a escalação hardcoded. |
| **GAP-C-02** | `tesoureiro-vaquinha` | **Chave PIX Chumbada no Componente** | [`src/components/TesoureiroColeta.tsx:41`](file:///home/adomoraes/projects/na-prancheta/src/components/TesoureiroColeta.tsx#L41) | A chave PIX (`11943210987`) está fixada diretamente no JSX. A rotação do tesoureiro do dia exige modificação no código-fonte e novo build do software. |
| **GAP-C-03** | `almoxarifado-patrimonio` | **Volatilidade do Checklist de Malas e Resenha** | [`src/components/AlmoxarifadoView.tsx:11-13`](file:///home/adomoraes/projects/na-prancheta/src/components/AlmoxarifadoView.tsx#L11-L13) | Os checkboxes de devolução de camisas, contagem de bolas e fechamento da mala são mantidos em memória volátil, reiniciando o status da resenha para "BLOQUEADA" a cada navegação. |

---

### 🟡 Severidade Média: Moderado (Comportamentos Incompletos / Regras de Domínio Faltantes)

| ID | Módulo | Descrição da Lacuna | Evidência no Código | Impacto |
|---|---|---|---|---|
| **GAP-M-01** | `confirmacao-presenca` | **Ausência de Limite de Vagas e Lista de Espera** | [`src/components/MatchCardConfirmacao.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/MatchCardConfirmacao.tsx) | Não há teto configurável de atletas para a partida; qualquer número de jogadores pode confirmar presença simultaneamente sem criar fila de espera. |
| **GAP-M-02** | `prancheta-tatica` | **Posicionamento em Campo por Slice Posicional** | [`src/components/PranchetaTecnica.tsx:128,147,166,185`](file:///home/adomoraes/projects/na-prancheta/src/components/PranchetaTecnica.tsx#L128) | O posicionamento visual dos titulares no gramado baseia-se em cortes fixos de índice (`slice(0,1)`, `slice(1,5)`, etc.), desconsiderando a posição principal do jogador ao fazer substituições. |
| **GAP-M-03** | `tesoureiro-vaquinha` | **Custo Fixo de Arbitragem Sem Parametrização** | [`src/components/TesoureiroColeta.tsx:38`](file:///home/adomoraes/projects/na-prancheta/src/components/TesoureiroColeta.tsx#L38) | O valor de R$ 300,00 da arbitragem é uma constante hardcoded, não permitindo valores diferenciados para amistosos, torneios com árbitro único ou partidas com taxa diferenciada. |
| **GAP-M-04** | `scout-pos-jogo` | **Falta de Desativação Mútua na Eleição de MVP** | [`src/components/ScoutPosJogo.tsx:50-54`](file:///home/adomoraes/projects/na-prancheta/src/components/ScoutPosJogo.tsx#L50-L54) | A função de alternância não zera o booleano `foi_mvp` de outros atletas, permitindo inconsistência de múltiplos MVPs eleitos na mesma rodada. |
| **GAP-M-05** | `almoxarifado-patrimonio` | **Custodiante de Malas Não Parametrizado** | [`src/components/AlmoxarifadoView.tsx:37`](file:///home/adomoraes/projects/na-prancheta/src/components/AlmoxarifadoView.tsx#L37) | O nome "Carlos Eduardo (Kadu)" está fixado no template estático do componente sem vínculo com o registro do evento. |
| **GAP-M-06** | `onboarding-elenco` | **Permissão de Camisas Duplicadas no Elenco** | [`src/components/SelfOnboardingModal.tsx:141-154`](file:///home/adomoraes/projects/na-prancheta/src/components/SelfOnboardingModal.tsx#L141-L154) | O formulário de cadastro não valida se outro atleta já utiliza o mesmo número de camisa preferido. |

---

### 🟢 Severidade Baixa: Cosmético / Polimento (Experiência do Usuário e Refinamento)

| ID | Módulo | Descrição da Lacuna | Evidência no Código | Impacto |
|---|---|---|---|---|
| **GAP-L-01** | `scout-pos-jogo` | **Campos de Súmula sem Interface Visual** | [`src/types.ts:83,85`](file:///home/adomoraes/projects/na-prancheta/src/types.ts#L83) | Os atributos `cartao_vermelho` e `gols_sofridos` existem na tipagem de domínio, mas não possuem botões de incremento no formulário de scout. |
| **GAP-L-02** | `onboarding-elenco` | **Ausência de Máscara de Telefone Celular** | [`src/components/SelfOnboardingModal.tsx:131-137`](file:///home/adomoraes/projects/na-prancheta/src/components/SelfOnboardingModal.tsx#L131-L137) | O campo aceita qualquer sequência alfanumérica sem forçar a máscara padrão de WhatsApp com DDD. |
| **GAP-L-03** | `prancheta-tatica` | **Alerta Nativo Síncrono (`window.alert`)** | [`src/components/PranchetaTecnica.tsx:42,52`](file:///home/adomoraes/projects/na-prancheta/src/components/PranchetaTecnica.tsx#L42) | O uso de `window.alert` bloqueia a thread de renderização do navegador e destoa da identidade visual moderna da aplicação. |

---

## 3. Matriz de Priorização Recomendada

```mermaid
quadrantChart
    title Priorização de Resolução de Lacunas
    x-axis Baixo Esforço --> Alto Esforço
    y-axis Baixo Impacto --> Alto Impacto
    quadrant-1 Prioridade Imediata (Quick Wins)
    quadrant-2 Planejamento Estrutural
    quadrant-3 Melhorias Futuras
    quadrant-4 Débito Técnico
    "Chave PIX Dinâmica": [0.25, 0.85]
    "Persistência Checklist Malas": [0.30, 0.80]
    "Persistência Escalação Tática": [0.35, 0.90]
    "Exclusividade de MVP": [0.20, 0.70]
    "Validação Camisa Única": [0.25, 0.65]
    "Máscara WhatsApp": [0.15, 0.30]
    "Campos Vermelho/Gols Sofridos": [0.20, 0.40]
    "Posicionamento Tático Inteligente": [0.75, 0.75]
    "Lista de Espera Configurável": [0.70, 0.70]
```
