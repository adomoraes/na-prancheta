# Histórias de Usuário: Jornada Completa do Dia de Jogo

> Nível de Documentação: **Detalhado**  
> Contexto: `na-prancheta`  
> Status: 🟢 CONFIRMADO

---

## 1. Personas Mapeadas

| Persona | Perfil | Papel no Sistema | Responsabilidade Crítica |
|---|---|---|---|
| **Comissão Técnica / Treinador** | Liderança tática | Gestor da Prancheta | Define formação 4-3-3, respeita a trava de atraso T-35 e comanda a preleção. |
| **Atleta Mensalista** | Jogador titular/elenco fixo | Usuário do Vestiário | Confirma presença em 1 toque, cumpre o horário T-50 e quita sua vaquinha. |
| **Atleta Convidado** | Reforço avulso da rodada | Usuário Convidado | Realiza self-onboarding rápido, recebe badge roxo e participa do rateio. |
| **Tesoureiro do Dia** | Diretor financeiro da rodada | Operador Financeiro | Cobra os confirmados, copia chave PIX, compartilha resumo no WhatsApp e cobre arbitragem. |
| **Custodiante do Almoxarifado** | Responsável pelo patrimônio | Fiscal de Materiais | Confere 22 camisas desviradas, 6 bolas e tranca da mala para liberar a resenha. |

---

## 2. Épicos e Histórias de Usuário (User Stories)

### Épico 1: Convocação e Confirmação de Presença ($T-24h$ a $T-2h$)

#### US-01: Confirmação de Presença em 1 Toque
- **Como** atleta do elenco,
- **Quero** visualizar a ficha completa do confronto (adversário, local com GPS e fardamento) e tocar em "Vou", "Não Vou" ou "Dúvida",
- **Para que** a comissão técnica e o tesoureiro saibam com precisão se eu participarei do jogo.
- **Critérios de Aceite**:
  - Exibição de rota via Google Maps em link externo direto.
  - Alternância imediata com feedback cromático sem recarregar a tela.
  - Atualização instantânea dos contadores de confirmados, dúvidas e recusas.

#### US-02: Entrada de Convidado de Última Hora (Self-Onboarding)
- **Como** atleta convidado que acabou de chegar ao clube,
- **Quero** preencher meu nome, posição, contato, tamanho de camisa e calção em um modal rápido,
- **Para que** eu seja incluído imediatamente no elenco, com presença confirmada e vaga na vaquinha.
- **Critérios de Aceite**:
  - Modal mobile responsivo com preenchimento em menos de 1 minuto.
  - Inserção automática em `atletas`, `presencas` e `coletas`.
  - Tag visual roxa `"Convidado"` destacada em todas as visualizações do elenco.

---

### Épico 2: Protocolo de Vestiário e Cronômetro de Pontualidade ($T-50$ a $T-25$ min)

#### US-03: Monitoramento do Horário de Vestiário
- **Como** membro do elenco presente no vestiário,
- **Quero** visualizar a contagem regressiva e os marcos temporais da partida ($T-50$, $T-35$, $T-25$),
- **Para que** todos saibam exatamente o momento da troca de uniforme e o prazo limite para não perder a vaga de titular.
- **Critérios de Aceite**:
  - Linha do tempo visual com badges coloridos por estágio.
  - Destaque ao marco $T-35$ como horário obrigatório de troca de uniforme.

#### US-04: Aplicação da Trava de Atraso Compulsória
- **Como** comissão técnica comprometida com a disciplina do grupo,
- **Quero** que o sistema impeça que atletas que chegaram após $T-35$ min iniciem entre os 11 titulares,
- **Para que** a regra combinada no vestiário seja soberana e sem favorecimentos.
- **Critérios de Aceite**:
  - Atletas com anotação `"Atrasado"` no horário de chegada ficam bloqueados de entrar na titularidade.
  - Emissão de modal/alerta com a fundamentação oficial da regra ao tentar escalá-los.
  - Exibição de tarja avermelhada `"Regra T-35"` no banco de reservas.

---

### Épico 3: Estratégia e Prancheta Tática

#### US-05: Escalação no Gramado Virtual 4-3-3
- **Como** treinador da equipe,
- **Quero** visualizar o gramado tático estilizado e alternar jogadores titulares e reservas com 1 toque,
- **Para que** a preleção oficial de $T-35$ min seja clara e visualmente engajante.
- **Critérios de Aceite**:
  - Campo tático escuro com demarcações oficiais e nós cromáticos por setor (Goleiro, Zaga, Meio e Ataque).
  - Teto estrito de 11 titulares (bloqueio ao tentar adicionar o 12º).
  - Ação de "Liberar Escalação (T-35)" com feedback transitório de confirmação.

---

### Épico 4: Arrecadação e Vaquinha da Arbitragem

#### US-06: Rateio Financeiro Exclusivo dos Confirmados
- **Como** tesoureiro do dia,
- **Quero** que o cálculo da arrecadação considere estritamente os atletas que confirmaram presença,
- **Para que** os ausentes não gerem cobrança injusta nem distorçam a meta da arbitragem.
- **Critérios de Aceite**:
  - Total esperado = confirmados $\times$ taxa individual do jogo.
  - Cards visuais de total arrecadado, total pendente e barra percentual com meta fixa de R$ 300,00.

#### US-07: Cobrança Rápida e Cobrança Social no WhatsApp
- **Como** tesoureiro do dia,
- **Quero** alternar o status de pagamento de cada atleta em 1 toque e copiar um resumo formatado para o WhatsApp com pendentes (❌) e pagos (✅),
- **Para que** a arrecadação ocorra sem constrangimento individual e com total transparência comunitária.
- **Critérios de Aceite**:
  - Botão tátil mobile de 44px que transita entre "Cobrar" e "Pago".
  - Botão "Copiar Chave PIX" com feedback visual de 2 segundos.
  - Mensagem gerada para WhatsApp com lista nominal e marcadores visuais.

---

### Épico 5: Scout Pós-Jogo e Premiações

#### US-08: Lançamento Expresso das Estatísticas da Partida
- **Como** capitão ou mesário do time,
- **Quero** lançar gols, assistências, cartões e minutagem em botões táteis (+ / -) em menos de 2 minutos,
- **Para que** o histórico de desempenho do time fique registrado sem tomar o tempo da resenha.
- **Critérios de Aceite**:
  - Carrossel horizontal deslizante com indicador âmbar de atletas com scout já lançado.
  - Proteção estrita contra números negativos.
  - Ajuste de minutagem em blocos práticos de 5 minutos.

#### US-09: Eleição do Craque do Jogo (MVP)
- **Como** comissão técnica e elenco,
- **Quero** eleger o melhor jogador da partida através do botão "Eleger Craque (MVP)",
- **Para que** o destaque da rodada seja homenageado no cabeçalho e nos históricos do clube.
- **Critérios de Aceite**:
  - Botão com estilo dourado de alto impacto e ícone de estrela preenchida.
  - Exibição em destaque do nome do MVP no placar superior.

---

### Épico 6: Almoxarifado, Custódia e Trava da Resenha

#### US-10: Checklist Tríplice de Fechamento de Malas
- **Como** responsável pela custódia do almoxarifado (Kadu),
- **Quero** validar o recolhimento das 22 camisas desviradas, 6 bolas oficiais e fechamento da mala 1 no veículo,
- **Para que** nenhum material esportivo se perca entre uma rodada e outra.
- **Critérios de Aceite**:
  - Três checkboxes com áreas de toque ampliadas para preenchimento ágil.
  - Banner explicativo da Regra de Ouro.

#### US-11: Trava Social da Resenha
- **Como** diretor do clube,
- **Quero** que a interface indique explicitamente que a resenha e o consumo de bebidas estão BLOQUEADOS até que o checklist tríplice esteja 100% cumprido,
- **Para que** haja compromisso coletivo na guarda dos materiais antes da comemoração.
- **Critérios de Aceite**:
  - Exibição de "BLOQUEADA (Aguardando malas) ⏳" enquanto houver pendência.
  - Transição imediata para "LIBERADA ✅" quando a conjunção tríplice for atendida.
