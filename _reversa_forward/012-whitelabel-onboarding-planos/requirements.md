# Requirements: Fluxo de Whitelabel com Onboarding, Autenticação, Planos e Pagamentos

> Identificador: `012-whitelabel-onboarding-planos`  
> Data: `2026-10-06`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

## 1. Resumo executivo

Esta funcionalidade introduz o modelo de múltiplas agremiações autônomas (Whitelabel e Arquitetura Multi-tenant) na plataforma Na Prancheta. O sistema passa a oferecer fluxo guiado de auto-cadastro para novos clubes esportivos com período de avaliação gratuita de 14 dias, personalização de identidade visual própria (emblema, cores primárias e denominação oficial), autenticação com segregação de perfil de gestor, contratação de planos recorrentes com suporte a PIX e Cartão, e capacidade de personificação de suporte para operadores ROOT. A entrega soluciona a dependência de agremiação única do sistema legado, viabilizando a comercialização da plataforma como serviço para centenas de equipes esportivas com isolamento rigoroso de informações e URL unificada.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|---|---|---|
| `_reversa_sdd/architecture.md#1-visão-geral-da-arquitetura` | A aplicação opera como aplicação de página única voltada ao ciclo operacional de um time de futebol, armazenando dados localmente ou consumindo serviços centralizados. | 🟢 CONFIRMADO |
| `_reversa_sdd/architecture.md#4-dívidas-técnicas-e-riscos-arquiteturais` | Ausência de isolamento multi-tenant documentada como dívida estrutural para expansão de múltiplos clubes simultâneos. | 🟢 CONFIRMADO |
| `_reversa_sdd/domain.md#1-glossário-ubíquo-de-domínio` | Definições consolidadas de atletas, comissão técnica, vestiário, taxa de jogo, patrimônio e eventos esportivos. | 🟢 CONFIRMADO |
| `_reversa_sdd/permissions.md#2-matriz-de-permissões-rbac` | Hierarquia de perfis com superusuário da plataforma (ROOT) e perfis operacionais locais (geral, técnico, financeiro, almoxarifado, atleta). | 🟢 CONFIRMADO |
| `_reversa_sdd/addenda/003-bloqueio-rotas-auth.md#2-resumo-da-entrega` | Proteção sistemática de rotas e recursos operacionais com validação estrita de token de sessão e tratamento de sessões expiradas. | 🟢 CONFIRMADO |
| `_reversa_sdd/addenda/004-painel-adm-root.md#2-resumo-da-entrega` | Painel administrativo mestre exclusivo para administração global de usuários, partidas e caixas. | 🟢 CONFIRMADO |
| `_reversa_sdd/addenda/010-landing-page-investidores.md#2-resumo-da-entrega` | Interface pública de apresentação institucional e captação de potenciais parceiros comerciais e clubes interessados. | 🟢 CONFIRMADO |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---|---|---|
| **Gestor da Agremiação** | Cadastrar seu clube esportivo, configurar escudo e cores e assinar um plano para gerenciar seu time. | Acessa a página de contratação, preenche os dados do clube, inicia o período de avaliação de 14 dias sem cartão, personaliza as cores e, antes do término do teste, escolhe o plano trimestral efetuando a quitação por PIX. |
| **Atleta / Integrante do Clube** | Acessar o sistema com a identidade visual da sua equipe para confirmar presença e acompanhar jogos. | Recebe link de convite do clube, autentica-se na URL única e visualiza a aplicação automaticamente estilizada com o escudo e cores oficiais da sua agremiação. |
| **Operador da Plataforma (ROOT)** | Supervisionar clubes cadastrados, acompanhar o status de assinaturas e prestar suporte técnico via personificação. | Acessa a visão global de agremiações, analisa métricas de renovação e adimplência e comuta temporariamente sua visão para um clube específico para investigar um chamado de suporte. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01WL (Isolamento Estrito entre Agremiações):** Todas as entidades operacionais (atletas, partidas, convocações, presenças, caixas, patrimônios, locais e adversários) pertencem obrigatoriamente a uma única agremiação esportiva, sendo terminantemente proibida a visibilidade ou alteração de dados entre agremiações distintas. 🟢
   - Origem no legado: Nova regra transversal derivada de `_reversa_sdd/architecture.md#4-dívidas-técnicas-e-riscos-arquiteturais`.
   - Tipo: nova

2. **RN-02WL (Personalização de Marca e Branding):** Cada agremiação possui registros de identidade visual contendo nome oficial, sigla, endereço do emblema esportivo, cor primária em formato hexadecimal e cor secundária em formato hexadecimal. A interface do usuário aplica dinamicamente essas propriedades visuais para todos os membros vinculados à respectiva agremiação a partir do contexto da sessão autenticada. 🟢
   - Origem no legado: Expansão de `_reversa_sdd/architecture.md#23-estilização-e-design-system-moderno`.
   - Tipo: nova

3. **RN-03WL (Estrutura e Limites de Planos de Assinatura):** O sistema disponibiliza três modalidades de contratação: Plano Amador (limite de 1 elenco ativo e até 25 atletas), Plano Campeão (limite de 3 elencos ativos, até 80 atletas e relatórios de scout avançados) e Plano Liga (elencos ilimitados, atletas ilimitados e múltiplos gestores). O sistema impede a criação de registros que excedam os limites do plano contratado. 🟢
   - Origem no legado: Nova regra de monetização e governança.
   - Tipo: nova

4. **RN-04WL (Ciclo de Vida da Assinatura, Avaliação Gratuita e Carência):** Uma agremiação recém-cadastrada inicia em estado de avaliação gratuita (trial) por 14 dias corridos, com acesso aos recursos do Plano Campeão sem exigência prévia de cartão de crédito. Ao término dos 14 dias sem contratação formal de um plano, o status comuta para suspenso. Para assinaturas contratadas, caso a renovação não seja confirmada na data de vencimento, a agremiação entra em carência de 5 dias corridos antes da suspensão de mutações operacionais. 🟢
   - Origem no legado: Expansão de `_reversa_sdd/domain.md#22-regras-financeiras-e-rateio`.
   - Tipo: nova

5. **RN-05WL (Perfil de Administrador da Agremiação):** O usuário que conclui o auto-cadastro do clube recebe o perfil de Administrador da Agremiação. Este perfil possui autoridade total sobre os recursos e membros do seu respectivo clube, mas não possui privilégios de acesso ao painel mestre global da plataforma (reservado ao papel ROOT). 🟢
   - Origem no legado: `_reversa_sdd/permissions.md#2-matriz-de-permissões-rbac` e `_reversa_sdd/addenda/004-painel-adm-root.md#3-impacto-por-artefato-da-extração`.
   - Tipo: alterada

6. **RN-06WL (Resolução Dinâmica de Agremiação por Sessão):** A plataforma utiliza URL unificada sem exigência de subdomínios ou prefixos de rota para o acesso diário dos atletas. A resolução do clube e a aplicação de regras e temas ocorrem exclusivamente por meio da identificação contida no token de autenticação emitido no momento do login. 🟢
   - Origem no legado: Nova regra de ergonomia e roteamento SPA.
   - Tipo: nova

7. **RN-07WL (Personificação de Acesso para Suporte ROOT):** Operadores globais com perfil ROOT possuem permissão especial de personificar a sessão de qualquer agremiação cadastrada. A ação de personificação emite token temporário restrito com registro obrigatório em log de auditoria, permitindo navegar como o gestor do clube para suporte técnico sem alterar senhas. 🟢
   - Origem no legado: Expansão de `_reversa_sdd/addenda/004-painel-adm-root.md#2-resumo-da-entrega`.
   - Tipo: nova

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|---|---|---|---|---|
| RF-01 | Fluxo de Onboarding com Avaliação de 14 Dias | Must | O sistema deve disponibilizar formulário em etapas solicitando nome do clube, sigla, modalidade esportiva e dados do gestor (nome, e-mail e senha), ativando imediatamente a agremiação com 14 dias de teste gratuito sem exigir dados de cartão de crédito. | 🟢 |
| RF-02 | Configuração de Identidade Visual e Branding do Clube | Must | O sistema deve permitir que o gestor envie arquivo de imagem do emblema (formatos PNG/JPEG/WEBP até 2 MB) e defina código hexadecimal das cores primária e secundária, aplicando as variáveis visuais no tema da aplicação dinamicamente no frontend. | 🟢 |
| RF-03 | Catálogo e Seleção de Planos de Assinatura | Must | O sistema deve apresentar catálogo comparativo exibindo recursos inclusos, limites operacionais e valores das opções de cobrança (mensal e anual) para cada modalidade de plano (Amador, Campeão e Liga). | 🟢 |
| RF-04 | Checkout e Liquidação com Provedor Nacional (PIX e Cartão) | Must | O sistema deve integrar checkout transparente com suporte a PIX com QR Code dinâmico copia-e-cola e Cartão de Crédito recorrente, processando confirmações via webhook assíncrono idempotente e atualizando a vigência da assinatura. | 🟢 |
| RF-05 | Autenticação com Contexto de Agremiação em URL Única | Must | O sistema deve autenticar o usuário na rota unificada e devolver credencial de sessão contendo o identificador do clube, aplicando automaticamente filtro por agremiação no backend e temas visuais no frontend. | 🟢 |
| RF-06 | Painel de Gestão da Assinatura do Gestor do Clube | Should | O sistema deve disponibilizar tela no painel do clube exibindo dias restantes do teste gratuito ou da assinatura, histórico de faturas quitadas e botão para contratação, troca de plano ou cancelamento. | 🟢 |
| RF-07 | Painel Global ROOT com Personificação de Clubes | Should | O sistema deve permitir que operadores globais ROOT visualizem todos os clubes, métricas de faturamento e acionem botão de personificação para visualizar a aplicação sob a perspectiva do clube selecionado. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|---|---|---|---|
| Segurança | Todas as consultas a tabelas do banco de dados devem aplicar cláusula de restrição obrigatória por identificador da agremiação, impedindo vazamento de dados entre clientes distintos em qualquer camada da aplicação. | Prevenção contra quebra de isolamento de dados em arquiteturas multi-tenant compartilhadas (`_reversa_sdd/architecture.md#4-dívidas-técnicas-e-riscos-arquiteturais`). | 🟢 |
| Desempenho | A aplicação de tokens de estilo e cores da marca do clube não deve acrescer mais de 150 milissegundos ao tempo de primeira renderização da interface do usuário. | Preservação da experiência de uso ágil e mobile-first estabelecida na documentação (`_reversa_sdd/architecture.md#23-estilização-e-design-system-moderno`). | 🟢 |
| Confiabilidade | O serviço de recepção de notificações de pagamento (webhooks) deve implementar controle estrito de idempotência, garantindo que notificações duplicadas da mesma transação financeira não gerem duplicidade de créditos ou ativações repetidas. | Integridade financeira e prevenção contra inconsistências em liquidações assíncronas. | 🟢 |
| Observabilidade | O sistema deve registrar eventos estruturados de auditoria para cada transação de pagamento, alteração de status de assinatura, cadastro de nova agremiação, personificação ROOT e bloqueio por término de avaliação/inadimplência. | Rastreabilidade e conformidade contábil e de segurança da operação do serviço. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Onboarding de novo clube com ativação imediata de teste gratuito de 14 dias
  Dado que um visitante acessa a página de auto-cadastro de clubes
  Quando preenche os dados cadastrais da agremiação "União Futebol Clube" e define as credenciais do gestor
  Então o sistema cria o registro da agremiação com status ativo em período de avaliação de 14 dias
  E não exige inserção de dados de cartão de crédito no momento do cadastro
  E autentica o gestor automaticamente com perfil de Administrador da Agremiação
  E direciona o gestor para o painel com o tema configurado com as cores do "União Futebol Clube"

Cenário: Bloqueio de mutações após encerramento do período de teste de 14 dias sem contratação
  Dado que a agremiação "Vila Nova FC" atingiu o 15º dia de cadastro sem contratar nenhum plano
  Quando o gestor ou técnico tenta criar uma nova partida na prancheta
  Então o sistema bloqueia a criação exibindo tela de bloqueio com aviso de término do período de avaliação
  E apresenta opções de contratação dos planos Amador, Campeão e Liga com pagamento via PIX ou Cartão

Cenário: Liquidação de plano de assinatura via PIX com ativação imediata por webhook
  Dado que a agremiação "Estrela da Madrugada" escolheu o "Plano Campeão" no valor de R$ 99,00
  Quando o gestor gera o código PIX e realiza a liquidação no aplicativo do seu banco
  E o webhook de confirmação do provedor nacional de pagamentos é recebido pelo sistema
  Então o sistema atualiza o status da assinatura para ativa com vencimento para 30 dias posteriores
  E libera imediatamente todas as mutações e limites correspondentes ao Plano Campeão

Cenário: Personificação de agremiação por operador ROOT para suporte técnico
  Dado que o operador está autenticado com o papel ROOT
  Quando seleciona a agremiação "Botafogo da Várzea" no painel mestre e clica em "Personificar Clube"
  Então o sistema gera credencial temporária de personificação e registra o evento na trilha de auditoria
  E redireciona a interface para o painel operacional com as cores e dados do "Botafogo da Várzea"
  E exibe uma barra de alerta superior informando que a sessão atual é de personificação com botão para retornar ao painel ROOT

Cenário: Notificação de pagamento duplicada recebida via webhook (Idempotência)
  Dado que uma notificação de liquidação da fatura "FAT-9872" já foi processada com sucesso
  Quando o provedor de pagamentos reenvia a mesma notificação da fatura "FAT-9872"
  Então o sistema reconhece o identificador de evento já processado
  E retorna resposta de sucesso sem executar nova mutação no saldo ou vigência do plano
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|---|---|---|
| RF-01 (Auto-cadastro e Onboarding com Trial) | Must | Requisito basilar para atração e conversão autônoma de novos clubes sem fricção de entrada. |
| RF-02 (Branding e Identidade Visual) | Must | Núcleo do conceito de Whitelabel, permitindo que cada agremiação ostente sua própria marca. |
| RF-03 (Catálogo e Seleção de Planos) | Must | Necessário para estabelecer as regras de limitação operacional e o modelo de negócio do serviço. |
| RF-04 (Checkout e Pagamentos PIX/Cartão) | Must | Mecanismo financeiro mandatório para ativação automatizada do serviço no mercado brasileiro. |
| RF-05 (Autenticação Multi-tenant em URL Única) | Must | Garantia técnica inegociável de isolamento entre bases de dados mantendo ergonomia de acesso. |
| RF-06 (Painel de Gestão da Assinatura do Clube) | Should | Permite autoatendimento do gestor para contratação de planos e conferência de faturas. |
| RF-07 (Painel Global ROOT com Personificação) | Should | Ferramenta gerencial para operadores da plataforma prestarem suporte e monitorarem métricas globais. |
| RNF de Segurança (Isolamento Multi-tenant) | Must | Risco crítico de vazamento de dados de atletas e finanças entre agremiações caso não atendido. |
| RNF de Confiabilidade (Idempotência de Pagamentos) | Must | Previne inconsistências financeiras decorrentes de retentativas de envio de webhooks. |
| RNF de Desempenho (Renderização de Temas) | Should | Assegura que a flexibilidade visual não degrade a velocidade de uso no dispositivo do atleta. |
| RNF de Observabilidade (Trilhas de Auditoria) | Should | Facilita diagnóstico de ocorrências financeiras e operacionais de suporte ao cliente. |

## 9. Esclarecimentos

### Sessão 2026-10-06

- **Q:** Como a interface web deve resolver a agremiação/clube (roteamento e identidade visual)?  
  **R:** Contexto dinâmico após autenticação — URL única da aplicação, com dados operacionais e tema visual hidratados dinamicamente com base no token da sessão autenticada do usuário.

- **Q:** Qual é a política de período de teste (trial) durante o onboarding do clube?  
  **R:** Período de teste gratuito de 14 dias sem exigência prévia de cartão de crédito no cadastro — o clube é ativado imediatamente com acesso integral de avaliação e o checkout de contratação de plano é exigido ao término dos 14 dias.

- **Q:** Qual deve ser o nível de acesso de operadores globais (ROOT) aos clubes de terceiros?  
  **R:** Personificação de acesso para suporte técnico — superusuários ROOT podem alternar temporariamente para o contexto de qualquer clube com registro em trilha de auditoria e indicador visual explícito de suporte.

- **Q:** Qual provedor/estratégia de pagamentos deve ser priorizada no checkout de planos?  
  **R:** Provedor nacional com suporte nativo a PIX instantâneo com conciliação via QR Code dinâmico e Cartão de Crédito recorrente, com recepção de confirmações por webhooks transacionais com controle estrito de idempotência.

## 10. Lacunas

> Nenhuma lacuna em aberto. Todos os pontos de escopo, roteamento, faturamento e governança foram esclarecidos.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|---|---|---|
| 2026-10-06 | Versão inicial gerada por `/reversa-requirements` para a Feature 012 | reversa |
| 2026-10-06 | Esclarecimento de roteamento dinâmico, trial de 14 dias, personificação ROOT e gateway nacional por `/reversa-clarify` | reversa |
