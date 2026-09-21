# Requirements: Número do Calçado na Ficha do Atleta

> Identificador: `005-numero-calcado-atleta`  
> Data: `2026-09-21`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

## 1. Resumo executivo

Esta especificação define a inclusão do número do calçado esportivo (tamanho de chuteira/tênis) na ficha cadastral do atleta. O recurso atende tanto administradores quanto atletas durante o ingresso no clube, permitindo que a comissão técnica e o setor de patrimônio conheçam a numeração de calçado de cada membro do elenco para distribuição e aquisição de materiais esportivos, sanando a ausência dessa informação que antes se restringia aos tamanhos de camisa e calção.

## 2. Contexto a partir do legado

A ficha do atleta no sistema já contempla dimensões físicas e preferências de vestuário esportivo (`tamanho_camisa` e `tamanho_calcao`), mas não dispunha de campo dedicado para o tamanho do calçado.

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/domain.md#1-glossário-do-domínio` | Definição de atleta, mensalista e convidado no ecossistema do clube. | 🟢 |
| `_reversa_sdd/data-dictionary.md#2-entidades-e-tabelas` | Estrutura da entidade de atletas e campos de vestuário existentes. | 🟢 |
| `_reversa_sdd/onboarding-elenco/requirements.md#requisitos-funcionais` | Fluxo de coleta de dados cadastrais no onboarding do atleta. | 🟢 |
| `_reversa_sdd/addenda/004-painel-adm-root.md#2-resumo-da-entrega` | Gerenciamento administrativo do elenco e edição de dados cadastrais. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Administrador / Gestor do Clube | Manter atualizada a ficha completa de cada atleta, incluindo a numeração de chuteira. | O administrador acessa a gestão de elenco no painel administrativo e preenche ou edita o número de calçado (ex.: 41) do atleta. |
| Atleta (Novo Integrante) | Informar seu tamanho de calçado ao ingressar no time pelo cadastro inicial. | O atleta abre o formulário de auto-cadastro (*Self-Onboarding*) e seleciona ou digita seu número de calçado junto aos tamanhos de uniforme. |
| Responsável pelo Almoxarifado / Patrimônio | Consultar o tamanho do calçado dos atletas para destinação de materiais esportivos. | O responsável visualiza a lista ou ficha do atleta e identifica rapidamente sua numeração para disponibilização de chuteiras ou calçados de treino. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Opcionalidade da Numeração de Calçado):** O preenchimento do número do calçado é opcional, permitindo que atletas legados ou cadastros rápidos sem essa informação imediata sejam salvos com sucesso. 🟢  
   - Origem no legado: `_reversa_sdd/domain.md#1-glossário-do-domínio`  
   - Tipo: nova  

2. **RN-02 (Faixa Válida de Numeração Esportiva):** Quando fornecido, o número do calçado deve ser um valor inteiro situado no intervalo entre 25 e 50 (inclusive), rejeitando valores fora dessa faixa ou caracteres não numéricos. 🟢  
   - Origem no legado: `_reversa_sdd/domain.md#1-glossário-do-domínio`  
   - Tipo: nova  

3. **RN-03 (Preservação de Atletas Pré-existentes):** Atletas já cadastrados na base de dados devem manter valor nulo (`null`) até que uma edição deliberada preencha o número do calçado, sem causar inconsistência em listagens ou quebras no fluxo do dia de jogo. 🟢  
   - Origem no legado: `_reversa_sdd/addenda/004-painel-adm-root.md#3-impacto-por-artefato-da-extração`  
   - Tipo: nova  

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Armazenar o número do calçado na ficha do atleta | Must | O sistema persiste o número do calçado no registro do atleta de forma associada e o recupera nas consultas cadastrais. | 🟢 |
| RF-02 | Permitir cadastro e edição do número do calçado na gestão administrativa | Must | O formulário de inclusão/edição de atletas no painel administrativo apresenta campo específico para informar o número de calçado com validação de inteiros entre 25 e 50. | 🟢 |
| RF-03 | Permitir seleção do número do calçado no auto-cadastro (*Self-Onboarding*) | Should | O formulário de cadastro do próprio atleta permite informar o número do calçado na seção de medidas esportivas. | 🟢 |
| RF-04 | Exibir o número do calçado nas listagens e detalhes do atleta | Must | A visualização dos dados do atleta exibe a numeração preenchida ou um traço ("—") indicando ausência quando não preenchido. | 🟢 |
| RF-05 | Validação de limites numéricos na interface e no serviço | Must | Qualquer tentativa de informar valor inferior a 25 ou superior a 50 resulta em mensagem de validação impedindo o envio. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | O acréscimo do campo não deve impactar o tempo de resposta das consultas de elenco (tempo médio < 100ms). | Consultas de elenco são críticas para o fluxo do vestiário e painel administrativo. | 🟢 |
| Usabilidade | O campo deve possuir indicador claro de exemplo (ex.: "Ex: 41") e teclado numérico em dispositivos móveis. | O sistema é utilizado em campo/vestiário via smartphone pelos atletas e dirigentes. | 🟢 |
| Compatibilidade | A alteração não deve gerar regressão nos módulos de escalação tática, confirmação de presença e controle de vaquinha. | Garantia de estabilidade do fluxo de dia de jogo conforme `_reversa_sdd/domain.md`. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Cadastro com sucesso do número de calçado no painel administrativo
  Dado que o administrador está autenticado no painel administrativo
  Quando o administrador preenche o cadastro do atleta com nome "Carlos Silva", camisa "10" e calçado "41"
  E submete o formulário de cadastro
  Então o atleta é gravado com sucesso com o número de calçado 41
  E a listagem de atletas exibe "41" na coluna de calçado

Cenário: Atleta sem número de calçado informado
  Dado que o administrador cria ou edita um atleta sem preencher o número de calçado
  Quando o formulário é enviado
  Então o atleta é salvo com sucesso com valor nulo para calçado
  E a interface apresenta um traço ("—") indicando valor não definido

Cenário: Validação de numeração fora dos limites aceitáveis
  Dado que o operador informa o valor "99" para o número de calçado
  Quando tenta submeter o formulário
  Então o sistema rejeita a gravação informando que o número deve estar entre 25 e 50

Cenário: Preenchimento no auto-cadastro do atleta
  Dado que um novo atleta está preenchendo o formulário de Self-Onboarding
  Quando preenche seus dados e informa calçado "42"
  Então o registro provisório é gerado contendo a numeração informada
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Estruturação e persistência do dado no registro do atleta é indispensável. |
| RF-02 | Must | Operação administrativa de cadastro e alteração do dado é o núcleo da solicitação. |
| RF-03 | Should | Enriquece o fluxo de entrada do atleta no onboarding, dispensando intervenção manual do gestor. |
| RF-04 | Must | A exibição clara do dado é necessária para que o usuário confirme o número registrado. |
| RF-05 | Must | Validação garante integridade e consistência contra entradas inválidas. |

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

## 10. Lacunas

Nenhuma dúvida ou lacuna técnica pendente. O escopo é estrito, coeso e delimitado à inclusão do campo numérico opcional de calçado na ficha do atleta.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-21 | Versão inicial dos requisitos para o campo número do calçado na ficha do atleta | reversa |
