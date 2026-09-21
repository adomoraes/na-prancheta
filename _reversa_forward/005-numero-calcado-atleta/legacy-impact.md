# Impacto no Legado: Número do Calçado na Ficha do Atleta

> Identificador: `005-numero-calcado-atleta`  
> Data: `2026-09-21`  
> Política de edição do legado: `allowLegacyEdits: true`, `allowedPaths: []` (irrestrito)  

---

## 1. Arquivos Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|---|---|---|---|---|
| `backend/database/migrations/2026_09_21_100000_add_numero_calcado_to_atletas_table.php` | Esquema de Dados | `delta-de-dados` | LOW | Migration incremental não-destrutiva adicionando coluna `numero_calcado` (`smallInteger`, `nullable`). |
| `backend/app/Models/Atleta.php` | Entidade Atleta | `regra-alterada` | LOW | Inclusão de `numero_calcado` em `$fillable` e `$casts`. |
| `backend/app/Http/Controllers/Api/AdminController.php` | Backoffice ROOT | `regra-nova` | LOW | Validação (`min:25\|max:50`) e atribuição de `numero_calcado` em `storeAtleta` e `updateAtleta`. |
| `backend/app/Http/Controllers/Api/AtletaController.php` | Cadastro de Elenco | `regra-nova` | LOW | Validação e persistência de `numero_calcado` em `store`. |
| `backend/tests/Feature/AtletaCalcadoTest.php` | Suíte de Testes | `componente-novo` | LOW | 5 novos testes de integração validando persistência, limites e integridade relacional. |
| `src/types.ts` | Tipagem TypeScript | `delta-de-contrato-externo` | LOW | Adição de `numero_calcado?: number \| null` nas interfaces `Atleta` e `AdminAtletaDTO`. |
| `src/services/api.ts` | Cliente API | `delta-de-contrato-externo` | LOW | Adição de `numero_calcado?: number` no payload de `createAtleta`. |
| `src/components/admin/AdminDashboard.tsx` | Dashboard ROOT | `componente-novo` | LOW | Inclusão do campo numérico no modal de atletas e coluna de exibição na tabela de elenco. |
| `src/components/SelfOnboardingModal.tsx` | Onboarding Atleta | `componente-novo` | LOW | Inclusão de campo numérico de calçado na seção de medidas do formulário do atleta. |
| `README.md` | Documentação | `componente-novo` | LOW | Atualização das métricas de testes (39 testes, 173 asserções) e árvore de diretórios. |

---

## 2. Diff Conceitual por Componente

### Backend & Banco de Dados
A tabela `atletas` recebeu a coluna `numero_calcado` do tipo `SMALLINT` com nulabilidade ativada. A camada de modelo e controle foi equipada com validação automática que rejeita valores inferiores a 25 ou superiores a 50, bem como tipos não-numéricos. Atletas pré-existentes permanecem com `null` sem quebrar listagens ou relacionamentos históricos.

### Frontend & Experiência do Usuário
A interface gráfica agora dispõe do campo "Nº Calçado" no modal de cadastro e edição de atletas da área administrativa, bem como no auto-cadastro de novos atletas (*Self-Onboarding*). A tabela de atletas apresenta uma coluna dedicada com fallback ("—") para atletas que ainda não informaram sua numeração.

---

## 3. Regras de Negócio Preservadas

| Regra | Descrição no Legado | Status |
|---|---|---|
| `RN-01 (Confirmação Prévia)` | Confirmação em `EventoPresenca` para escalação | Preservada 🟢 |
| `RN-02 (Corte Disciplinar T-35)` | Atletas com atraso vão para o banco | Preservada 🟢 |
| `RN-03 (Teto de 11 Titulares)` | Limite estrito de 11 atletas no campo | Preservada 🟢 |
| `RN-05 (Cota de Arbitragem)` | Rateio de vaquinha restrito a confirmados | Preservada 🟢 |
| `RN-11 (MVP Exclusivo)` | Unicidade de Craque do Jogo por confronto | Preservada 🟢 |
| `RBAC ROOT Exclusivo` | Rotas `/api/admin/*` restritas a `role:root` | Preservada 🟢 |

---

## 4. Regras de Negócio Modificadas / Novas

| Regra | Natureza da Modificação |
|---|---|
| Ficha Cadastral do Atleta | Agora suporta o atributo opcional `numero_calcado` (inteiro entre 25 e 50). |
| Validação de Entrada de Atletas | As rotas de criação e edição exigem validação de faixa numérica para o calçado quando o campo estiver presente. |
