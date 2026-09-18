# Dicionário de Dados — Na Prancheta

> Gerado pelo **Reversa Arqueólogo** em 18/09/2026  
> Nível de Documentação: **Detalhado**  
> Escopo: Tipos, Modelos de Entidades, Enums e Persistência em LocalStorage

---

## 1. Enums e Tipos Primitivos de Domínio

### 1.1 `NivelAcesso`
Nível de acesso e visão operacional no sistema.
- **Valores possíveis**: `'atleta'`, `'tecnico'`, `'financeiro'`, `'geral'`, `'almoxarifado'`
- **Confiança**: 🟢 CONFIRMADO (`src/types.ts:1`)

### 1.2 `TipoVinculo`
Natureza do vínculo esportivo e associativo do atleta com a agremiação.
- **Valores possíveis**:
  - `'mensalista'`: Atleta fixo associado que contribui mensalmente.
  - `'convidado'`: Atleta participante convidado para a partida.
  - `'inativo'`: Atleta desligado ou temporariamente suspenso.
- **Confiança**: 🟢 CONFIRMADO (`src/types.ts:2`)

### 1.3 `TipoEvento`
Classificação da partida ou agenda esportiva.
- **Valores possíveis**: `'amistoso'`, `'campeonato'`, `'treino'`, `'evento_social'`
- **Confiança**: 🟢 CONFIRMADO (`src/types.ts:3`)

### 1.4 `StatusConfirmacao`
Estado da confirmação de presença do atleta na rodada.
- **Valores possíveis**:
  - `'confirmado'`: Presença garantida no jogo.
  - `'recusado'`: Atleta comunicou ausência ("Não Vou").
  - `'duvida'`: Atleta aguardando definição de disponibilidade.
  - `'lista_espera'`: Atleta aguardando desistência de vaga titular/reserva.
- **Confiança**: 🟢 CONFIRMADO (`src/types.ts:4`)

### 1.5 `EstadoItem`
Estado físico e de conservação do patrimônio esportivo.
- **Valores possíveis**: `'novo'`, `'bom'`, `'desgastado'`, `'avariado'`
- **Confiança**: 🟢 CONFIRMADO (`src/types.ts:5`)

### 1.6 `StatusCustodia`
Situação de posse temporária de materiais do clube.
- **Valores possíveis**: `'em_uso'`, `'devolvido'`, `'com_pendencia'`
- **Confiança**: 🟢 CONFIRMADO (`src/types.ts:6`)

---

## 2. Entidades Principais de Dados

### 2.1 Entidade: `Atleta`
Representa um membro do elenco esportivo, jogador ou comissão.

| Campo | Tipo | Obrigatório | Valor Padrão / Exemplo | Descrição |
|---|---|---|---|---|
| `id` | `string` | Sim | `"atl-1"` ou `"atl-${Date.now()}"` | Identificador único do atleta. |
| `nome` | `string` | Sim | `"Lucas Silva"` | Nome de registro do atleta. |
| `apelido` | `string` | Não | `"Lucão"` | Apelido reconhecido no vestiário e escalação. |
| `telefone` | `string` | Não | `"(11) 98765-4321"` | Número de telefone / WhatsApp com DDD. |
| `foto_url` | `string` | Não | `undefined` | URL da foto de perfil do atleta. |
| `posicao_principal` | `string` | Sim | `"Goleiro"`, `"Zagueiro"`, `"Meio-Campo"` | Posição tática primária preferencial. |
| `posicao_secundaria` | `string` | Não | `"Lateral Esquerdo"` | Posição secundária alternativa. |
| `numero_camisa` | `number` | Não | `10` | Número preferido do fardamento (1-99). |
| `tipo_vinculo` | `TipoVinculo` | Sim | `'mensalista'` | Relação com a equipe (mensalista ou convidado). |
| `nivel_acesso` | `NivelAcesso` | Sim | `'atleta'` | Perfil de permissão e visão no sistema. |
| `tamanho_camisa` | `string` | Sim | `'G'` | Tamanho da camisa do uniforme (P, M, G, GG). |
| `tamanho_calcao` | `string` | Sim | `'G'` | Tamanho do calção do uniforme (P, M, G, GG). |
| `ativo` | `boolean` | Sim | `true` | Se o atleta está ativo para convocações. |
| `criado_em` | `string` | Sim | ISO 8601 string | Data e hora de inclusão no cadastro. |
| `chegou_vestiario` | `boolean` | Não | `true` | Indicador se o atleta já ingressou no vestiário. |
| `chegou_em` | `string` | Não | `"T-50 min (No Horário)"` | Registro textual da pontualidade. Se contiver `"Atrasado"`, aciona a Regra T-35. |

### 2.2 Entidade: `Evento`
Representa uma partida, confronto ou treino agendado.

| Campo | Tipo | Obrigatório | Exemplo | Descrição |
|---|---|---|---|---|
| `id` | `string` | Sim | `"evt-001"` | Identificador único do evento esportivo. |
| `titulo` | `string` | Sim | `"Copa Regional dos Campeões — Rodada 4"` | Nome ou cabeçalho do evento. |
| `tipo_evento` | `TipoEvento` | Sim | `'campeonato'` | Classificação da partida. |
| `data_hora` | `string` | Sim | ISO 8601 string | Horário oficial de início da partida (apito inicial T-0). |
| `horario_vestiario_t50` | `string` | Sim | ISO 8601 string | Horário obrigatório de apresentação de todos no vestiário (T-50). |
| `horario_prelecao_t35` | `string` | Não | ISO 8601 string | Horário de início da preleção e trava de corte por atraso (T-35). |
| `horario_aquecimento_t25`| `string` | Não | ISO 8601 string | Horário de saída a campo para aquecimento fisiológico (T-25). |
| `local_nome` | `string` | Sim | `"Arena Soccer Ville — Campo 1 Oficial"` | Nome do complexo esportivo / campo. |
| `local_link_gps` | `string` | Não | `"https://maps.google.com/?q=..."` | Link externo para navegação via Google Maps / Waze. |
| `adversario` | `string` | Não | `"União Alvinegra F.C."` | Nome da equipe adversária. |
| `fardamento_definido_id` | `string` | Não | `"pat-1"` | ID da mala de fardamento escalada para o confronto. |
| `fardamento_nome` | `string` | Não | `"Kit 1 — Branco com Faixa Diagonal"` | Nome legível do kit de uniforme da equipe. |
| `tesoureiro_dia_id` | `string` | Não | `"atl-5"` | ID do atleta responsável pela coleta da taxa na data. |
| `tesoureiro_nome` | `string` | Não | `"Thiago Oliveira (Thiaguinho)"` | Nome do tesoureiro do dia. |
| `valor_taxa_jogo` | `number` | Sim | `25.0` | Valor individual da cota da vaquinha em Reais (R$). |
| `observacoes` | `string` | Não | `"Tolerância zero para atraso no vestiário..."` | Instruções e avisos gerais para o elenco. |
| `status_partida` | `string` | Não | `'em_vestiario'` | Estado do jogo (`agendado`, `em_vestiario`, etc.). |

### 2.3 Entidade: `EventoPresenca`
Relação de convocação e resposta de disponibilidade do atleta para um evento específico.

| Campo | Tipo | Obrigatório | Exemplo | Descrição |
|---|---|---|---|---|
| `id` | `string` | Sim | `"pres-atl-1"` | Identificador único do registro de presença. |
| `evento_id` | `string` | Sim | `"evt-001"` | Referência para o evento associado. |
| `atleta_id` | `string` | Sim | `"atl-1"` | Referência para o atleta convocado. |
| `status` | `StatusConfirmacao` | Sim | `'confirmado'` | Resposta atual (`confirmado`, `recusado`, `duvida`). |
| `respondido_em` | `string` | Sim | ISO 8601 string | Carimbo de data/hora do último voto/toque do atleta. |
| `atleta` | `Atleta` | Não | Objeto `Atleta` | Dados desnormalizados do atleta para renderização rápida em tela. |

### 2.4 Entidade: `EventoColetaDia`
Controle financeiro da taxa individual de rateio por evento.

| Campo | Tipo | Obrigatório | Exemplo | Descrição |
|---|---|---|---|---|
| `id` | `string` | Sim | `"col-atl-1"` | Identificador único da cobrança. |
| `evento_id` | `string` | Sim | `"evt-001"` | Referência para o evento associado. |
| `atleta_id` | `string` | Sim | `"atl-1"` | Referência para o atleta devedor/pagante. |
| `valor_pago` | `number` | Sim | `25.0` | Valor da taxa individual atribuída. |
| `pago` | `boolean` | Sim | `true` ou `false` | Flag indicando quitação da cota. |
| `pago_em` | `string` | Não | ISO 8601 string | Timestamp do momento em que o pagamento foi registrado. |

### 2.5 Entidade: `EventoScout`
Estatísticas quantitativas individuais do atleta em uma partida.

| Campo | Tipo | Obrigatório | Exemplo | Descrição |
|---|---|---|---|---|
| `id` | `string` | Sim | `"scout-1"` | Identificador único do scout do atleta. |
| `evento_id` | `string` | Sim | `"evt-001"` | Referência para o evento associado. |
| `atleta_id` | `string` | Sim | `"atl-10"` | Referência para o atleta. |
| `minutos_jogados` | `number` | Sim | `40` | Minutos de participação efetiva no campo. |
| `gols` | `number` | Sim | `2` | Gols marcados pelo atleta. |
| `assistencias` | `number` | Sim | `1` | Passes para gol concedidos pelo atleta. |
| `cartao_amarelo` | `number` | Sim | `0` | Quantidade de cartões amarelos recebidos. |
| `cartao_vermelho` | `number` | Sim | `0` | Quantidade de cartões vermelhos recebidos. |
| `foi_mvp` | `boolean` | Sim | `true` | Se o atleta foi eleito o Craque da Partida. |
| `gols_sofridos` | `number` | Sim | `0` | Gols sofridos no período em campo (relevante para goleiros). |

### 2.6 Entidade: `PatrimonioItem`
Item de inventário físico pertencente ao acervo da agremiação.

| Campo | Tipo | Obrigatório | Exemplo | Descrição |
|---|---|---|---|---|
| `id` | `string` | Sim | `"pat-1"` | Identificador único do item no almoxarifado. |
| `nome` | `string` | Sim | `"Mala 1 — Fardamento Principal"` | Descrição do conjunto ou equipamento. |
| `categoria` | `string` | Sim | `'fardamento'`, `'treino'`, `'apoio'` | Segmento do patrimônio. |
| `quantidade_total` | `number` | Sim | `22` | Quantidade original/total cadastrada. |
| `quantidade_disponivel`| `number` | Sim | `22` | Quantidade pronta para uso na data. |
| `estado_conservacao` | `EstadoItem` | Sim | `'bom'` | Condição física do material. |
| `observacoes` | `string` | Não | `"Kit completo com 20 camisas..."` | Detalhes adicionais de composição do item. |

---

## 3. Chaves de Persistência no `localStorage`

| Chave de Armazenamento | Tipo do Conteúdo | Finalidade |
|---|---|---|
| `naprancheta_atletas` | `Atleta[]` | Lista persistida de todos os atletas cadastrados no clube. |
| `naprancheta_evento` | `Evento` | Dados do evento esportivo em foco/andamento. |
| `naprancheta_presencas`| `EventoPresenca[]` | Respostas individuais de presença para o evento ativo. |
| `naprancheta_coletas` | `EventoColetaDia[]` | Registros de pagamento da vaquinha do dia. |
| `naprancheta_scout` | `EventoScout[]` | Lançamento dos dados estatísticos e scout pós-jogo. |
