# Design Técnico: Almoxarifado, Custódia de Malas e Patrimônio

> Nível de Documentação: **Detalhado**  
> Unit: `almoxarifado-patrimonio`  
> Componente Base: [`src/components/AlmoxarifadoView.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/AlmoxarifadoView.tsx)

---

## 1. Interface e Contratos

### 1.1 Assinatura do Componente React

| Símbolo | Propriedade | Tipo | Obrigatório | Descrição |
|---|---|---|:---:|---|
| `AlmoxarifadoView` | `itens` | `PatrimonioItem[]` | Sim | Catálogo completo dos bens e materiais esportivos do clube. |
| `AlmoxarifadoView` | `evento` | `Evento` | Sim | Dados do evento associado à rodada. |

---

## 2. Fluxo Principal

1. **Apresentação Institucional e Custódia**:
   - Renderiza cabeçalho com ícone de caixa/patrimônio (`Package`) e indicação do custodiante designado.
2. **Exibição da Regra de Ouro do Vestiário**:
   - Bloco de alerta em tom púrpuro comunicando que o consumo social de bebidas e confraternização ("resenha") está restrito ao cumprimento das devoluções.
3. **Checklist Pós-Jogo de 3 Fases**:
   - Três elementos `<input type="checkbox">` encapsulados em labels táteis:
     - `uniformesLadoCorreto`: Conferência de 22 camisas dobradas/depositadas do lado correto.
     - `bolasRecolhidas`: Contagem do bolsão com 6 bolas oficiais.
     - `malaConferida`: Tranca da mala 1 e armazenamento no veículo oficial.
4. **Avaliação Booleana Reativa (`tudoConferido`)**:
   - Conjunção lógica instantânea:
     ```typescript
     const tudoConferido = malaConferida && uniformesLadoCorreto && bolasRecolhidas;
     ```
   - O indicador de rodapé do card alterna para:
     - `LIBERADA ✅` (verde esmeralda) se verdadeiro.
     - `BLOQUEADA (Aguardando malas) ⏳` (âmbar) se falso.
5. **Renderização do Catálogo de Patrimônio Ativo**:
   - Itera sobre o array `itens`, renderizando card individual com nome, contagem de disponibilidade (`quantidade_disponivel / quantidade_total`) e observações de estado físico.

---

## 3. Fluxos Alternativos e Exceções

### 3.1 Desmarcação de Item Já Conferido
- Se qualquer um dos três checkboxes for desmarcado pelo usuário após liberação, `tudoConferido` é reavaliado imediatamente para `false`, revertendo o indicador para o estado de bloqueio.

---

## 4. Dependências

- `lucide-react`: `Package`, `CheckCircle2`, `AlertTriangle`, `ShieldCheck`, `Shirt`, `Check`, `RefreshCw`.
- `src/types.ts`: `PatrimonioItem`, `Evento`.

---

## 5. Decisões de Design Identificadas

| Decisão | Evidência no Código | Confiança |
|---|---|:---:|
| Labels com preenchimento interno e hover suave para facilidade de clique no vestiário | `src/components/AlmoxarifadoView.tsx:60, 72, 84` (`p-2.5 rounded-lg hover:border-zinc-700`) | 🟢 |
| Avaliação booleana derivada sem efeitos colaterais assíncronos | `src/components/AlmoxarifadoView.tsx:15` (`const tudoConferido = ...`) | 🟢 |
| Cartões de inventário compactos com métrica fracionária de disponibilidade | `src/components/AlmoxarifadoView.tsx:114-124` | 🟢 |
| Identificação visual púrpura (`bg-purple-500/10 text-purple-400`) para a identidade do almoxarifado | `src/components/AlmoxarifadoView.tsx:23, 43` | 🟢 |

---

## 6. Estado Interno

```typescript
// Validação das camisas desviradas para lavanderia
const [uniformesLadoCorreto, setUniformesLadoCorreto] = useState<boolean>(false);

// Validação da contagem das 6 bolas de jogo
const [bolasRecolhidas, setBolasRecolhidas] = useState<boolean>(false);

// Validação do trancamento e guarda da mala oficial
const [malaConferida, setMalaConferida] = useState<boolean>(false);
```

---

## 7. Observabilidade

- Não há persistência no `localStorage` nem telemetria remota para o checklist de devolução. As variáveis residem estritamente na memória volátil do componente React.

---

## 8. Riscos e Lacunas (🔴 / 🟡)

- 🔴 **LACUNA**: O estado do checklist (`malaConferida`, `uniformesLadoCorreto`, `bolasRecolhidas`) é volátil (`useState`). Ao recarregar a página (F5) ou alternar de aba na navegação do aplicativo, a conferência é resetada para desmarcada.
- 🔴 **LACUNA**: O nome do responsável pela custódia (`"Carlos Eduardo (Kadu)"`) está chumbado no JSX (linha 37) em vez de ser alimentado dinamicamente a partir dos metadados da partida ou do perfil do custodiante.
- 🟡 **INFERIDO**: A "trava da resenha" é puramente visual/informativa; não bloqueia telas do sistema ou fluxos concorrentes.
