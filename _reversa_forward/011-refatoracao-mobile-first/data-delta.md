# Delta no Modelo de Dados: Feature 011 - Refatoração Mobile-First

> Data: `2026-10-02`  
> Referência no legado: `_reversa_sdd/erd-complete.md`  
> Confidência: 🟢 CONFIRMADO  

---

## 1. Visão Geral das Alterações

A feature `011-refatoracao-mobile-first` tem escopo **estritamente de Frontend (UI/UX, CSS e Layouts Responsivos)**.

- **Novas Tabelas no Banco de Dados:** **Nenhuma**.
- **Alterações em Tabelas Existentes:** **Nenhuma**.
- **Novas Colunas, Índices ou Restrições:** **Nenhuma**.
- **Migrações Laravel:** **Nenhuma**.
- **Models Eloquent Alterados:** **Nenhum**.
- **Impacto em Dados Históricos / Legados:** **Zero**.

---

## 2. Rastreabilidade com Entidades Operacionais

Todas as entidades persistidas no PostgreSQL e consumidas pelo frontend mantêm 100% de compatibilidade estrutural:

| Entidade | Consumo no Frontend Mobile | Status do Schema |
|----------|----------------------------|-------------------|
| `eventos` | Exibição de cards de partida e seletor compacto de jogos no topo. | Intocado |
| `atletas` | Listagem de elenco, avatares nos botões de campo 4-3-3 e drawer de perfil. | Intocado |
| `escalacoes` | Coordenadas e titulares/reservas da Prancheta Tática adaptativa. | Intocado |
| `taxas_jogo` | Cards de baixa de PIX e rateio da vaquinha da arbitragem. | Intocado |
| `scouts` | Exibição consolidada no Bottom Sheet do menu "Mais". | Intocado |
| `itens_patrimonio` | Checklist da "Trava da Resenha" e almoxarifado via Bottom Sheet. | Intocado |
| `users` | Autenticação Google e controle de perfil de acesso. | Intocado |

---

## 3. Estado Local do Frontend (UI State Delta)

Embora não haja delta no banco de dados, o gerenciamento de estado local do cliente React 19 incorpora os seguintes estados voláteis:

```typescript
// Novos estados de UI em memória (src/App.tsx ou src/contexts/MobileContext.tsx)
interface MobileUIState {
  activeTab: 'vestiario' | 'presenca' | 'tatica' | 'caixa' | 'mais';
  isMoreDrawerOpen: boolean;
  isKeyboardOpen: boolean;
  viewportWidth: number;
  viewportHeight: number;
}
```

Esses estados controlam exclusivamente transições de tela, abertura de gavetas inferiores e auto-ocultação da Bottom Bar, sem persistência remota.
