# Máquinas de Estado — Na Prancheta

> Gerado pelo **Reversa Detetive** em 18/09/2026  
> Nível de Documentação: **Detalhado**  
> Escopo: Ciclos de vida, transições de status e diagramas de estado em Mermaid

---

## 1. Máquina de Estados: Ciclo de Vida do Evento / Partida

Controla o progresso cronológico de um confronto esportivo desde a criação até o encerramento da rodada.

```mermaid
stateDiagram-v2
    [*] --> agendado: Criação da partida e divulgação de data/local
    
    agendado --> em_vestiario: Abertura do vestiário (T-70 min)
    em_vestiario --> em_aquecimento: Conclusão da preleção e saída ao campo (T-25 min)
    em_aquecimento --> em_jogo: Término do aquecimento e apito inicial (T-0)
    em_jogo --> finalizado: Apito final, registro de scout e fechamento das malas
    
    finalizado --> [*]
```

---

## 2. Máquina de Estados: Confirmação de Presença (`EventoPresenca`)

Controla a resposta individual do atleta no quadro de presenças da partida.

```mermaid
stateDiagram-v2
    [*] --> duvida: Convocação gerada (status inicial padrão)
    
    duvida --> confirmado: Atleta clica no botão 'Vou'
    duvida --> recusado: Atleta clica no botão 'Não Vou'
    
    confirmado --> recusado: Imprevisto informado pelo atleta
    confirmado --> duvida: Incerteza comunicada antes da partida
    
    recusado --> confirmado: Reversão de disponibilidade
    recusado --> duvida: Reavaliação de agenda
    
    confirmado --> lista_espera: Excedente de vagas no elenco (regra futura)
    lista_espera --> confirmado: Desistência de outro titular/reserva
```

---

## 3. Máquina de Estados: Protocolo Oficial de Vestiário

Regula a linha do tempo regressiva de 70 minutos pré-jogo e as obrigações disciplinares.

```mermaid
stateDiagram-v2
    [*] --> PreAbertura: T > 70 min
    
    PreAbertura --> ComissaoEMalas: T <= 70 min (Chegada da comissão e malas de fardamento)
    ComissaoEMalas --> VestiarioObrigatorio: T <= 50 min (Apresentação obrigatória de todo o elenco)
    
    VestiarioObrigatorio --> PrelecaoEEscalacao: T <= 35 min (Fechamento das portas da preleção)
    note right of PrelecaoEEscalacao
        Corte automático de atrasados:
        Atleta que chegar após este marco
        inicia compulsoriamente no banco.
    end note
    
    PrelecaoEEscalacao --> AquecimentoCampo: T <= 25 min (Início das 4 etapas neuromusculares)
    AquecimentoCampo --> JogoIniciado: T - 0 min (Apito inicial do árbitro)
    
    JogoIniciado --> [*]
```

---

## 4. Máquina de Estados: Escalação Tática e Condição do Atleta

Determina o enquadramento de um atleta na prancheta técnica durante o dia do jogo.

```mermaid
stateDiagram-v2
    [*] --> NaoConfirmado: Presença em dúvida ou recusada
    [*] --> ConfirmadoPontual: Presença confirmada e chegada antes de T-35
    [*] --> ConfirmadoAtrasado: Presença confirmada mas chegada após T-35
    
    ConfirmadoPontual --> Titular433: Escalado entre os 11 titulares
    ConfirmadoPontual --> BancoReservasApto: Alocado como reserva (opção tática)
    
    BancoReservasApto --> Titular433: Promovido a titular (limite <= 11)
    Titular433 --> BancoReservasApto: Substituído / desmarcado
    
    ConfirmadoAtrasado --> BancoCompulsorio: Trava T-35 ativa (corte automático)
    note right of BancoCompulsorio
        Bloqueado: Tentativa de promover
        a titular dispara pop-up disciplinar.
    end note
```

---

## 5. Máquina de Estados: Cobrança da Vaquinha do Jogo (`EventoColetaDia`)

Controla o fluxo financeiro da taxa individual da partida.

```mermaid
stateDiagram-v2
    [*] --> pendente: Atleta confirma presença no evento
    
    pendente --> pago: Tesoureiro registra recebimento (PIX / Dinheiro)
    pago --> pendente: Estorno / correção de lançamento manual
    
    pago --> [*]: Fechamento financeiro da rodada
```

---

## 6. Máquina de Estados: Trava da Resenha Social (Almoxarifado)

Regula a liberação da resenha e consumo de bebidas pelo elenco no pós-jogo.

```mermaid
stateDiagram-v2
    [*] --> ResenhaBloqueada: Término da partida
    
    state ResenhaBloqueada {
        [*] --> PendenteCamisas
        PendenteCamisas --> CamisasConferidas: 22 camisas desviradas na mala
        
        [*] --> PendenteBolas
        PendenteBolas --> BolasConferidas: 6 bolas oficiais recolhidas
        
        [*] --> PendenteMala
        PendenteMala --> MalaFechada: Mala trancada no veículo oficial
    }
    
    ResenhaBloqueada --> ResenhaLiberada: Todas as 3 condições satisfeitas (tudoConferido === true)
    
    state ResenhaLiberada {
        [*] --> SocialLiberado: Confraternização e resenha autorizadas
    }
```
