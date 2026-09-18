# Requisitos da Feature: Self-Onboarding do Atleta

> Nível de Documentação: **Detalhado**  
> Unit: `onboarding-elenco`  
> Status: 🟢 CONFIRMADO

---

## 1. Visão Geral

A feature **Self-Onboarding do Atleta** permite a integração cadastral expressa de novos jogadores ao elenco (atletas mensalistas ou convidados de última hora da rodada). Através de um formulário modal otimizado para dispositivos móveis, o jogador informa seus dados pessoais, apelido de vestiário, contato WhatsApp, camisa preferida, posições táticas (primária e secundária), tamanhos de fardamento (camisa e calção) e modalidade de vínculo. A conclusão do cadastro aciona um efeito cascata que insere o atleta no elenco ativo, confirma automaticamente sua presença no jogo e gera seu registro de débito na vaquinha do dia.

---

## 2. Responsabilidades

- Apresentar formulário modal com backdrop blur e fechamento seguro por botão ou cancelamento.
- Coletar informações cadastrais essenciais e preferências esportivas do atleta.
- Validar obrigatoriedade do nome completo antes do envio.
- Gerar identificador único (`atl-${Date.now()}`) e carimbo de criação em formato ISO.
- Configurar status padrão de pontualidade no vestiário (`chegou_vestiario: true` e `chegou_em: 'T-50 min (No Horário)'`).
- Propagar o novo atleta para o estado central, disparando a criação simultânea de registros em `EventoPresenca` e `EventoColetaDia`.

---

## 3. Regras de Negócio

- **RN-OE-01 (Validação Mandatória de Nome)** 🟢 CONFIRMADO: O campo de nome completo é obrigatório. O envio de formulário com nome em branco ou composto apenas por espaços é bloqueado com alerta (`src/components/SelfOnboardingModal.tsx:42-45`).
- **RN-OE-02 (Definição de Vínculo Institucional)** 🟢 CONFIRMADO: O atleta deve ser categorizado como `'mensalista'` (membro fixo da equipe) ou `'convidado'` (participante avulso da partida) (`src/components/SelfOnboardingModal.tsx:24, 247-270`).
- **RN-OE-03 (Posições Táticas e Uniformes)** 🟢 CONFIRMADO: O atleta escolhe sua posição primária entre 9 opções do campo de futebol e pode optar por uma posição secundária. Os tamanhos de camisa e calção são selecionados entre P, M, G e GG com padrão 'G' (`src/components/SelfOnboardingModal.tsx:19-23, 28-38, 200-238`).
- **RN-OE-04 (Integração em Cascata no Dia do Jogo)** 🟢 CONFIRMADO: Ao salvar o atleta, o sistema gera automaticamente:
  1. Cadastro do atleta no elenco em `naprancheta_atletas`.
  2. Presença confirmada (`status: 'confirmado'`) em `naprancheta_presencas`.
  3. Cobrança pendente (`pago: false`) no rateio do tesoureiro em `naprancheta_coletas`.
  4. Marcação de pontualidade em `chegou_em: 'T-50 min (No Horário)'`, habilitando-o para escalação tática (`src/App.tsx:94-110`, `src/components/SelfOnboardingModal.tsx:61-63`).

---

## 4. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| **RF-OE-01** | Formulário modal de cadastro rápido | Must | Exibir modal com campos de nome, apelido, WhatsApp, camisa preferida, posições e grade de tamanhos. |
| **RF-OE-02** | Seleção de tamanhos de fardamento (P, M, G, GG) | Must | Botões de toque para seleção rápida de tamanho de camisa e calção, com destaque visual esmeralda na opção ativa. |
| **RF-OE-03** | Alternador de vínculo (Mensalista vs. Convidado) | Must | Botões de seleção exclusiva com estilização cromática distintiva (verde para mensalista, roxo para convidado). |
| **RF-OE-04** | Propagação automática de presença e vaquinha | Must | Ao concluir o cadastro, o jogador deve constar imediatamente na lista de confirmados, no rateio do tesoureiro e apto para a prancheta. |

---

## 5. Requisitos Não Funcionais

| Tipo | Requisito Inferido | Evidência no Código | Confiança |
|---|---|---|---|
| **Ergonomia Mobile** | Botão de conclusão com altura mínima de 48px (`min-h-[48px]`) | `src/components/SelfOnboardingModal.tsx:276` | 🟢 |
| **Experiência de Uso (UX)** | Animação de entrada suave (`animate-in fade-in`) e backdrop escurecido com blur | `src/components/SelfOnboardingModal.tsx:70` (`bg-black/80 backdrop-blur-sm`) | 🟢 |
| **Responsividade de Tela** | Formulário rolável verticalmente com teto de 90% da viewport (`max-h-[90vh] overflow-y-auto`) | `src/components/SelfOnboardingModal.tsx:71, 94` | 🟢 |

---

## 6. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: Cadastro com sucesso de atleta convidado
  Dado que o modal de Self-Onboarding está aberto
  Quando o usuário preenche o nome "Marcelo Rezende"
  E seleciona o vínculo "Convidado da Rodada"
  E seleciona a posição "Zagueiro"
  E clica no botão "Concluir Cadastro no Elenco"
  Então um novo atleta com ID prefixado por "atl-" deve ser gerado
  E uma nova presença confirmada deve ser criada para o jogo atual
  E uma nova coleta de vaquinha pendente no valor da taxa deve ser atribuída ao atleta
  E o modal deve ser fechado

Cenário: Tentativa de cadastro com nome vazio
  Dado que o modal de Self-Onboarding está aberto
  Quando o usuário submete o formulário com o campo de nome em branco
  Então deve ser exibido o alerta "Informe ao menos o nome do atleta."
  E nenhum registro deve ser gravado
```

---

## 7. Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|---|---|---|
| Formulário de entrada com campos essenciais de futebol amador | **Must** | Permite acolher reforços e convidados diretamente no vestiário. |
| Integração em cascata (presença automática e vaquinha) | **Must** | Elimina retrabalho manual para o treinador e para o tesoureiro. |
| Seleção de tamanhos de uniformes | **Should** | Facilita a distribuição dos kits de fardamento pelo almoxarifado. |
| Atribuição de pontualidade padrão (T-50 min) | **Should** | Garante elegibilidade tática imediata para recém-cadastrados. |

---

## 8. Rastreabilidade de Código

| Arquivo do Legado | Linhas | Símbolo / Responsabilidade | Confiança |
|---|---|---|---|
| [`src/components/SelfOnboardingModal.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/SelfOnboardingModal.tsx) | 1-287 | Componente `SelfOnboardingModal` e validação do formulário | 🟢 CONFIRMADO |
| [`src/App.tsx`](file:///home/adomoraes/projects/na-prancheta/src/App.tsx) | 94-110 | Handler `handleAddAtleta` e criação em cascata de presença/coleta | 🟢 CONFIRMADO |
| [`src/types.ts`](file:///home/adomoraes/projects/na-prancheta/src/types.ts) | 1-24 | Interfaces `Atleta`, `TipoVinculo`, `NivelAcesso` | 🟢 CONFIRMADO |
