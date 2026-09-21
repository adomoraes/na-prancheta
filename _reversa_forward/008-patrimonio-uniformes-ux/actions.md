# Actions: Cadastro de Patrimônio com Condicional para Uniformes e Refatoração de UX

> Identificador: `008-patrimonio-uniformes-ux`  
> Data: `2026-09-21`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 12 |
| Paralelizáveis (`[//]`) | 3 |
| Maior cadeia de dependência | 6 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar migration `add_uniforme_fields_to_itens_almoxarifado_table` adicionando `tipo_uniforme`, `tamanho`, `cor`, `numero` e `observacoes`. | - | `[//]` | `backend/database/migrations/2026_09_21_400000_add_uniforme_fields_to_itens_almoxarifado_table.php` | 🟢 | `[X]` |
| T002 | Atualizar tipagem TypeScript em `src/types.ts` adicionando os campos opcionais em `AdminPatrimonioDTO`. | - | `[//]` | `src/types.ts` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Criar suíte de testes `PatrimonioUniformeTest.php` cobrindo cadastro de itens padrão, condicional obrigatória de uniformes, persistência de atributos específicos e atualização. | T001 | - | `backend/tests/Feature/PatrimonioUniformeTest.php` | 🟢 | `[X]` |

## Fase 3, Núcleo Backend

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Atualizar Model Eloquent `ItemAlmoxarifado.php` com os novos campos no `$fillable`. | T001 | - | `backend/app/Models/ItemAlmoxarifado.php` | 🟢 | `[X]` |
| T005 | Implementar validação condicional e persistência no `AdminController.php` (`storePatrimonio` e `updatePatrimonio`). | T004 | - | `backend/app/Http/Controllers/Api/AdminController.php` | 🟢 | `[X]` |
| T006 | Atualizar `LegacyInitialDataSeeder.php` adicionando exemplos canônicos de uniformes (ex: Camisa 10 GG Azul Adidas). | T004 | - | `backend/database/seeders/LegacyInitialDataSeeder.php` | 🟢 | `[X]` |

## Fase 4, Frontend & Refatoração de UX

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Atualizar `src/services/api.ts` com suporte aos novos atributos de uniforme em `createPatrimonio` e `updatePatrimonio`. | T002 | - | `src/services/api.ts` | 🟢 | `[X]` |
| T008 | Refatorar o modal de cadastro/edição de patrimônio em `AdminDashboard.tsx` com categorias visuais, condicional reativa para uniforme, chips de tipo e chips de tamanho. | T007 | - | `src/components/admin/AdminDashboard.tsx` | 🟢 | `[X]` |
| T009 | Refatorar os cards de listagem de patrimônio em `AdminDashboard.tsx` exibindo badges de tipo, tamanho, número, cor e observações, além de filtro por categoria. | T008 | - | `src/components/admin/AdminDashboard.tsx` | 🟢 | `[X]` |

## Fase 5, Validação & Fechamento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T010 | Executar migrations locais e validar a suíte completa com `php artisan test`. | T003, T005 | - | `backend/tests/Feature/PatrimonioUniformeTest.php` | 🟢 | `[X]` |
| T011 | Validar build de frontend com `npm run build` e atualizar documentação Reversa (`investigation.md`, `legacy-impact.md`, `regression-watch.md`, `008-patrimonio-uniformes-ux.md`). | T009, T010 | - | `_reversa_sdd/addenda/008-patrimonio-uniformes-ux.md` | 🟢 | `[X]` |
| T012 | Fazer commit, push da branch `feat/008-patrimonio-uniformes-ux` e gerar o link do PR para review e merge do usuário. | T011 | - | Git Branch & PR | 🟢 | `[X]` |
