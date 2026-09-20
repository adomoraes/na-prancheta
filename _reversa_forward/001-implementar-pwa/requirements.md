# Requirements: Suporte a Progressive Web App (PWA)

> Identificador: `001-implementar-pwa`
> Data: `2026-09-20`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

Esta especificação define a capacitação da aplicação Na Prancheta como um Progressive Web App (PWA). A entrega permite instalação direta na tela inicial de dispositivos móveis e suporte a operação em campo com conectividade instável ou offline, garantindo que atletas, técnicos e mesários operem vestiário, presença, escalação e tesouraria no dia do jogo sem depender de sinal contínuo de internet.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#1-visão-geral-da-arquitetura` | Projeto concebido com foco estrito na experiência do usuário em dispositivos móveis (mobile-first / PWA feel) para o dia do jogo. | 🟢 |
| `_reversa_sdd/architecture.md#22-estratégia-de-persistência-local-first` | Persistência orientada a navegador via armazenamento local (`localStorage`), com hidratação imediata no cliente. | 🟢 |
| `_reversa_sdd/architecture.md#23-estilização-e-design-system-moderno` | Paleta escura baseada em Zinc 950 com acentos semânticos e tipografia Plus Jakarta Sans e Cabinet Grotesk. | 🟢 |
| `_reversa_sdd/domain.md#21-regras-de-presença-e-escalação` | RN-04 (Ergonomia de Resposta Mobile de 1 Toque) com alvos de toque adequados para smartphone em campo. | 🟢 |
| `_reversa_sdd/inventory.md#superfície` | Aplicação cliente web SPA com ponto de entrada em `index.html` e configuração no ecossistema Vite. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Atleta / Mensalista** | Confirmar presença e consultar vestiário rapidamente sem abrir navegador. | Acessa o aplicativo diretamente pelo ícone na tela inicial do celular ao sair de casa ou a caminho do jogo. |
| **Técnico / Comissão** | Gerenciar o protocolo de vestiário T-35 e escalação no gramado. | Abre o aplicativo na beira do campo, onde a cobertura 4G/5G oscila, consultando e ajustando a escalação tática sem interrupção. |
| **Tesoureiro do Dia** | Cobrar taxa de jogo e registrar quitações no vestiário. | Registra pagamentos e copia prestação de contas no vestiário físico mesmo em áreas subterrâneas com sinal fraco. |
| **Almoxarife** | Realizar o checklist de malas de uniforme e bolas antes da resenha. | Efetua a conferência dos itens de patrimônio offline no porta-malas do carro ao término da partida. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Instalação Autônoma na Tela Inicial)** 🟢
   - Origem no legado: `_reversa_sdd/architecture.md#1-visão-geral-da-arquitetura`
   - Tipo: nova
   - O sistema deve disponibilizar manifesto de aplicativo web permitindo instalação em modo autônomo (standalone), ocultando a barra de navegação e URL do navegador para proporcionar imersão nativa.

2. **RN-02 (Resiliência e Continuidade Operacional Offline)** 🟢
   - Origem no legado: `_reversa_sdd/architecture.md#22-estratégia-de-persistência-local-first`
   - Tipo: nova
   - Quando o dispositivo perder conexão com a internet, o aplicativo deve continuar carregando e renderizando todas as telas operacionais (Vestiário, Presença, Prancheta, Tesouraria, Almoxarifado e Scout) a partir do cache local.

3. **RN-03 (Sinalização de Estado de Rede)** 🟢
   - Origem no legado: n/a
   - Tipo: nova
   - O aplicativo deve informar ao usuário o estado atual da conectividade (online vs. offline) de maneira não intrusiva, orientando que as ações locais serão preservadas até o restabelecimento da conexão.

4. **RN-04 (Ciclo de Atualização Interativa de Versão)** 🟢
   - Origem no legado: Esclarecimento da Sessão 2026-09-20
   - Tipo: nova
   - Ao detectar nova versão do Service Worker baixada e pronta para ativação, o aplicativo deve exibir um toast interativo permitindo que o usuário aplique a atualização imediatamente através de um toque, sem interromper operações em andamento de forma involuntária.

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Manifesto de Aplicativo Web (Web App Manifest) | Must | Existir arquivo de manifesto servido na raiz informando nome da aplicação ("Na Prancheta"), nome curto ("Prancheta"), tema escuro (#09090b), cor de fundo (#09090b), orientação retrato e ícones nos formatos 192x192, 512x512 e maskable. | 🟢 |
| RF-02 | Service Worker com Shell Caching e Toast de Atualização | Must | Registrar Service Worker para cache offline do app shell e exibir componente Toast/alerta interativo com ação de recarga imediata ("Nova versão disponível! Atualizar") quando houver atualização em espera. | 🟢 |
| RF-03 | UX Híbrida de Instalação (Banner Inferior + Botão no Menu) | Should | Exibir banner inferior contextual nos primeiros acessos em navegadores compatíveis (`beforeinstallprompt`) e manter botão discreto permanente no cabeçalho/menu para instalação a qualquer momento. | 🟢 |
| RF-04 | Indicador Visual de Modo Offline | Should | Exibir indicador contextual discreto na interface quando o dispositivo estiver sem conexão com a internet, atualizando em tempo real ao reconectar. | 🟢 |
| RF-05 | Cache de Dados de Leitura da Partida | Should | Permitir a leitura dos dados da última partida consultada mesmo quando o aplicativo for iniciado sem acesso à rede. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Tempo de carregamento inferior a 1,5 segundo em conexões 3G lentas ou offline após primeira visita. | Atletas e comissão acessam a aplicação no campo com latência alta. | 🟢 |
| Usabilidade | Experiência de tela cheia sem barras de navegador e sem comportamentos indesejados de zoom por duplo toque em inputs. | `_reversa_sdd/domain.md#21-regras-de-presença-e-escalação` (RN-04). | 🟢 |
| Confiabilidade | Falhas na rede externa não devem gerar telas em branco ou erros de exceção não tratados. | Princípio local-first estabelecido em `_reversa_sdd/architecture.md#22`. | 🟢 |
| Segurança | Service Worker e manifesto servidos obrigatoriamente através de protocolo seguro (HTTPS / Localhost). | Requisito normativo do padrão W3C para Service Workers. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Carregamento da aplicação em dispositivo sem conectividade à internet
  Dado que o usuário já acessou o Na Prancheta pelo menos uma vez
  E o dispositivo encontra-se sem sinal de internet ou em modo avião
  Quando o usuário abre o aplicativo pela tela inicial ou navegador
  Então o aplicativo exibe o shell da aplicação normalmente
  E exibe um indicador visual discreto informando que o sistema está em modo offline
  E as telas de vestiário, presença, escalação e tesouraria permanecem navegáveis com dados em cache

Cenário: Instalação do aplicativo via banner contextual ou botão de menu
  Dado que o usuário navega na aplicação em navegador compatível com PWA
  E a aplicação ainda não foi instalada no dispositivo
  Quando os requisitos de instalabilidade forem atendidos
  Então o sistema disponibiliza o banner de instalação no rodapé e o botão permanente no cabeçalho
  E ao acionar a instalação por qualquer uma das opções, o sistema operacional abre o diálogo nativo de confirmação

Cenário: Notificação e ativação de nova versão
  Dado que o usuário está navegando no Na Prancheta
  Quando um novo Service Worker for detectado e instalado em background
  Então um toast interativo surge na tela informando "Nova versão disponível!" com botão "Atualizar"
  E ao clicar em "Atualizar", a nova versão é ativada e a página é recarregada
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (Manifesto Web) | Must | Base fundamental de qualquer PWA para identificação e instalação no SO. |
| RF-02 (Service Worker e Caching) | Must | Essencial para viabilizar o funcionamento autônomo, offline e controle de atualizações. |
| RF-03 (UX Híbrida de Instalação) | Should | Maximiza a adesão do usuário de forma amigável e não invasiva. |
| RF-04 (Indicador de Modo Offline) | Should | Informa o estado real ao usuário sem bloquear sua navegação. |
| RF-05 (Cache de Dados de Leitura) | Should | Evita tela vazia no vestiário sem sinal. |

## 9. Esclarecimentos

### Sessão 2026-09-20
- **Q:** Estratégia de atualização do Service Worker quando uma nova versão for publicada?
  **R:** Opção B — Prompt interativo (Toast de atualização): exibe notificação *"Nova versão disponível! [Atualizar]"*, permitindo ao usuário recarregar na hora sem perder o contexto de uso operacional.
- **Q:** Ergonomia e posicionamento do convite de instalação (PWA Install Prompt)?
  **R:** Opção C — Híbrido: Banner contextual inferior nos primeiros acessos + botão permanente discreto no cabeçalho/menu da aplicação para instalação a qualquer momento.

## 10. Lacunas

> Nenhuma lacuna pendente. Todas as dúvidas identificadas foram esclarecidas e incorporadas aos requisitos.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-20 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-09-20 | Resolução de dúvidas de atualização e UX de instalação via `/reversa-clarify` | reversa |
