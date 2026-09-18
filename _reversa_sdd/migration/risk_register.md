---
schemaVersion: 1
generatedAt: 2026-09-18T15:40:00-03:00
reversa:
  version: "1.3.3"
kind: risk_register
producedBy: strategist
hash: "sha256:bad9c5f9f63afefec3777d75bf74458b29f182b293e80604252c6a3a61e8b4bd"
---

# Risk Register — Na Prancheta

> Registro exaustivo de riscos da migração do Na Prancheta para Laravel 11 + PostgreSQL com probabilidade, impacto, gatilhos, mitigação e responsáveis.

## Riscos

### RISK-001 (Latência e Instabilidade de Rede no Vestiário)
- **Descrição**: No vestiário ou beira de campo, a conexão móvel 3G/4G dos atletas e da comissão técnica frequentemente oscila. Requisições REST síncronas podem travar ou falhar durante confirmação de presença e escalação.
- **Categoria**: Técnico / Operacional
- **Probabilidade**: Alta
- **Impacto**: Alto
- **Severidade combinada**: **Alta**
- **Trigger / sinal de alerta**: Timeouts de conexão (`net::ERR_CONNECTION_TIMED_OUT`), atletas reclamando que clicaram em "Vou" e a tela não respondeu.
- **Mitigação**: 
  1. Configuração do TanStack Query no React com `staleTime: 5000` e mutações com feedback visual otimista (`onMutate` atualiza a UI antes da resposta do servidor e reverte apenas se der erro).
  2. Toasts visuais discretos de "Sincronizando..." e "Modo offline temporário".
- **Plano de contingência**: Ativação do modo contingência local (`VITE_USE_MOCK_STORAGE=true`) que salva temporariamente no `localStorage` e exibe aviso para sincronizar quando a conexão retornar.
- **Owner**: Arquiteto Frontend (Ado)
- **Status**: Aberto

### RISK-002 (Atrito de Acesso com Autenticação Sanctum no Vestiário)
- **Descrição**: Atletas atrasados ou convidados que chegam ao vestiário podem esquecer senhas ou não querer passar por fluxo burocrático de login tradicional enquanto se trocam.
- **Categoria**: Operacional / UX
- **Probabilidade**: Média
- **Impacto**: Alto
- **Severidade combinada**: **Alta**
- **Trigger / sinal de alerta**: Atleta não consegue confirmar presença porque esqueceu a senha e desiste de usar o app.
- **Mitigação**:
  1. Implementação de Magic Link / Token de Convocação enviado no WhatsApp da rodada que loga o atleta automaticamente com 1 clique.
  2. Sessão persistente (token Sanctum de longa duração gravado de forma segura no dispositivo do atleta com `expires_at` estendido).
- **Plano de contingência**: O tesoureiro ou técnico (com perfil `admin`) possui permissão de "Confirmar pelo atleta" na interface de gestão.
- **Owner**: Desenvolvedor Backend (Ado)
- **Status**: Aberto

### RISK-003 (Concorrência Simultânea no Cadastro de Camisas e Escalação)
- **Descrição**: Dois atletas cadastrando-se simultaneamente com a mesma camisa 10, ou técnico e auxiliar alterando a prancheta ao mesmo tempo.
- **Categoria**: Técnico
- **Probabilidade**: Média
- **Impacto**: Médio
- **Severidade combinada**: **Média**
- **Trigger / sinal de alerta**: Erros de integridade no banco (`duplicate key value violates unique constraint`).
- **Mitigação**:
  1. Constraint `UNIQUE (time_id, numero_camisa)` no PostgreSQL.
  2. Tratamento amigável de erro HTTP 422 na UI: "A camisa 10 acabou de ser escolhida por outro atleta. Escolha outro número disponível".
  3. Lock otimista na escalação da partida (`version` ou `updated_at` checado no PUT/POST).
- **Plano de contingência**: Notificação instantânea via toast informando conflito de versão e recarregando os dados mais recentes do servidor.
- **Owner**: Desenvolvedor Backend (Ado)
- **Status**: Aberto

### RISK-004 (Inconsistência entre Sementes do Legado e Schema das Migrations)
- **Descrição**: Os dados mocados em `src/data/initialData.ts` possuem tipagens soltas e datas estáticas fictícias. Se a migração falhar ao mapear essas entidades, a carga inicial de dados falhará.
- **Categoria**: Técnico / Dados
- **Probabilidade**: Baixa
- **Impacto**: Médio
- **Severidade combinada**: **Baixa**
- **Trigger / sinal de alerta**: Erro de validação ou tipagem ao rodar `php artisan db:seed`.
- **Mitigação**: Criação de um Seeder especializado (`LegacyInitialDataSeeder`) com parser e normalização estrita de strings, gerando UUIDs/IDs sequenciais e datas válidas.
- **Plano de contingência**: Script de sanitização prévio que valida o JSON de sementes antes de rodar o seeder.
- **Owner**: Desenvolvedor Backend (Ado)
- **Status**: Aberto

---

## Resumo por severidade

| Severidade | Quantidade | IDs |
|---|:---:|---|
| **Crítica** | 0 | - |
| **Alta** | 2 | RISK-001 (Latência de Rede no Vestiário), RISK-002 (Atrito de Acesso Sanctum) |
| **Média** | 1 | RISK-003 (Concorrência de Camisa e Escalação) |
| **Baixa** | 1 | RISK-004 (Inconsistência de Schema nos Seeders) |

---

## Riscos relacionados ao paradigma alvo

> Riscos originados diretamente da transição de paradigma (Local-First isolado → Multi-Usuário Concorrente em Laravel 11):

- **RISK-001 (Latência de Rede no Vestiário)**: No legado, tudo ocorria em memória local síncrona sem risco de timeout de rede. No paradigma de API REST, qualquer I/O de rede introduz latência e possibilidade de falha.
- **RISK-003 (Concorrência de Camisa e Escalação)**: No legado, cada aparelho tinha seu próprio `localStorage`, logo não existia concorrência multi-usuário simultânea. No Laravel/PostgreSQL, a concorrência é real e exige transações ACID e tratamento de conflito.
