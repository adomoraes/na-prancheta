# Design Técnico: Prancheta Tática e Gestão de Titulares

> Nível de Documentação: **Detalhado**  
> Unit: `prancheta-tatica`  
> Componente Base: [`src/components/PranchetaTecnica.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/PranchetaTecnica.tsx)

---

## 1. Interface e Contratos

### 1.1 Assinatura do Componente React

| Símbolo | Propriedade | Tipo | Obrigatório | Descrição |
|---|---|---|:---:|---|
| `PranchetaTecnica` | `evento` | `Evento` | Sim | Objeto completo da partida ativa com dados de data, local e adversário. |
| `PranchetaTecnica` | `atletas` | `Atleta[]` | Sim | Lista completa de atletas cadastrados no elenco. |
| `PranchetaTecnica` | `presencas` | `EventoPresenca[]` | Sim | Lista de confirmações de presença da partida corrente. |

---

## 2. Fluxo Principal

1. **Derivação de Elegibilidade de Confirmados**:
   - Constrói um `Set` contendo apenas os IDs de atletas com confirmação positiva:
     ```typescript
     const confirmadosIds = new Set(
       presencas.filter((p) => p.status === 'confirmado').map((p) => p.atleta_id)
     );
     const atletasConfirmados = atletas.filter((a) => confirmadosIds.has(a.id));
     ```
2. **Carga e Separação de Titulares e Reservas**:
   - Com base no estado local `titularesIds`, particiona os atletas confirmados:
     ```typescript
     const titulares = atletasConfirmados.filter((a) => titularesIds.includes(a.id));
     const reservas = atletasConfirmados.filter((a) => !titularesIds.includes(a.id));
     ```
3. **Distribuição Espacial no Gramado (Esquema 4-3-3)**:
   - Os 11 titulares são divididos em 4 linhas por index slices:
     - **Goleiro**: `titulares.slice(0, 1)` — Nó individual centralizado com anel roxo (`border-purple-500/80`).
     - **Linha Defensiva**: `titulares.slice(1, 5)` — 4 nós horizontais (Laterais e Zagueiros) com anel âmbar (`border-amber-500/80`).
     - **Linha de Meio-Campo**: `titulares.slice(5, 8)` — 3 nós horizontais (Volante e Meias) com anel azul (`border-blue-500/80`).
     - **Linha de Ataque**: `titulares.slice(8, 11)` — 3 nós horizontais (Pontas e Centroavante) com anel verde-esmeralda (`border-emerald-500/80`).
4. **Mapeamento do Banco de Reservas**:
   - Renderiza os atletas em `reservas` em grade de cards, destacando o vínculo e o status de pontualidade.
5. **Ação de Alternância de Titularidade (`toggleTitular`)**:
   - O usuário toca em qualquer atleta no campo ou no banco para transferi-lo entre as listas, submetido às validações de regras de negócio.
6. **Divulgação da Escalação para Preleção (`handleDivulgar`)**:
   - Dispara `setNotifiedPrelecao(true)` com timer de 3.000 ms via `setTimeout` para retorno automático ao estado de espera.

---

## 3. Fluxos Alternativos e Exceções

### 3.1 Violação da Regra do Vestiário T-35 (Atraso Compulsório)
- Ao invocar `toggleTitular(atleta)`, avalia:
  ```typescript
  if (atleta.chegou_em?.includes('Atrasado')) {
    alert(
      `Regra do Vestiário (T-35): ${atleta.apelido || atleta.nome} chegou após o horário obrigatório de troca. Por protocolo oficial do clube, o atleta deve iniciar a partida compulsoriamente no banco de reservas.`
    );
    return;
  }
  ```
- O fluxo é abortado sem inclusão do atleta na lista de titulares.

### 3.2 Transbordamento de Limite de Titulares (> 11 Atletas)
- Caso o atleta não seja titular e `titularesIds.length >= 11`:
  ```typescript
  if (titularesIds.length >= 11) {
    alert('Limite de 11 titulares atingido. Remova um titular antes de adicionar outro.');
    return;
  }
  ```
- O fluxo é abortado sem exceder o teto regulamentar.

---

## 4. Dependências

- `lucide-react`: `Shield`, `AlertTriangle`, `Users`, `Share2`, `Sparkles`, `Check`, `ChevronDown`, `CheckCircle2`.
- `src/types.ts`: `Evento`, `Atleta`, `EventoPresenca`.

---

## 5. Decisões de Design Identificadas

| Decisão | Evidência no Código | Confiança |
|---|---|:---:|
| Visualização de campo vertical com gradiente escuro (`bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950`) | `src/components/PranchetaTecnica.tsx:116` | 🟢 |
| Elementos geométricos absolutos simulando linhas de marcação de campo de futebol | `src/components/PranchetaTecnica.tsx:118-122` | 🟢 |
| Cores temáticas por setor tático (Roxo=Goleiro, Âmbar=Defesa, Azul=Meio, Verde=Ataque) | `src/components/PranchetaTecnica.tsx:134,153,172,191` | 🟢 |
| Alertas nativos síncronos via `window.alert()` para bloqueios de regras de negócio | `src/components/PranchetaTecnica.tsx:42-45, 52` | 🟢 |
| Cartões de atletas sancionados no banco com fundo avermelhado translúcido (`bg-red-500/10 border-red-500/30`) | `src/components/PranchetaTecnica.tsx:224` | 🟢 |

---

## 6. Estado Interno

```typescript
// IDs dos atletas titulares (11 posições)
const [titularesIds, setTitularesIds] = useState<string[]>([
  'atl-1', // Lucão Goleiro
  'atl-3', // Felipinho LD
  'atl-2', // Digão ZAG
  'atl-4', // Biel ZAG
  'atl-5', // Thiaguinho LE
  'atl-6', // Danilão VOL
  'atl-7', // Bruninho MC
  'atl-8', // Deco MEI
  'atl-9', // Rafinha PD
  'atl-10', // Theus CA
  'atl-11', // Guga PE
]);

// Flag de confirmação transitória de liberação da preleção
const [notifiedPrelecao, setNotifiedPrelecao] = useState<boolean>(false);
```

---

## 7. Observabilidade

- Não há telemetria, analytics ou persistência em `localStorage` para a formação tática. Apenas mutação em memória volátil de componente.

---

## 8. Riscos e Lacunas (🔴 / 🟡)

- 🔴 **LACUNA**: `titularesIds` reside unicamente no estado volátil do React (`useState`). Ao atualizar a página (F5) ou alternar de tela, as alterações táticas efetuadas pela comissão técnica são perdidas, restaurando a escalação padrão estática.
- 🔴 **LACUNA**: O posicionamento tático no gramado depende puramente da ordem do array (`slice(0,1)`, `slice(1,5)`, etc.). Não existe vínculo inteligente com a propriedade `posicao_principal` do atleta (ex: adicionar um zagueiro no final do array o fará aparecer graficamente na linha de ataque).
- 🟡 **INFERIDO**: A ação "Liberar Escalação (T-35)" simula uma emissão com timeout local de 3 segundos, porém não dispara notificações push, envio de webhook para WhatsApp ou gravação de auditoria em banco.
