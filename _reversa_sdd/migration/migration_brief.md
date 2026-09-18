---
schemaVersion: 1
generatedAt: 2026-09-18T15:20:00-03:00
reversa:
  version: "1.3.3"
kind: migration_brief
producedBy: orchestrator
hash: "sha256:pending"
---

# Migration Brief — Na Prancheta

> Documento de critério de migração coletado em entrevista no início do `/reversa-migrate`.
> Consumido pelos seis agentes do Time de Migração. Não pergunta paradigma (responsabilidade do Paradigm Advisor) nem apetite (derivado em `paradigm_decision.md`).

## Objetivo da migração
Centralizar dados multi-usuário em um banco relacional robusto, eliminando a volatilidade do `localStorage` do navegador e viabilizando a colaboração em tempo real e compartilhada entre os atletas do elenco, o tesoureiro do dia e a comissão técnica.

## Métricas de sucesso
- **Persistência Centralizada**: 100% dos dados operacionais (elenco, convocações, escalações táticas, débitos/quitação de vaquinha e conferência do almoxarifado) persistidos em banco relacional.
- **Isolamento de Conflito**: Zero perda de formação tática ou status de pagamento ao recarregar a tela (F5) ou alternar de dispositivo.
- **Tempo de Resposta**: Endpoints de API REST respondendo em menos de 200ms para operações de leitura e confirmação rápida em 1 toque.
- **Desacoplamento**: Frontend React 19 desacoplado e conectado exclusivamente via chamadas HTTP REST limpas e documentadas.

## Restrições
- **Prazo**: Janela contínua de desenvolvimento com entrega incremental por fases.
- **Orçamento**: Infraestrutura open-source baseada no ecossistema PHP/Laravel e PostgreSQL/MySQL.
- **Técnicas**: Preservação da experiência de usuário (UX) do frontend React 19 já validada; substituição transparente da camada de storage por clientes HTTP/Axios/Fetch.
- **Operacionais**: Capacidade de transição e carga inicial a partir das sementes de dados (`src/data/initialData.ts`).

## Fatores de risco conhecidos
- Latência de rede no vestiário (necessidade de feedback visual otimista ou cache local no client para toques rápidos).
- Conciliação concorrente de múltiplos atletas confirmando presença ou tesoureiro dando baixa em quitações simultaneamente.

## Stakeholders
| Nome / papel | Responsabilidade na migração |
|---|---|
| **Ado** | Product Owner, Arquiteto e Desenvolvedor Principal |
| **Comissão Técnica** | Validação da prancheta tática e formação em tempo real |
| **Tesoureiro do Dia** | Validação da auditoria financeira e conciliação de PIX |
| **Custodiante de Malas (Kadu)** | Validação do checklist de devolução de materiais esportivos |

## Stack alvo
- **Linguagem**: PHP 8.3+
- **Framework**: Laravel 11
- **Banco**: PostgreSQL 16 (ou MySQL 8) com migrations e Eloquent ORM
- **Mensageria / Tempo Real** (se houver): Laravel Reverb / WebSockets para eventos de presença e súmula ao vivo
- **Infra**: Docker / Docker Compose (Sail) ou VPS Linux (Nginx + PHP-FPM)
- **Frontend Consumidor**: React 19 + TypeScript + Vite (existente, mantido como SPA desacoplada consumindo API REST)

## Escopo declarado
- **Incluído**: Todos os 7 módulos do sistema legado:
  1. `protocolo-vestiario`: Cronômetros de marcos temporais e trava disciplinar T-35.
  2. `confirmacao-presenca`: Ficha do jogo, botões táteis de presença e lista de espera.
  3. `prancheta-tatica`: Formação 4-3-3, teto de 11 titulares e persistência de escalação.
  4. `tesoureiro-vaquinha`: Rateio exclusivo de confirmados, quitação de taxas e chave PIX configurável.
  5. `scout-pos-jogo`: Estatísticas individuais, gols, passes, cartões e MVP estritamente exclusivo.
  6. `almoxarifado-patrimonio`: Inventário de bens, checklist tríplice e trava da resenha persistida.
  7. `onboarding-elenco`: Cadastro rápido de membros/convidados com unicidade estrita de camisa.
- **Excluído**: Nenhum módulo foi excluído do escopo.

## Notas livres
As decisões humanas registradas em `_reversa_sdd/questions.md` devem ser estritamente respeitadas:
1. Persistência de prancheta, PIX e checklist tratadas nativamente na camada de backend.
2. MVP é estritamente exclusivo por jogo (apenas 1 atleta por partida).
3. Camisa preferida é estritamente única no elenco ativo.
4. Teto de vagas no jogo direciona excedentes para lista de espera.
