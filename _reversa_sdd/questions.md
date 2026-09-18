# Perguntas para Validação Humana — na-prancheta

> Gerado pelo Revisor do Reversa em 2026-09-18  
> Nível de Documentação: **Detalhado**  
> Status: 🟢 TODAS AS PERGUNTAS RESPONDIDAS E INTEGRADAS

---

## Pergunta 1: Persistência da Escalação Tática

**Contexto:** Módulo `prancheta-tatica` — estado `titularesIds` em [`src/components/PranchetaTecnica.tsx:23-35`](file:///home/adomoraes/projects/na-prancheta/src/components/PranchetaTecnica.tsx#L23-L35)  
**Spec afetada:** [`_reversa_sdd/prancheta-tatica/design.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/prancheta-tatica/design.md)  
**Pergunta:** A escalação definida pelo treinador deve ser persistida no `localStorage` (sob uma chave como `naprancheta_titulares`) para sobreviver a recarregamentos de página (F5) e alternância de abas, ou a redefinição para o time padrão a cada sessão é o comportamento esperado?  
**Impacto:** Se deve persistir, é necessário adicionar uma nova chave no storage local e conectar o handler de alteração tática no componente raiz `App.tsx`.

✅ **Respondida**  
**Resposta:** as persistencias devem ser consideradas como migração para backend real.

---

## Pergunta 2: Configuração Dinâmica da Chave PIX do Tesoureiro

**Contexto:** Módulo `tesoureiro-vaquinha` — constante `chavePixTesoureiro` em [`src/components/TesoureiroColeta.tsx:41`](file:///home/adomoraes/projects/na-prancheta/src/components/TesoureiroColeta.tsx#L41)  
**Spec afetada:** [`_reversa_sdd/tesoureiro-vaquinha/requirements.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/tesoureiro-vaquinha/requirements.md)  
**Pergunta:** A chave PIX deve ser transferida para um campo configurável na entidade `Evento` (ou associada ao perfil do atleta que atua como tesoureiro do dia), permitindo que o tesoureiro altere sua chave diretamente na interface?  
**Impacto:** Se sim, o schema da interface `Evento` precisa ser estendido com `tesoureiro_pix: string` e uma tela/modal de configuração deve ser adicionada.

✅ **Respondida**  
**Resposta:** sim, considero mais via backend também e deve ser devem ser consideradas como migração para backend real.

---

## Pergunta 3: Persistência do Checklist de Malas e Trava da Resenha

**Contexto:** Módulo `almoxarifado-patrimonio` — estados booleanos em [`src/components/AlmoxarifadoView.tsx:11-13`](file:///home/adomoraes/projects/na-prancheta/src/components/AlmoxarifadoView.tsx#L11-L13)  
**Spec afetada:** [`_reversa_sdd/almoxarifado-patrimonio/design.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/almoxarifado-patrimonio/design.md)  
**Pergunta:** A conferência da mala, das bolas e das camisas deve ser gravada no `localStorage` (ex: `naprancheta_almoxarifado`) para garantir que o status da resenha (Liberada vs. Bloqueada) permaneça visível para todo o elenco durante a comemoração pós-jogo?  
**Impacto:** Se sim, os checkboxes devem persistir o objeto de status no storage local com timestamp e identificação de quem realizou a conferência.

✅ **Respondida**  
**Resposta:** sim, devem ser consideradas como migração para backend real.

---

## Pergunta 4: Exclusividade Estrita do Craque do Jogo (MVP)

**Contexto:** Módulo `scout-pos-jogo` — função `toggleMvp()` em [`src/components/ScoutPosJogo.tsx:50-54`](file:///home/adomoraes/projects/na-prancheta/src/components/ScoutPosJogo.tsx#L50-L54)  
**Spec afetada:** [`_reversa_sdd/scout-pos-jogo/requirements.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/scout-pos-jogo/requirements.md)  
**Pergunta:** O sistema deve impor exclusividade estrita ao MVP (desmarcando automaticamente qualquer atleta anteriormente eleito ao selecionar um novo), ou a eleição pode contemplar múltiplos destaques simultâneos na mesma partida?  
**Impacto:** Se for estritamente exclusivo, a função `toggleMvp` deve percorrer `scoutList` zerando `foi_mvp` de outros atletas antes de atribuir ao selecionado.

✅ **Respondida**  
**Resposta:** estritamente exclusivo

---

## Pergunta 5: Regra de Bloqueio por Limite de Vagas na Partida

**Contexto:** Módulo `confirmacao-presenca` — lista de presenças em [`src/components/MatchCardConfirmacao.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/MatchCardConfirmacao.tsx)  
**Spec afetada:** [`_reversa_sdd/confirmacao-presenca/requirements.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/confirmacao-presenca/requirements.md)  
**Pergunta:** Deve existir um teto máximo de atletas confirmados por jogo (ex: 22 ou 25 jogadores), após o qual novas confirmações são automaticamente direcionadas para uma "Lista de Espera"?  
**Impacto:** Se sim, o enum `StatusConfirmacao` precisa receber o estado `'lista_espera'` e o componente deve travar o botão "Vou" ao atingir a capacidade máxima configurada no evento.

✅ **Respondida**  
**Resposta:** sim.

---

## Pergunta 6: Unicidade de Número de Camisa no Elenco

**Contexto:** Módulo `onboarding-elenco` — campo `numeroCamisa` em [`src/components/SelfOnboardingModal.tsx:141-154`](file:///home/adomoraes/projects/na-prancheta/src/components/SelfOnboardingModal.tsx#L141-L154)  
**Spec afetada:** [`_reversa_sdd/onboarding-elenco/tasks.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/onboarding-elenco/tasks.md)  
**Pergunta:** O número de camisa preferido deve ser único por atleta no elenco ativo, emitindo aviso de conflito se outro jogador já estiver registrado com o mesmo número, ou números duplicados são permitidos (ex: titulares e reservas com mesma numeração em jogos diferentes)?  
**Impacto:** Se a numeração for exclusiva, a submissão do formulário de onboarding deve validar a existência prévia do número no array `atletas`.

✅ **Respondida**  
**Resposta:** numeração exclusiva por atleta.
