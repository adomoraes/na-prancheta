# Onboarding: Validação e Teste do PWA — Na Prancheta

> Identificador: `001-implementar-pwa`
> Data: `2026-09-20`
> Requirements: `_reversa_forward/001-implementar-pwa/requirements.md`

Este documento orienta o desenvolvedor ou analista de qualidade no teste e validação de ponta a ponta da experiência PWA no Na Prancheta.

---

## 1. Pré-requisitos
- Node.js 20+ e npm instalados.
- Google Chrome ou Microsoft Edge (para emulação completa de eventos PWA via DevTools).
- Servidor frontend em execução (`npm run dev` ou `npm run preview`).

---

## 2. Roteiro de Testes Passo a Passo

### Cenário 1: Auditoria do Manifesto e Service Worker
1. Abra o navegador e acesse a aplicação em `http://localhost:3000` (ou `http://localhost:4173` em preview).
2. Abra as Ferramentas de Desenvolvedor (`F12` ou `Ctrl+Shift+I`).
3. Vá até a aba **Application** (Aplicativo):
   - Em **Manifest**:
     - Verifique se o nome é "Na Prancheta" e o nome curto é "Prancheta".
     - Confirme a presença dos ícones 192x192 e 512x512.
     - Confirme a cor de tema `#09090b` e modo de exibição `standalone`.
   - Em **Service Workers**:
     - Verifique se o Service Worker está registrado com status **Activated and is running**.

---

### Cenário 2: Teste de Instalação na Tela Inicial
1. No Chrome em Desktop:
   - Observe o botão de instalação com ícone de download exibido na barra superior da aplicação ou o ícone de instalação nativo na barra de endereço do navegador.
   - Em viewport mobile (modo responsivo `Ctrl+Shift+M`), observe a exibição do banner inferior de convite à instalação: *"Instale o Na Prancheta no seu celular"*.
2. Clique no botão **Instalar**:
   - Confirme a abertura da janela modal nativa do navegador.
   - Após aceitar, a aplicação deve abrir em sua própria janela independente sem barras de endereço do navegador.

---

### Cenário 3: Resiliência Offline no Vestiário / Campo
1. No DevTools do navegador, vá até a aba **Network** (Rede).
2. Altere a seleção de *No throttling* para **Offline** (ou desconecte o Wi-Fi/rede do computador).
3. Pressione `F5` para recarregar a página completamente:
   - **Resultado Esperado:** A aplicação carrega imediatamente do cache do Service Worker sem tela de erro de conexão (dino do Chrome).
   - Observe o surgimento do badge discreto **"Modo Offline — Ações locais preservadas"** no topo da interface.
4. Navegue entre as abas:
   - Vestiário e Protocolo T-35
   - Confirmação de Presença
   - Prancheta Tática
   - Tesouraria e Coleta
   - Almoxarifado
   - Scout Pós-Jogo
   - **Resultado Esperado:** Todas as telas permanecem operacionais e funcionais em modo offline.

---

### Cenário 4: Notificação de Nova Versão (Toast de Atualização)
1. Com a aplicação aberta em uma aba:
   - Na aba **Application** -> **Service Workers** do DevTools, você pode simular um novo worker ou publicar uma nova versão.
2. Observe o surgimento do toast no canto inferior direito:
   - *"Nova versão disponível! [Atualizar]"*
3. Ao clicar em **Atualizar**:
   - A página recarrega aplicando a nova versão instantaneamente.
