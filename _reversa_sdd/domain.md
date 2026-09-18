# Modelo de Domínio e Regras de Negócio — Na Prancheta

> Gerado pelo **Reversa Detetive** em 18/09/2026  
> Nível de Documentação: **Detalhado**  
> Escala de Confiança: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

---

## 1. Glossário Ubíquo de Domínio

| Termo de Domínio | Definição no Sistema | Confiança | Evidência no Código |
|---|---|---|---|
| **Vestiário** | Núcleo físico e temporal de preparação da equipe antes de entrar em campo. Governa pontualidade, fardamento, união do elenco e foco tático. | 🟢 CONFIRMADO | `src/components/VestiarioTimeline.tsx:47` |
| **Protocolo T-X** | Linha do tempo regressiva em minutos em relação ao apito inicial ($T-0$). Possui marcos críticos: $T-70$, $T-50$, $T-35$ e $T-25$. | 🟢 CONFIRMADO | `src/types.ts:42-44`, `src/components/VestiarioTimeline.tsx:84-168` |
| **Regra Fundamental do Atraso** | Norma disciplinar inegociável que estabelece que qualquer atleta que não esteja trocado e pronto no vestiário até $T-35$ min é automaticamente transferido para o banco de reservas. | 🟢 CONFIRMADO | `src/components/VestiarioTimeline.tsx:73-80`, `src/components/PranchetaTecnica.tsx:41-46` |
| **Preleção Técnica** | Reunião a portas fechadas no vestiário iniciada exatamente às $T-35$ min, onde a comissão revela os 11 titulares, orientações táticas e alinhamento de bolas paradas. | 🟢 CONFIRMADO | `src/components/VestiarioTimeline.tsx:142-145` |
| **Sequência Fisiológica** | Protocolo neuromuscular de 25 minutos executado no gramado dividido em 4 fases consecutivas (Ativação, Mobilidade, Dinâmica e Técnica) para prevenir estiramentos. | 🟢 CONFIRMADO | `src/components/VestiarioTimeline.tsx:176-199` |
| **Prancheta Tática** | Representação gráfica e interativa do campo posicional onde os 11 titulares são dispostos na formação tática 4-3-3. | 🟢 CONFIRMADO | `src/components/PranchetaTecnica.tsx:107-202` |
| **Tesoureiro do Dia** | Função operacional rotativa atribuída a um atleta para coletar a taxa da rodada (vaquinha) e garantir o pagamento da arbitragem. | 🟢 CONFIRMADO | `src/types.ts:50-51`, `src/components/TesoureiroColeta.tsx:90-96` |
| **Vaquinha / Taxa do Jogo** | Cota financeira individual cobrada de cada atleta confirmado na partida para cobrir a taxa de arbitragem e custos de campo (fixada em R$ 25,00/atleta, meta R$ 300,00). | 🟢 CONFIRMADO | `src/types.ts:52`, `src/data/initialData.ts:323`, `src/components/TesoureiroColeta.tsx:29-39` |
| **Scout Expresso** | Registro quantitativo simplificado (< 2 min) de ações pós-jogo: gols, assistências, cartões, minutagem e eleição do Craque do Jogo (MVP). | 🟢 CONFIRMADO | `src/components/ScoutPosJogo.tsx:78-80` |
| **Craque do Jogo (MVP)** | Título honorífico atribuído a um único atleta de destaque em cada partida. | 🟢 CONFIRMADO | `src/components/ScoutPosJogo.tsx:50-54` |
| **Almoxarifado & Custódia** | Responsabilidade de guarda, conservação e transporte das malas de uniformes oficiais, bolas calibradas e kits de cones. | 🟢 CONFIRMADO | `src/components/AlmoxarifadoView.tsx:27-39` |
| **Regra de Ouro do Vestiário (Trava da Resenha)** | Proibição de início da confraternização social e consumo de bebidas até que as 22 camisas da mala estejam desviradas, as 6 bolas recolhidas e a mala guardada. | 🟢 CONFIRMADO | `src/components/AlmoxarifadoView.tsx:43-51` |
| **Mensalista** | Atleta fixo da equipe associado mensalmente à agremiação. | 🟢 CONFIRMADO | `src/types.ts:2`, `src/data/initialData.ts:51` |
| **Convidado** | Atleta externo chamado para completar o elenco na rodada. Identificado com badge visual e sem titularidade garantida. | 🟢 CONFIRMADO | `src/types.ts:2`, `src/components/MatchCardConfirmacao.tsx:234-238` |

---

## 2. Inventário de Regras de Negócio Explícitas e Implícitas

### 2.1 Regras de Presença e Escalação
- **RN-01 (Confirmação Prévia Obrigatória)** 🟢 CONFIRMADO: Apenas atletas com status `confirmado` em `EventoPresenca` são elegíveis para escalação na `PranchetaTecnica` ou cálculo no rateio do `TesoureiroColeta`.
- **RN-02 (Corte Inegociável por Atraso - T-35)** 🟢 CONFIRMADO: Caso o atleta chegue ao vestiário após o início da preleção ($T-35$), a função `toggleTitular` bloqueia sua adição aos 11 titulares, forçando seu posicionamento no banco de reservas com aviso disciplinar.
- **RN-03 (Limite Estrito de 11 Titulares)** 🟢 CONFIRMADO: A prancheta impede a seleção de um 12º atleta titular. Para promover um reserva, a comissão deve obrigatoriamente desmarcar um titular previamente selecionado.
- **RN-04 (Ergonomia de Resposta Mobile de 1 Toque)** 🟢 CONFIRMADO: As opções "Vou", "Não Vou" e "Dúvida" operam em botões de acionamento imediato com altura mínima de 52px para garantir agilidade operacional em telas de smartphones.

### 2.2 Regras Financeiras e Rateio
- **RN-05 (Base de Cobrança Restrita a Confirmados)** 🟢 CONFIRMADO: A lista de cobrança e o total esperado excluem atletas em dúvida ou ausentes. Apenas os confirmados pagam a cota da rodada.
- **RN-06 (Meta de Arbitragem Fixa)** 🟢 CONFIRMADO: A meta financeira estipulada para a partida é de R$ 300,00 (trio de arbitragem amador). O progresso percentual reflete a arrecadação em relação a essa meta.
- **RN-07 (Transparência Ativa via WhatsApp)** 🟢 CONFIRMADO: O sistema gera um relatório de cobrança segmentado entre atletas que já quitaram e atletas pendentes com indicação de chave PIX, permitindo cópia para colagem imediata no grupo do WhatsApp da equipe.

### 2.3 Regras de Patrimônio e Encerramento do Vestiário
- **RN-08 (Obrigatoriedade de Desvirar Fardamentos)** 🟢 CONFIRMADO: Camisas não podem ser entregues do avesso na mala para evitar danos ao tecido e facilitar a lavagem industrial/doméstica.
- **RN-09 (Trava Booleana da Resenha Social)** 🟢 CONFIRMADO: A resenha social (confraternização/bebidas) é bloqueada programaticamente até que o almoxarife confirme a tríplice conferência: (1) camisas do lado correto, (2) 6 bolas oficiais recolhidas e (3) mala trancada no veículo oficial de transporte.

### 2.4 Regras de Scout e Estatísticas
- **RN-10 (Integridade dos Contadores Numéricos)** 🟢 CONFIRMADO: Os contadores de gols, assistências, minutagem e cartões possuem trava contra valores negativos (`val < 0`).
- **RN-11 (Unicidade do MVP da Partida)** 🟢 CONFIRMADO: Apenas um atleta por confronto pode ostentar a distinção de Craque do Jogo (`foi_mvp = true`).

---

## 3. Lacunas e Inconsistências Detectadas (🔴 LACUNAS)

1. **Simulação Temporal vs. Relógio Real**:
   - `VestiarioTimeline.tsx` utiliza `countdownMinutes` simulado em 38 com decrementos por `setInterval` de 15s. Não há cálculo derivado do relógio de parede real (`Date.now()` vs `evento.data_hora`).
2. **Definição de Atraso por String**:
   - A verificação de atraso depende da busca de substring `atleta.chegou_em?.includes('Atrasado')`. Se o formato da string mudar no cadastro, a trava tática deixará de funcionar. Recomenda-se converter para um campo tipado `atrasado_vestiario: boolean` ou timestamp `chegou_vestiario_em: string` comparado com `evento.horario_prelecao_t35`.
3. **Ausência de Recibo ou Comprovante PIX**:
   - O toggle de pagamento no `TesoureiroColeta` é puramente declarativo manual. Não há upload de anexo de comprovante bancário nem conferência de extrato Open Finance.
