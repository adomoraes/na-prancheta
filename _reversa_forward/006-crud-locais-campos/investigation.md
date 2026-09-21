# Investigação Técnica: CRUD de Locais e Campos da Partida

> Identificador: `006-crud-locais-campos`  
> Data: `2026-09-21`  
> Feature: CRUD para Locais e Campos e listagem no formulário da partida  

---

## 1. Contexto e Motivação

No futebol de final de semana, as equipes costumam atuar em um conjunto rotativo de praças esportivas e campos societários fixos (geralmente de 2 a 5 campos habituais). Em partidas pontuais, a comissão técnica precisava digitar manualmente o endereço, nome do campo e link do Google Maps para cada jogo agendado. Erros na digitação do link de mapas causavam atrasos na chegada de atletas e convidados no vestiário (impactando a regra de corte disciplinar $T-35$).

A criação de um catálogo de locais padroniza os dados, possibilita auto-preenchimento e qualifica o histórico de confrontos.

---

## 2. Decisão de Modelagem: Tabela de Apoio + Snapshot

A relação entre Partidas e Locais possui uma particularidade crítica em sistemas de eventos:
- Se uma arena esportiva for reformada, mudar de nome (ex.: por naming rights ou troca de proprietário) ou mudar de bairro, os confrontos passados que já aconteceram naquele endereço histórico NÃO devem ter seu histórico alterado de forma retroativa.
- **Padrão adotado:** A partida armazena a referência relacional opcional `local_id`, mas retém as colunas de texto congelado (`local_nome`, `local_endereco`, `local_maps_url`). Ao selecionar o local no formulário, o sistema copia os dados atuais para a partida. Caso o local seja editado no futuro, o histórico do jogo permanece íntegro.

---

## 3. Campos da Entidade `Local`

| Atributo | Tipo SQL | Restrição | Exemplo |
|---|---|---|---|
| `id` | UUID | Chave Primária | `a1b2c3d4-...` |
| `time_id` | UUID | Foreign Key (`times`) | `11111111-...` |
| `nome` | VARCHAR(150) | NOT NULL, UNIQUE com time_id | "Arena Fut7 Central" |
| `endereco` | VARCHAR(255) | NOT NULL | "Av. das Américas, 1500 - Barra" |
| `maps_url` | TEXT | NULLABLE | "https://maps.google.com/?q=-22.9..." |
| `tipo_piso` | VARCHAR(50) | DEFAULT 'Grama Sintética' | "Grama Sintética", "Terra", "Grama Natural" |
| `observacoes` | TEXT | NULLABLE | "Estacionamento R$ 10,00, Vestiário 2" |
| `ativo` | BOOLEAN | DEFAULT TRUE | `true` / `false` |
| `timestamps` | TIMESTAMP | NOT NULL | Criação e atualização |

---

## 4. Integração com a UI do Formulário de Partidas

No componente `AdminDashboard.tsx`:
1. Uma aba dedicada **"Locais & Campos"** permite listar, criar, editar e ativar/desativar campos.
2. No modal de criação/edição de partida:
   - Um dropdown exibe os locais cadastrados ativos: `<option value={local.id}>{local.nome} - {local.tipo_piso}</option>`.
   - Há uma opção especial `outro` / `personalizado`: "Outro / Digitar manualmente".
   - Quando o usuário seleciona um local do dropdown, o estado do formulário (`partidaForm`) atualiza automaticamente `local_nome = local.nome`, `local_endereco = local.endereco` e `local_maps_url = local.maps_url`.

---

## 5. Conclusão da Investigação

A solução é enxuta, resiliente, oferece ganho imediato de usabilidade e preserva 100% de retrocompatibilidade com o banco existente.
