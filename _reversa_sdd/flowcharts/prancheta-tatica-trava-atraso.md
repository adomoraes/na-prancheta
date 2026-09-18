# Fluxograma de Função — Algoritmo `toggleTitular` e Trava de Atraso

> Módulo: `prancheta-tatica`  
> Função: `toggleTitular(atleta: Atleta)` em `src/components/PranchetaTecnica.tsx`

```mermaid
flowchart TD
    InvokeToggle([toggleTitular é chamada para o atleta]) --> CheckStringAtraso{atleta.chegou_em contem 'Atrasado'?}
    
    CheckStringAtraso -- Sim --> ShowPopup["alert('Regra do Vestiário (T-35): Chegou após o horário obrigatório...')"]
    ShowPopup --> AbortExecution([Interrompe execução sem alterar escalação])
    
    CheckStringAtraso -- Não --> CheckIsAlreadyTitular{titularesIds.includes(atleta.id)?}
    
    CheckIsAlreadyTitular -- Sim --> FilterOut["setTitularesIds(titularesIds.filter(id !== atleta.id))"]
    FilterOut --> SuccessExit([Atleta removido da titularidade])
    
    CheckIsAlreadyTitular -- Não --> Check11Limit{titularesIds.length >= 11?}
    Check11Limit -- Sim --> ShowLimitAlert["alert('Limite de 11 titulares atingido...')"]
    ShowLimitAlert --> AbortExecution
    
    Check11Limit -- Não --> AppendTitular["setTitularesIds([...titularesIds, atleta.id])"]
    AppendTitular --> SuccessExit
```
