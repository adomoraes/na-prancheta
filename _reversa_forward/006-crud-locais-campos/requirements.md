# Requirements: CRUD de Locais e Campos da Partida

> Identificador: `006-crud-locais-campos`  
> Data: `2026-09-21`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

## 1. Resumo executivo

Esta especificação define o gerenciamento estruturado (CRUD - Create, Read, Update, Delete) de praças esportivas, locais e campos de jogo, integrando-os como opção de seleção no agendamento de partidas. O recurso elimina a necessidade de digitação repetitiva e propensa a erros de nomes de campos, endereços e links de GPS, garantindo padronização de localização para atletas e comissão técnica.

## 2. Contexto a partir do legado

No sistema atual, as partidas registram o local do jogo através de strings manuais (`local_nome`, `local_endereco`, `local_maps_url`), sem uma tabela de apoio relacional para catalogar os campos habituais do clube.

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#2-arquitetura-do-backend-laravel-11` | Arquitetura de controladores RESTful e entidades de partidas no backend. | 🟢 |
| `_reversa_sdd/domain.md#1-glossário-do-domínio` | Definições de partida e rotas de localização compartilhadas no dia de jogo. | 🟢 |
| `_reversa_sdd/data-dictionary.md#2-entidades-e-tabelas` | Atributos de localização de partida (`local_nome`, `local_endereco`, `local_maps_url`). | 🟢 |
| `_reversa_sdd/addenda/004-painel-adm-root.md#2-resumo-da-entrega` | Gerenciamento administrativo de partidas e vestiário. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Administrador / Gestor do Clube | Cadastrar e manter o catálogo de campos e arenas onde o time realiza seus jogos. | O administrador acessa a área de Locais no painel administrativo ROOT e cadastra uma nova arena com endereço, link do GPS e tipo de piso. |
| Responsável pela Partida / Técnico | Agendar uma partida selecionando rapidamente o campo a partir dos locais cadastrados. | Ao criar ou editar uma partida, o operador seleciona o campo desejado em um seletor e o sistema preenche automaticamente o endereço e o link de localização. |
| Atleta e Convidado | Acessar informações confiáveis de trajeto e localização no dia do jogo. | O atleta clica no link do campo no card do jogo e abre o trajeto diretamente no aplicativo de navegação (Google Maps / Waze). |

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Catálogo Centralizado de Locais):** Cada local esportivo possui nome obrigatório e único por agremiação, endereço descritivo, link para aplicativo de mapas (URL válida), tipo de piso (Grama Sintética, Grama Natural, Terra, Society) e indicador de status ativo. 🟢  
   - Origem no legado: `_reversa_sdd/domain.md#1-glossário-do-domínio`  
   - Tipo: nova  

2. **RN-02 (Seleção Assistida no Agendamento da Partida):** O formulário de criação e edição de partidas deve disponibilizar a lista de campos ativos em formato de seletor (*dropdown*). Ao selecionar um local cadastrado, os campos de endereço e link de mapas são automaticamente sincronizados. 🟢  
   - Origem no legado: `_reversa_sdd/addenda/004-painel-adm-root.md#2-resumo-da-entrega`  
   - Tipo: nova  

3. **RN-03 (Imutabilidade de Snapshot Histórico):** A partida deve armazenar tanto a referência opcional do local (`local_id`) quanto os valores textuais congelados (`local_nome`, `local_endereco`, `local_maps_url`), impedindo que alterações cadastrais futuras no campo desfigurem partidas passadas já disputadas. 🟢  
   - Origem no legado: `_reversa_sdd/data-dictionary.md#2-entidades-e-tabelas`  
   - Tipo: nova  

4. **RN-04 (Proteção de Integridade Relacional):** A exclusão de um local associado a partidas não deve apagar as partidas históricas (`nullOnDelete` ou inativação lógica com `ativo: false`). 🟢  
   - Origem no legado: `_reversa_sdd/addenda/004-painel-adm-root.md#2-resumo-da-entrega`  
   - Tipo: nova  

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Criar entidade e tabela relacional `locais` | Must | A tabela `locais` armazena `id`, `nome`, `endereco`, `maps_url`, `tipo_piso`, `observacoes`, `ativo` e timestamps. | 🟢 |
| RF-02 | Endpoints RESTful para gestão de locais | Must | A API disponibiliza rotas sob `/api/admin/locais` para listagem, cadastro, edição e exclusão/inativação protegidas pelo papel `root`, além de listagem pública/autenticada em `/api/locais`. | 🟢 |
| RF-03 | Sub-aba / Módulo de Locais no Painel Administrativo | Must | O painel administrativo ROOT apresenta visualização em tabela e modal de cadastro/edição de locais esportivos. | 🟢 |
| RF-04 | Seletor de campo no formulário de Partida | Must | O modal de partidas substitui o campo de texto solto de "Campo" por um seletor alimentado pelos locais cadastrados, permitindo seleção direta com auto-preenchimento de endereço e link do GPS. | 🟢 |
| RF-05 | Suporte a entrada manual / campo personalizado | Should | O formulário permite manter a digitação de um campo eventual ou não catalogado caso a partida ocorra em local extraordinário. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Tempo de resposta para carregamento da lista de locais inferior a 80ms. | O seletor de locais deve abrir sem engasgos ao abrir o modal de partida. | 🟢 |
| Usabilidade | Validação de link com protocolo HTTP/HTTPS e suporte a URLs encurtadas do Google Maps/Waze. | Facilita a colagem de links gerados em smartphones pelo gestor. | 🟢 |
| Confiabilidade | Partidas pré-existentes devem continuar operando sem quebra com seus textos originais preservados. | Garantia de não-destrutividade da base legada de partidas. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Cadastro de novo campo esportivo pelo administrador
  Dado que o usuário ROOT está autenticado no painel administrativo
  Quando preenche o nome "Arena Central Fut7", endereço "Av. das Américas, 1500" e tipo de piso "Grama Sintética"
  E submete o formulário de cadastro de local
  Então o local é salvo no banco de dados com status ativo
  E passa a figurar imediatamente na tabela de locais

Cenário: Seleção de campo ao cadastrar nova partida
  Dado que existem locais cadastrados no sistema ("Arena Central Fut7" e "Campo da Estrela")
  Quando o administrador abre o modal de agendamento de partida
  E seleciona "Arena Central Fut7" no seletor de campo
  Então o endereço "Av. das Américas, 1500" e o link de mapas correspondente são preenchidos nos campos da partida

Cenário: Validação de duplicidade de nome de campo
  Dado que o campo "Campo da Estrela" já está cadastrado
  Quando o administrador tenta cadastrar outro local com o mesmo nome exato
  Então o sistema recusa a gravação com aviso de validação indicando duplicidade

Cenário: Partida existente com local legado
  Dado que uma partida antiga possui endereço em texto livre sem vínculo com a tabela de locais
  Quando a partida é consultada na API ou exibida na lista de jogos
  Então as informações de local são exibidas normalmente sem erros ou valores nulos
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Estruturação de dados fundamental para a entidade de locais. |
| RF-02 | Must | Operações de backend para suporte às interfaces. |
| RF-03 | Must | Interface de gestão administrativa pelo usuário mestre. |
| RF-04 | Must | Conexão do catálogo de locais com a criação de partidas. |
| RF-05 | Should | Flexibilidade operacional para jogos em campos extraordinários. |

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

## 10. Lacunas

Nenhuma dúvida ou lacuna técnica pendente. O escopo é coeso, auto-contido e compatível com as regras vigentes do sistema.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial dos requisitos para o CRUD de Locais e Campos da Partida | reversa |
