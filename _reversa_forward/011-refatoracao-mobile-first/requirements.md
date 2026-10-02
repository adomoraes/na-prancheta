# Requirements: Refatoração do Frontend 100% Mobile-First

> Identificador: `011-refatoracao-mobile-first`  
> Data: `2026-10-02`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta feature refatora a interface do usuário do **Na Prancheta** com foco **100% Mobile-First**, otimizando a experiência operacional de ponta a ponta para telas de smartphones (360px a 430px de largura). Ela elimina atritos de uso na beira do campo e no vestiário através de navegação inferior fixa (*Bottom Navigation Bar*), touch targets generosos (mínimo de 48px), eliminação de transbordamentos horizontais, suporte a *Safe Area Insets* (entalhes/notches e barras de navegação do iOS/Android) e conversão de modais pesados em *Bottom Sheets* deslizáveis com 1 mão só.

---

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/domain.md#2.1` | **RN-04 (Ergonomia de Resposta Mobile de 1 Toque):** Botões com altura mínima de 52px e acionamento imediato para operação ágil em smartphones. | 🟢 CONFIRMADO |
| `_reversa_sdd/domain.md#1` | **Vestiário e Protocolo T-X:** Ações rápidas sob pressão de tempo (T-70 a T-0) realizadas frequentemente com 1 mão só e sob iluminação de campo. | 🟢 CONFIRMADO |
| `_reversa_sdd/architecture.md#2.1` | **Padrão SPA Reativa:** Navegação por abas de estado local (`activeTab`) que atualmente utiliza barras superiores em desktop. | 🟢 CONFIRMADO |
| `_reversa_sdd/architecture.md#2.3` | **Design System Dark Mode:** Paleta Zinc 950 com acentos semânticos e tipografia Cabinet Grotesk / Plus Jakarta Sans. | 🟢 CONFIRMADO |
| `_reversa_sdd/user-stories/jornada-dia-de-jogo.md#1` | **Jornada do Dia de Jogo:** Atletas, técnicos e tesoureiros acessam a plataforma majoritariamente via smartphone (PWA/Chrome/Safari). | 🟢 CONFIRMADO |
| `_reversa_sdd/addenda/001-implementar-pwa.md#1` | **Suporte PWA:** Instalação standalone no dispositivo móvel, exigindo respeito a barras de status e gestos do sistema operacional. | 🟢 CONFIRMADO |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Atleta no Vestiário** | Confirmar chegada no vestiário e pagar vaquinha via PIX rapidamente com 1 mão. | Segurando a mala com uma mão, abre o app no celular, confirma presença com 1 toque e clica no botão PIX sem precisar de zoom ou rolagem complexa. |
| **Técnico / Diretor na Beira do Campo** | Escalar os 11 titulares e conferir substituições e cartões na prancheta tática. | Sob sol intenso no gramado, visualiza o campo tático na vertical, arrasta/toca nos atletas com alvos táteis nítidos e confirma escalação sem misclicks. |
| **Tesoureiro do Dia** | Dar baixa nas cotas pagas e compartilhar resumo no grupo de WhatsApp. | Sentado no banco, abre o módulo financeiro, marca atletas que pagaram em lista vertical compacta e toca em "Copiar Relatório WhatsApp" em barra de ação acessível. |
| **Almoxarife Pós-Jogo** | Fazer o checklist das malas, uniformes desvirados e travar/liberar a resenha. | Na mala do carro ou porta do vestiário, preenche a vistoria rápida com toggles grandes e visualiza o selo verde de liberação da resenha. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-04 (Ergonomia Mobile Ampliada de 1 Toque e Alcance do Polegar):** 🟢  
   - Origem no legado: `_reversa_sdd/domain.md#RN-04`  
   - Tipo: alterada.  
   - Definição: Todas as ações operacionais críticas devem estar posicionadas na *Thumb Zone* (zona de alcance natural do polegar, terço inferior da tela) com alvos de toque de no mínimo 48x48px e espaçamento adequado para evitar toques acidentais.

2. **RN-12 (Navegação Inferior Fixa com Safe Area):** 🟢  
   - Origem no legado: `_reversa_sdd/architecture.md#2.1`  
   - Tipo: nova.  
   - Definição: Em visualização móvel (< 768px), as abas operacionais do dia de jogo devem ser apresentadas em uma *Bottom Navigation Bar* fixa com suporte a `padding-bottom: env(safe-area-inset-bottom)`, mantendo o conteúdo rolável livre de sobreposição.

3. **RN-13 (Comportamento de Bottom Sheets para Detalhes e Ações Rápidas):** 🟢  
   - Origem no legado: `_reversa_sdd/domain.md#2.1`  
   - Tipo: nova.  
   - Definição: Modais centrais que exigem rolagem em celulares devem ser substituídos por gavetas inferiores (*Bottom Sheets*) com puxador (*drag handle*), permitindo fechar deslizando para baixo ou tocando no backdrop.

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| **RF-01** | Implementar *Bottom Navigation Bar* fixa no rodapé para dispositivos móveis com os módulos principais (Vestiário, Presença, Tática, Caixa, Almoxarifado/Mais). | Must | Visível apenas em viewports móveis (< 768px), com ícones, labels concisos e indicador ativo de alto contraste. | 🟢 |
| **RF-02** | Otimizar a Prancheta Tática 4-3-3 para telas estreitas (360px a 400px), garantindo renderização proporcional do campo sem scroll horizontal acidental. | Must | O gramado ocupa 100% da largura útil sem quebrar proporções, com as 11 posições visíveis e atletas tocáveis para troca de titulares. | 🟢 |
| **RF-03** | Converter modais e diálogos de ação (cadastro de atletas, detalhes de partida, confirmação de PIX) em *Bottom Sheets* deslizáveis com suporte a toque/gesto. | Must | Em mobile (< 768px), o conteúdo abre de baixo para cima com cantos arredondados no topo e fecha com gesto de deslizar para baixo ou botão de fechar. | 🟢 |
| **RF-04** | Adequar o cabeçalho (*Header*) para ocupar altura compacta em mobile, movendo seletores extensos para gaveta ou menu colapsável. | Must | O Header mobile não ultrapassa 60px de altura, exibindo o logo compacto, badge da partida atual e botão de perfil/menu. | 🟢 |
| **RF-05** | Garantir área de toque mínima (*Touch Target*) de 48x48px para todos os botões, checkboxes, toggles e chips de seleção do sistema. | Must | Nenhum elemento clicável/acionável possui área de clique inferior a 48px na menor dimensão. | 🟢 |
| **RF-06** | Adicionar suporte estrito a *Safe Area Insets* (top, bottom, left, right) no layout raiz, navegação inferior e botões flutuantes para iOS/Android. | Must | O conteúdo e barras não colidem com o entalhe (*notch*), ilha dinâmica ou barra de navegação por gestos de smartphones modernos. | 🟢 |
| **RF-07** | Otimizar tabelas e listagens operacionais (Vaquinha, Presença, Scouts, Patrimônio) para visualização em cards empilhados ou listas densas touch-friendly. | Should | Em telas móveis, tabelas com mais de 3 colunas são transformadas em cards com ações primárias em destaque, evitando scroll horizontal. | 🟡 |
| **RF-08** | Implementar feedback tátil/visual imediato (*active state* e ripple/micro-transição) em todos os botões e itens selecionáveis. | Should | Toque no botão gera alteração visual imediata de estado (< 50ms) para sensação de resposta instantânea de app nativo. | 🟡 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| **Responsividade & Viewport** | A interface deve se adaptar perfeitamente de 360px a 430px sem criar barra de rolagem horizontal no `body` (`overflow-x: hidden`). | Princípio de usabilidade mobile PWA. | 🟢 |
| **Desempenho** | Tempo de resposta para alternância entre abas na Bottom Nav inferior a 100ms sem travamentos de animação (60fps). | Garantir fluidez em aparelhos intermediários e de entrada. | 🟢 |
| **Acessibilidade Tátil** | Tamanho de alvo tátil conforme diretrizes WCAG 2.2 (Critério 2.5.8 - Target Size Minimum de 24x24px, recomendação avançada 48x48px). | `_reversa_sdd/domain.md#RN-04` e web.dev best practices. | 🟢 |
| **Ergonomia Visual** | Relação de contraste mínima de 4.5:1 para textos e 3:1 para controles de interface sobre o fundo Dark Mode Zinc 950. | Legibilidade sob luz do sol em campos abertos de futebol amador. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Navegação por Bottom Navigation Bar no smartphone
  Dado que o usuário está acessando a aplicação em um smartphone com tela de 390px de largura
  Quando o app operacional de dia de jogo é carregado
  Então uma barra de navegação inferior fixa deve ser exibida no rodapé da tela
  E a barra deve respeitar o espaçamento da barra de gestos do sistema operacional (safe-area-inset-bottom)
  E ao tocar em uma aba ("Tática", "Caixa", etc.), o conteúdo deve alternar instantaneamente sem recarregar a página

Cenário: Visualização do Campo Tático sem transbordamento horizontal
  Dado que o usuário acessa a Prancheta Tática em um dispositivo de 360px de largura
  Quando a formação 4-3-3 é exibida
  Então todo o campo de futebol e os 11 titulares devem caber dentro da largura útil da tela
  E nenhuma barra de rolagem horizontal deve ser exibida na página

Cenário: Abertura de Ações e Detalhes em Bottom Sheet
  Dado que o usuário está no celular e toca para ver o perfil de um atleta ou detalhes de cobrança
  Quando o detalhe é acionado
  Então o conteúdo deve ser aberto a partir da base da tela em formato de gaveta inferior (Bottom Sheet)
  E o usuário deve poder dispensar a gaveta tocando fora ou arrastando para baixo
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| **RF-01** (Bottom Navigation Bar) | **Must** | Espinha dorsal da ergonomia mobile; substitui a navegação desktop por padrão nativo de celular. |
| **RF-02** (Prancheta Tática responsiva 360px) | **Must** | O módulo tático é o coração do produto ("Na Prancheta") e não pode vazar a tela. |
| **RF-03** (Bottom Sheets substituindo modais) | **Must** | Modais desktop em telas pequenas causam problemas de corte e teclado virtual. |
| **RF-04** (Header compacto mobile) | **Must** | Libera espaço vertical valioso no terço superior da tela do smartphone. |
| **RF-05** (Alvos táteis 48x48px) | **Must** | Elimina toques errados na beira do campo com o celular em movimento. |
| **RF-06** (Suporte Safe Area Insets) | **Must** | Evita que botões fiquem escondidos sob a barra de gestos do iOS e Android. |
| **RF-07** (Cards empilhados no lugar de tabelas) | **Should** | Melhora expressiva de leitura de listas extensas em smartphones. |
| **RF-08** (Feedback tátil/visual imediato) | **Should** | Eleva a percepção de produto profissional e rápido tipo app nativo. |

---

## 9. Esclarecimentos

### Sessão 2026-10-02

- **Q:** Como a Prancheta Tática 4-3-3 deve se comportar em telas muito compactas (< 375px, ex: iPhone SE / 360px)?  
  **R:** Campo vertical adaptativo proporcional, mantendo os 11 titulares e banco visíveis com escala reduzida e sem necessidade de girar o aparelho para operação ágil e consistente.

- **Q:** Qual deve ser a composição dos atalhos na Bottom Navigation Bar (barra inferior fixa no celular)?  
  **R:** 5 abas fixas mais utilizadas: `Vestiário`, `Presença`, `Tática`, `Caixa` e um botão `Mais` (que abre Bottom Sheet com Almoxarifado, Scouts, Painel Admin e Vitrine Comercial).

- **Q:** Como a Bottom Navigation Bar deve se comportar quando o teclado virtual do celular abrir (ex: ao digitar nome de atleta ou valor)?  
  **R:** Ocultar automaticamente a Bottom Bar enquanto o teclado virtual estiver ativo (`keyboard-open`), liberando 100% da altura da tela para o formulário e botões de ação primários sem obstrução.

---

## 10. Lacunas

> Nenhuma lacuna pendente. Todas as dúvidas de ergonomia e layout mobile foram esclarecidas na sessão de 2026-10-02.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-02 | Versão inicial gerada por `/reversa-requirements` a partir da solicitação "refatorar o frontend com foco 100% mobile first" | reversa |
| 2026-10-02 | Esclarecimento de 3 dúvidas de ergonomia mobile (campo vertical adaptativo, 5 abas fixas + "Mais" e auto-hide da barra com teclado aberto) | reversa-clarify |
