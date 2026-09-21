# Onboarding de Teste: CRUD de Locais e Campos da Partida

> Identificador: `006-crud-locais-campos`  
> Data: `2026-09-21`  
> Objetivo: Roteiro de testes manuais e de integração para a feature  

---

## 1. Pré-requisitos

1. Backend Laravel ativo e banco de dados conectado.
2. Migration aplicada (`php artisan migrate`).
3. Usuário com papel `root` autenticado no sistema.

---

## 2. Passo a Passo do Teste Manual

### Cenário A: Cadastro de Campo no Painel Administrativo
1. Acesse o sistema e abra o **Painel Admin** com o usuário `root`.
2. Acesse a aba **"Locais & Campos"**.
3. Clique em **"+ Novo Local / Campo"**.
4. Preencha os campos:
   - **Nome do Campo:** "Arena Sport Fut7"
   - **Endereço Completo:** "Rua dos Esportes, 500"
   - **Link do Google Maps / GPS:** "https://maps.google.com/?q=ArenaSport"
   - **Tipo de Piso:** "Grama Sintética"
   - **Observações:** "Vestiário com chuveiro quente"
5. Submeta o formulário.
6. **Resultado Esperado:** O local é salvo, aparece na tabela de locais com badge "ATIVO", tipo de piso e link funcional para o mapa.

---

### Cenário B: Edição de Local
1. Na tabela de locais, clique no botão de edição de "Arena Sport Fut7".
2. Altere o nome para "Arena Sport Fut7 Premium".
3. Salve as alterações.
4. **Resultado Esperado:** Os dados atualizados são exibidos na listagem.

---

### Cenário C: Agendamento de Partida Selecionando o Campo
1. Acesse a aba **"Partidas & Vestiário"**.
2. Clique em **"+ Agendar Partida"**.
3. No campo **"Campo / Local"**, abra o seletor dropdown.
4. Selecione **"Arena Sport Fut7 Premium"**.
5. **Resultado Esperado:** Os campos de Endereço e Link do Google Maps do formulário de partida são preenchidos instantaneamente com os dados do local.
6. Conclua o agendamento da partida e confirme que ela foi criada com sucesso com o `local_id` vinculado.

---

## 3. Testes Automatizados no Backend

Execute:
```bash
php artisan test --filter=LocalCrudTest
```

Todos os testes de CRUD, validação de duplicidade e vínculo com partidas devem passar com 100% de sucesso.
