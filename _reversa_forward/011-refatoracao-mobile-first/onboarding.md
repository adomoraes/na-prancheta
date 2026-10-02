# Guia de Onboarding & Validação: Refatoração 100% Mobile-First

> Feature: `011-refatoracao-mobile-first`  
> Destinado a: Desenvolvedores, QA, Designers e Comissão Técnica  

---

## 1. Pré-requisitos de Ambiente

1. Backend Laravel ativo em `http://localhost:8000`:
   ```bash
   php artisan serve
   ```
2. Frontend React 19 + Vite ativo em `http://localhost:5173`:
   ```bash
   npm start
   # ou npm run dev
   ```

---

## 2. Configuração de Emulação Mobile (Chrome / Edge / Safari DevTools)

Para simular fidedignamente o ambiente de campo de jogo:
1. Abra as Ferramentas de Desenvolvedor (`F12` ou `Ctrl + Shift + I`).
2. Ative a Barra de Dispositivos (`Ctrl + Shift + M`).
3. Selecione os seguintes perfis recomendados para testes de regressão:
   - **Dispositivo Estreito (Pior Caso):** *iPhone SE (375x667)* ou Customizado *360x800* (padrão Android de entrada).
   - **Dispositivo Padrão Atual:** *iPhone 14/15 Pro (393x852)* ou *Samsung Galaxy S20 (360x800)*.
   - **Dispositivo Grande:** *iPhone 15 Pro Max (430x932)*.
4. Mantenha o zoom em 100% e habilite a emulação de toque (cursor em formato de círculo).

---

## 3. Roteiro Passo a Passo de Validação Funcional

### Passo 1: Bottom Navigation Bar Fixa (< 768px)
1. Acesse `http://localhost:5173/` em viewport móvel (< 768px).
2. **Resultado Esperado:**
   - A barra inferior fixa aparece no rodapé com as 5 abas principais: `Vestiário`, `Presença`, `Tática`, `Caixa` e `Mais`.
   - Há espaçamento de segurança inferior (`pb-safe` / `safe-area-inset-bottom`).
   - O conteúdo central possui `padding-bottom` suficiente para não ser coberto pela barra.
   - Em viewport desktop (>= 768px), a Bottom Navigation Bar fica oculta e o menu tradicional de cabeçalho é exibido.

### Passo 2: Menu Secundário em Bottom Sheet ("Mais")
1. Toque na aba **"Mais"** na Bottom Navigation Bar.
2. **Resultado Esperado:**
   - Uma gaveta inferior deslizável (*Bottom Sheet*) sobe suavemente do rodapé com fundo semitransparente escurecido.
   - A gaveta exibe os atalhos para: *Almoxarifado & Uniformes*, *Scouts & Estatísticas*, *Administração* e *Vitrine Comercial / Investidores*.
   - Ao tocar fora da gaveta ou no botão "Fechar", ela desce suavemente com animação fluida.

### Passo 3: Prancheta Tática 4-3-3 Adaptativa
1. Toque na aba **"Tática"**.
2. Alterne a resolução do DevTools entre 360px, 375px, 390px e 430px.
3. **Resultado Esperado:**
   - O campo de futebol é exibido verticalmente de forma 100% proporcional.
   - **Zero scroll horizontal:** o campo nunca transborda as bordas da tela.
   - Todos os 11 titulares do esquema 4-3-3 e os reservas do banco estão visíveis e legíveis.
   - O toque em um atleta abre o painel inferior de substituição ou detalhes sem quebrar o layout.

### Passo 4: Alvos de Toque Ergonômicos (RN-04 - 48x48px)
1. Toque na aba **"Presença"**.
2. Inspecione os botões de ação rápida: *"Vou"*, *"Não Vou"*, *"Dúvida"* e as ações da lista de convocados.
3. **Resultado Esperado:**
   - A área física clicável de cada botão é de no mínimo $48 \times 48\text{px}$.
   - O toque tem feedback tátil/visual imediato (`active:scale-95`).
   - Não ocorrem toques acidentais em elementos vizinhos.

### Passo 5: Detecção de Teclado Virtual Móvel
1. Acesse um campo de formulário (ex: busca de atleta ou valor da vaquinha na aba Caixa).
2. Foque no campo de texto para simular a abertura do teclado.
3. **Resultado Esperado:**
   - A classe `.keyboard-open` é aplicada ao container.
   - A Bottom Navigation Bar é recolhida suavemente para fora da tela, liberando 100% da altura para o formulário e o botão de salvar.
   - Ao desfocar do campo (fechar teclado), a Bottom Navigation Bar retorna suavemente à posição original.

---

## 4. Validação Automatizada de Código

Execute no terminal da raiz do projeto:

```bash
# 1. Validação de tipagem e build do frontend
npm run build

# 2. Validação da suíte completa de testes do backend
php artisan test
```
