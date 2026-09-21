# Roadmap: Landing Page Comercial & Pitch para Investidores

> Identificador: `010-landing-page-investidores`  
> Data: `2026-09-21`  
> Requirements: `_reversa_forward/010-landing-page-investidores/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A solução implementa a vitrine comercial pública do **Na Prancheta** diretamente na rota raiz (`/`) da SPA React 19, apresentando uma experiência visual de padrão internacional com Dark Mode (Zinc 950), tipografia expressiva (`Cabinet Grotesk` nos títulos e `Plus Jakarta Sans` no corpo), microanimações e narrativa estruturada para investidores de SportsTech. O usuário pode transicionar para o app operacional em um clique através do botão "Acessar Plataforma / Demo", enquanto o app mantém atalho para retornar à vitrine. No backend Laravel 11, é provisionado o endpoint `POST /api/leads/investor` com migração da tabela `investor_leads`, alimentando o pipeline comercial de captação de forma híbrida (persistência no banco + conversa instantânea no WhatsApp).

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| **I. Ergonomia Mobile-First & Local-First** | A Landing Page é 100% responsiva (360px a ultra-wide) e permite experimentar a demo do produto sem barreiras de autenticação forçada. | Respeita 🟢 |
| **II. Não Violabilidade de Dados Legados** | Tabelas e fluxos de jogo (`eventos`, `escalacoes`, `scouts`, `taxas_jogo`, `itens_patrimonio`) permanecem intactos. Apenas uma nova tabela desacoplada (`investor_leads`) é introduzida. | Respeita 🟢 |
| **III. Fidelidade às Regras Culturais** | O showcase destaca com rigor as convenções do futebol amador (Régua T-35, Trava da Resenha, Vaquinha PIX de R$ 300,00 e Unicidade do MVP). | Respeita 🟢 |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| **D-01** | **Landing Page na rota raiz (`/`) com alternância de estado em `App.tsx`** | Permite transição instantânea e sem reload entre a apresentação para investidores e o app funcional em sandbox/demo, reaproveitando os componentes e Tailwind CSS já compilados. | Microfrontend separado (overhead de build), roteador tradicional com recarga de página (atrito desnecessário na demo). | 🟢 |
| **D-02** | **Persistência híbrida de leads (Backend + WhatsApp)** | Garante retenção dos dados no banco PostgreSQL para métricas de conversão e CRM, ao mesmo tempo em que oferece conversa instantânea no WhatsApp com mensagem estruturada para os fundadores. | Apenas e-mail (baixa taxa de leitura/resposta), apenas formulário sem contato direto (esfria o lead). | 🟢 |
| **D-03** | **Showcase Interativo com Tabs dos 5 Pilares de Negócio** | Permite ao investidor explorar as regras proprietárias do produto de forma dinâmica, vendo a interface correspondente e a proposta de valor. | Carrossel estático de imagens (passivo), vídeo longo (investidores preferem navegar no próprio ritmo). | 🟢 |
| **D-04** | **Simulador Interativo de ROI & Economia** | Transforma números abstratos em dados tangíveis de retorno sobre investimento e horas poupadas para o capitão do time. | Tabela estática de preços (pouco atraente e sem engajamento). | 🟢 |
| **D-05** | **Endpoint `POST /api/leads/investor` com Rate Limiting** | Protege a aplicação contra abusos e spam de bots através de throttle (`throttle:10,1`) e validação estrita de campos. | Submissão de form sem proteção (vulnerável a spam). | 🟢 |

---

## 4. Premissas

> Nenhuma premissa sob dúvida: todos os pontos levantados foram esclarecidos na sessão `/reversa-clarify` de 2026-09-21 (Roteamento na raiz, processamento híbrido e inclusão de validação social).

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| **Ponto de Entrada SPA** | `src/App.tsx` | regra-alterada | Adiciona estado `viewMode: 'landing' \| 'app'`, renderizando a Landing Page como padrão na raiz com atalho para o app e vice-versa. |
| **Módulo Landing Page** | `src/components/landing/*` | componente-novo | Criação de componentes dedicados para a vitrine comercial (Hero, Showcase, Problema/Solução, Tese de Mercado, Modelo de Negócios, Simulador ROI, Prova Social, Modal Lead e Footer). |
| **API Client** | `src/services/api.ts` | contrato-novo | Adiciona método `api.leads.submitInvestorLead(data)` para envio do formulário de captação. |
| **Modelo Eloquent** | `backend/app/Models/InvestorLead.php` | componente-novo | Modelo para persistência de leads de investidores e parceiros. |
| **Controlador de Leads** | `backend/app/Http/Controllers/Api/InvestorLeadController.php` | componente-novo | Controller para recepcionar `POST /api/leads/investor` e listagem administrativa. |
| **Rotas da API** | `backend/routes/api.php` | contrato-novo | Registro das rotas pública e administrativa para gestão de leads. |
| **Migração do Banco** | `backend/database/migrations/*_create_investor_leads_table.php` | componente-novo | Criação da tabela `investor_leads` com índices otimizados. |

---

## 6. Delta no modelo de dados

- Adição da tabela `investor_leads` no PostgreSQL com campos `nome`, `email`, `telefone`, `tipo_investidor`, `ticket_estimado`, `mensagem`, `ip_address`, `origem` e `status`.
- Detalhe completo em: [`_reversa_forward/010-landing-page-investidores/data-delta.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/010-landing-page-investidores/data-delta.md)

---

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| `POST /api/leads/investor` | HTTP REST (JSON) | [`_reversa_forward/010-landing-page-investidores/interfaces/leads-investor.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/010-landing-page-investidores/interfaces/leads-investor.md) |

---

## 8. Plano de migração

1. Criar e executar a migração Laravel para a tabela `investor_leads`.
2. Registrar o modelo `InvestorLead` e o controller `InvestorLeadController`.
3. Criar os testes automatizados em `backend/tests/Feature/InvestorLeadTest.php`.
4. Implementar os componentes frontend sob `src/components/landing/`.
5. Integrar a alternância de tela em `src/App.tsx` e o serviço em `src/services/api.ts`.
6. Executar validação de testes (`php artisan test`) e compilação do bundle (`npm run build`).

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| **Usuário operacional do dia do jogo ficar desorientado na Landing Page** | Médio | Baixa | Botão "Acessar Plataforma / Demo" com destaque visual primário no Navbar superior e Hero. |
| **Spam no formulário de leads** | Baixo | Média | Aplicação de rate limiting (10 req/min) no Laravel e validação estrita de e-mail e formato de telefone. |
| **Bloqueador de popup impedir abertura do WhatsApp** | Baixo | Baixa | Abertura via `window.open` acionada diretamente pelo clique do usuário com link de fallback em caso de bloqueio. |

---

## 10. Critério de pronto

- [ ] Todos os componentes da Landing Page implementados com fidelidade ao design system (Zinc 950, Cabinet Grotesk, Plus Jakarta Sans).
- [ ] Showcase interativo dos 5 pilares com abas e mockups dinâmicos.
- [ ] Transição fluida entre Landing Page e App operacional nos dois sentidos.
- [ ] Formulário de captação híbrido gravando no backend e abrindo WhatsApp com mensagem formatada.
- [ ] Testes de integração backend passando 100% (`InvestorLeadTest`).
- [ ] Build do frontend concluído sem erros de compilação ou TypeScript.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial gerada por `/reversa-plan` | Reversa Arquiteto |
