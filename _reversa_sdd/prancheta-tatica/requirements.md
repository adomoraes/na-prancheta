# Requisitos da Feature: Prancheta Tática e Gestão de Titulares

> Nível de Documentação: **Detalhado**  
> Unit: `prancheta-tatica`  
> Status: 🟢 CONFIRMADO

---

## 1. Visão Geral

A feature **Prancheta Tática e Gestão de Titulares** é o módulo operacional e estratégico utilizado pela comissão técnica para definir a formação tática oficial (formação base 4-3-3), visualizar a disposição dos atletas sobre um campo de futebol sintético estilizado em alta definição, gerenciar os 11 titulares e o banco de reservas, e aplicar compulsoriamente a **Regra de Vestiário T-35** (bloqueio de titularidade por atraso na chegada), além de disparar a liberação oficial da escalação para preleção.

---

## 2. Responsabilidades

- Filtrar exclusivamente os atletas com presença confirmada (`status === 'confirmado'`) para disponibilização tática.
- Renderizar a representação visual do gramado com 4 setores táticos: Goleiro (1), Defesa (4), Meio-Campo (3) e Ataque (3).
- Permitir a promoção e rebaixamento dinâmico de atletas entre titularidade e banco de reservas via clique/toque de 1 interação.
- Assegurar o teto máximo regulamentar de 11 titulares em campo.
- Executar a validação impeditiva de atraso: impedir que atletas que chegaram após $T-35$ sejam escalados como titulares.
- Oferecer o botão de divulgação/liberação da escalação no vestiário com feedback de confirmação temporário de 3 segundos.

---

## 3. Regras de Negócio

- **RN-PT-01 (Elegibilidade Exclusiva de Confirmados)** 🟢 CONFIRMADO: Apenas atletas cujo registro em `EventoPresenca` possua `status === 'confirmado'` podem compor os titulares ou o banco de reservas (`src/components/PranchetaTecnica.tsx:17-20`).
- **RN-PT-02 (Teto Regulamentar de 11 Titulares)** 🟢 CONFIRMADO: O time titular é estritamente limitado a 11 atletas. Ao tentar adicionar um 12º titular, a ação deve ser rejeitada com mensagem de aviso orientando a substituição prévia (`src/components/PranchetaTecnica.tsx:51-54`).
- **RN-PT-03 (Trava de Atraso T-35 - Banco Compulsório)** 🟢 CONFIRMADO: Se `atleta.chegou_em` contiver a substring `"Atrasado"`, o atleta fica terminantemente impedido de ingressar na lista de titulares, devendo iniciar compulsoriamente no banco de reservas com aviso modal explícito (`src/components/PranchetaTecnica.tsx:40-46`).
- **RN-PT-04 (Alternância Dinâmica / Toggle)** 🟢 CONFIRMADO: Clicar sobre um atleta titular remove-o da escalação principal e o transfere para o banco de reservas. Clicar sobre um reserva apto promove-o à titularidade, respeitado o limite de 11 (`src/components/PranchetaTecnica.tsx:48-56`).
- **RN-PT-05 (Notificação de Liberação da Preleção)** 🟢 CONFIRMADO: O acionamento do botão "Liberar Escalação (T-35)" ativa o estado de preleção confirmada por 3.000 ms, alternando o rótulo para "Escalação Liberada no Vestiário!" acompanhado de ícone de validação (`src/components/PranchetaTecnica.tsx:62-65, 89-99`).

---

## 4. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| **RF-PT-01** | Renderizar gramado tático 4-3-3 | Must | Exibir representação gráfica de campo com linhas regulamentares e nós posicionados para 1 Goleiro, 4 Defensores, 3 Meio-campistas e 3 Atacantes. |
| **RF-PT-02** | Exibir identificação do atleta no campo | Must | Cada nó no campo deve exibir número da camisa, apelido/nome abreviado e sigla da posição tática com código cromático por setor. |
| **RF-PT-03** | Alternar titularidade com validação | Must | Ao tocar em um atleta, alternar entre titular e reserva; bloquear se o atleta estiver atrasado ou se a cota de 11 já estiver preenchida. |
| **RF-PT-04** | Listar banco de reservas com alertas | Must | Renderizar todos os atletas confirmados não-titulares em grade responsiva, destacando em vermelho atletas sancionados pela Regra T-35. |
| **RF-PT-05** | Disparar liberação de escalação | Should | Permitir que o treinador notifique o vestiário com feedback visual temporário de 3 segundos. |

---

## 5. Requisitos Não Funcionais

| Tipo | Requisito Inferido | Evidência no Código | Confiança |
|---|---|---|---|
| **Usabilidade & Acessibilidade** | Nós de jogadores no campo com target tátil de 40x40px | `src/components/PranchetaTecnica.tsx:134,153,172,191` (`w-10 h-10`) | 🟢 |
| **Feedback Visual** | Animação suave e scale em hover nos atletas | `src/components/PranchetaTecnica.tsx:132,151,170,189` (`transition transform hover:scale-105`) | 🟢 |
| **Responsividade** | Layout adaptativo para campo e grid de banco em 1, 2 e 4 colunas | `src/components/PranchetaTecnica.tsx:214` (`grid-cols-1 sm:grid-cols-2 md:grid-cols-4`) | 🟢 |
| **Diferenciação Cromática Setorial** | Bordas setoriais: Roxo (Goleiro), Âmbar (Zaga/Laterais), Azul (Meio), Esmeralda (Ataque) | `src/components/PranchetaTecnica.tsx:134,153,172,191` | 🟢 |

---

## 6. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: Atleta pontual promovido a titular com vaga aberta
  Dado que existem 10 titulares selecionados na prancheta
  E o atleta "Thiaguinho" está no banco de reservas
  E o horário de chegada de "Thiaguinho" não possui marcação de "Atrasado"
  Quando a comissão técnica clica no card de "Thiaguinho" no banco
  Então "Thiaguinho" deve ser incluído na lista de titulares
  E o contador de titulares deve exibir "11/11 Titulares definidos"
  E o card de "Thiaguinho" deve ser renderizado na linha defensiva do campo

Cenário: Tentativa de escalar atleta que chegou após T-35
  Dado que o atleta "Vitinho" chegou com anotação "Atrasado (19:42)"
  E ele está listado no banco de reservas com o badge "Regra T-35"
  Quando a comissão técnica clica no card de "Vitinho" para promovê-lo
  Então deve ser exibido um alerta bloqueando a ação:
    "Regra do Vestiário (T-35): Vitinho chegou após o horário obrigatório de troca. Por protocolo oficial do clube, o atleta deve iniciar a partida compulsoriamente no banco de reservas."
  E a lista de titulares não deve ser alterada

Cenário: Tentativa de adicionar 12º titular
  Dado que já existem 11 titulares definidos
  E o atleta "Deco" está no banco de reservas sem pendência de atraso
  Quando a comissão técnica clica no card de "Deco"
  Então deve ser exibido um alerta: "Limite de 11 titulares atingido. Remova um titular antes de adicionar outro."
  E "Deco" deve permanecer no banco de reservas
```

---

## 7. Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|---|---|---|
| Campo tático interativo com posicionamento 4-3-3 | **Must** | Interface primária de visualização da estratégia do jogo. |
| Bloqueio compulsório de atletas atrasados (Regra T-35) | **Must** | Regra central de disciplina e governança do vestiário amador. |
| Controle estrito de 11 titulares máximos | **Must** | Integridade da regra básica do futebol de campo. |
| Grid de reservas com diferenciação de atrasados | **Must** | Visibilidade clara de opções de banco e sanções disciplinares. |
| Ação de divulgação da preleção com feedback transitório | **Should** | Sincronia de comunicação do anúncio da escalação. |

---

## 8. Rastreabilidade de Código

| Arquivo do Legado | Linhas | Símbolo / Responsabilidade | Confiança |
|---|---|---|---|
| [`src/components/PranchetaTecnica.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/PranchetaTecnica.tsx) | 1-254 | Componente `PranchetaTecnica`, lógica de formação 4-3-3 e trava T-35 | 🟢 CONFIRMADO |
| [`src/types.ts`](file:///home/adomoraes/projects/na-prancheta/src/types.ts) | 1-32 | Tipos `Atleta`, `Evento`, `EventoPresenca`, `PosicaoCampo` | 🟢 CONFIRMADO |
| [`src/data/initialData.ts`](file:///home/adomoraes/projects/na-prancheta/src/data/initialData.ts) | 1-133 | Definição do elenco base com posições táticas e números de camisa | 🟢 CONFIRMADO |
