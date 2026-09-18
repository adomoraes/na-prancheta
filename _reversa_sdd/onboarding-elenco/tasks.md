# Tarefas de Implementação: Self-Onboarding do Atleta

> Nível de Documentação: **Detalhado**  
> Unit: `onboarding-elenco`  
> Componente Base: [`src/components/SelfOnboardingModal.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/SelfOnboardingModal.tsx)

---

## 1. Pré-requisitos

- [ ] Interfaces `Atleta`, `TipoVinculo`, `NivelAcesso`, `EventoPresenca` e `EventoColetaDia` disponíveis em `src/types.ts`.
- [ ] Estado `isOnboardingOpen` e handlers `handleAddAtleta` implementados em `src/App.tsx`.

---

## 2. Tarefas de Implementação

- [ ] **T-OE-01: Renderizar Modal com Animação e Backdrop Blur**
  - **Origem no Legado**: `src/components/SelfOnboardingModal.tsx:69-92`
  - **Critério de Pronto**: Renderizar container modal fixo sobre a tela com backdrop blur escurecido, ícone `UserPlus`, título institucional, subtítulo e botão de fechamento rápido (`X`).
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-OE-02: Implementar Campos Cadastrais e Validação de Nome**
  - **Origem no Legado**: `src/components/SelfOnboardingModal.tsx:94-154`
  - **Critério de Pronto**: Inputs com estilos adaptados para Nome Completo (obrigatório com alerta em branco), Apelido de Vestiário, WhatsApp e Número de Camisa preferido (1 a 99).
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-OE-03: Implementar Seletores de Posições e Tamanhos de Fardamento**
  - **Origem no Legado**: `src/components/SelfOnboardingModal.tsx:156-239`
  - **Critério de Pronto**: Selects nativos para posições principal e secundária, acompanhados de grids táteis para escolha de tamanho de camisa e calção (P, M, G, GG).
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-OE-04: Implementar Seleção de Tipo de Vínculo**
  - **Origem no Legado**: `src/components/SelfOnboardingModal.tsx:241-270`
  - **Critério de Pronto**: Botoeira de seleção exclusiva entre "Mensalista Oficial" (esmeralda) e "Convidado da Rodada" (roxo).
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-OE-05: Implementar Submissão e Efeito Cascata**
  - **Origem no Legado**: `src/components/SelfOnboardingModal.tsx:40-67`, `src/App.tsx:94-110`
  - **Critério de Pronto**: Montar objeto `Atleta`, invocar `onAddAtleta` e garantir que o componente raiz adicione o atleta, crie a presença confirmada, crie a cobrança da vaquinha e feche o modal.
  - **Confiança**: 🟢 CONFIRMADO

---

## 3. Tarefas de Teste Automatizado

- [ ] **TT-OE-01: Teste de Bloqueio com Nome em Branco**
  - **Cenário**: Tentar submeter o formulário sem preencher o nome e validar que `window.alert` é disparado e o callback de salvamento não é chamado.
- [ ] **TT-OE-02: Teste de Montagem do Objeto Atleta**
  - **Cenário**: Preencher os dados completos do formulário e verificar se o objeto emitido possui ID temporal `atl-*`, `ativo: true` e `chegou_em: 'T-50 min (No Horário)'`.
- [ ] **TT-OE-03: Teste de Disparo em Cascata no Estado Central**
  - **Cenário**: Validar se a adição do atleta insere concomitantemente um registro em `presencas` e em `coletas` no `localStorage`.

---

## 4. Ordem Sugerida

1. **T-OE-02**: Estrutura dos inputs básicos e validação síncrona.
2. **T-OE-03**: Seletores de posições e botões de tamanho de uniforme.
3. **T-OE-04**: Botoeira de tipo de vínculo.
4. **T-OE-01**: Estrutura modal e backdrop.
5. **T-OE-05**: Submissão e propagação em cascata.

---

## 5. Lacunas Pendentes (🔴)

- 🔴 **Validação de Camisa Única**: Impedir que dois atletas compartilhem o mesmo número de camisa no elenco ativo.
- 🔴 **Máscara de Telefone**: Implementar formatação automática `(XX) XXXXX-XXXX` para o WhatsApp do atleta.
