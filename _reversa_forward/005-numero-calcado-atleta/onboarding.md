# Onboarding de Teste: Número do Calçado na Ficha do Atleta

> Identificador: `005-numero-calcado-atleta`  
> Data: `2026-09-21`  
> Objetivo: Roteiro passo a passo para validação funcional e manual da feature  

---

## 1. Pré-requisitos

1. Backend Laravel ativo e conectado ao banco de dados local.
2. Frontend Vite em execução na porta local (ex.: `http://localhost:5173`).
3. Migration aplicada via `php artisan migrate`.

---

## 2. Passo a Passo de Teste Manual

### Cenário A: Cadastro de Atleta com Calçado no Painel Administrativo
1. Acesse o sistema e faça login com um usuário que possua a role `root` (ex.: `root@naprancheta.com`).
2. Acesse o Painel Administrativo clicando no botão **"Admin"** no cabeçalho.
3. No painel, clique na aba **"Atletas & Elenco"**.
4. Clique no botão **"+ Novo Atleta"**.
5. Preencha os campos obrigatórios:
   - **Nome Completo:** "Gabriel Menino"
   - **Apelido:** "Menino"
   - **Número da Camisa:** "25"
   - **Posição Principal:** "MEI"
   - **Número do Calçado:** "41"
6. Clique em **"Cadastrar Atleta"**.
7. **Resultado Esperado:** O modal fecha, um toast de sucesso é exibido e a tabela de atletas exibe "Gabriel Menino" com o número de calçado `41`.

---

### Cenário B: Edição do Calçado de um Atleta Existente
1. Na tabela da aba **"Atletas & Elenco"**, localize um atleta que ainda não possua calçado preenchido (que exiba `—`).
2. Clique no ícone de **"Editar"** (lápis) na linha do atleta.
3. No campo **"Número do Calçado"**, digite `43`.
4. Clique em **"Salvar Alterações"**.
5. **Resultado Esperado:** Os dados são atualizados com sucesso e a coluna de calçado passa a exibir `43`.

---

### Cenário C: Validação de Valor Inválido
1. Clique em **"+ Novo Atleta"** ou em **"Editar"**.
2. No campo **"Número do Calçado"**, digite `15` ou `65` (fora da faixa 25 a 50).
3. Tente submeter o formulário.
4. **Resultado Esperado:** O sistema impede o envio ou a API retorna erro 422 indicando que o número deve estar entre 25 e 50.

---

### Cenário D: Auto-Onboarding pelo Atleta (Self-Onboarding)
1. Abra o formulário de cadastro de novo atleta (*Self-Onboarding*).
2. Na seção de medidas e uniformes, verifique o campo de numeração de calçado.
3. Selecione ou digite `41`.
4. Conclua o cadastro e confirme que o dado foi associado à ficha do atleta.

---

## 3. Testes Automatizados no Backend

Para validar via linha de comando:

```bash
php artisan test --filter=AtletaAdminTest
```

Todas as asserções de validação de campo, persistência, atualização e rejeição de valores inválidos devem passar com 100% de sucesso.
