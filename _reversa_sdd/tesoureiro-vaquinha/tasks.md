# Tarefas de Implementação: Painel do Tesoureiro e Vaquinha do Jogo

> Nível de Documentação: **Detalhado**  
> Unit: `tesoureiro-vaquinha`  
> Componente Base: [`src/components/TesoureiroColeta.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/TesoureiroColeta.tsx)

---

## 1. Pré-requisitos

- [ ] Interfaces `Evento`, `EventoColetaDia`, `EventoPresenca` e `Atleta` definidas em `src/types.ts`.
- [ ] Estado `coletas` e handler `handleTogglePago` implementados no componente raiz `src/App.tsx`.

---

## 2. Tarefas de Implementação

- [ ] **T-TV-01: Renderizar Header do Tesoureiro e Ações de Cópia**
  - **Origem no Legado**: `src/components/TesoureiroColeta.tsx:83-116`
  - **Critério de Pronto**: Exibir cabeçalho com ícone de moeda, título e subtítulo informativo, acompanhado dos botões "Copiar Chave PIX" e "Resumo WhatsApp", com feedback visual de 2 segundos após o acionamento.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-TV-02: Implementar Métricas Financeiras e Barra de Arbitragem**
  - **Origem no Legado**: `src/components/TesoureiroColeta.tsx:22-40, 118-158`
  - **Critério de Pronto**: Isolar confirmados, calcular total esperado, total arrecadado, pendente e exibir barra de progresso proporcional à meta de R$ 300,00 de arbitragem.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-TV-03: Implementar Filtros Rápidos com Contadores**
  - **Origem no Legado**: `src/components/TesoureiroColeta.tsx:160-192`
  - **Critério de Pronto**: Renderizar seletores para "Todos", "Pendentes" e "Pagos" exibindo as respectivas quantidades numéricas entre parênteses e alternando a listagem renderizada.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-TV-04: Renderizar Grade de Cobrança com Botão Tátil Ergonômico**
  - **Origem no Legado**: `src/components/TesoureiroColeta.tsx:194-258`
  - **Critério de Pronto**: Renderizar cada atleta com camisa, nome/apelido, valor individual e botão tátil com altura mínima de 44px (`min-h-[44px]`) alternando entre "Cobrar" (âmbar) e "Pago" (verde).
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-TV-05: Implementar Compilação e Cópia do Resumo WhatsApp**
  - **Origem no Legado**: `src/components/TesoureiroColeta.tsx:49-73`
  - **Critério de Pronto**: Montar texto com título, dados de taxa, arrecadação, chave PIX e listas separadas de atletas pendentes (❌) e pagos (✅), copiando para a área de transferência via `navigator.clipboard`.
  - **Confiança**: 🟢 CONFIRMADO

---

## 3. Tarefas de Teste Automatizado

- [ ] **TT-TV-01: Teste de Exclusão de Atletas Ausentes do Rateio**
  - **Cenário**: Garantir que atletas com `status === 'duvida'` ou `'recusado'` não sejam incluídos na contagem de cobrança nem nos totais esperados.
- [ ] **TT-TV-02: Teste de Alternância de Pagamento e Timestamp**
  - **Cenário**: Acionar `onTogglePago` para um atleta pendente e validar se `pago` torna-se `true` com `pago_em` preenchido, incrementando a arrecadação e decrementando o total pendente.
- [ ] **TT-TV-03: Teste de Cópia da Chave PIX**
  - **Cenário**: Interceptar chamada a `navigator.clipboard.writeText` ao clicar no botão de PIX e confirmar a gravação da chave configurada.
- [ ] **TT-TV-04: Teste de Estruturação do Texto para WhatsApp**
  - **Cenário**: Validar se o resumo gerado contém as seções de pendentes e pagos com a formatação correta de emojis.

---

## 4. Ordem Sugerida

1. **T-TV-02**: Lógica de consolidação de métricas financeiras.
2. **T-TV-04**: Grade de cobrança com botão tátil de quitação.
3. **T-TV-03**: Filtros de visualização ('todos', 'pendentes', 'pagos').
4. **T-TV-01**: Header e feedback de clipboard.
5. **T-TV-05**: Formatador de mensagem para WhatsApp.

---

## 5. Lacunas Pendentes (🔴)

- 🔴 **Desacoplamento da Chave PIX**: Migrar a chave PIX de valor estático no componente para campo dinâmico na entidade `Evento` ou perfil do usuário.
- 🔴 **Custo de Arbitragem Configurável**: Permitir configurar a meta de arbitragem no cadastro do evento, superando o valor fixado em R$ 300,00.
