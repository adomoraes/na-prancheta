# Adendo: Cadastro de Patrimônio com Condicional para Uniformes e Refatoração de UX

> Identificador: `008-patrimonio-uniformes-ux`  
> Data: `2026-09-21`  
> Cenário: `legado`  
> Origem: `_reversa_forward/008-patrimonio-uniformes-ux/`  

---

## 1. Vigência

Vigente desde 2026-09-21.

---

## 2. Resumo da entrega

Implementação do módulo de **Cadastro de Patrimônio com Condicional para Uniformes e Refatoração de UX**, permitindo a gestão especializada de fardamento esportivo (camisas, calções, meiões) com controle de tamanhos, cores, números e observações técnicas de marca/fornecedor, além de uma experiência de usuário guiada no cadastro e visualização categorizada no inventário.

A entrega contemplou:
1. **Esquema de Dados:** Migration incremental adicionando as colunas `tipo_uniforme`, `tamanho`, `cor`, `numero` e `observacoes` à tabela `itens_almoxarifado`.
2. **Modelagem Eloquent:** Atualização do Model `ItemAlmoxarifado` com os novos campos no `$fillable`.
3. **Controladores e Validações:** No `AdminController@storePatrimonio` e `@updatePatrimonio`, validação condicional obrigatória de `tipo_uniforme` (`camisa`, `meiao`, `calcao`) quando a categoria for `uniforme`, preservando a retrocompatibilidade para outros itens.
4. **Camada de Serviços Frontend:** Atualização de `src/types.ts` (`AdminPatrimonioDTO`) e `src/services/api.ts` com os novos parâmetros.
5. **Painel Administrativo & Refatoração de UX:**
   - Modal com seleção visual de categorias por botões estilizados.
   - Revelação condicional reativa com chips de tipo de peça (`Camisa`, `Meião`, `Calção`), campos dedicados para Qtd, Tamanho (com chips rápidos), Cor, Número e Observação/Marca (ex: Adidas).
   - Botão para auto-sugestão de nomenclatura de fardamento.
   - Listagem no inventário com barra de filtros rápidos (`Todos`, `Uniformes`, `Bolas`, `Coletes`, `Apoio`) e cards enriquecidos com badges de alta visibilidade.
6. **Qualidade e Testes:** Nova suíte de testes de integração automatizados `PatrimonioUniformeTest.php` com 6 testes específicos, elevando a suíte total para 57 testes e 264 asserções com 100% de aprovação.

Todas as **12 ações atômicas** planejadas em `_reversa_forward/008-patrimonio-uniformes-ux/actions.md` foram concluídas com êxito.

---

## 3. Impacto por artefato da extração

| Artefato | Seção | Tipo de impacto | Delta |
|---|---|---|---|
| `_reversa_sdd/architecture.md` | `#2-arquitetura-do-backend-laravel-11` | `modificação` | Tabela `itens_almoxarifado` estendida com campos de vestuário e validação condicional no `AdminController`. |
| `_reversa_sdd/data-dictionary.md` | `#2-entidades-e-tabelas` | `modificação` | Entidade `itens_almoxarifado` documentada com as 5 novas colunas de fardamento esportivo. |
| `_reversa_sdd/domain.md` | `#1-glossário-do-domínio` | `regra-nova` | Entidade "Patrimônio / Uniformes" formalizada com atributos de grade (tamanho, cor, número, fornecedor) e tipagem de vestuário. |
| `_reversa_sdd/architecture.md` | `#21-padrão-single-page-application` | `melhoria-ux` | Modal de patrimônio com condicional reativa de uniformes e inventário com filtro por categorias e badges informativos. |

---

## 4. Regras sob vigilância

- **W001:** Itens não pertencentes à categoria uniforme continuam sendo salvos sem a obrigatoriedade de `tipo_uniforme`.
- **W002:** A contagem de camisas recolhidas na conferência de malas pós-jogo (`conferencias_malas`) permanece perfeitamente sincronizada com o inventário.
- **W003:** Rotas de mutação de patrimônio sob `/api/admin/patrimonio` continuam estritamente protegidas por `role:root`.

---

## 5. Fontes

- `_reversa_forward/008-patrimonio-uniformes-ux/requirements.md`
- `_reversa_forward/008-patrimonio-uniformes-ux/actions.md`
- `_reversa_forward/008-patrimonio-uniformes-ux/investigation.md`
- `_reversa_forward/008-patrimonio-uniformes-ux/legacy-impact.md`
- `_reversa_forward/008-patrimonio-uniformes-ux/regression-watch.md`
