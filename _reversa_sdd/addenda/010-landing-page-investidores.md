# Adendo: Landing Page Comercial & Vitrine para Investidores

> Feature: `010-landing-page-investidores`  
> Data: 2026-09-21  
> Cenário: legado  

---

## Vigência

Vigente desde 2026-09-21.

---

## Resumo da entrega

Implementação da **Landing Page Comercial e Vitrine para Investidores** na rota raiz (`/`) da SPA React 19, apresentando a tese de mercado de SportsTech amadora (+100k times, R$ 15,2 bilhões anuais no Brasil), o modelo de negócios baseado em 4 motores de receita, showcase interativo dos 5 pilares culturais do produto (Régua T-35, Presença 1 Toque, Prancheta 4-3-3, Vaquinha PIX de R$ 300,00 e a Trava da Resenha), calculadora de ROI e formulário híbrido de captação de leads com persistência no PostgreSQL Laravel (`investor_leads`) e abertura de WhatsApp. Foram concluídas **13 de 13 ações** com 70 testes de integração passando 100%.

---

## Impacto por artefato da extração

| Artefato | Seção | Tipo de impacto | Delta |
|---|---|---|---|
| `_reversa_sdd/architecture.md` | `#2.1 Padrão SPA Reativa` | regra-alterada | Ponto de entrada padrão alterado para vitrine comercial via estado `viewMode: 'landing' \| 'app'`, com transição sem reload para a sandbox de dia de jogo. |
| `_reversa_sdd/architecture.md` | `#2.3 Design System Moderno` | componente-novo | Módulo dedicado `src/components/landing/*` (10 componentes) alinhado ao tema Dark Mode Zinc 950 e tipografia Cabinet Grotesk / Plus Jakarta Sans. |
| `_reversa_sdd/architecture.md` | `#3 Mapa de Integrações Externas` | componente-novo | Integração comercial de captação híbrida via WhatsApp Web/App (`wa.me`) pré-formatado a partir de submissão na API. |
| `_reversa_sdd/erd-complete.md` | `#Tabelas do Sistema` | delta-de-dados | Nova tabela `investor_leads` criada com índices em `email`, `status` e `created_at`, sem alterar nenhuma das tabelas legadas do vestiário. |
| `_reversa_sdd/domain.md` | `#2 Inventário de Regras de Negócio` | regra-nova | Adição da regra de vitrine pública raiz (RN-01 da feature) e fluxo híbrido de qualificação de leads de investidores (RN-03 da feature). |

---

## Regras sob vigilância

Os seguintes itens foram registrados para vigília em futuras re-extrações do sistema:
- **`W001`**: A rota raiz (`/`) deve renderizar a Landing Page comercial por padrão sem exigir autenticação prévia.
- **`W002`**: O cabeçalho do app operacional deve manter botão visível para retorno à Landing Page Comercial.
- **`W003`**: O endpoint `POST /api/leads/investor` deve aceitar submissões públicas e aplicar rate limiting.
- **`W004`**: Registros de leads devem ser salvos com `origem: landing_page` e status inicial `novo`.

*Consulte a definição completa dos sinais de violação em [`_reversa_forward/010-landing-page-investidores/regression-watch.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/010-landing-page-investidores/regression-watch.md).*

---

## Fontes

- `_reversa_forward/010-landing-page-investidores/requirements.md`
- `_reversa_forward/010-landing-page-investidores/roadmap.md`
- `_reversa_forward/010-landing-page-investidores/actions.md`
- `_reversa_forward/010-landing-page-investidores/legacy-impact.md`
- `_reversa_forward/010-landing-page-investidores/regression-watch.md`
- `_reversa_forward/010-landing-page-investidores/progress.jsonl`
