# Data Delta: Painel Administrativo ROOT e Gestão de CRUDs

> Identificador: `004-painel-adm-root`  
> Data: `2026-09-21`  
> Impacto de Banco de Dados: Zero Migrations (Aproveitamento das tabelas e campos existentes)  

---

## 1. Resumo Executivo do Modelo de Dados

O schema atual do banco de dados já possui as tabelas necessárias para os CRUDs administrativos. Não há criação de novas tabelas ou alteração em colunas pré-existentes. A implementação utiliza a coluna `role` da tabela `users` aceitando `'root'` e a coluna `ativo` das tabelas `atletas` e `partidas` para suporte a soft delete / desativação lógica.

---

## 2. Entidades Gerenciadas pelos CRUDs

| Tabela | Campos Gerenciados pelo ROOT | Política de Exclusão |
|--------|------------------------------|----------------------|
| `users` | `name`, `phone`, `email`, `password`, `role` | Desativação ou alteração de role para bloqueio |
| `atletas` | `nome`, `apelido`, `numero_camisa`, `posicao_principal`, `posicao_secundaria`, `tipo_vinculo`, `ativo` | Lógica (`ativo = false`) |
| `partidas` | `adversario`, `data_partida`, `horario_inicio`, `horario_t50`, `horario_t35`, `horario_t25`, `local_nome`, `local_link_maps`, `valor_taxa_jogo`, `limite_confirmados`, `status` | Lógica (`status = 'cancelada' | 'encerrada'`) |
| `caixa_movimentacoes` | `tipo`, `valor`, `descricao`, `comprovante` | Inserção de lançamentos manuais de ajuste |
| `patrimonio` / materiais | `item`, `quantidade_total`, `estado_conservacao` | Edição de quantidades |

---

## 3. Seed / Usuário ROOT Padrão

Para facilitar testes e demonstrações em ambiente de desenvolvimento, o sistema disponibiliza o usuário:
- **Nome:** Administrador ROOT
- **Email:** `root@naprancheta.com.br`
- **Telefone:** `11999990000`
- **Role:** `root`
- **Senha padrão dev:** `na-prancheta-2026`
