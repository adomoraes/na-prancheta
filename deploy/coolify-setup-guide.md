# 🚀 Guia de Implantação do Na Prancheta na VPS com Coolify

> **Guia Oficial de Operação e Deploy**  
> **Objetivo:** Subir o sistema Na Prancheta (Frontend React 19 PWA + Backend Laravel 11 + PostgreSQL 16) em servidor próprio com custo de R$ 22 a R$ 35/mês, zero cold-start, SSL automático e deploy contínuo via Git.

---

## 1. Pré-Requisitos e Escolha da VPS

Recomendamos uma VPS com no mínimo:
- **2 vCPUs**
- **2 GB a 4 GB de memória RAM**
- **20 GB+ de disco SSD / NVMe**
- **Sistema Operacional:** Ubuntu 24.04 LTS (ou 22.04 LTS)

### Provedor Mais Recomendado:
- **Hetzner Cloud:** Plano **CX22** (~€ 3,79/mês ~ R$ 23/mês). Servidores na Alemanha, Finlândia ou EUA com excelente latência e estabilidade imbatível.
- **Alternativas:** Hostinger VPS (Brasil ou EUA), DigitalOcean Basic Droplet ($4 a $6/mês) ou Linode/Akamai.

---

## 2. Passo 1: Instalação do Coolify na VPS

1. Acesse o seu servidor via terminal SSH:
   ```bash
   ssh root@<IP_DA_SUA_VPS>
   ```

2. Atualize os pacotes básicos do sistema:
   ```bash
   apt update && apt upgrade -y && apt install -y curl ufw
   ```

3. Instale o **Coolify** com o script oficial de um único comando:
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```
   *O instalador configurará automaticamente o Docker, o Traefik (proxy reverso com SSL automático) e a interface administrativa do Coolify.*

4. Após a conclusão (cerca de 2 a 3 minutos), abra o navegador em:
   ```
   http://<IP_DA_SUA_VPS>:8000
   ```
5. Cadastre o seu usuário e senha de administrador no primeiro acesso.

---

## 3. Passo 2: Configuração do Domínio (DNS)

No seu gerenciador de domínio (ex: Cloudflare, Registro.br, GoDaddy):

Crie dois registros do tipo **A**:
- **Nome:** `app` (ou `@` se for domínio raiz) ➔ **Conteúdo:** `<IP_DA_SUA_VPS>`
- **Nome:** `api` ➔ **Conteúdo:** `<IP_DA_SUA_VPS>`

*(Dica: Se usar a Cloudflare, pode deixar a nuvem cinza `DNS Only` inicialmente para o Coolify emitir os certificados Let's Encrypt diretamente).*

---

## 4. Passo 3: Deploy da Aplicação no Coolify

### 4.1 Conectar o Repositório GitHub
1. No painel do Coolify, vá em **Sources** ➔ **Add Private GitHub App** ou adicione via **Deploy Key / Personal Access Token**.
2. Conecte ao seu repositório `na-prancheta`.

### 4.2 Criar o Recurso Docker Compose
1. No menu lateral, clique em **Projects** ➔ selecione ou crie um projeto (ex: `Na Prancheta`).
2. Clique em **+ New Resource** ➔ selecione **Docker Compose**.
3. Selecione a fonte **GitHub** e escolha o repositório `na-prancheta` e o branch `main`.
4. Defina o caminho do arquivo compose:
   ```
   docker-compose.prod.yml
   ```

### 4.3 Configurar as Variáveis de Ambiente no Painel do Coolify
No painel do projeto, abra a aba **Environment Variables** e preencha:

```ini
# Chave de Criptografia do Laravel (Gere com: php artisan key:generate --show)
APP_KEY=base64:SUA_CHAVE_AQUI

# Banco de Dados
DB_DATABASE=na_prancheta
DB_USERNAME=postgres
DB_PASSWORD=DEFINA_UMA_SENHA_MUITO_SEGURA_AQUI

# URLs de Produção com HTTPS
APP_URL=https://api.seudominio.com.br
FRONTEND_URL=https://app.seudominio.com.br
SANCTUM_STATEFUL_DOMAINS=app.seudominio.com.br,seudominio.com.br

# Variável de Build do Frontend (aponta para a URL da API)
VITE_API_URL=https://api.seudominio.com.br/api

# Opcional (Google Gemini API)
GEMINI_API_KEY=sua_chave_do_google_ai_studio
```

### 4.4 Atribuir os Domínios Públicos com SSL
No Coolify, nas configurações de serviço do Compose:
- No serviço **frontend**: preencha o campo **Domains** com `https://app.seudominio.com.br`.
- No serviço **backend**: preencha o campo **Domains** com `https://api.seudominio.com.br`.

O Coolify solicitará automaticamente os certificados SSL válidos da Let's Encrypt.

### 4.5 Executar o Deploy
Clique no botão **Deploy**.

O Coolify irá:
1. Clonar o repositório.
2. Construir o container do banco PostgreSQL 16.
3. Construir o container do backend Laravel 11 com Nginx e PHP 8.2-FPM.
4. Construir o container do frontend React 19 compilado.
5. O script `entrypoint.sh` executará automaticamente `php artisan migrate --force` e o seed inicial da partida teste.
6. A aplicação estará online!

---

## 5. Validação Pós-Deploy

1. **Teste da API:**  
   Abra no navegador: `https://api.seudominio.com.br/api/partidas/1`  
   *Deve retornar os dados JSON da partida cadastrada.*

2. **Teste do Frontend Web & PWA:**  
   Abra: `https://app.seudominio.com.br`  
   *A interface do Na Prancheta deve carregar imediatamente em Dark Mode.*

3. **Instalação no Celular:**  
   - No Android (Chrome): clique no menu de 3 pontinhos ➔ **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.  
   - No iOS (Safari): clique no botão de compartilhamento ➔ **"Adicionar à Tela de Início"**.  
   *O Na Prancheta abre como aplicativo nativo em tela cheia, sem barra de navegação do browser.*

---

## 6. Rotinas de Backup e Manutenções

### Backups Automáticos do Banco de Dados
1. No Coolify, abra o serviço **postgres**.
2. Clique na aba **Backups**.
3. Ative a rotina diária (ex: às 03:00 da manhã) mantendo os últimos 7 dias salvos. Você pode vincular um bucket S3 grátis (como o Cloudflare R2 ou Backblaze B2 com 10 GB grátis perpétuos).

### Atualizações Contínuas (CI/CD Automático)
Sempre que você commitar novas alterações e fizer `git push origin main`:
- O Coolify recebe o webhook do GitHub.
- Reconstrói os containers atualizados sem interrupção de serviço.
