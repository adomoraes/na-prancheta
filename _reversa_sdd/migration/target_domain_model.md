---
schemaVersion: 1
generatedAt: 2026-09-18T15:48:00-03:00
reversa:
  version: "1.3.3"
kind: target_domain_model
producedBy: designer
hash: "sha256:40ca213997190618e51eae468c71c07b08311cf65c65c52371a8e203224fbc28"
---

# Target Domain Model — Na Prancheta

> Modelo de domínio do sistema novo em Laravel 11. Define Aggregates, Entidades, Value Objects, Serviços de Domínio e Invariantes com rastreabilidade explícita para o modelo legado (`domain.md`) e para as regras aprovadas em `target_business_rules.md`.

---

## Aggregates

### AGG-Atleta (Aggregate Root: Atleta)
- **Aggregate Root**: `Atleta`
- **Contexto**: BC-01 (Elenco & Identidade)
- **Invariantes**:
  - `INV-ATL-01`: O número da camisa preferencial deve ser estritamente único entre os atletas ativos do mesmo time ([BR-MIGRAR-022](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - `INV-ATL-02`: O atleta deve possuir vínculo formal declarado (`mensalista` ou `convidado`) ([BR-MIGRAR-006](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - `INV-ATL-03`: Posição principal e posições secundárias devem pertencer ao catálogo tático válido (GOL, ZAG, LAT, MEI, ATA).
- **Comandos / Métodos de Domínio**:
  - `cadastrar(nome, apelido, numeroCamisa, posicao, tipoVinculo, telefone)`
  - `atualizarCamisa(novoNumero)` -> valida unicidade no time
  - `vincularUsuarioSanctum(user)`
- **Origem no legado**: `src/types.ts:1-12` / `_reversa_sdd/domain.md:25-26` / `onboarding-elenco/design.md`.

---

### AGG-Partida (Aggregate Root: Partida)
- **Aggregate Root**: `Partida`
- **Contexto**: BC-02 (Partidas & Convocação) e BC-03 (Tática & Escalação)
- **Entidades Internas**: `ConfirmacaoPresenca`, `PartidaTitular`, `MarcoVestiario`
- **Invariantes**:
  - `INV-PAR-01`: Quando o total de confirmações atinge o limite da partida (`limite_confirmados`), confirmações excedentes recebem automaticamente status `lista_espera` ([BR-MIGRAR-007](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - `INV-PAR-02`: Apenas atletas com status `confirmado` podem ser escalados entre os titulares ([BR-MIGRAR-010](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - `INV-PAR-03`: O total de titulares da equipe não pode ultrapassar o teto estrito de 11 atletas ([BR-MIGRAR-009](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - `INV-PAR-04`: Atleta que chegar ao vestiário após o início da preleção ($T-35$) tem sua titularidade bloqueada pela trava disciplinar e é alocado no banco ([BR-MIGRAR-002](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - `INV-PAR-05`: Marcos temporais regressivos do vestiário ($T-70$, $T-50$, $T-35$, $T-25$) são calculados deterministicamente a partir de `horario_inicio` ([BR-MIGRAR-001](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
- **Comandos / Métodos de Domínio**:
  - `registrarPresenca(atletaId, statusResposta)`
  - `promoverListaEspera(atletaId)`
  - `escalarTitular(atletaId, posicaoCampoId)`
  - `removerTitular(atletaId)`
  - `validarTravaAtrasoT35(atletaId, horarioChegada)`
- **Origem no legado**: `src/types.ts:14-48`, `_reversa_sdd/domain.md:14-18,33-36`, `confirmacao-presenca/design.md`, `prancheta-tatica/design.md`.

---

### AGG-Vaquinha (Aggregate Root: VaquinhaLancamento)
- **Aggregate Root**: `VaquinhaLancamento`
- **Contexto**: BC-04 (Finanças & Vaquinha)
- **Entidades Internas**: `CaixaMovimentacao`
- **Invariantes**:
  - `INV-VAQ-01`: Lançamentos de taxa individual são gerados exclusivamente para atletas com status `confirmado` ([BR-MIGRAR-012](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - `INV-VAQ-02`: A quitação da taxa registra data/hora exata e o identificador do tesoureiro autenticado que confirmou o pagamento ([BR-MIGRAR-014](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - `INV-VAQ-03`: Arrecadações que superem a meta de arbitragem (R$ 300,00) são creditadas como saldo positivo na conta corrente de Caixa Geral da Equipe ([BR-HUMANA-003](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
- **Comandos / Métodos de Domínio**:
  - `gerarCobrancasPartida(partidaId)`
  - `darBaixaPagamento(lancamentoId, tesoureiroId, metodo)`
  - `fecharCaixaPartida(partidaId)` -> transfere excedente para `CaixaGeral`
  - `gerarPayloadWhatsApp(partidaId)`
- **Origem no legado**: `src/types.ts:50-59`, `_reversa_sdd/domain.md:19-20,39-41`, `tesoureiro-vaquinha/design.md`.

---

### AGG-Scout (Aggregate Root: ScoutPartida)
- **Aggregate Root**: `ScoutPartida`
- **Contexto**: BC-05 (Desempenho & Scout)
- **Invariantes**:
  - `INV-SCT-01`: Gols, assistências, cartões e minutagem devem ser números inteiros maiores ou iguais a zero ([BR-MIGRAR-017](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - `INV-SCT-02`: Exclusividade estrita do Craque do Jogo (MVP): apenas 1 atleta por confronto pode ter `foi_mvp = true`; a eleição de um novo atleta remove automaticamente o destaque do anterior ([BR-MIGRAR-018](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
- **Comandos / Métodos de Domínio**:
  - `atualizarEstatisticas(atletaId, gols, assistencias, amarelos, vermelhos, minutos)`
  - `elegerMvp(atletaId)` -> transação atômica que reseta os demais da partida
- **Origem no legado**: `src/types.ts:75-92`, `_reversa_sdd/domain.md:21-22,48-50`, `scout-pos-jogo/design.md`.

---

### AGG-Almoxarifado (Aggregate Root: ConferenciaMala)
- **Aggregate Root**: `ConferenciaMala`
- **Contexto**: BC-06 (Patrimônio & Custódia)
- **Entidades Internas**: `ItemAlmoxarifado`
- **Invariantes**:
  - `INV-ALM-01`: Todas as 22 camisas devem ser conferidas como desviradas para permitir o fechamento ([BR-MIGRAR-020](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
  - `INV-ALM-02`: A Trava de Segurança da Resenha Social só é destravada (`resenha_liberada = true`) mediante tríplice confirmação: 22 camisas desviradas, 6 bolas calibradas e mala guardada no carro ([BR-MIGRAR-021](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)).
- **Comandos / Métodos de Domínio**:
  - `conferirItem(itemId, status)`
  - `destravarResenha(custodianteId)`
- **Origem no legado**: `src/types.ts:61-73`, `_reversa_sdd/domain.md:23-24,44-46`, `almoxarifado-patrimonio/design.md`.

---

## Value Objects

| Value Object | Atributos | Regras e Validações |
|---|---|---|
| **StatusPresenca** | `valor: string` | Enum restrito: `'confirmado'`, `'ausente'`, `'duvida'`, `'lista_espera'` |
| **PosicaoTatica** | `sigla: string`, `setor: string` | Catálogo posicional restrito: `GOL`, `LAD`, `ZAG_DIR`, `ZAG_ESQ`, `LAE`, `VOL`, `MC`, `MEI`, `PTE`, `PTD`, `CA` |
| **TipoVinculo** | `valor: string` | Enum restrito: `'mensalista'`, `'convidado'` |
| **StatusQuitacao** | `valor: string` | Enum restrito: `'pendente'`, `'pago'` |
| **ChavePix** | `tipo: string`, `chave: string` | Validação de formato (CPF, CNPJ, E-mail, Telefone, Aleatória) |
| **DinheiroBRL** | `centavos: integer` | Manipulação precisa em centavos inteiros (evitando imprecisão de ponto flutuante) |

---

## Serviços de Domínio (Domain Services)

1. **`EscalacaoService`**:
   - Coordena a validação de limite de 11 atletas e elegibilidade de presença.
   - Aplica a trava disciplinar $T-35$ comparando o timestamp de chegada do atleta com o início da preleção.
2. **`VaquinhaService`**:
   - Gera lançamentos para todos os atletas confirmados.
   - Calcula o rateio, audita a quitação do PIX e credita o excedente da meta no Caixa Geral.
3. **`AlmoxarifadoService`**:
   - Valida o checklist tríplice e emite o timestamp oficial de liberação da resenha.

---

## Mapeamento de Regras de Domínio (`target_business_rules.md`)

| ID da Regra | Local no Domínio Novo | Origem na Especificação |
|---|---|---|
| **BR-MIGRAR-001** | `AGG-Partida.calcularMarcosVestiario()` | `protocolo-vestiario` |
| **BR-MIGRAR-002** | `EscalacaoService.validarAtrasoT35()` | `protocolo-vestiario` |
| **BR-MIGRAR-005** | `AGG-Partida.registrarPresenca()` | `confirmacao-presenca` |
| **BR-MIGRAR-007** | `AGG-Partida.transbordarListaEspera()` | `confirmacao-presenca` |
| **BR-MIGRAR-009** | `AGG-Partida.invariante INV-PAR-03 (max 11)` | `prancheta-tatica` |
| **BR-MIGRAR-010** | `AGG-Partida.invariante INV-PAR-02 (elegibilidade)` | `prancheta-tatica` |
| **BR-MIGRAR-012** | `AGG-Vaquinha.invariante INV-VAQ-01` | `tesoureiro-vaquinha` |
| **BR-MIGRAR-014** | `AGG-Vaquinha.darBaixaPagamento()` | `tesoureiro-vaquinha` |
| **BR-MIGRAR-016** | `Partida.chave_pix_cobranca` | `tesoureiro-vaquinha` |
| **BR-MIGRAR-017** | `AGG-Scout.invariante INV-SCT-01 (>= 0)` | `scout-pos-jogo` |
| **BR-MIGRAR-018** | `AGG-Scout.elegerMvp() (exclusividade)` | `scout-pos-jogo` |
| **BR-MIGRAR-020** | `AGG-Almoxarifado.invariante INV-ALM-01 (desviradas)`| `almoxarifado-patrimonio` |
| **BR-MIGRAR-021** | `AGG-Almoxarifado.destravarResenha()` | `almoxarifado-patrimonio` |
| **BR-MIGRAR-022** | `AGG-Atleta.invariante INV-ATL-01 (camisa única)` | `onboarding-elenco` |
| **BR-HUMANA-001** | `User.tokensSanctum` + `Policies` | `target_business_rules` |
| **BR-HUMANA-003** | `CaixaMovimentacao.creditarExcedente()` | `target_business_rules` |
