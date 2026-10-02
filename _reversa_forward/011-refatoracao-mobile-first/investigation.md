# Investigação Técnica & Benchmark: Refatoração 100% Mobile-First

> Identificador: `011-refatoracao-mobile-first`  
> Data: `2026-10-02`  
> Confidência: 🟢 CONFIRMADO  

---

## 1. Motivação & Contexto Operacional

O Na Prancheta é, por definição e essência, uma ferramenta utilizada **à beira do gramado ou da quadra sintética**:
- **Ambiente adverso de uso:** Iluminação solar intensa direta, atletas e comissão técnica em movimento contínuo, dedos suados, mãos ocupadas com prancheta física, garrafa de água ou bolas, e uso quase exclusivo com **apenas uma das mãos (operações com o polegar)**.
- **Conectividade móvel intermitente:** Redes 3G/4G instáveis em campos de várzea e arenas afastadas exigem que a interface responda instantaneamente com o mínimo de atrito visual e sem dependência de recargas de tela pesadas.
- **Diagnóstico da interface anterior:** Embora o sistema funcionasse responsivamente através de breakpoints padrões do Tailwind CSS, diversos fluxos herdavam paradigmas tipicamente desktop:
  1. *Tabs e navegação no topo (Header):* Forçavam o usuário a esticar o polegar até o topo da tela do smartphone (+15cm de distância), gerando risco de queda do aparelho e lentidão operacional.
  2. *Prancheta Tática 4-3-3 com tendência horizontal:* Exigia scroll lateral ou reduzia drasticamente a escala dos botões de jogadores em telas estreitas (< 375px).
  3. *Modais flutuantes centralizados:* Em aparelhos compridos (proporções 19.5:9 ou 20:9), abriam centralizados com botões de fechar no canto superior direito fora do alcance do polegar.
  4. *Alvos de toque compactos:* Alguns botões de ação e chips operavam com dimensões inferiores a 40px, gerando toques acidentais sob pressão de tempo (ex: conferência da lista a 35 minutos do início).

---

## 2. Benchmark de UX: Thumb Zone & Padrões Nacionais

### 2.1 A Regra da "Thumb Zone" (Área do Polegar de Steven Hoober)
Em dispositivos modernos (telas de 6.1" a 6.7"), mais de 75% das interações ocorrem com o polegar da mão dominante. A interface foi redesenhada dividindo o espaço em três faixas de prioridade:
1. **Zona Natural (Terço Inferior):** Bottom Navigation Bar fixa, botões primários de confirmação ("Vou", "Não Vou"), ação de baixa de PIX e acionamento de Bottom Sheets.
2. **Zona de Alcance Fácil (Terço Médio):** Campo tático 4-3-3, listagem de atletas, status da vaquinha e cards de partida.
3. **Zona Difícil / Ocasional (Terço Superior):** Identificação do clube, troca de partida, status da bateria/sincronização e perfil do usuário.

### 2.2 Padrões Nativos vs Web Mobile
Comparativo com aplicações líderes de alta performance operacional (ex: WhatsApp, Nubank, Strava):
- **Navegação inferior fixa (Bottom Nav):** 4 a 5 destinos máximos, ícone + legenda curta, sem scroll horizontal na própria barra.
- **Gaveta inferior (Bottom Sheet):** Desliza de baixo para cima, mantém o contexto visual de fundo escurecido (*backdrop blur*), possui alça de arraste (*drag handle*) e fecha com toque fora ou swipe para baixo.
- **Safe Area Inset:** Respeito rigoroso aos entalhes (Dynamic Island / Notches) e à barra de navegação por gestos do iOS e Android (`env(safe-area-inset-bottom)`).

---

## 3. Desafios Técnicos & Soluções Arquiteturais

### 3.1 Prancheta Tática Vertical Adaptativa (360px a 430px)
- **Problema:** O campo tático tradicional em formato paisagem obriga o técnico a girar o celular (exigindo duas mãos) ou reduz os círculos dos atletas a pontos microscópicos ilegíveis.
- **Solução Adotada (D-04):** Campo em perspectiva vertical (gol-a-gol de baixo para cima) com SVG e coordenadas percentuais fixas (`top: X%`, `left: Y%`). Os 11 titulares e a área de reservas cabem confortavelmente em uma única tela vertical de 360px a 430px de largura sem scroll horizontal, garantindo leitura instantânea do nome e número do atleta.

### 3.2 Comportamento da Bottom Bar sob Teclado Virtual Móvel
- **Problema:** Em navegadores móveis (Safari iOS e Chrome Android), a abertura do teclado virtual altera a altura do viewport visual. Se a barra inferior permanecer em `fixed bottom: 0`, ela é empurrada para cima do teclado, cobrindo o campo de digitação ou o botão de confirmação.
- **Solução Adotada (D-03):** Listener de `visualViewport.height` e detecção de foco em elementos de formulário (`input`, `textarea`, `select`), aplicando a classe `.keyboard-open` no container raiz para ocultar suavemente a Bottom Navigation Bar com `translate-y-full opacity-0 pointer-events-none`.

### 3.3 Touch Targets Rigorosos (RN-04)
- **Diretriz:** Alvos de toque interativos com dimensão mínima física de $48 \times 48\text{px}$, espaçamento mínimo de $8\text{px}$ entre alvos adjacentes, e feedback visual imediato (`active:scale-95 transition-transform`).

---

## 4. Conclusão & Próximos Passos

A investigação confirma a viabilidade total da refatoração sem dependências externas adicionais, mantendo o bundle leve e ágil em React 19 + Tailwind CSS. A decomposição para tarefas atômicas no `actions.md` deve seguir as prioridades mapeadas no roadmap.
