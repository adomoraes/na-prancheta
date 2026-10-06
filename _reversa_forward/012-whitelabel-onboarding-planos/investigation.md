# Investigação Técnica: Arquitetura Whitelabel, Multi-tenancy e Monetização

> Identificador: `012-whitelabel-onboarding-planos`  
> Data: `2026-10-06`  
> Confidência: 🟢 CONFIRMADO  

---

## 1. Motivação & Contexto de Negócio

O Na Prancheta nasceu governando o ecossistema e o dia de jogo de um time amador específico. Contudo, a escalabilidade comercial da plataforma para o mercado nacional de agremiações amadoras, semi-profissionais e ligas esportivas exige a capacidade de operar como **Software as a Service (SaaS) Whitelabel Multi-tenant**.

Nesse modelo:
- Cada clube parceiro opera com total soberania sobre seu elenco, finanças da vaquinha, histórico de partidas e relatórios de scout.
- O gestor do clube adquire o software como um serviço personalizado com o escudo e as cores do seu clube, reforçando o sentimento de pertencimento dos atletas.
- A plataforma monetiza por meio de planos de assinatura recorrente com ciclo mensal ou anual, processados automaticamente por provedores nacionais com conciliação bancária instantânea via PIX e cobrança recorrente em cartão.

---

## 2. Padrões de Multi-tenancy Avaliados

Foram analisadas três abordagens clássicas de isolamento multi-tenant para aplicações baseadas no stack React + Laravel:

### Alternativa A: Banco de dados dedicado por tenant (Database-per-tenant)
- **Vantagens:** Isolamento físico total e facilidade de backup/restauração individual.
- **Desvantagens:** Elevadíssimo custo de infraestrutura no início, complexidade extrema de migrações simultâneas em centenas de bancos SQLite/MySQL/PostgreSQL, sobrecarga operacional desnecessária para equipes amadoras.
- **Veredito:** Descartada.

### Alternativa B: Esquema dedicado por tenant (Schema-per-tenant)
- **Vantagens:** Isolamento lógico dentro da mesma instância de banco.
- **Desvantagens:** Complexidade no gerenciamento de pools de conexão e migrações assíncronas; não suportado uniformemente em bancos de dados de teste ou ambientes locais (SQLite).
- **Veredito:** Descartada.

### Alternativa C: Coluna Discriminadora com Escopo Global (Shared Database, Discriminator Column / Row-Level Scoping)
- **Vantagens:** Arquitetura ágil, compatível com o banco existente (`times` já possui chave `time_id` em `atletas` e `partidas`), permitindo que Global Scopes no Eloquent (Laravel) injetem automaticamente `WHERE time_id = ?` em todas as consultas e operações do usuário autenticado.
- **Veredito:** **Adotada**. A aplicação garante isolamento estrito via middleware e escopo global, mantendo custo de infraestrutura mínimo e velocidade máxima de iteração.

---

## 3. Roteamento e Resolução da Identidade do Clube no Frontend

### Decisão: URL Unificada com Resolução Dinâmica de Sessão
Em conformidade com a decisão da fase de esclarecimentos (`/reversa-clarify`):
- O atleta e o gestor acessam a aplicação pela URL única.
- No momento do login ou do término do onboarding, a API devolve o token Sanctum acompanhado do objeto `tenant` (ID, nome, sigla, cores primária e secundária, URL do escudo e status do plano).
- O frontend React armazena o contexto em memória e `localStorage`, aplicando variáveis CSS dinâmicas (`--color-primary`, `--color-secondary`) nas raízes do layout Tailwind v4.
- Essa abordagem elimina completamente a fricção de configuração de wildcard DNS ou subdomínios complexos em ambientes PWA móveis.

---

## 4. Estratégia de Pagamento e Idempotência de Webhooks

A monetização exige conciliação em tempo real e prevenção rigorosa de falhas:
1. **PIX Dinâmico com QR Code:** Gera cobrança com tempo de expiração curto (30 a 60 minutos) para checkout inicial e renovações.
2. **Cartão de Crédito Recorrente:** Tokenização do cartão com cobrança automática pelo provedor na data de renovação.
3. **Controle de Idempotência:** A tabela `webhook_events` armazena o `event_id` único enviado pelo provedor de pagamentos. Caso uma retentativa de webhook com o mesmo `event_id` atinja a rota `/api/webhooks/pagamentos`, o sistema responde HTTP 200 imediatamente sem reprocessar a fatura nem comutar estados da assinatura novamente.
