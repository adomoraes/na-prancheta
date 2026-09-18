---
schemaVersion: 1
generatedAt: 2026-09-18T15:30:00-03:00
reversa:
  version: "1.3.3"
kind: discard_log
producedBy: curator
hash: "sha256:82b03278338a2df4263401065595341cf8c3ad7d353a878c42fdeb6a2dfd2612"
---

# Discard Log — Na Prancheta

> Registro formal de regras, mecanismos e comportamentos do sistema legado descartados da migração e suas justificativas.
> Cada item rastreia para a origem no legado e estabelece seu substituto idiomático na stack alvo (Laravel 11 + PostgreSQL).

## Itens descartados

### BR-DESCARTAR-001 (Simulação de Decremento de Tempo via setInterval de 15s)
- **Origem**: `_reversa_sdd/protocolo-vestiario/design.md` § 4.2 / `VestiarioTimeline.tsx:78-83`
- **Descrição**: O cronômetro regressivo do vestiário utiliza um estado local `countdownMinutes` inicializado artificialmente em 38 minutos, com decrementos forçados a cada 15 segundos via `setInterval`.
- **Justificativa**: Mecanismo frágil, não-canônico e fictício que não reflete a hora real nem a sincronia entre os celulares dos atletas e da comissão técnica.
- **Vinculado a paradigma**: **Sim** (Artefato típico de frontend simulado sem relógio canônico de servidor).
  - *Absorção no paradigma alvo*: A partida no PostgreSQL possui `horario_inicio: timestamp` e `horario_prelecao_t35: timestamp`. O tempo restante é calculado de forma determinística comparando o relógio real (`now()`) com esses marcos temporais.
- **Reposição no sistema novo**: Cálculo determinístico de tempo real derivado da coluna `partidas.horario_inicio` via Carbon e relógio do dispositivo sincronizado via NTP.
- **Risco de descartar**: **Baixo**. Elimina dessincronização entre usuários e traz precisão ao protocolo T-X.

### BR-DESCARTAR-002 (Persistência Síncrona Monolítica em window.localStorage)
- **Origem**: `_reversa_sdd/architecture.md:32-35` / `App.tsx`
- **Descrição**: Serialização de todo o estado operacional do time em strings JSON gravadas de forma síncrona no `window.localStorage` do navegador do usuário.
- **Justificativa**: Incompatível com sistema colaborativo multi-usuário. Causa isolamento de dados por aparelho (o que o técnico faz não reflete no celular do atleta), perda de dados ao limpar cache e ausência total de transações ACID.
- **Vinculado a paradigma**: **Sim** (Paradigma local-first monolítico client-side).
  - *Absorção no paradigma alvo*: O backend Laravel 11 atua como única fonte da verdade com modelos Eloquent, migrações relacionais e banco PostgreSQL 16 com isolamento de transações.
- **Reposição no sistema novo**: Endpoints RESTful transacionais (`POST`, `PATCH`, `GET`) com banco PostgreSQL 16.
- **Risco de descartar**: **Baixo**. É o objetivo central da migração solicitada pelo usuário.

### BR-DESCARTAR-003 (Validação de Atraso por Parsing de Substring 'Atrasado' em String Livre)
- **Origem**: `_reversa_sdd/domain.md:57-58` / `VestiarioTimeline.tsx:73-80`
- **Descrição**: A identificação de atleta atrasado na preleção é realizada verificando se a string livre de horário de chegada contém a palavra `'Atrasado'` (`atleta.chegou_em?.includes('Atrasado')`).
- **Justificativa**: Padrão de dados não-estruturados altamente suscetível a quebras e inconsistências de internacionalização ou formatação.
- **Vinculado a paradigma**: **Sim** (Manipulação solta de strings em estado não-normalizado).
  - *Absorção no paradigma alvo*: O modelo relacional no PostgreSQL e as regras de negócio no Laravel utilizam campo tipado `chegou_vestiario_em: timestamp` comparado com `horario_prelecao_t35` da partida, gerando um atributo booleano formal `atrasado_prelecao: boolean`.
- **Reposição no sistema novo**: Atributo tipado e comparação temporal formal no service de escalação do Laravel.
- **Risco de descartar**: **Baixo**. Aumenta a robustez da regra disciplinar sem qualquer impacto negativo na experiência do usuário.

---

## Itens descartados por mudança de paradigma (subseção dedicada)

| ID | Origem | Paradigma legado | Substituto no paradigma alvo (Laravel 11) |
|---|---|---|---|
| **BR-DESCARTAR-001** | `protocolo-vestiario/design.md` § 4.2 | Loop simulado em memória (`setInterval`) | Timestamps canônicos no PostgreSQL (`horario_inicio`) + Carbon |
| **BR-DESCARTAR-002** | `architecture.md:32-35` | LocalStorage síncrono isolado em browser único | API REST multi-usuário com Eloquent e transações PostgreSQL |
| **BR-DESCARTAR-003** | `domain.md:57-58` | Substring em texto não-normalizado | Colunas tipadas `timestamp` e validação relacional em Form Request |

---

## Notas
- Nenhum comportamento ou regra de valor de negócio real para o clube de futebol foi descartado.
- Os 3 descartes removem puramente mecanismos improvisados do frontend do legado que são naturalmente superados e absorvidos pela arquitetura profissional do Laravel 11.
