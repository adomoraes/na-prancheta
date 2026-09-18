# ADR-005: Scout Pós-Jogo Simplificado de Baixa Fricção com Eleição de MVP Único

> Status: **Aprovado / Implementado** 🟢 CONFIRMADO  
> Data: 18/09/2026  
> Contexto: Estatísticas e engajamento do elenco esportivo

---

## Contexto

Softwares profissionais de scout (como Wyscout, InStat) são impraticáveis para o futebol amador devido ao nível excessivo de detalhamento (dezenas de eventos por minuto, exigência de análise de vídeo e dedicação exclusiva durante a partida). Por outro lado, a total ausência de números desmotiva atletas que buscam acompanhar sua evolução (artilharia, assistências e disciplina).

## Decisão

Projetar uma ferramenta de **Scout Expresso** preenchível em menos de 2 minutos logo após o apito final:
1. Foco em métricas essenciais e de alto impacto: gols, assistências, cartões e minutagem em campo ($\pm 5$ min).
2. Interface com carrossel horizontal de atletas confirmados e botões `+`/`-` com trava de valores negativos.
3. Eleição de um único **Craque da Partida (MVP)** por jogo, garantindo prestígio e valorização individual.
4. Totalizadores automáticos do time no topo do módulo para conferência rápida de placar.

## Alternativas Consideradas

1. **Scout em Tempo Real com Marcação Lance a Lance**:
   - *Prós*: Riqueza de detalhes de posse de bola e desarmes.
   - *Contras*: Exige uma pessoa da comissão sem poder assistir ao jogo, com alta probabilidade de abandono do uso no meio da partida.
2. **Votação Aberta do Elenco para Escolha do MVP**:
   - *Prós*: Democrático.
   - *Contras*: Gera votação combinada entre amigos/"panelinhas" e atrasa a conclusão do fechamento do jogo.

## Consequências

- **Positivas**:
  - Adoção imediata: o scout é lançado ainda no calor do vestiário em poucos toques.
  - Alimenta o engajamento e a resenha saudável sobre artilharia e prêmio de MVP.
- **Negativas**:
  - Métricas táticas refinadas (ex: passes certos, desarmes, defesas difíceis) não são rastreadas nesta versão.
