# Onboarding e Teste Manual: Painel Administrativo ROOT

> Identificador: `004-painel-adm-root`  
> Data: `2026-09-21`  
> Destinado a: Administradores do Sistema, Desenvolvedores e QA  

---

## 1. Pré-requisitos do Ambiente

Certifique-se de que os serviços da aplicação estão iniciados:

```bash
# Iniciar frontend e backend
./start.sh
# ou se preferir rodar em terminais separados:
# Terminal 1: npm run dev
# Terminal 2: cd backend && php artisan serve
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api`

---

## 2. Roteiro de Teste Manual Passo a Passo

### Cenário 1: Tentativa de Acesso por Usuário Não-Root (Proteção e Guard)
1. Acesse `http://localhost:5173`.
2. Efetue login com o perfil **Técnico** (ou Atleta / Financeiro) através do seletor rápido no `LoginModal`.
3. Verifique o cabeçalho (`Header`):
   - **Resultado Esperado:** O botão "Painel Administrativo" **NÃO** deve estar visível.
4. Tente forçar o acesso direto via console ou URL administrativa:
   - **Resultado Esperado:** O usuário permanece no fluxo de jogo e não obtém acesso à visão de administração.

### Cenário 2: Acesso do Superusuário ROOT à Dashboard Administrativa
1. Faça logout e clique em "Entrar".
2. No modal de login, selecione o perfil de demonstração **ROOT** (ou informe as credenciais de um usuário com role `root`).
3. Observe o cabeçalho:
   - **Resultado Esperado:** Um botão destacado **"Painel Admin"** (ícone de engrenagem / chave de segurança) é exibido no topo.
4. Clique no botão "Painel Admin".
   - **Resultado Esperado:**
     - A interface transiciona para a **Dashboard Administrativa ROOT** (tema Dark Mode elegante em tons Zinc 950 com acentos esmeralda/roxo).
     - No topo da dashboard, há um botão claro de **"Voltar ao Jogo"**.
     - É exibida a barra de navegação com as 5 abas modulares:
       1. Usuários & Perfis
       2. Elenco & Atletas
       3. Partidas & Jogos
       4. Caixa Geral
       5. Patrimônio Esportivo

### Cenário 3: CRUD de Usuários e Gestão de Roles
1. Na aba **Usuários & Perfis**:
2. Clique no botão **"Novo Usuário"**.
3. Preencha o formulário:
   - Nome: `Novo Diretor de Teste`
   - E-mail: `diretor.teste@naprancheta.com`
   - Papel: `geral`
   - Senha: `senhaSegura123`
4. Clique em **"Salvar Usuário"**.
   - **Resultado Esperado:** O usuário aparece listado na tabela imediatamente.
5. Na linha do usuário recém-criado, clique em **"Redefinir Senha"**:
   - Defina uma nova senha e confirme.
   - **Resultado Esperado:** Toast de sucesso confirmando a alteração.

### Cenário 4: CRUD de Atletas com Exclusão Lógica (Soft Delete)
1. Clique na aba **Elenco & Atletas**.
2. Clique em **"Cadastrar Atleta"**:
   - Nome: `Lucas Silveira`
   - Apelido: `Luquinhas`
   - Número: `17`
   - Posição: `MEI`
   - Mensalista: `Sim`
3. Salve o cadastro e confirme que ele surge na listagem com badge verde "Ativo".
4. Clique na ação de **"Desativar Atleta"**:
   - Confirme a desativação.
   - **Resultado Esperado:** O atleta não é excluído do banco de dados; seu status muda para badge cinza "Inativo", preservando todos os scouts e presenças prévias no histórico.
5. Clique no botão **"Reativar"** para comprovar que o ROOT pode restaurar o atleta a qualquer momento.

### Cenário 5: CRUD de Partidas e Parâmetros
1. Clique na aba **Partidas & Jogos**.
2. Clique em **"Nova Partida"**:
   - Adversário: `Barcelona do Bairro`
   - Data/Hora: Selecione uma data futura
   - Local: `Clube Recreativo Alvorada`
   - Teto de Atletas: `16`
3. Salve e confira se a partida foi gerada com o cronograma T-50 / T-35 / T-25 calculado.

### Cenário 6: CRUD Financeiro e Patrimônio
1. Acesse a aba **Caixa Geral**:
   - Clique em **"Novo Lançamento"**, selecione tipo "Saída", valor `85.00` e descrição `Gelo e frutas para o vestiário`.
   - Salve e confira a atualização do saldo consolidado.
2. Acesse a aba **Patrimônio**:
   - Adicione 10 coletes laranjas ao almoxarifado.
   - Edite a quantidade para 12 e verifique a persistência.

### Cenário 7: Retorno ao Fluxo de Jogo
1. Clique no botão **"Voltar ao Jogo"** no topo da tela administrativa.
2. **Resultado Esperado:** Retorna imediatamente para a tela da partida ativa com todos os dados sincronizados.
