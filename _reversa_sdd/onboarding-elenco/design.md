# Design Técnico: Self-Onboarding do Atleta

> Nível de Documentação: **Detalhado**  
> Unit: `onboarding-elenco`  
> Componente Base: [`src/components/SelfOnboardingModal.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/SelfOnboardingModal.tsx)

---

## 1. Interface e Contratos

### 1.1 Assinatura do Componente React

| Símbolo | Propriedade | Tipo | Obrigatório | Descrição |
|---|---|---|:---:|---|
| `SelfOnboardingModal` | `isOpen` | `boolean` | Sim | Controla a renderização do modal sobre a tela. |
| `SelfOnboardingModal` | `onClose` | `() => void` | Sim | Callback para fechar a janela modal. |
| `SelfOnboardingModal` | `onAddAtleta` | `(novoAtleta: Atleta) => void` | Sim | Callback acionado ao submeter o formulário com o objeto do novo atleta. |

---

## 2. Fluxo Principal

1. **Abertura do Modal**:
   - Acionado via botão no componente `Header.tsx` ("Novo Atleta" / ícone `UserPlus`), alternando `isOnboardingOpen` para `true` em `App.tsx`.
2. **Preenchimento dos Campos de Entrada**:
   - O usuário insere nome completo (obrigatório), apelido de vestiário, telefone WhatsApp e número de camisa desejado (1 a 99).
3. **Seleção de Posições e Uniformes**:
   - Posição principal e secundária escolhidas a partir da lista fixa de 9 posições táticas.
   - Tamanhos de camisa e calção selecionados nos botões táteis (P, M, G, GG).
   - Tipo de vínculo com o clube: Mensalista Oficial ou Convidado da Rodada.
4. **Submissão do Formulário (`handleSubmit`)**:
   - Valida `nome.trim() !== ''`.
   - Constrói o objeto `Atleta` com ID temporal `atl-${Date.now()}` e timestamp de pontualidade `T-50 min (No Horário)`.
   - Invoca `onAddAtleta(novo)` e `onClose()`.
5. **Efeito Cascata no Estado Central (`App.tsx`)**:
   - Adiciona o atleta ao array `atletas` e salva em `naprancheta_atletas`.
   - Cria e anexa automaticamente um objeto `EventoPresenca` com `status: 'confirmado'` e salva em `naprancheta_presencas`.
   - Cria e anexa automaticamente um objeto `EventoColetaDia` com `pago: false` e valor da taxa do jogo, salvando em `naprancheta_coletas`.

---

## 3. Fluxos Alternativos e Exceções

### 3.1 Violação de Nome em Branco
- Se o campo nome for submetido vazio ou apenas com espaços:
  ```typescript
  if (!nome.trim()) {
    alert('Informe ao menos o nome do atleta.');
    return;
  }
  ```
- O formulário bloqueia a submissão e mantém o modal aberto com os demais campos intactos.

### 3.2 Cancelamento ou Fechamento
- O usuário pode fechar o modal a qualquer momento clicando no botão `X` do cabeçalho sem persistir alterações.

---

## 4. Dependências

- `lucide-react`: `X`, `UserPlus`, `Check`, `Shirt`, `Phone`, `User`, `Shield`.
- `src/types.ts`: `Atleta`, `TipoVinculo`, `NivelAcesso`, `EventoPresenca`, `EventoColetaDia`.

---

## 5. Decisões de Design Identificadas

| Decisão | Evidência no Código | Confiança |
|---|---|:---:|
| Modal com efeito blur de fundo escuro (`bg-black/80 backdrop-blur-sm`) | `src/components/SelfOnboardingModal.tsx:70` | 🟢 |
| Criação em cascata imediata de presença e cobrança para reduzir atrito no vestiário | `src/App.tsx:98-109` | 🟢 |
| Botões em grade para escolha rápida de tamanho (P, M, G, GG) sem menus dropdown | `src/components/SelfOnboardingModal.tsx:200-238` | 🟢 |
| Inserção padrão de pontualidade (`T-50 min (No Horário)`) habilitando o novato para a prancheta | `src/components/SelfOnboardingModal.tsx:62` | 🟢 |

---

## 6. Estado Interno

```typescript
const [nome, setNome] = useState<string>('');
const [apelido, setApelido] = useState<string>('');
const [telefone, setTelefone] = useState<string>('');
const [posicaoPrincipal, setPosicaoPrincipal] = useState<string>('Meio-Campo');
const [posicaoSecundaria, setPosicaoSecundaria] = useState<string>('Volante');
const [numeroCamisa, setNumeroCamisa] = useState<number | ''>('');
const [tamanhoCamisa, setTamanhoCamisa] = useState<string>('G');
const [tamanhoCalcao, setTamanhoCalcao] = useState<string>('G');
const [tipoVinculo, setTipoVinculo] = useState<TipoVinculo>('mensalista');
```

---

## 7. Observabilidade

- Ao salvar, os dados são distribuídos em três chaves do `localStorage`:
  - `naprancheta_atletas`: cadastro do jogador.
  - `naprancheta_presencas`: presença confirmada.
  - `naprancheta_coletas`: débito da vaquinha.

---

## 8. Riscos e Lacunas (🔴 / 🟡)

- 🔴 **LACUNA**: Não há checagem de duplicidade de número de camisa (`numero_camisa`). Dois atletas podem ser cadastrados com o mesmo número, provocando conflito visual no gramado da prancheta.
- 🔴 **LACUNA**: Ausência de validação de máscara no campo de telefone WhatsApp (aceita caracteres alfanuméricos arbitrários).
- 🟡 **INFERIDO**: A pontualidade é atribuída compulsoriamente como "No Horário", impedindo cadastrar um convidado que tenha chegado após o horário regulamentar de troca.
