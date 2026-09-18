# Inventário do Sistema — Na Prancheta

> Gerado pelo **Reversa Scout** em 18/09/2026  
> Escopo: Mapeamento de superfície e inventário estrutural de código

---

## 1. Visão Geral do Projeto

| Atributo | Detalhe |
|---|---|
| **Nome do Projeto** | Na Prancheta |
| **Descrição** | Sistema integrado de gestão esportiva amadora, protocolo de vestiário T-50/T-35/T-25, presença, vaquinha e scout |
| **Linguagem Principal** | TypeScript (~5.8.2) |
| **Arquitetura** | Frontend SPA (Single Page Application) baseada em Componentes React |
| **Build & Tooling** | Vite 6.2.3, TailwindCSS 4.1.14 (@tailwindcss/vite), PostCSS/Autoprefixer |
| **Gerenciador de Pacotes** | npm |
| **Total de Arquivos Rastreados** | 21 arquivos (excluindo dependências e artefatos de build) |

---

## 2. Estrutura de Diretórios

```
na-prancheta/
├── .agents/                      # Configurações e skills de agentes
├── .env.example                  # Variáveis de ambiente de exemplo (GEMINI_API_KEY, APP_URL)
├── .gitignore                    # Regras de exclusão do Git
├── .reversa/                     # Estado, contexto e planos do framework Reversa
├── AGENTS.md                     # Diretrizes e comandos do framework Reversa
├── GEMINI.md                     # Diretrizes de integração Gemini CLI
├── index.html                    # Ponto de entrada HTML do Vite
├── metadata.json                 # Metadados da aplicação AI Studio / Cloud Run
├── package.json                  # Manifesto de dependências e scripts npm
├── public/                       # Assets estáticos
│   └── assets/
│       └── aistudio/
├── src/                          # Código-fonte da aplicação
│   ├── App.tsx                   # Componente raiz, orquestrador de estado e abas
│   ├── index.css                 # Estilos globais e importação do TailwindCSS v4
│   ├── main.tsx                  # Ponto de entrada React DOM
│   ├── types.ts                  # Definições de tipos, contratos e modelos de domínio
│   ├── components/               # Módulos funcionais e interface visual
│   │   ├── AlmoxarifadoView.tsx      # Almoxarifado, patrimônio e checklist de malas
│   │   ├── Header.tsx                # Cabeçalho com seletor de perfil/visão e onboarding
│   │   ├── MatchCardConfirmacao.tsx  # Ficha do jogo e confirmação de presença (1 toque)
│   │   ├── PranchetaTecnica.tsx      # Prancheta tática 4-3-3 e trava de atraso
│   │   ├── ScoutPosJogo.tsx          # Lançamento expresso de scout e eleição de MVP
│   │   ├── SelfOnboardingModal.tsx   # Modal de auto-cadastro de novos atletas
│   │   ├── TesoureiroColeta.tsx      # Painel de rateio da vaquinha e PIX do tesoureiro
│   │   └── VestiarioTimeline.tsx     # Linha do tempo T-50/T-35/T-25 e cronômetro vivo
│   └── data/
│       └── initialData.ts        # Dados iniciais e fallback mock de elenco, evento e patrimônio
├── tsconfig.json                 # Configuração do TypeScript
└── vite.config.ts                # Configuração do bundler Vite e plugins
```

---

## 3. Catálogo de Arquivos

### 3.1 Pontos de Entrada e Configurações

| Arquivo | Papel / Responsabilidade |
|---|---|
| `index.html` | Entrada HTML da SPA com carregamento de fontes do Google Fonts (`Plus Jakarta Sans`, `Cabinet Grotesk`). |
| `src/main.tsx` | Bootstrap React (`createRoot`) renderizando `<App />` em modo estrito. |
| `src/App.tsx` | Componente central que gerencia os estados locais, persistência em `localStorage`, sincronização de presenças e navegação entre abas. |
| `vite.config.ts` | Configuração do Vite com aliases (`@`), `@tailwindcss/vite`, `@vitejs/plugin-react` e suporte a HMR condicional. |
| `tsconfig.json` | Configuração do compilador TypeScript com target ES2020 e módulos ESNext. |
| `metadata.json` | Metadados do Google AI Studio com indicação de capacidades (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`). |
| `.env.example` | Template de chaves (`GEMINI_API_KEY`, `APP_URL`). |

### 3.2 Módulos Funcionais e Componentes (`src/components/`)

| Componente | Linhas | Responsabilidade |
|---|---|---|
| `VestiarioTimeline.tsx` | ~204 | Cronômetro regressivo ao vivo até o início da partida. Exibe os marcos **T-1h10** (Comissão & Malas), **T-50** (Chegada obrigatória de todos), **T-35** (Preleção, escalação e corte de titulares atrasados) e **T-25** (Aquecimento fisiológico em 4 etapas). |
| `MatchCardConfirmacao.tsx` | ~276 | Banner do jogo (data, local, adversário, link GPS Google Maps, fardamento), botões mobile-first de 1 toque (Vou, Não Vou, Dúvida) e listagem do elenco com contadores. |
| `PranchetaTecnica.tsx` | ~254 | Campo tático visual interativo (formação 4-3-3), lista de titulares/reservas, **trava automática da Regra T-35** (atleta que chegou após T-35 é forçado para o banco de reservas) e botão de liberação da escalação. |
| `TesoureiroColeta.tsx` | ~262 | Controle financeiro do rateio da taxa de jogo/arbitragem (R$ 25,00/atleta, meta R$ 300,00). Alternância rápida pago/pendente, cópia de chave PIX e geração de relatório formatado para WhatsApp. |
| `ScoutPosJogo.tsx` | ~295 | Registro ágil pós-jogo (< 2 minutos) de gols, assistências, minutagem e cartões com controles `+`/`-`, métricas agregadas da equipe e eleição de Craque da Partida (MVP). |
| `AlmoxarifadoView.tsx` | ~129 | Catálogo de patrimônio (malas de fardamento, bolsão de bolas, kit agilidade) e checklist rigoroso pós-jogo (camisas do lado certo, bolas recolhidas, mala fechada) que libera ou bloqueia a resenha/social. |
| `Header.tsx` | ~126 | Cabeçalho sticky com comutação de perfis de visualização (Elenco, Comissão Técnica, Tesoureiro do Dia, Almoxarifado) e botão de auto-cadastro. |
| `SelfOnboardingModal.tsx` | ~287 | Modal com formulário de cadastro de novo atleta no elenco com nome, apelido, whatsapp, número de camisa, posições e tamanhos de uniforme. |

### 3.3 Dados e Tipos (`src/data/` e `src/types.ts`)

| Arquivo | Responsabilidade |
|---|---|
| `src/types.ts` | Contratos TypeScript: `Atleta`, `PatrimonioItem`, `Evento`, `EventoPresenca`, `EventoConvocacao`, `EventoScout`, `EventoColetaDia`, `NivelAcesso`, `StatusConfirmacao`, `TipoVinculo`, etc. |
| `src/data/initialData.ts` | Base de dados mock/semente contendo elenco inicial de 15 atletas (mensalistas e convidados), partida configurada (`Copa Regional dos Campeões`), patrimônio inicial (2 malas e kit treino) e coletas iniciais. |

---

## 4. Módulos Funcionais Identificados

1. **`protocolo-vestiario`**: Gerenciamento temporal pré-jogo rigoroso (T-50/T-35/T-25), contagem regressiva viva e aplicação da regra de corte por atraso.
2. **`confirmacao-presenca`**: Ficha da partida e confirmação expressa de presença de atletas com contagem em tempo real de confirmados, dúvidas e recusas.
3. **`prancheta-tatica`**: Prancheta tática com formação 4-3-3 visual, posicionamento em campo, gestão de reservas e bloqueio de titulares atrasados.
4. **`tesoureiro-vaquinha`**: Painel do Tesoureiro do Dia com rateio de custos de arbitragem, checklist de cobrança com alternância de 1 toque, PIX e envio para WhatsApp.
5. **`scout-pos-jogo`**: Registro rápido pós-partida de scouts individuais (gols, assistências, cartões, minutagem) e eleição do Craque do Jogo (MVP).
6. **`almoxarifado-patrimonio`**: Gestão do patrimônio esportivo (fardamentos e equipamentos) e checklist de encerramento da mala como trava para a resenha.
7. **`onboarding-elenco`**: Cadastro autônomo (self-onboarding) de atletas com validação de tamanhos e vínculos.

---

## 5. Armazenamento e Persistência de Dados

- **Persistência do Usuário**: `window.localStorage` sob as chaves:
  - `naprancheta_atletas`: Coleção de atletas cadastrados.
  - `naprancheta_evento`: Dados da partida ativa.
  - `naprancheta_presencas`: Confirmações de presença por evento.
  - `naprancheta_coletas`: Situação de pagamento de taxa de jogo.
  - `naprancheta_scout`: Registro estatístico de desempenho.
- **Camada de Fallback / Inicial**: `src/data/initialData.ts`.
- **Banco de Dados Tradicional / Backend**: Ausente no momento da análise (aplicação focada em frontend/client-side local).

---

## 6. Cobertura e Qualidade de Testes

- **Frameworks de Testes Automatizados**: Nenhum configurado no projeto (nem Vitest, Jest, Cypress ou Playwright).
- **Contagem de Arquivos de Teste**: 0 arquivos.
- **Tipagem Estática**: TypeScript rigoroso com script de verificação (`npm run lint` executa `tsc --noEmit`).
