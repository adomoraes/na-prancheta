# Pontos de Atenção & Monitoramento de Regressão

## Checklist de Regressão
1. **Regra Canônica PT-006 (Exclusividade de MVP):**
   - Ao eleger um atleta como MVP na partida, nenhum outro atleta na mesma partida pode continuar com `foi_mvp = true`.
2. **Restrição de Unicidade (`partida_id`, `atleta_id`):**
   - Criações de scout repetidas para o mesmo atleta na mesma partida devem atualizar o registro existente em vez de causar violação de chave única.
3. **Validação de Não-Negatividade:**
   - Valores estatísticos não podem ser negativos (`min:0`).
4. **Isolamento de Permissões RBAC:**
   - Apenas usuários com papel `root` podem acessar os endpoints `/api/admin/scouts*`. Usuários anônimos recebem 401 e usuários com outro papel recebem 403.
5. **Integração Frontend:**
   - Build do Vite deve compilar sem erros de tipos em `AdminDashboard.tsx`, `types.ts` e `api.ts`.
