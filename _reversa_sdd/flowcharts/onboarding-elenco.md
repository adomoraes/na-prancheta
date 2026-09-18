# Fluxograma — Self-Onboarding do Atleta

> Módulo: `onboarding-elenco`  
> Componente: `src/components/SelfOnboardingModal.tsx`

```mermaid
flowchart TD
    ClickNovoAtleta([Usuário Clica em 'Novo Atleta / Cadastrar']) --> OpenModal[Abre Modal de Auto-Cadastro]
    OpenModal --> FillForm[Preenche Nome, Apelido, WhatsApp, Nº Camisa, Posições e Tamanhos P/M/G/GG]
    
    FillForm --> SubmitForm([Usuário Clica em 'Concluir Cadastro no Elenco'])
    SubmitForm --> ValidateNome{nome.trim() !== ''?}
    
    ValidateNome -- Não --> AlertError["alert('Informe ao menos o nome do atleta.')"]
    AlertError --> FillForm
    
    ValidateNome -- Sim --> GenerateAtleta["Gera Atleta com id = 'atl-${Date.now()}', ativo = true"]
    GenerateAtleta --> TriggerAppHandler[Dispara handleAddAtleta no componente raiz App.tsx]
    
    TriggerAppHandler --> Step1[1. Adiciona Atleta no estado de Atletas]
    TriggerAppHandler --> Step2[2. Adiciona EventoPresenca confirmada no evento ativo]
    TriggerAppHandler --> Step3[3. Adiciona EventoColetaDia com valor_taxa_jogo e pago = false]
    
    Step1 --> CloseModal[Fecha Modal e Persiste no LocalStorage]
    Step2 --> CloseModal
    Step3 --> CloseModal
```
