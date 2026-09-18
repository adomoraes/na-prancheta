# Design Técnico: Protocolo de Vestiário

> Nível de Documentação: **Detalhado**  
> Unit: `protocolo-vestiario`  
> Componente Base: [`src/components/VestiarioTimeline.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/VestiarioTimeline.tsx)

---

## 1. Interface e Contratos

### 1.1 Assinatura do Componente React

| Símbolo | Propriedade | Tipo | Obrigatório | Descrição |
|---|---|---|:---:|---|
| `VestiarioTimeline` | `evento` | `Evento` | Sim | Objeto completo da partida com campos de data/hora e marcos. |

### 1.2 Estrutura da Entidade `Evento` Utilizada

```typescript
interface Evento {
  id: string;
  titulo: string;
  data_hora: string; // ISO 8601 do início da partida
  horario_vestiario_t50: string; // ISO 8601 da chegada do elenco
  horario_prelecao_t35?: string; // ISO 8601 da preleção
  horario_aquecimento_t25?: string; // ISO 8601 do aquecimento
}
```

---

## 2. Fluxo Principal

1. **Inicialização do Estado**:
   - `countdownMinutes` é inicializado em `38` (representando $T-38$ min, imediatamente antes da preleção crítica).
   - `isLiveSimulating` é inicializado como `true`.
2. **Ciclo de Atualização Reativo (`useEffect`)**:
   - Um `setInterval` de 15.000 ms (15 segundos) é instanciado.
   - A cada tick, decrementa `countdownMinutes` em 1 unidade até atingir o limite mínimo zero (`prev > 0 ? prev - 1 : 0`).
   - Ao desmontar o componente, o intervalo é limpo via `clearInterval(interval)`.
3. **Derivação de Indicadores Visuais e Badges**:
   - Se `countdownMinutes <= 25`: define `currentMilestone = 'T-25: Aquecimento em Campo'` e `badgeColor = 'bg-emerald-600 animate-pulse'`.
   - Senão, se `countdownMinutes <= 35`: define `currentMilestone = 'T-35: Preleção & Escalação'` e `badgeColor = 'bg-red-600 animate-pulse'`.
   - Senão, se `countdownMinutes <= 50`: define `currentMilestone = 'T-50: Vestiário Obrigatório'` e `badgeColor = 'bg-amber-600'`.
4. **Renderização dos 4 Blocos da Timeline**:
   - Bloco 1: $T-1h10$ (Comissão & Malas)
   - Bloco 2: $T-50$ (Chegada Obrigatória)
   - Bloco 3: $T-35$ (Preleção & Escalação — com aviso da Regra do Atraso)
   - Bloco 4: $T-25$ (Aquecimento Fisiológico de Campo)
5. **Renderização do Protocolo de Campo**:
   - 4 caixas descritivas: Ativação (5-8 min), Mobilidade (5 min), Dinâmica (8 min) e Técnica (8 min).

---

## 3. Fluxos Alternativos e Exceções

- **Atleta com Chegada Registrada Após $T-35$**:
  - O componente `VestiarioTimeline` comunica a regra institucional.
  - A aplicação prática do corte ocorre no componente parceiro [`src/components/PranchetaTecnica.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/PranchetaTecnica.tsx) através da checagem da flag de atraso.
- **Pausa da Simulação de Tempo**:
  - Caso `isLiveSimulating` seja comutado para `false`, o `useEffect` interrompe os ticks do cronômetro.

---

## 4. Dependências

- `lucide-react`: Ícones `Clock`, `ShieldAlert`, `CheckCircle2`, `Flame`, `Activity`.
- `src/types.ts`: Tipo `Evento`.

---

## 5. Decisões de Design Identificadas

| Decisão | Evidência no Código | Confiança |
|---|---|:---:|
| Uso de decremento simulado em intervalo de 15s em vez de `Date.now()` para PoC | `src/components/VestiarioTimeline.tsx:15-21` | 🟢 |
| Acentos de cores semânticos no badge de acordo com o risco disciplinar | `src/components/VestiarioTimeline.tsx:24-35` | 🟢 |
| Divisão em 4 subfases explícitas para o aquecimento de 25 min | `src/components/VestiarioTimeline.tsx:182-199` | 🟢 |

---

## 6. Estado Interno

```typescript
const [selectedProtocolPhase, setSelectedProtocolPhase] = useState<number | null>(null);
const [countdownMinutes, setCountdownMinutes] = useState(38);
const [isLiveSimulating, setIsLiveSimulating] = useState(true);
```

---

## 7. Observabilidade

- Não há emissão de telemetria externa ou logs estruturados de auditoria no código legado. O estado é exclusivamente volátil em memória.

---

## 8. Riscos e Lacunas (🔴 / 🟡)

- 🔴 **LACUNA**: Ausência de cálculo baseado na hora real do sistema operacional (`Date.now()` contra `evento.data_hora`). Se a página for recarregada, o cronômetro volta para 38 minutos.
- 🟡 **INFERIDO**: A interação de clique nos cards (`setSelectedProtocolPhase`) altera estado local mas atualmente não expande um modal ou gaveta dedicada na PoC.
