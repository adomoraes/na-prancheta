# Adendo: Inclusão do Número do Calçado na Ficha do Atleta

> Identificador: `005-numero-calcado-atleta`  
> Data: `2026-09-21`  
> Cenário: `legado`  
> Origem: `_reversa_forward/005-numero-calcado-atleta/`  

---

## 1. Vigência

Vigente desde 2026-09-21.

---

## 2. Resumo da entrega

Inclusão do atributo **Número do Calçado** (`numero_calcado`) na ficha cadastral do atleta, preenchendo uma lacuna logística na distribuição e aquisição de materiais esportivos (chuteiras, tênis society e meiões) para o elenco da agremiação.

A entrega contemplou:
1. **Esquema de Dados:** Migration incremental adicionando a coluna `numero_calcado` (`smallInteger`, `nullable`) na tabela `atletas` com capacidade de rollback estrito.
2. **Camada de Aplicação:** Validação de integridade na API (faixa numérica inteira entre 25 e 50) nos controladores `AdminController` e `AtletaController`, e tipagem no Model Eloquent `Atleta`.
3. **Interfaces de Usuário:** Atualização do painel administrativo ROOT (`AdminDashboard.tsx`) com campo numérico no modal e coluna na tabela de elenco, além do formulário de auto-cadastro (`SelfOnboardingModal.tsx`).
4. **Qualidade e Testes:** 5 novos testes de integração automatizados na suíte `AtletaCalcadoTest.php`, elevando a cobertura para 39 testes (173 asserções) com 100% de aprovação.

Todas as **10 ações atômicas** planejadas em `_reversa_forward/005-numero-calcado-atleta/actions.md` foram concluídas com sucesso.

---

## 3. Impacto por artefato da extração

| Artefato | Seção | Tipo de impacto | Delta |
|---|---|---|---|
| `_reversa_sdd/architecture.md` | `#2-arquitetura-do-backend-laravel-11` | `delta-de-dados` | A tabela `atletas` agora contempla a coluna `numero_calcado` (`smallInteger`, nullable) mapeada no Model `Atleta`. |
| `_reversa_sdd/data-dictionary.md` | `#2-entidades-e-tabelas` | `delta-de-dados` | Documentada a coluna `numero_calcado` na tabela `atletas` com faixa aceitável de 25 a 50. |
| `_reversa_sdd/domain.md` | `#1-glossário-do-domínio` | `regra-nova` | A ficha cadastral do atleta suporta a dimensão de calçado para fins de kit e uniforme esportivo. |
| `_reversa_sdd/architecture.md` | `#21-padrão-single-page-application` | `componente-novo` | Campo de entrada integrado no modal de atletas do `AdminDashboard.tsx` e no `SelfOnboardingModal.tsx`. |

---

## 4. Regras sob vigilância

Os seguintes itens de monitoramento de regressão foram formalizados para auditoria nas próximas re-extrações:

- [`W001`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/005-numero-calcado-atleta/regression-watch.md): Atletas cadastrados sem `numero_calcado` devem permanecer válidos com `null`, renderizando fallback "—" sem quebras.
- [`W002`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/005-numero-calcado-atleta/regression-watch.md): Entradas fora da faixa regulamentar de 25 a 50 devem ser rejeitadas pela API com status HTTP 422.
- [`W003`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/005-numero-calcado-atleta/regression-watch.md): Atualizações cadastrais via PUT devem ser atômicas e idempotentes, sem exigir reenvio compulsório do número de calçado.

Detalhes completos em: [`_reversa_forward/005-numero-calcado-atleta/regression-watch.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/005-numero-calcado-atleta/regression-watch.md).

---

## 5. Fontes

- `_reversa_forward/005-numero-calcado-atleta/requirements.md`
- `_reversa_forward/005-numero-calcado-atleta/roadmap.md`
- `_reversa_forward/005-numero-calcado-atleta/actions.md`
- `_reversa_forward/005-numero-calcado-atleta/progress.jsonl`
- `_reversa_forward/005-numero-calcado-atleta/legacy-impact.md`
- `_reversa_forward/005-numero-calcado-atleta/regression-watch.md`
- `_reversa_forward/005-numero-calcado-atleta/interfaces/atleta-calcado-api.md`
- `_reversa_forward/005-numero-calcado-atleta/onboarding.md`
