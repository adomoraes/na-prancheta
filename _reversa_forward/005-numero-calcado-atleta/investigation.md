# Investigação Técnica: Número do Calçado na Ficha do Atleta

> Identificador: `005-numero-calcado-atleta`  
> Data: `2026-09-21`  
> Feature: Inclusão do campo número do calçado na ficha do atleta  

---

## 1. Contexto e Motivação

No futebol amador e semi-profissional, a gestão de kits e fardamentos é coordenada pelo almoxarifado/diretoria do clube. O sistema Na Prancheta já gerencia tamanhos de camisa e calção (`tamanho_camisa` e `tamanho_calcao`), porém a ausência do número de calçado (chuteiras, tênis society ou travas de campo) impedia que a agremiação organizasse compras coletivas, reservas de chuteiras reservas ou kits personalizados para o elenco.

A inclusão do número do calçado preenche essa lacuna com mínimo impacto arquitetural e alto benefício operacional.

---

## 2. Padrões de Numeração e Faixas Esportivas

No Brasil, o padrão de numeração de calçados esportivos adota a escala BR (equivalente aproximado a EUR - 2).

- Numerações infantojuvenis: 28 a 36.
- Numerações adultas masculinas e femininas usuais: 37 a 46.
- Numerações extremas (pés grandes / pivôs): 47 a 50.

**Definição da Faixa:**
A faixa estabelecida para validação é de **25 a 50** como números inteiros positivos. Isso cobre com folga qualquer atleta do futebol amador (inclusive categorias de base ou de grande porte), impedindo ao mesmo tempo erros crassos de digitação (como números de camisa digitados por engano no campo de calçado, ou anos de nascimento).

---

## 3. Impacto no Banco de Dados e Compatibilidade

### 3.1. Tipo de Coluna
A coluna `numero_calcado` será definida como `smallInteger('numero_calcado')->nullable()->after('tipo_vinculo')`.
- `smallInteger` em PostgreSQL/MySQL consome apenas 2 bytes por linha.
- Como o campo é opcional, atletas já existentes no banco continuam intactos com valor `NULL`.

### 3.2. Estratégia de Migração
- A migration usa o método `Schema::table('atletas', ...)` padrão do Laravel.
- Método `down` remove a coluna com `$table->dropColumn('numero_calcado')`, garantindo idempotência e capacidade de reversão imediata.

---

## 4. Impacto no Frontend e Experiência do Usuário (UX)

### 4.1. Painel Administrativo (`AdminDashboard.tsx`)
- Tabela de Atletas: inserção de cabeçalho "Calçado" ou indicação na coluna de detalhes.
- Modal de Criação/Edição: campo numérico com `placeholder="Ex: 41"`, `min="25"`, `max="50"`.

### 4.2. Self-Onboarding (`SelfOnboardingModal.tsx`)
- Na seção de uniformes esportivos, além dos seletores de tamanho de camisa e calção (P, M, G, GG), disponibiliza-se um campo seletor ou input numérico estilizado para o calçado, agilizando o auto-cadastro.

---

## 5. Conclusão da Investigação

A implementação é viável, de baixo risco, retrocompatível e segue os padrões estabelecidos no repositório. Não há necessidade de novas dependências ou bibliotecas externas.
