# Matriz de Impacto de Especificações (Spec Impact Matrix) — Na Prancheta

> Gerado pelo **Reversa Arquiteto** em 18/09/2026  
> Nível de Documentação: **Detalhado**  
> Escopo: Rastreabilidade de impacto cruzado entre módulos, regras de negócio e componentes

---

## 1. Matriz de Dependência e Impacto Direto

| Componente de Origem (Quem Muda) | Componentes Impactados (Quem Reage) | Natureza do Impacto | Severidade de Regressão |
|---|---|---|:---:|
| **`onboarding-elenco`** (`SelfOnboardingModal`) | `App`, `confirmacao-presenca`, `tesoureiro-vaquinha` | Adição de novo atleta injeta automaticamente presença confirmada e registro de taxa de jogo em aberto no evento ativo. | 🟡 Média |
| **`confirmacao-presenca`** (`MatchCardConfirmacao`) | `prancheta-tatica`, `tesoureiro-vaquinha`, `scout-pos-jogo` | Apenas atletas confirmados ficam disponíveis para escalação titular/reserva, entram no rateio da vaquinha e aparecem no lançamento de scout. | 🔴 Alta |
| **`protocolo-vestiario`** (`VestiarioTimeline`) | `prancheta-tatica` | O marco T-35 aciona a Regra do Atraso. Atletas com chegada posterior a T-35 são impedidos pela prancheta de figurar entre os 11 titulares. | 🔴 Alta |
| **`prancheta-tatica`** (`PranchetaTecnica`) | `VestiarioTimeline`, `Header` | Divulgação da escalação no vestiário e alinhamento com a preleção oficial. | 🟢 Baixa |
| **`tesoureiro-vaquinha`** (`TesoureiroColeta`) | `App` | Atualização de status de pagamento altera métricas financeiras e resumo do WhatsApp. | 🟢 Baixa |
| **`almoxarifado-patrimonio`** (`AlmoxarifadoView`) | Experiência pós-jogo do elenco | A conferência das 22 camisas desviradas e 6 bolas controla a autorização da resenha social. | 🟡 Média |
| **`scout-pos-jogo`** (`ScoutPosJogo`) | Histórico de desempenho do time | Lançamento de gols, assistências e eleição do Craque do Jogo (MVP). | 🟢 Baixa |

---

## 2. Mapa Cruzado de Componente $\times$ Regra de Negócio

| Módulo | RN-01 (Presença) | RN-02 (Trava Atraso T-35) | RN-03 (11 Titulares) | RN-05 (Rateio Confirmados) | RN-08 (Camisas Desviradas) | RN-09 (Trava Resenha) | RN-11 (MVP Único) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `protocolo-vestiario` | - | **Define** | - | - | - | - | - |
| `confirmacao-presenca` | **Origina** | Sinaliza | - | Alimenta | - | - | - |
| `prancheta-tatica` | Consome | **Aplica** | **Aplica** | - | - | - | - |
| `tesoureiro-vaquinha` | Consome | - | - | **Aplica** | - | - | - |
| `scout-pos-jogo` | Consome | - | - | - | - | - | **Aplica** |
| `almoxarifado-patrimonio`| - | - | - | - | **Aplica** | **Aplica** | - |
| `onboarding-elenco` | Cria | - | - | Cria | - | - | - |

---

## 3. Diretrizes para Modificações Futuras (Test & Watch Points)

1. **Se alterar o formato do campo `chegou_em`**:
   - *Onde verificar*: `PranchetaTecnica.tsx:41` e `MatchCardConfirmacao.tsx:253`.
   - *Risco*: Quebra silenciosa da trava de titularidade dos atletas atrasados.
2. **Se alterar a estrutura de `EventoPresenca`**:
   - *Onde verificar*: `TesoureiroColeta.tsx` (filtro de confirmados) e `ScoutPosJogo.tsx`.
   - *Risco*: Atletas ausentes serem cobrados indevidamente ou receberem scout na partida.
3. **Se migrar de `localStorage` para banco de dados relacional**:
   - *Onde verificar*: `App.tsx` (todos os `useEffect` e handlers de atualização).
   - *Risco*: Dessincronização de estado entre abas e perda de persistência offline.
