# Roadmap: Número do Calçado na Ficha do Atleta

> Identificador: `005-numero-calcado-atleta`  
> Data: `2026-09-21`  
> Requirements: `_reversa_forward/005-numero-calcado-atleta/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

## 1. Resumo da abordagem

A inclusão do número do calçado na ficha do atleta será executada como uma evolução incremental não destrutiva do modelo de dados e das interfaces de usuário. 

No backend Laravel, adiciona-se a coluna `numero_calcado` (`smallInteger`, `nullable`) na tabela `atletas` através de migration específica com suporte a reversão segura (`up` e `down`). O Eloquent Model `Atleta` incorpora o campo em `$fillable` e `$casts`. As camadas de controle (`AdminController` e `AtletaController`) passam a validar entradas inteiras no intervalo entre 25 e 50.

No frontend React, a interface `Atleta` em `src/types.ts` ganha o atributo opcional `numero_calcado?: number | null`. O formulário de inclusão e edição de atletas em `AdminDashboard.tsx` recebe o campo de entrada com máscara/validação numérica, a tabela administrativa passa a expor a coluna com fallback visual para atletas legados, e o formulário de `SelfOnboardingModal.tsx` incorpora a seleção junto aos uniformes.

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Não-destrutividade de dados legados | A coluna é estritamente opcional (`nullable`), preservando intactos os atletas já cadastrados. | Respeita 🟢 |
| Segregação de responsabilidade (RBAC) | Apenas administradores e o próprio atleta durante o onboarding preenchem o calçado. | Respeita 🟢 |
| Retrocompatibilidade com Dia de Jogo | Nenhuma regra de vestiário, confirmação de presença ou scout é alterada ou desestabilizada. | Respeita 🟢 |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Tipagem numérica inteira (`smallInteger`, 25 a 50) | Garante consistência de dados esportivos e facilita filtros futuros por tamanho de calçado. | Texto livre (risco de entradas como "41/42", "tam 41"); Enum (inflexível e desnecessário). | 🟢 |
| D-02 | Coluna `nullable` sem valor padrão numérico | Atletas existentes não devem ter valores presumidos ou fictícios atribuídos automaticamente. | Valor default `0` ou `40` (criaria distorção e dados incorretos no inventário). | 🟢 |
| D-03 | Fallback visual na UI ("—") para valores nulos | Comunica explicitamente que o atleta ainda não teve seu calçado aferido/informado. | Ocultar ou exibir espaço em branco vazio (piora a legibilidade da tabela). | 🟢 |
| D-04 | Validação unificada no backend (Form Request / Validator) | Impede gravações de dados corrompidos via API direta ou chamadas externas. | Validação exclusiva no front-end (vulnerável a inconsistências). | 🟢 |

## 4. Premissas

Não há marcadores `[DÚVIDA]` no `requirements.md`. Todas as regras de negócio e limites numéricos foram acordados previamente com o usuário.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| Migration Atletas | `backend/database/migrations/` | componente-novo | Migration incremental adicionando `numero_calcado` na tabela `atletas`. |
| Model Atleta | `backend/app/Models/Atleta.php` | regra-alterada | Inclusão de `numero_calcado` em `$fillable` e `$casts`. |
| AdminController | `backend/app/Http/Controllers/Api/AdminController.php` | contrato-alterado | Validação e persistência de `numero_calcado` em `storeAtleta` e `updateAtleta`. |
| AtletaController | `backend/app/Http/Controllers/Api/AtletaController.php` | contrato-alterado | Validação e persistência de `numero_calcado` em `store` e exibição em `index`. |
| Tipos TypeScript | `src/types.ts` | contrato-alterado | Inclusão de `numero_calcado?: number \| null` na interface `Atleta`. |
| AdminDashboard | `src/components/admin/AdminDashboard.tsx` | componente-alterado | Adição do campo no formulário modal e coluna na tabela de elenco. |
| SelfOnboardingModal | `src/components/SelfOnboardingModal.tsx` | componente-alterado | Inclusão do campo numérico/seletor de calçado na ficha do atleta. |

## 6. Delta no modelo de dados

- **Resumo das mudanças:** Acréscimo do campo `numero_calcado` (`smallInteger`, `nullable`) na tabela `atletas`.
- **Detalhe completo em:** `_reversa_forward/005-numero-calcado-atleta/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| API de Atletas & Administração | HTTP | `_reversa_forward/005-numero-calcado-atleta/interfaces/atleta-calcado-api.md` |

## 8. Plano de migração

1. Criar migration `YYYY_MM_DD_HHMMSS_add_numero_calcado_to_atletas_table.php`.
2. Executar `php artisan migrate` localmente.
3. Testar reversibilidade com `php artisan migrate:rollback --step=1` e re-aplicar com `php artisan migrate`.
4. Atualizar o Model `Atleta` e as validações nos Controllers.
5. Atualizar os tipos no frontend e os componentes React afetados.
6. Rodar a suíte de testes de integração (`php artisan test`) garantindo 100% de aprovação.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Quebra de renderização no front com valor nulo | Médio | Baixa | Tipagem rigorosa `numero_calcado?: number \| null` e operador de coalescência nula `a.numero_calcado ?? '—'`. |
| Concorrência ou rejeição em formulários legados | Baixo | Baixa | O campo é opcional (`nullable`), requisições que omitirem o campo continuam aceitas. |
| Entrada de valores fora do padrão (ex.: negativos ou > 50) | Baixo | Baixa | Validação estrita na API com `min:25|max:50` e input com `min="25" max="50"`. |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Migration aplicada e testada bidirecionalmente (up/down)
- [ ] Formulário administrativo gravando e alterando número de calçado com sucesso
- [ ] Onboarding de atleta capturando número de calçado
- [ ] Suíte de testes do backend executada com 100% de aprovação
- [ ] Pull Request criado no repositório com descrição detalhada para revisão manual do usuário

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial do Roadmap técnico para número de calçado | reversa |
