# Requirements: Landing Page Comercial & Pitch para Investidores

> Identificador: `010-landing-page-investidores`  
> Data: `2026-09-21`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

A feature entrega uma **Landing Page Comercial institucional e de alto impacto visual** para o **Na Prancheta**, posicionada como **porta de entrada principal na rota raiz (`/`)**, voltada primordialmente a **investidores-anjo, fundos de Venture Capital (SportsTechs/SaaS) e parceiros estratégicos**. Ela resolve a ausência de uma vitrine pública na web que traduza a complexidade e a cultura rica do futebol amador brasileiro em uma tese de investimento clara, escalável e com alto potencial de monetização (TAM, unit economics, engajamento orgânico, modelo de receita híbrido e prova social de vestiário).

---

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#2.3` | Identidade visual estabelecida: paleta Dark Mode (Zinc 950), tipografia `Cabinet Grotesk` (títulos) e `Plus Jakarta Sans` (interface), acentos semânticos esmeralda, azul, âmbar, roxo e rosa. | 🟢 CONFIRMADO |
| `_reversa_sdd/domain.md#1` | Regras emblemáticas de domínio com forte apelo cultural: Régua do Vestiário ($T-35$), Vaquinha de Arbitragem PIX, Trava da Resenha no Almoxarifado e Scout de MVP. | 🟢 CONFIRMADO |
| `_reversa_sdd/domain.md#2.2` | Fluxo financeiro (RN-05 a RN-07): R$ 300,00 de meta de arbitragem por jogo, cobrado apenas dos confirmados, gerando tração para potencial receita de take-rate via PIX. | 🟢 CONFIRMADO |
| `_reversa_sdd/user-stories/jornada-dia-de-jogo.md#1` | A jornada completa em 4 tempos (Convocação, Vestiário, Campo, Resenha/Terceiro Tempo) como espinha dorsal da narrativa do produto. | 🟢 CONFIRMADO |
| `_reversa_sdd/addenda/004-painel-adm-root.md#1` | Existência de backoffice administrativo e controle de tenant/clubes, permitindo que investidores vejam a governança técnica da plataforma. | 🟢 CONFIRMADO |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Investidor Anjo / VC de SportsTech** | Avaliar tamanho de mercado, tese do produto, tração e diferenciais competitivos antes de agendar uma reunião de pitch. | Acessa a landing page na raiz (`/`), percorre os números de mercado (TAM/SAM), vê a demonstração interativa dos 5 módulos, a prova social e clica em "Solicitar Pitch Deck / Agendar Call". |
| **Gestor de Liga ou Complexo Esportivo (Arena B2B)** | Compreender se o produto serve como parceiro de tecnologia para modernizar os jogos sediados em seus campos. | Analisa a seção de parcerias B2B e preenche formulário de contato para piloto institucional. |
| **Atleta / Membro de Comissão Técnica** | Acessar o sistema operacional do Na Prancheta no dia do jogo. | Entra em `/`, clica no botão evidente "Acessar Plataforma / Entrar" no cabeçalho e transiciona para o app operacional de dia de jogo. |
| **Fundadores / Equipe do Na Prancheta** | Dispor de um link institucional moderno (`naprancheta.com.br`) para prospecções ativas de captação e receber leads qualificados no banco e no WhatsApp. | Compartilha o link com preview em OpenGraph rico e recebe mensagens imediatas de investidores no WhatsApp com lead armazenado no backend. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Landing Page na Raiz e Transição para o App):** 🟢  
   A Landing Page comercial para investidores é a rota raiz padrão (`/`). O cabeçalho possui botão de destaque "Acessar Plataforma / Demo" que direciona para a experiência da aplicação operacional. No cabeçalho da aplicação operacional, deve existir um atalho/botão para retornar à "Vitrine Comercial / Tese de Investimento".
   - Origem no legado: `_reversa_sdd/architecture.md#2.1` e esclarecimento de 2026-09-21.
   - Tipo: nova.

2. **RN-02 (Showcase Interativo dos 5 Pilares de Valor):** 🟢  
   A página deve demonstrar visualmente e interativamente os 5 pilares que diferenciam o Na Prancheta de planilhas e apps genéricos de torneios:
   - *1. Protocolo do Vestiário & Corte Disciplinar ($T-35$)*
   - *2. Presença em 1 Toque com Fila de Espera Automática*
   - *3. Prancheta Tática 4-3-3 com Validação Antiatraso*
   - *4. Tesoureiro Automático & Vaquinha PIX de Arbitragem*
   - *5. Almoxarifado com a Lendária "Trava da Resenha"*
   - Origem no legado: `_reversa_sdd/domain.md#1`
   - Tipo: nova.

3. **RN-03 (Processamento Híbrido de Leads de Investidores):** 🟢  
   O formulário de investidores deve coletar nome, e-mail, telefone/WhatsApp, tipo de perfil (Investidor Anjo, Fundo VC, Arena/Liga, Outro), ticket estimado e mensagem. Ao submeter:
   - Persiste no backend Laravel através da rota `POST /api/leads/investor` na tabela `investor_leads`.
   - Simultaneamente, formata uma mensagem executiva pronta e abre o WhatsApp comercial dos fundadores para conversa instantânea.
   - Origem: esclarecimento de 2026-09-21.
   - Tipo: nova.

4. **RN-04 (Transparência de Tese & Modelo de Receita):** 🟢  
   Apresentação clara dos 4 vetores de monetização previstos:
   - SaaS por Equipe / Clube (Freemium e Assinatura Mensal/Anual);
   - B2B Arenas e Ligas (SaaS de infraestrutura e gestão de locação);
   - FinTech / Take Rate sobre fluxo de pagamentos PIX de arbitragem e confraternizações;
   - Marcas Esportivas & Patrocínio de Resenha (Brand Awareness no boletim de jogo e eleição de MVP).
   - Tipo: nova.

5. **RN-05 (Validação Social e Métricas de Impacto de Vestiário):** 🟢  
   Exibição de métricas operacionais comprovadas (ex: 98% de arrecadação pontual de vaquinha, 0 camisas perdidas com a Trava da Resenha, 100% de preleções pontuais no $T-35$) e depoimentos de capitães e diretores reais/conceituais.
   - Origem: esclarecimento de 2026-09-21.
   - Tipo: nova.

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| **RF-01** | **Hero Section de Alto Impacto** com headline poderosa ("A revolução digital dos bastidores do futebol amador"), subheadline, badge de SportsTech SaaS, CTA duplo ("Testar Demo Interativa" e "Falar com Fundadores / Pitch Deck") e métricas-resumo. | Must | Renderização imediata, visual moderno com gradients dinâmicos, background sutil de campo tático e tipografia Cabinet Grotesk. | 🟢 |
| **RF-02** | **Apresentação do Problema vs Solução**: Contraste claro entre o caos analógico tradicional (mensagens perdidas no WhatsApp, discussões por atraso, calotes no PIX, camisas perdidas) versus a ordem profissional do Na Prancheta. | Must | Cards comparativos com ícones e estatísticas visuais do tempo e estresse poupados pelo gestor do time. | 🟢 |
| **RF-03** | **Showcase Interativo do Produto (Feature Tabs / Carousel)**: Demonstração viva das 5 grandes inovações do produto (Vestiário T-35, Presença 1 Toque, Prancheta 4-3-3, Vaquinha PIX, Trava da Resenha e Scout MVP) com tabs interativas e mockups fiéis às telas do app. | Must | Visitante pode alternar entre abas e ver a tela correspondente animada com descrição dos benefícios. | 🟢 |
| **RF-04** | **Seção "Por que Investir? (Tese & Mercado)"**: Números do mercado de futebol amador no Brasil/LATAM (TAM: +100k times amadores; +R$ 15 bi movimentados anualmente no ecossistema de peladas/campos sintéticos). | Must | Seção com números grandes, gráficos conceituais e tese de expansão e retenção orgânica viral. | 🟢 |
| **RF-05** | **Seção "Modelo de Negócio (Monetização)"**: Exibição dos 4 motores de receita (SaaS Clubes, B2B Arenas, FinTech PIX e Patrocínios/Marcas de Cerveja e Material Esportivo). | Must | Exibição clara e profissional para analistas de VC e anjos avaliarem viabilidade econômica. | 🟢 |
| **RF-06** | **Simulador Interativo de Economia & ROI da Rodada**: Ferramenta interativa onde o visitante ajusta o número de jogos/mês e o valor da arbitragem para ver o tempo e o dinheiro economizados por ano com o app. | Should | Slider interativo em React com recálculo instantâneo de números na tela. | 🟢 |
| **RF-07** | **Acesso Direto à Experiência do App (Live Demo / Sandbox)**: Botão evidente no Hero, no Navbar e no final da página permitindo ao visitante entrar na aplicação operacional com dados pré-carregados. | Must | Transição limpa e fluida para o app de vestiário, mantendo botão de retorno no cabeçalho. | 🟢 |
| **RF-08** | **Formulário de Captação & Agendamento de Pitch (Híbrido)**: Modal/seção para investidores submeterem dados. Valida no frontend, envia via API Laravel (`POST /api/leads/investor`) e abre WhatsApp dos fundadores com texto pronto. | Must | Persistência garantida no banco de dados e abertura de conversa direta no WhatsApp. | 🟢 |
| **RF-09** | **Seção de Prova Social & Validação de Vestiário**: Apresentação de depoimentos de capitães/organizadores e cards de impacto (98% de arrecadação de vaquinha, zero camisas perdidas, redução de atritos). | Must | Cards com avatares, nomes de equipes, citações autênticas e métricas consolidadas. | 🟢 |
| **RF-10** | **Footer Institucional Completo**: Links rápidos para documentação Reversa, links sociais, menção à stack técnica (React 19 + Laravel 11 + PostgreSQL 16) e selo de segurança de dados. | Must | Rodapé responsivo e elegante com copyright e canais de contato institucional. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| **Desempenho** | Tempo de carregamento inicial (LCP) inferior a 1.5s em conexões 4G/banda larga. | Primeiro impacto com investidor não pode ter lentidão ou travas. | 🟢 |
| **Aparência & UX** | Design de padrão internacional com tema escuro (Dark Mode Zinc 950), acentos em Esmeralda/Ouro, tipografia Cabinet Grotesk / Plus Jakarta Sans, microinterações e glassmorphism refinado. | Diretrizes de excelência visual para encantar investidores à primeira vista. | 🟢 |
| **Responsividade** | 100% responsivo para mobile (Smartphones de 360px a 430px), tablets e desktops ultra-wide (1440px+). | Investidores frequentemente abrem links pelo celular via WhatsApp ou LinkedIn. | 🟢 |
| **SEO & Compartilhamento Social** | Tags OpenGraph completas (`og:title`, `og:description`, `og:image`, `twitter:card`) com descrição atrativa para compartilhamento em redes e mensageiros. | Links enviados em conversas de investimento precisam gerar preview rico e profissional. | 🟢 |
| **Acessibilidade & Semântica** | Uso de tags HTML5 semânticas (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`) com contraste adequado (WCAG AA). | Conformidade com melhores práticas de engenharia web. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Investidor acessa a landing page no navegador
  Dado que o visitante entra no endereço raiz (/) da plataforma
  Quando a página carrega
  Então deve visualizar o Hero com headline de impacto e proposta de valor clara
  E deve visualizar os botões de ação "Explorar Demonstração do App" e "Solicitar Pitch Deck"
  E as seções de Problema vs Solução, Showcase Interativo, Tese de Mercado e Prova Social devem estar visíveis

Cenário: Investidor navega pelos pilares de produto no Showcase Interativo
  Dado que o visitante está na seção de funcionalidades do Na Prancheta
  Quando clica na aba "Protocolo do Vestiário (T-35)" ou "Trava da Resenha"
  Então a visualização central deve atualizar com o mockup correspondente e o destaque da regra de negócio
  E a animação de transição deve ser fluida e sem travamentos

Cenário: Investidor envia formulário de interesse
  Dado que o investidor preencheu seu nome, e-mail, telefone, perfil e mensagem
  Quando clica em "Solicitar Pitch Deck & Falar com Fundadores"
  Então o sistema valida os campos obrigatórios
  E envia os dados para o endpoint POST /api/leads/investor com persistência no banco
  E abre uma nova aba no WhatsApp com os fundadores contendo mensagem executiva estruturada
  E exibe feedback visual elegante de sucesso na tela

Cenário: Visitante quer transicionar entre a vitrine e o app operacional
  Dado que o visitante está na Landing Page (/)
  Quando clica no botão "Acessar Plataforma / Demo" no Navbar
  Então o sistema renderiza a aplicação operacional do vestiário
  E o Navbar do app exibe o botão "Voltar para Apresentação / Investidores" para retornar à Landing Page
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (Hero Section de Alto Impacto) | Must | Porta de entrada primordial; define a percepção de qualidade do produto nos primeiros 3 segundos. |
| RF-02 (Problema vs Solução) | Must | Essencial para provar que a dor do futebol amador é real e não atendida por soluções comuns. |
| RF-03 (Showcase Interativo dos 5 Pilares) | Must | Mostra o produto real em funcionamento com as features que criam barreira de entrada (moat). |
| RF-04 (Tese de Mercado TAM/SAM) | Must | Dado indispensável em qualquer tese de investimento de risco (VC/Anjo). |
| RF-05 (Modelo de Monetização) | Must | Investidores precisam enxergar claramente os caminhos de retorno sobre o capital investido. |
| RF-07 (Navegação Bi-direcional Raiz/App) | Must | Permite navegar organicamente entre a vitrine comercial e a demonstração operacional. |
| RF-08 (Formulário Híbrido API + WhatsApp) | Must | Geração tangível de leads com gravação de dados e conversão imediata no WhatsApp. |
| RF-09 (Prova Social & Validação) | Must | Constrói autoridade e credibilidade com base na cultura e números de vestiário. |
| RF-06 (Simulador de Economia / ROI) | Should | Diferencial interativo que agrega dinamismo e retenção na página. |
| RF-10 (Footer Institucional com Selos) | Should | Credibilidade institucional e fechamento de página. |

---

## 9. Esclarecimentos

### Sessão 2026-09-21

- **Q:** Como deve ser o roteamento e a navegação entre a Landing Page e o App operacional?  
  **R:** A rota raiz (`/`) é a Landing Page comercial/investidores, com botão destacado "Acessar Plataforma / Demo" que direciona para a experiência do app operacional. No cabeçalho do App, deve existir um botão de retorno para a Landing Page ("Vitrine Comercial / Tese").
- **Q:** Como os contatos/leads de investidores e parceiros devem ser processados pelo sistema?  
  **R:** Estratégia híbrida: persistência segura do lead no backend Laravel (tabela `investor_leads` via `POST /api/leads/investor`) para posterior gestão/acompanhamento, combinada com abertura imediata de conversa direta no WhatsApp dos fundadores com texto pré-estruturado de apresentação.
- **Q:** Deseja incluir depoimentos e métricas de impacto operacional de times amadores como validação social?  
  **R:** Sim, incorporar seção de validação de vestiário com depoimentos de capitães/diretores de times amadores e métricas de impacto real (98% de arrecadação de vaquinha, 0 camisas perdidas com a Trava da Resenha e disciplina de preleção).

---

## 10. Lacunas

> Nenhuma lacuna ou dúvida em aberto. Todos os pontos foram esclarecidos na sessão de 2026-09-21.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial gerada por `/reversa-requirements` ancorada no `_reversa_sdd/` | Reversa Redator |
| 2026-09-21 | Resolução das 3 dúvidas via `/reversa-clarify` (roteamento raiz, persistência híbrida de leads e prova social) | Reversa Clarify |
