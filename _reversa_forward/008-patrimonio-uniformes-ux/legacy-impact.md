# Impacto no Sistema Legado: Gestão de Patrimônio e Uniformes

> Feature: `008-patrimonio-uniformes-ux`  
> Data: `2026-09-21`  
> Avaliação: Risco Baixo / 100% Retrocompatível

---

## 1. Superfície de Risco e Compatibilidade

### 1.1 Tabela `itens_almoxarifado`
- As 5 novas colunas (`tipo_uniforme`, `tamanho`, `cor`, `numero`, `observacoes`) são totalmente opcionais e anuláveis (`nullable`), garantindo que qualquer registro pré-existente ou migração anterior permaneça válida.
- Os processos de conferência de malas pós-jogo (`conferencias_malas`) e destravamento da resenha continuam operando de forma idêntica.

### 1.2 Model `ItemAlmoxarifado.php`
- O `$fillable` foi estendido com os 5 novos atributos.
- As relações com `Time` permanecem intactas.

### 1.3 Seeder e Dados Históricos
- O `LegacyInitialDataSeeder.php` agora inclui exemplos completos de fardamento esportivo, demonstrando camisas titulares, calções, meiões e itens gerais como bolas e cones.

## 2. Garantias Verificadas

- Testes de paridade funcional de almoxarifado (`PT005: almoxarifado conferencia e trava da resenha`) continuam passando 100%.
- Total de 57 testes passando (264 asserções).
