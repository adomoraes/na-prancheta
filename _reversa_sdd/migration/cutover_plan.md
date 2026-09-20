---
schemaVersion: 1
generatedAt: 2026-09-18T15:40:00-03:00
reversa:
  version: "1.3.3"
kind: cutover_plan
producedBy: strategist
hash: "sha256:a9c8d060ba75d2b22c4c501784d7ba34a13b083784d98a4832d09b3b0df519e6"
---

# Cutover Plan — Na Prancheta

> Plano detalhado de transição (cutover) do legado local-first para o backend Laravel 11 + PostgreSQL, baseado na Estratégia A (Modular por Ondas).

## Estratégia base
- **Estratégia confirmada**: **Estratégia A (Modular Cutover por Ondas)** conforme definido em `migration_strategy.md`.

---

## Pré-requisitos
- [x] Backend Laravel 11 instalado e configurado via Docker / Sail com PHP 8.3 e PostgreSQL 16.
- [x] 100% das Migrations de banco executadas e validadas (`php artisan migrate:status`).
- [x] Seeders de carga inicial (`LegacyInitialDataSeeder`) executados e conferidos contra `src/data/initialData.ts`.
- [x] Suíte de testes automatizados do Laravel (`php artisan test`) passando com 100% de sucesso.
- [x] Configuração de CORS no Laravel habilitando a URL do frontend React 19 SPA.
- [x] Variáveis de ambiente configuradas no frontend (`VITE_API_BASE_URL=http://localhost:8000/api`).

---

## Janela de cutover
- **Data alvo**: Terça-feira (intervalo entre rodadas de fim de semana, sem jogos acontecendo).
- **Duração estimada**: 2 horas por onda.
- **Ambiente afetado**: Staging / Produção local.
- **Comunicação prévia**: Ado (Product Owner) e Comissão Técnica avisados com 48h de antecedência.

---

## Passos do cutover por ondas

### Onda 1: Elenco, Autenticação e Presença
| # | Passo | Owner | Duração | Reversível? |
|---|---|---|---|:---:|
| 1.1 | Subir container Docker do PostgreSQL e Laravel 11 | Backend (Ado) | 10 min | Sim |
| 1.2 | Executar `php artisan migrate --seed` com elenco e partida piloto | Backend (Ado) | 5 min | Sim |
| 1.3 | Configurar Sanctum e emitir token de teste de comissão e atleta | Backend (Ado) | 10 min | Sim |
| 1.4 | Apontar cliente React (`apiClient.ts`) para `/api/presencas` e `/api/atletas` | Frontend (Ado) | 20 min | Sim |
| 1.5 | Smoke test: Atleta A clica em "Vou", Atleta B visualiza via polling no outro browser | QA / Ado | 15 min | Sim |

### Onda 2: Prancheta Tática e Protocolo do Vestiário
| # | Passo | Owner | Duração | Reversível? |
|---|---|---|---|:---:|
| 2.1 | Ativar endpoints de escalação (`POST /api/partidas/{id}/titulares`) | Backend (Ado) | 10 min | Sim |
| 2.2 | Conectar componente `PranchetaTecnica.tsx` às mutações com feedback otimista | Frontend (Ado) | 25 min | Sim |
| 2.3 | Validar regra inegociável de corte T-35 e teto de 11 titulares na API | Backend / QA | 15 min | Sim |
| 2.4 | Smoke test: Simulação de escalação completa e conferência de persistência pós-F5 | QA / Ado | 10 min | Sim |

### Onda 3: Vaquinha (PIX), Scout e Almoxarifado
| # | Passo | Owner | Duração | Reversível? |
|---|---|---|---|:---:|
| 3.1 | Ativar endpoints de quitação de taxas e conciliação de PIX (`TesoureiroColeta`) | Backend (Ado) | 15 min | Sim |
| 3.2 | Ativar endpoints de conferência de materiais e fechamento de mala (`AlmoxarifadoView`) | Backend (Ado) | 15 min | Sim |
| 3.3 | Conectar relatórios de scout pós-jogo e exclusividade estrita do MVP | Frontend (Ado) | 20 min | Sim |
| 3.4 | Teste ponta a ponta do Dia de Jogo completo (da convocação à Trava da Resenha) | Ado | 30 min | Sim |

---

## Plano de rollback
- **Critérios de acionamento do Rollback**:
  - Queda inesperada do serviço do PostgreSQL ou da API Laravel durante a rodada do time de futebol.
  - Impossibilidade de os atletas confirmarem presença a menos de 60 minutos do apito inicial.
- **Passos de Rollback**:
  1. Alterar a flag do frontend `.env`: `VITE_USE_MOCK_STORAGE=true`.
  2. Forçar recarga da aplicação no navegador dos atletas (F5 ou limpeza rápida de cache PWA).
  3. O frontend restaura o modo de operação legado utilizando `localStorage` e dados locais sem dependência do servidor.
- **Tempo máximo aceitável até rollback**: 5 minutos.
- **Owner do rollback**: Ado (Arquiteto e Desenvolvedor Principal).

---

## Critérios de go / no-go

### Critérios de GO
1. Resposta de API REST abaixo de 200ms em condições normais de rede.
2. Nenhuma regressão visual nas 7 telas da SPA React 19.
3. 100% dos testes unitários e de integração do Laravel aprovados (`php artisan test`).
4. Persistência comprovada: dados salvos continuam intactos após recarga completa da página.

### Critérios de NO-GO
1. Falha na geração ou validação de tokens do Laravel Sanctum.
2. Perda de integridade relacional (ex: dois titulares na mesma posição ou número de camisa duplicado).
3. Erros de CORS impedindo requisições do frontend React.

---

## Pós-cutover
- [ ] Monitoramento ativo durante as primeiras 3 partidas oficiais do time.
- [ ] Backup diário automatizado do PostgreSQL (`pg_dump`).
- [ ] Limpeza definitiva do código legado de `localStorage` em `src/App.tsx` após a estabilização da Onda 3.
