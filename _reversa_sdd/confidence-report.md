# Relatório de Confiança da Engenharia Reversa — na-prancheta

> Gerado pelo Revisor do Reversa em 2026-09-18  
> Nível de Análise: **Detalhado**  
> Status: 🟢 CONCLUÍDO

---

## 1. Resumo Geral

| Nível de Certeza | Quantidade | Percentual | Descrição |
|---|---|---|---|
| 🟢 **CONFIRMADO** | 157 | 86.7% | Extraído diretamente do código-fonte e verificado linha a linha |
| 🟡 **INFERIDO**   | 13  | 7.2%  | Deduções lógicas e suposições funcionais fundamentadas |
| 🔴 **LACUNA**     | 11  | 6.1%  | Pontos de ambiguidade que demandam validação humana |
| **Total Analisado** | **181** | **100%** | **Inventário total de regras, contratos e comportamentos** |

### **Índice de Confiança Geral:** **90.3%**
$$\text{Confiança} = \frac{\text{Total 🟢} + (\text{Total 🟡} \times 0.5)}{\text{Total}} \times 100 = \frac{157 + (13 \times 0.5)}{181} \times 100 = 90.3\%$$

---

## 2. Cobertura por Unidade de Especificação (Spec)

| Unidade / Spec | 🟢 Confirmado | 🟡 Inferido | 🔴 Lacuna | Índice de Confiança |
|---|:---:|:---:|:---:|:---:|
| [`protocolo-vestiario`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/protocolo-vestiario/requirements.md) | 14 | 1 | 0 | **96.7%** |
| [`confirmacao-presenca`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/confirmacao-presenca/requirements.md) | 13 | 2 | 1 | **87.5%** |
| [`prancheta-tatica`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/prancheta-tatica/requirements.md) | 15 | 1 | 2 | **86.1%** |
| [`tesoureiro-vaquinha`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/tesoureiro-vaquinha/requirements.md) | 16 | 1 | 2 | **86.8%** |
| [`scout-pos-jogo`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/scout-pos-jogo/requirements.md) | 15 | 2 | 2 | **84.2%** |
| [`almoxarifado-patrimonio`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/almoxarifado-patrimonio/requirements.md) | 12 | 1 | 2 | **83.3%** |
| [`onboarding-elenco`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/onboarding-elenco/requirements.md) | 14 | 1 | 2 | **85.3%** |
| **Artefatos Globais de Arquitetura & Domínio** | 58 | 4 | 0 | **96.8%** |
| **Total Consolidado** | **157** | **13** | **11** | **90.3%** |

---

## 3. Principais Lacunas Auditadas (🔴)

As seguintes lacunas foram isoladas para direcionamento estratégico e constam detalhadas em [`_reversa_sdd/questions.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/questions.md) e [`_reversa_sdd/gaps.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/gaps.md):

1. **Persistência da Escalação Tática** (`prancheta-tatica`): O array `titularesIds` reside em `useState` volátil; recargas descartam escalações personalizadas.
2. **Parametrização da Chave PIX** (`tesoureiro-vaquinha`): Constante estática `11943210987` fixada no código JSX impede rotação de tesoureiro em tempo de execução.
3. **Persistência do Checklist Pós-Jogo** (`almoxarifado-patrimonio`): A validação tríplice de fechamento de malas e liberação da resenha é reiniciada ao recarregar a tela.
4. **Exclusividade Estrita de MVP** (`scout-pos-jogo`): Não há desativação mútua automática ao eleger um novo craque da partida.
5. **Teto de Presença e Lista de Espera** (`confirmacao-presenca`): O sistema permite confirmações ilimitadas sem direcionamento automático para fila de espera.
6. **Validação de Camisa Única** (`onboarding-elenco`): O cadastro permite números de camisas duplicados no elenco ativo.

---

## 4. Recomendações Estruturais para Ciclo Forward

- [ ] **Persistência Local Abrangente**: Padronizar chaves de `localStorage` para `naprancheta_titulares` e `naprancheta_almoxarifado`, garantindo integridade de estado offline.
- [ ] **Configuração Dinâmica de Rodada**: Desacoplar a chave PIX e o nome do custodiante das views, incorporando-os como propriedades da entidade `Evento`.
- [ ] **Módulo de Súmula Oficial**: Fechamento formal da partida que trave o lançamento de scouts e emita o boletim da rodada para exportação.
- [ ] **Design System e Toasts**: Substituir chamadas nativas de `window.alert()` por componentes de modal ou toasts desacoplados.

---

## 5. Histórico de Validação e Rastreabilidade

- **Fase 1 (Scout)**: 100% concluída (inventário, stack e dependências mapeados).
- **Fase 2 (Arqueólogo)**: 100% concluída (7 módulos analisados, dicionário de dados e 11 fluxogramas Mermaid).
- **Fase 3 (Detetive & Arquiteto)**: 100% concluída (ADRs, C4 context/containers/components, ERD e máquinas de estado).
- **Fase 4 (Redator)**: 100% concluída (23 especificações SDD, user stories e matriz de rastreabilidade).
- **Fase 5 (Revisor)**: 100% concluída (auditoria de consistência, questions.md, gaps.md e relatório de confiança emitido).
