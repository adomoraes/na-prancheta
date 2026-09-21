# Investigação Técnica: Bloqueio de Rotas e Proteção de Recursos

> Identificador: `003-bloqueio-rotas-auth`  
> Data: `2026-09-21`  
> Contexto: Autenticação Laravel Sanctum, SPA Desacoplada e Guards de Navegação  

---

## 1. Contexto do Problema

Na entrega da feature `002-autenticacao-google-rbac`, foram implementados a autenticação Google GIS, login por credenciais, RBAC com 5 papéis de acesso e tokens de acesso pessoal via Laravel Sanctum.

No entanto, uma análise das rotas em `backend/routes/api.php` revelou que:
1. As rotas de confirmação de presença (`POST /partidas/{id}/presencas`) não possuíam middleware de autenticação (`auth:sanctum`), permitindo que chamadas anônimas alterassem a lista de confirmados e a pontualidade dos atletas.
2. As rotas com controle de papel (`->middleware('role:tecnico,geral')`, etc.) utilizavam o middleware `CheckRole`, que ao verificar `$request->user('sanctum') ?? $request->user()` permitia a passagem de requisições se `$user` fosse nulo (quando desacompanhado do middleware `auth:sanctum`).
3. No frontend desacoplado (React 19), as abas operacionais (`tatica`, `financeiro`, `almoxarifado`) podiam ser clicadas diretamente no menu inferior e lateral sem validação prévia de login.

---

## 2. Padrões Avaliados e Decisões

### 2.1 Backend: Guard em Nível de Rota vs. Guard em Controller

- **Alternativa A (Verificação manual nos Controllers):** Inserir verificações `if (!auth()->check())` ou `abort(401)` nos métodos de cada controller.
  - *Avaliação:* Descartada. Alto risco de omissão em novos métodos, duplicação de lógica e acoplamento desnecessário do controller com preocupações de infraestrutura.
- **Alternativa B (Middleware `auth:sanctum` em grupos no `routes/api.php`):** Agrupar todas as mutações sob o middleware nativo do Sanctum.
  - *Avaliação:* **Adotada.** O Laravel Sanctum intercepta o cabeçalho `Authorization: Bearer <token>`, valida no banco e, caso inválido ou ausente, responde imediatamente com HTTP 401 Unauthorized e payload JSON uniforme antes da execução de qualquer controller.

### 2.2 Tratamento de Erro 401 no Cliente HTTP Desacoplado

- **Padrão Utilizado:** Centralização no método `request()` do `src/services/api.ts`.
- **Comunicação Desacoplada:** Ao detectar status 401:
  1. O token inválido é removido de `localStorage`.
  2. Um evento customizado nativo do navegador `window.dispatchEvent(new CustomEvent('auth:session-expired'))` é disparado.
  3. O `AuthContext` escuta esse evento, limpa os estados do usuário em memória (`setUser(null)` e `setToken(null)`), exibe um toast informativo com visual Dark Mode e aciona `openLoginModal()`.
- **Vantagem:** Evita dependência circular entre `api.ts` e `AuthContext.tsx`.

### 2.3 Experiência de Visitante (Shareability via WhatsApp)

- A aplicação Na Prancheta vive do compartilhamento orgânico de links de jogos nos grupos de WhatsApp dos times amadores.
- Se o link do jogo (`GET /partidas/{id}`) exigisse login imediato, atletas atrasados ou convidados que ainda não possuem cadastro não conseguiriam ver o endereço do campo (GPS) nem o horário de início (cronômetro T-50).
- Por isso, a decisão de manter as rotas `GET /partidas/{id}` e `/protocolo-vestiario` públicas preserva o valor essencial do produto sem comprometer a segurança das mutações de dados.

---

## 3. Fontes e Referências

- Documentação Oficial do Laravel 11 — *Sanctum API Token Authentication*: `https://laravel.com/docs/11.x/sanctum`
- OWASP Top 10 — *Broken Authentication & Broken Access Control*: Diretrizes de rejeição antecipada em nível de middleware.
- Arquitetura SDD Na Prancheta — `_reversa_sdd/architecture.md` e `_reversa_sdd/permissions.md`.
