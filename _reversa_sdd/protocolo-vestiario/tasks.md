# Tarefas de Implementação: Protocolo de Vestiário

> Nível de Documentação: **Detalhado**  
> Unit: `protocolo-vestiario`  
> Componente Base: [`src/components/VestiarioTimeline.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/VestiarioTimeline.tsx)

---

## 1. Pré-requisitos

- [ ] Definição da interface `Evento` com os campos `data_hora`, `horario_vestiario_t50`, `horario_prelecao_t35` e `horario_aquecimento_t25` em `src/types.ts`.
- [ ] Configuração do Tailwind CSS v4 e Lucide React para renderização de ícones e cores semânticas.

---

## 2. Tarefas de Implementação

- [ ] **T-PV-01: Implementar o Cronômetro Regressivo e Derivação de Badges**
  - **Origem no Legado**: `src/components/VestiarioTimeline.tsx:10-35`
  - **Critério de Pronto**: Estado de contagem regressiva decrementado periodicamente, derivando rótulo textual e classes de cor semântica para $T-50$ (Âmbar), $T-35$ (Vermelho pulsante) e $T-25$ (Verde pulsante).
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-PV-02: Implementar o Banner da Regra Fundamental do Atraso (T-35)**
  - **Origem no Legado**: `src/components/VestiarioTimeline.tsx:70-81`
  - **Critério de Pronto**: Banner de alerta de alta visibilidade comunicando que atletas que chegarem após $T-35$ min iniciam compulsoriamente no banco de reservas.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-PV-03: Renderizar a Linha do Tempo dos 4 Marcos Principais**
  - **Origem no Legado**: `src/components/VestiarioTimeline.tsx:84-168`
  - **Critério de Pronto**: Grid responsivo exibindo os blocos de $T-1h10$ (Comissão), $T-50$ (Chegada Obrigatória), $T-35$ (Preleção & Escalação) e $T-25$ (Aquecimento Fisiológico) com badges e descrições.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-PV-04: Implementar o Guia da Sequência Fisiológica de Aquecimento**
  - **Origem no Legado**: `src/components/VestiarioTimeline.tsx:171-200`
  - **Critério de Pronto**: Exibir os 4 cards de aquecimento neuromuscular: Ativação (5-8 min), Mobilidade (5 min), Dinâmica (8 min) e Técnica (8 min).
  - **Confiança**: 🟢 CONFIRMADO

---

## 3. Tarefas de Teste Automatizado

- [ ] **TT-PV-01: Teste de Transição dos Marcos Temporais**
  - **Cenário**: Validar que quando o tempo atinge 35 minutos ou menos, o badge comuta para `bg-red-600 animate-pulse` com o texto `'T-35: Preleção & Escalação'`.
- [ ] **TT-PV-02: Teste de Limpeza de Intervalo (Memory Leak Prevention)**
  - **Cenário**: Validar que ao desmontar o componente `VestiarioTimeline`, a função `clearInterval` é disparada impedindo vazamento de timers.

---

## 4. Ordem Sugerida

1. **T-PV-01**: Estrutura base de estado e contagem regressiva.
2. **T-PV-02**: Banner normativo da Regra do Atraso.
3. **T-PV-03**: Grid responsivo com os marcos $T-70$, $T-50$, $T-35$, $T-25$.
4. **T-PV-04**: Cards da sequência fisiológica de campo.

---

## 5. Lacunas Pendentes (🔴)

- 🔴 **Cálculo com Relógio Real**: Substituir o estado simulado em memória por cálculo dinâmico baseado na diferença entre a hora atual do dispositivo (`Date.now()`) e o horário oficial do apito inicial (`evento.data_hora`).
