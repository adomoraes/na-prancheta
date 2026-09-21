# Guia de Onboarding & Validação: Landing Page para Investidores

> Feature: `010-landing-page-investidores`  
> Destinado a: Desenvolvedores, QA, Product Owners e Fundadores  

---

## 1. Pré-requisitos de Ambiente

1. Backend Laravel ativo em `http://localhost:8000` (ou container Docker):
   ```bash
   php artisan migrate
   ```
2. Frontend Vite ativo em `http://localhost:5173`:
   ```bash
   npm run dev
   ```

---

## 2. Roteiro Passo a Passo de Validação

### Passo 1: Acesso Inicial & Primeira Impressão (Hero)
1. Abra o navegador e acesse a raiz `http://localhost:5173/`.
2. **Resultado Esperado:** A Landing Page comercial é carregada imediatamente como página padrão, exibindo:
   - Navbar com logotipo estilizado "Na Prancheta", badge "SportsTech SaaS", links de navegação suave e botão "Acessar Plataforma / Demo".
   - Hero Section com headline de grande impacto, estatísticas consolidadas e botões de chamada para ação.

### Passo 2: Navegação no Showcase dos 5 Pilares Culturais
1. Role a página até a seção **"O Produto: Inovação nos Bastidores"**.
2. Clique alternadamente entre as abas:
   - *Protocolo T-35 & Régua do Vestiário*
   - *Presença em 1 Toque & Fila de Espera*
   - *Prancheta Tática 4-3-3 Antiatraso*
   - *Tesoureiro & Vaquinha PIX Transparente*
   - *Almoxarifado & Trava da Resenha*
   - *Scout Pós-Jogo & Eleição de MVP*
3. **Resultado Esperado:** O mockup central e o resumo da regra de negócio atualizam com animação suave e sem recarga de tela.

### Passo 3: Simulador Dinâmico de ROI & Tese de Mercado
1. Ajuste os controles do simulador de partidas/mês e valor médio de rateio da arbitragem.
2. **Resultado Esperado:** Os valores de economia anual em dinheiro e horas de estresse do capitão recalculam em tempo real.
3. Role até a seção de mercado e confira os cards com números do TAM (+100k times, R$ 15 bi anuais) e modelo de 4 fontes de monetização.

### Passo 4: Transição Bi-direcional para a Demonstração Operacional
1. No Navbar superior ou no botão do Hero, clique em **"Acessar Plataforma / Demo"**.
2. **Resultado Esperado:** A visualização transiciona instantaneamente para a aplicação operacional do dia de jogo com dados simulados prontos para uso.
3. No topo do cabeçalho do app operacional, localize o botão **"Vitrine Comercial / Investidores"** e clique nele.
4. **Resultado Esperado:** A interface retorna perfeitamente para a Landing Page na posição inicial.

### Passo 5: Submissão de Lead de Investidor
1. Na Landing Page, clique no botão **"Solicitar Pitch Deck & Falar com Fundadores"**.
2. No modal aberto, preencha:
   - Nome: `Investidor Teste`
   - E-mail: `investidor@capital.vc`
   - WhatsApp: `(11) 98888-7777`
   - Perfil: `Fundo VC / Venture Capital`
   - Ticket Pretendido: `R$ 200k a R$ 1M`
   - Mensagem: `Interesse em receber pitch deck e conversar sobre rodada seed.`
3. Clique em **"Enviar Proposta & Abrir WhatsApp"**.
4. **Resultado Esperado:**
   - Requisição `POST /api/leads/investor` retorna status `201 Created`.
   - Uma nova aba do navegador é acionada com link `wa.me` com o texto devidamente encodado.
   - O modal exibe tela de agradecimento com confirmação de envio.

---

## 3. Validação Automatizada

Para validar a integridade dos testes de backend:
```bash
php artisan test --filter=InvestorLeadTest
```
Para validar o build do frontend React:
```bash
npm run build
```
