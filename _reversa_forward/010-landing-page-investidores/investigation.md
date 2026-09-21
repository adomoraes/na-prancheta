# Investigação Técnica & Benchmark: Landing Page para Investidores

> Identificador: `010-landing-page-investidores`  
> Data: `2026-09-21`  
> Confidência: 🟢 CONFIRMADO  

---

## 1. Motivação & Contexto de Mercado

O mercado de **SportsTechs amadoras** na América Latina possui um paradoxo gritante:
- **Tamanho colossal e informal:** Mais de **100 mil times amadores organizados** no Brasil, movimentando cerca de **R$ 15 bilhões por ano** em locação de quadras sintéticas/campos, taxas de arbitragem, jogos de uniforme, lavanderias e a consagrada "resenha do pós-jogo" (consumo de churrasco e bebidas).
- **Caos operacional nos bastidores:** Quase 100% da gestão do dia de jogo ainda é feita por mensagens truncadas no WhatsApp, listas de presença confusas que nunca fecham no número certo, notas rasuradas em cadernetas e calotes no rateio da taxa de arbitragem.
- **Limitação dos softwares existentes:** Plataformas como CopaFácil, SportEasy ou gerenciadores genéricos de tabelas focam puramente no torneio/campeonato (tabela de pontos e chaveamento). **Nenhuma delas governa a dor do vestiário e do dia de jogo** — que é onde a fidelidade do atleta e o dinheiro semanal realmente circulam.

---

## 2. Diferenciais Competitivos (O "Moat" Cultural do Na Prancheta)

O Na Prancheta introduz convenções e travas operacionais com altíssima aderência cultural à realidade brasileira:

1. **Protocolo Disciplinar T-35:** A regra de que atrasados na preleção vão obrigatoriamente para a reserva encerra disputas políticas e discussões entre comissão técnica e jogadores.
2. **Presença em 1 Toque com Teto Regulamentar:** Resolução ágil de convocações com transbordamento automático para a Lista de Espera a partir do 15º atleta.
3. **Prancheta Tática 4-3-3:** Alinhamento visual posicional que bloqueia atletas cortados por atraso.
4. **Vaquinha PIX de Arbitragem com Cópia para WhatsApp:** Rateio transparente de R$ 300,00 apenas entre os confirmados, com geração de boletim instantâneo e crédito automático de saldo excedente no Caixa do Clube.
5. **Almoxarifado & "Trava da Resenha":** A proibição programática da confraternização social até a tríplice conferência de fardamento desvirado, bolas recolhidas e mala trancada.

---

## 3. Análise de Arquitetura de Apresentação (Single Page vs Roteamento)

### Alternativas Avaliadas:

1. **Abordagem A: Site estático separado (ex: Astro/Next.js hospedado em outro domínio)**:
   - *Prós:* Isolamento completo de bundle.
   - *Contras:* Fragmentação de repositório, necessidade de hospedar dois projetos distintos, duplicação de design tokens e componentes, atrito na transição para a demo.
2. **Abordagem B: Rota desacoplada na SPA React existente com toggle no App (`viewMode: 'landing' | 'app'`)**:
   - *Prós:* Reutilização instantânea de todos os componentes de estilo, tipografia (`Cabinet Grotesk` / `Plus Jakarta Sans`), ícones (`lucide-react`) e dados em memória de [`src/data/initialData.ts`](file:///home/adomoraes/projects/na-prancheta/src/data/initialData.ts). Transição sem recarga e sem atrito para o investidor experimentar o produto em 1 clique ("Live Demo").
   - *Decisão:* **Adotada a Abordagem B**, complementada com sincronização via hash/parâmetro de URL (`?view=demo` ou `?view=landing`) e persistência no `localStorage`.

---

## 4. Integração Comercial (Lead Capture Híbrido)

Para garantir máxima conversão no primeiro contato com investidores:
- O formulário submete via chamada HTTP para a API Laravel (`POST /api/leads/investor`).
- Simultaneamente, abre uma janela do WhatsApp Web/App com mensagem pré-formatada pronta para envio ao número oficial dos fundadores:
  > *"Olá, time do Na Prancheta! Sou [Nome] ([Perfil]), analisei a landing page e gostaria de conversar sobre investimentos e receber o Pitch Deck executivo."*
- Essa abordagem garante retenção no banco relacional de dados para CRM de captação e, ao mesmo tempo, conversão quente imediata com os sócios fundadores.
