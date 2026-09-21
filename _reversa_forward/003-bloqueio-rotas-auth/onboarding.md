# Onboarding e Teste Manual da Feature: Bloqueio de Rotas Não Autenticadas

> Identificador: `003-bloqueio-rotas-auth`  
> Data: `2026-09-21`  
> Destinado a: Desenvolvedores, QA e Revisores de Código  

---

## 1. Pré-requisitos do Ambiente

Certifique-se de que a aplicação está rodando via script unificado:

```bash
./start.sh
# ou
npm start
```

- Frontend acessível em: `http://localhost:5173`
- Backend Laravel acessível em: `http://localhost:8000/api`

---

## 2. Cenários de Teste Manual Passo a Passo

### Cenário 1: Visitante Anônimo Acessa a Ficha Pública do Jogo
1. Abra uma aba anônima do navegador (para garantir que não haja tokens em cache).
2. Acesse `http://localhost:5173`.
3. **Resultado Esperado:**
   - O cronômetro regressivo T-50, o adversário e o endereço do campo com link GPS devem estar perfeitamente visíveis.
   - O cabeçalho deve exibir o botão "Entrar" com indicador de visitante anônimo.

### Cenário 2: Visitante Anônimo Tenta Confirmar Presença
1. Na mesma aba anônima (sem login), clique em qualquer botão de confirmação de presença (ex: "Confirmar", "Dúvida", "Recusar").
2. **Resultado Esperado:**
   - A ação é interceptada.
   - O modal de autenticação (`LoginModal`) é aberto imediatamente na tela.
   - Nenhuma chamada `POST` mutatória não autorizada é registrada no console da rede.

### Cenário 3: Visitante Anônimo Tenta Navegar para Abas Protegidas
1. Com status não autenticado, clique na aba "Prancheta Tática" no menu inferior ou lateral.
2. **Resultado Esperado:**
   - A aba não muda para a Prancheta.
   - O `LoginModal` é aberto informando a necessidade de identificação.
3. Repita o clique na aba "Tesoureiro do Dia" e "Almoxarifado".
   - O comportamento deve ser idêntico (abertura do modal de login e bloqueio da tela restrita).

### Cenário 4: Bloqueio Estrito na API REST via Terminal (cURL)
1. Execute uma chamada simulando um invasor anônimo tentando alterar presenças sem token:
   ```bash
   curl -i -X POST http://localhost:8000/api/partidas/1/presencas \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{"atleta_id": "1", "status": "confirmado"}'
   ```
2. **Resultado Esperado:**
   - Status HTTP `401 Unauthorized`.
   - Corpo JSON: `{"message": "Unauthenticated."}`.

3. Execute uma chamada na rota de leitura pública:
   ```bash
   curl -i -X GET http://localhost:8000/api/partidas/1 \
     -H "Accept: application/json"
   ```
4. **Resultado Esperado:**
   - Status HTTP `200 OK` com os dados do jogo.

### Cenário 5: Tratamento de Sessão Expirada no Frontend
1. Faça login na aplicação como Técnico (usando o perfil de dev rápido no modal de login).
2. Abra as Ferramentas de Desenvolvedor (F12) -> Application -> Local Storage.
3. Altere o valor da chave `na_prancheta_token` para uma string inválida (ex: `token_invalido_123`).
4. Tente realizar qualquer ação (ex: salvar escalação na prancheta ou alterar um scout).
5. **Resultado Esperado:**
   - O interceptador captura o erro 401 retornado pela API.
   - O token inválido é removido do `localStorage`.
   - Um toast de aviso é exibido: *"Sessão expirada. Faça login novamente."*.
   - O modal de login reabre automaticamente para reautenticação sem recarregar a tela.
