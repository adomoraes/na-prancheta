# Guia de Teste & Onboarding: Feature 012 - Whitelabel, Planos e Pagamentos

> Identificador: `012-whitelabel-onboarding-planos`  
> Data: `2026-10-06`  
> Confidência: 🟢 CONFIRMADO  

---

## 1. Pré-requisitos do Ambiente

1. Aplicação frontend em execução:
   ```bash
   npm run dev
   ```
2. Servidor backend Laravel ativo:
   ```bash
   cd backend && php artisan serve --port=8000
   ```
3. Migrações e seeders de planos executados:
   ```bash
   cd backend && php artisan migrate
   cd backend && php artisan db:seed --class=PlanosSeeder
   ```

---

## 2. Roteiro Passo a Passo de Teste Funcional

### Etapa 1: Fluxo de Auto-cadastro (Onboarding)
1. Acesse a página inicial ou abra o modal de onboarding clicando em **"Cadastre seu Clube"**.
2. Preencha os campos:
   - Nome do Clube: `Guarani da Várzea F.C.`
   - Sigla: `GVA`
   - Modalidade: `Futebol 11`
   - Nome do Gestor: `Carlos Técnico`
   - E-mail: `carlos@guaranivarzea.com`
   - Senha: `SenhaSegura123!`
3. Avance e confirme o início do período de teste gratuito de 14 dias (sem pedir cartão).
4. **Resultado Esperado:** O sistema cria a agremiação com status `trial` e autentica o gestor automaticamente, exibindo tela de boas-vindas.

### Etapa 2: Personalização Visual (Branding Whitelabel)
1. No menu do gestor, acesse a aba **"Identidade Visual & Branding"**.
2. Selecione:
   - Cor Primária: `#16a34a` (Verde Esmeralda)
   - Cor Secundária: `#ffffff` (Branco)
   - Upload de Escudo: Envie uma imagem PNG quadrada.
3. Clique em **"Salvar Identidade"**.
4. **Resultado Esperado:** Os botões principais, cabeçalhos, destaques e cards da interface assumem imediatamente as cores e o escudo do Guarani da Várzea.

### Etapa 3: Consulta de Planos e Checkout PIX
1. Acesse a aba **"Assinatura & Planos"**.
2. Visualize as opções:
   - *Plano Amador:* R$ 49,90/mês (1 elenco, até 25 atletas)
   - *Plano Campeão:* R$ 99,90/mês (3 elencos, até 80 atletas, scouts completos)
   - *Plano Liga:* R$ 199,90/mês (ilimitado)
3. Selecione o **Plano Campeão** (Ciclo Mensal) e clique em **"Assinar via PIX"**.
4. **Resultado Esperado:** Um modal de checkout é renderizado com QR Code dinâmico do PIX, chave Copia-e-Cola e cronômetro de expiração de 30 minutos.

### Etapa 4: Simulação de Confirmação por Webhook
1. Emita um POST HTTP simulando a liquidação da fatura enviada pelo gateway:
   ```bash
   curl -X POST http://localhost:8000/api/webhooks/pagamentos \
     -H "Content-Type: application/json" \
     -d '{
       "event_id": "EVT-TEST-001",
       "event": "PAYMENT_CONFIRMED",
       "transacao_id": "TRANS-PIX-12345",
       "fatura_id": "<UUID_DA_FATURA_GERADA>",
       "valor_centavos": 9990
     }'
   ```
2. **Resultado Esperado:** O webhook retorna HTTP 200 `{"status": "processed"}`. Recarregue a tela do gestor: o status comuta para `Assinatura Ativa (Plano Campeão)` e o período de vigência é estendido por 30 dias.
3. Reenvie o mesmo comando com o mesmo `event_id`: o sistema retorna HTTP 200 `{"status": "already_processed"}` comprovando a idempotência.

### Etapa 5: Teste de Personificação por Superusuário ROOT
1. Faça logout e autentique-se com a conta ROOT da plataforma (`admin@naprancheta.com`).
2. Acesse o **Painel Administrativo Master** (`/admin`).
3. Localize o `Guarani da Várzea F.C.` na tabela de clubes e clique no botão **"Personificar"**.
4. **Resultado Esperado:** A interface comuta para a visão do Guarani da Várzea exibindo uma barra superior indicativa: *"Modo de Suporte: Visualizando como Guarani da Várzea | [Sair da Personificação]"*.
