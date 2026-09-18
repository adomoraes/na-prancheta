# Design Técnico: Scout Pós-Jogo Simplificado

> Nível de Documentação: **Detalhado**  
> Unit: `scout-pos-jogo`  
> Componente Base: [`src/components/ScoutPosJogo.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/ScoutPosJogo.tsx)

---

## 1. Interface e Contratos

### 1.1 Assinatura do Componente React

| Símbolo | Propriedade | Tipo | Obrigatório | Descrição |
|---|---|---|:---:|---|
| `ScoutPosJogo` | `evento` | `Evento` | Sim | Dados do confronto ativo para vinculação do scout (`evento_id`). |
| `ScoutPosJogo` | `atletas` | `Atleta[]` | Sim | Lista completa de atletas do elenco. |
| `ScoutPosJogo` | `presencas` | `EventoPresenca[]` | Sim | Presenças confirmadas para filtrar os participantes aptos. |
| `ScoutPosJogo` | `scoutList` | `EventoScout[]` | Sim | Coleção de estatísticas individuais acumuladas no evento. |
| `ScoutPosJogo` | `onUpdateScout` | `(scout: EventoScout) => void` | Sim | Callback acionado a cada mutação de contadores ou MVP. |

---

## 2. Fluxo Principal

1. **Seleção de Participantes**:
   - Isola os atletas com presença confirmada:
     ```typescript
     const confirmadosIds = new Set(
       presencas.filter((p) => p.status === 'confirmado').map((p) => p.atleta_id)
     );
     const atletasParticipantes = atletas.filter((a) => confirmadosIds.has(a.id));
     ```
2. **Carregamento ou Criação de Scout Padrão**:
   - Recupera o objeto do atleta selecionado (`selectedAtletaId`) ou inicializa estrutura padrão com 40 minutos jogados:
     ```typescript
     const currentScout: EventoScout =
       scoutList.find((s) => s.atleta_id === selectedAtletaId) || {
         id: `scout-${selectedAtletaId}`,
         evento_id: evento.id,
         atleta_id: selectedAtletaId,
         minutos_jogados: 40,
         gols: 0,
         assistencias: 0,
         cartao_amarelo: 0,
         cartao_vermelho: 0,
         foi_mvp: false,
         gols_sofridos: 0,
       };
     ```
3. **Agregação Coletiva no Placar**:
   - Soma total de gols (`reduce`), total de assistências e identificação do atleta premiado com `foi_mvp`.
4. **Interação com Contadores Táteis (`updateField`)**:
   - Ao tocar em `+` ou `-`, calcula o novo valor garantindo `val >= 0`.
   - Dispara `onUpdateScout(updated)`.
   - O componente raiz `src/App.tsx` atualiza o array de scouts e persiste no `localStorage` sob a chave `naprancheta_scout`.
5. **Alternância de Craque do Jogo (`toggleMvp`)**:
   - Inverte o booleano `foi_mvp` e dispara persistência imediata.

---

## 3. Fluxos Alternativos e Exceções

### 3.1 Proteção de Piso Zero
- Se `(currentScout[field] as number) + delta < 0`, o processamento é interrompido imediatamente sem disparar callbacks ou re-renderizações espúrias:
  ```typescript
  const val = (currentScout[field] as number) + delta;
  if (val < 0) return;
  ```

### 3.2 Indicação Visual de Scout Preenchido
- No carrossel horizontal de atletas, verifica-se:
  ```typescript
  const hasStats = scoutList.some(
    (s) => s.atleta_id === atleta.id && (s.gols > 0 || s.assistencias > 0 || s.foi_mvp)
  );
  ```
- Caso verdadeiro, exibe um ponto indicador circular âmbar (`bg-amber-400`) para alertar o operador de que o atleta já foi lançado.

---

## 4. Dependências

- `lucide-react`: `Trophy`, `Award`, `Plus`, `Minus`, `Check`, `Clock`, `ShieldCheck`, `Flame`, `Star`, `PackageCheck`.
- `src/types.ts`: `Evento`, `EventoScout`, `Atleta`, `EventoPresenca`.

---

## 5. Decisões de Design Identificadas

| Decisão | Evidência no Código | Confiança |
|---|---|:---:|
| Seletor horizontal deslizante com rolagem fluida e scrollbar oculta | `src/components/ScoutPosJogo.tsx:115` (`scrollbar-none overflow-x-auto`) | 🟢 |
| Botões de contadores com target de 36x36px (`w-9 h-9`) para touch na beira do campo | `src/components/ScoutPosJogo.tsx:194, 200, 216, 222, 238, 244, 260, 266` | 🟢 |
| Minutagem com passos de 5 minutos em vez de 1 minuto para rapidez operacional | `src/components/ScoutPosJogo.tsx:237-248` (`-5` e `+5`) | 🟢 |
| Badge do Craque (MVP) com realce dourado (`bg-amber-500 text-zinc-950 font-black`) | `src/components/ScoutPosJogo.tsx:174` | 🟢 |
| Banner fixo com protocolo ético de pós-jogo (roda de 3 min e uniformes desvirados) | `src/components/ScoutPosJogo.tsx:277-291` | 🟢 |

---

## 6. Estado Interno

```typescript
// Atleta em foco para inserção de estatísticas
const [selectedAtletaId, setSelectedAtletaId] = useState<string>(atletas[9]?.id || atletas[0]?.id);

// Flag de feedback de salvamento
const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
```

---

## 7. Observabilidade

- A persistência local em `localStorage` armazena o histórico sob a chave `naprancheta_scout`:
  ```json
  [
    {
      "id": "scout-atl-10",
      "evento_id": "ev-1",
      "atleta_id": "atl-10",
      "minutos_jogados": 45,
      "gols": 2,
      "assistencias": 1,
      "cartao_amarelo": 0,
      "cartao_vermelho": 0,
      "foi_mvp": true,
      "gols_sofridos": 0
    }
  ]
  ```

---

## 8. Riscos e Lacunas (🔴 / 🟡 / 🟢)

- 🟢 **CONFIRMADO (Regra Validada)**: O MVP é estritamente exclusivo por jogo. Na refatoração/evolução, a função `toggleMvp()` deve desmarcar automaticamente qualquer atleta com `foi_mvp === true` antes de aplicar ao atleta selecionado.
- 🟡 **INFERIDO**: Os campos `cartao_vermelho` e `gols_sofridos` existem no schema de dados de `EventoScout`, mas não contam com interface gráfica de entrada em `ScoutPosJogo.tsx`.
- 🟡 **INFERIDO**: Ausência de validação de coerência entre os gols lançados individualmente e o placar total de gols do jogo contra o adversário.
