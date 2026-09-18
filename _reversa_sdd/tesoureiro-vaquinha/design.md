# Design Técnico: Painel do Tesoureiro e Vaquinha do Jogo

> Nível de Documentação: **Detalhado**  
> Unit: `tesoureiro-vaquinha`  
> Componente Base: [`src/components/TesoureiroColeta.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/TesoureiroColeta.tsx)

---

## 1. Interface e Contratos

### 1.1 Assinatura do Componente React

| Símbolo | Propriedade | Tipo | Obrigatório | Descrição |
|---|---|---|:---:|---|
| `TesoureiroColeta` | `evento` | `Evento` | Sim | Dados da partida ativa, incluindo valor da taxa (`valor_taxa_jogo`) e nome do tesoureiro (`tesoureiro_nome`). |
| `TesoureiroColeta` | `coletas` | `EventoColetaDia[]` | Sim | Array de cobranças associadas ao evento. |
| `TesoureiroColeta` | `presencas` | `EventoPresenca[]` | Sim | Lista de confirmações de presença dos atletas. |
| `TesoureiroColeta` | `onTogglePago` | `(atletaId: string) => void` | Sim | Callback acionado ao alternar a situação de quitação de um atleta. |

---

## 2. Fluxo Principal

1. **Filtragem de Atletas Confirmados**:
   - Constrói o `Set` de atletas confirmados para filtrar o rateio:
     ```typescript
     const confirmadosIds = new Set(
       presencas.filter((p) => p.status === 'confirmado').map((p) => p.atleta_id)
     );
     const coletasConfirmados = coletas.filter((c) => confirmadosIds.has(c.atleta_id));
     ```
2. **Cálculo de Agregações Financeiras**:
   - `totalEsperado = coletasConfirmados.length * evento.valor_taxa_jogo;`
   - `totalArrecadado = coletasConfirmados.filter((c) => c.pago).reduce((sum, c) => sum + c.valor_pago, 0);`
   - `totalPendente = totalEsperado - totalArrecadado;`
   - `percentualArrecadado = totalEsperado > 0 ? (totalArrecadado / totalEsperado) * 100 : 0;`
3. **Renderização dos Cards de Totais**:
   - Exibe os 3 cards superiores: Total Arrecadado (verde), Pendente (âmbar) e Meta de Arbitragem com barra percentual (base R$ 300,00).
4. **Filtragem da Lista de Cobrança**:
   - Aplica o filtro de tela (`filter: 'todos' | 'pendentes' | 'pagos'`) sobre `coletasConfirmados`.
5. **Ação de Toque Rápido (`onTogglePago`)**:
   - O tesoureiro toca no botão "Cobrar" / "Pago" do atleta.
   - O callback eleva o evento para `App.tsx`, invertendo `pago`, gravando/removendo `pago_em` e persistindo a coleção no `localStorage` sob a chave `naprancheta_coletas`.

---

## 3. Fluxos Alternativos e Exceções

### 3.1 Cópia da Chave PIX (`handleCopyPix`)
- Invoca `navigator.clipboard.writeText(chavePixTesoureiro)`.
- Altera `copiedPix` para `true` e programa timeout de 2.000 ms para restauração.

### 3.2 Geração e Cópia do Resumo WhatsApp (`handleCopyResumoWhatsApp`)
- Compila a mensagem concatenando:
  1. Cabeçalho com título do evento e taxa individual.
  2. Arrecadado vs. Total Esperado e dados de PIX.
  3. Lista de atletas pendentes com prefixo `❌`.
  4. Lista de atletas pagos com prefixo `✅`.
- Grava no clipboard via `navigator.clipboard.writeText` e exibe feedback transitório `copiedResumo` por 2.000 ms.

---

## 4. Dependências

- `lucide-react`: `DollarSign`, `CheckCircle`, `Clock`, `Copy`, `Check`, `Users`, `Sparkles`, `AlertCircle`.
- `src/types.ts`: `Evento`, `EventoColetaDia`, `EventoPresenca`, `Atleta`.

---

## 5. Decisões de Design Identificadas

| Decisão | Evidência no Código | Confiança |
|---|---|:---:|
| Botão de ação de cobrança mobile com altura mínima de 44px (`min-h-[44px]`) | `src/components/TesoureiroColeta.tsx:235` | 🟢 |
| Formatação de moeda em Real brasileiro com 2 casas decimais (`toFixed(2)`) | `src/components/TesoureiroColeta.tsx:125,137` | 🟢 |
| Card de atleta pendente com realce sutil em âmbar (`bg-amber-500/5 border-amber-500/25`) | `src/components/TesoureiroColeta.tsx:206` | 🟢 |
| Resumo para WhatsApp estruturado com emojis para fácil leitura mobile | `src/components/TesoureiroColeta.tsx:50-68` | 🟢 |
| Persistência reativa no `localStorage` sob a chave `naprancheta_coletas` | `src/App.tsx:123` | 🟢 |

---

## 6. Estado Interno

```typescript
// Filtro visual da lista de cobrança
const [filter, setFilter] = useState<'todos' | 'pendentes' | 'pagos'>('todos');

// Indicador temporário de cópia da chave PIX
const [copiedPix, setCopiedPix] = useState<boolean>(false);

// Indicador temporário de cópia do resumo para WhatsApp
const [copiedResumo, setCopiedResumo] = useState<boolean>(false);
```

---

## 7. Observabilidade

- A persistência local reflete o estado de pagamento de cada atleta:
  ```json
  {
    "id": "col-1",
    "evento_id": "ev-1",
    "atleta_id": "atl-1",
    "valor_pago": 15.0,
    "pago": true,
    "pago_em": "2026-09-18T14:10:00.000Z"
  }
  ```

---

## 8. Riscos e Lacunas (🔴 / 🟡)

- 🔴 **LACUNA**: A chave PIX (`chavePixTesoureiro = '11943210987'`) está hardcoded diretamente no componente `TesoureiroColeta.tsx:41`, inviabilizando a troca dinâmica de tesoureiro sem alteração no código-fonte.
- 🔴 **LACUNA**: O custo da arbitragem (`custoArbitragem = 300.0`) está fixo no código (linha 38) em vez de ser um atributo dinâmico da entidade `Evento`.
- 🟡 **INFERIDO**: Não há conciliação com extrato bancário ou QR Code dinâmico do Banco Central (EMV/Pix Copia e Cola); a validação de quitação depende estritamente da conferência visual manual do tesoureiro.
