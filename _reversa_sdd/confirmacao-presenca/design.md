# Design Técnico: Confirmação de Presença e Ficha do Jogo

> Nível de Documentação: **Detalhado**  
> Unit: `confirmacao-presenca`  
> Componente Base: [`src/components/MatchCardConfirmacao.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/MatchCardConfirmacao.tsx)

---

## 1. Interface e Contratos

### 1.1 Assinatura do Componente React

| Símbolo | Propriedade | Tipo | Obrigatório | Descrição |
|---|---|---|:---:|---|
| `MatchCardConfirmacao` | `evento` | `Evento` | Sim | Objeto completo da partida ativa. |
| `MatchCardConfirmacao` | `presencas` | `EventoPresenca[]` | Sim | Lista de presenças dos atletas associadas ao evento. |
| `MatchCardConfirmacao` | `onUpdatePresenca` | `(atletaId: string, status: StatusConfirmacao) => void` | Sim | Callback para persistir a alteração de presença no estado central. |
| `MatchCardConfirmacao` | `currentAtletaId` | `string` | Sim | ID do atleta logado/ativo no momento da sessão. |

---

## 2. Fluxo Principal

1. **Recuperação de Presença Pessoal**:
   - Localiza o objeto de presença do usuário atual:
     ```typescript
     const minhaPresenca = presencas.find((p) => p.atleta_id === currentAtletaId);
     const statusAtual = minhaPresenca?.status || 'duvida';
     ```
2. **Cálculo de Agregações em Tempo Real**:
   - `confirmadosCount`: Quantidade de presenças com `status === 'confirmado'`.
   - `duvidasCount`: Quantidade com `status === 'duvida'`.
   - `recusadosCount`: Quantidade com `status === 'recusado'`.
3. **Formatação de Data e Horário**:
   - `dataFormatada`: Formatado via `toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })`.
   - `horaFormatada`: Formatado via `toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })`.
4. **Filtragem Dinâmica do Elenco**:
   - Filtra os atletas conforme o estado local `filter`: `'todos'`, `'confirmado'` ou `'duvida'`.
5. **Ação de Toque do Usuário (1 Toque)**:
   - Ao tocar em "Vou", "Não Vou" ou "Dúvida", dispara `onUpdatePresenca(currentAtletaId, novoStatus)`.
   - O componente raiz [`src/App.tsx`](file:///home/adomoraes/projects/na-prancheta/src/App.tsx) atualiza o array de presenças e salva no `localStorage`.

---

## 3. Fluxos Alternativos e Exceções

- **Atleta com Atraso Registrado**:
  - Na listagem de confirmações, verifica se `atleta.chegou_em?.includes('Atrasado')`.
  - Caso positivo, renderiza um aviso sublinhado em vermelho: `"Atrasou (Banco)"` logo abaixo do badge de confirmado.
- **Atleta Convidado**:
  - Verifica `atleta.tipo_vinculo === 'convidado'` e renderiza badge roxo específico para facilitar identificação pela comissão técnica.

---

## 4. Dependências

- `lucide-react`: `MapPin`, `Shirt`, `Calendar`, `DollarSign`, `UserCheck`, `Check`, `X`, `HelpCircle`, `Shield`, `AlertCircle`.
- `src/types.ts`: `Evento`, `EventoPresenca`, `Atleta`, `StatusConfirmacao`.

---

## 5. Decisões de Design Identificadas

| Decisão | Evidência no Código | Confiança |
|---|---|:---:|
| Botões de confirmação com 52px de altura mínima para ergonomia touch | `src/components/MatchCardConfirmacao.tsx:149` | 🟢 |
| Link direto para Google Maps com URL deep link | `src/components/MatchCardConfirmacao.tsx:79-88` | 🟢 |
| Atualização otimista imediata sem bloqueio de tela | `src/components/MatchCardConfirmacao.tsx:148,160,173` | 🟢 |

---

## 6. Estado Interno

```typescript
const [filter, setFilter] = useState<'todos' | 'confirmado' | 'duvida'>('todos');
```

---

## 7. Observabilidade

- Não há logs de auditoria remotos. O timestamp da resposta é persistido no campo `respondido_em` de cada item de `EventoPresenca`.

---

## 8. Riscos e Lacunas (🔴 / 🟡)

- 🔴 **LACUNA**: Não há limite configurável de vagas para a partida. Atualmente, qualquer número de atletas pode confirmar presença sem transbordamento automático para `lista_espera`.
- 🟡 **INFERIDO**: O `currentAtletaId` é simulado estaticamente em `App.tsx` baseado em flag booleana de tesoureiro em vez de sessão de autenticação real.
