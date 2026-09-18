# ADR-001: Adoção de Arquitetura SPA Local-First com Persistência em LocalStorage

> Status: **Aprovado / Implementado** 🟢 CONFIRMADO  
> Data: 18/09/2026  
> Contexto: Fase de Prova de Conceito (PoC v1.0) do Na Prancheta

---

## Contexto

A gestão de equipes de futebol amador frequentemente ocorre em ambientes com conectividade de internet móvel instável (campos de várzea, complexos esportivos suburbanos e vestiários com paredes grossas). Além disso, a agilidade no teste inicial de valor e adoção pelo elenco exigia uma solução de baixíssima fricção que não demandasse setup complexo de servidores, banco de dados ou autenticação obrigatória prévia.

## Decisão

Implementar o Na Prancheta como uma Single Page Application (SPA) em **React 19**, **TypeScript** e **Vite**, com dados persistidos localmente no navegador via `window.localStorage` sob as chaves `naprancheta_atletas`, `naprancheta_evento`, `naprancheta_presencas`, `naprancheta_coletas` e `naprancheta_scout`, provendo uma base de dados mock completa via `src/data/initialData.ts` como semente e fallback.

## Alternativas Consideradas

1. **Arquitetura Tradicional com Backend API REST + PostgreSQL**:
   - *Prós*: Sincronização multi-dispositivo em tempo real entre todos os atletas e a comissão técnica.
   - *Contras*: Custo de infraestrutura de banco de dados e servidor, exigência de autenticação imediata e vulnerabilidade a falhas de conectividade durante a preleção no vestiário.
2. **Backend Serverless Firebase / Supabase**:
   - *Prós*: Suporte a sincronização em tempo real e offline persistence nativa.
   - *Contras*: Complexidade de regras de segurança e dependência de serviços externos no primeiro estágio de PoC.

## Consequências

- **Positivas**:
  - Aplicação 100% responsiva e instantânea no vestiário sem dependência de rede estável.
  - Custo zero de infraestrutura de backend no primeiro ciclo.
  - Carregamento e renderização ultrarrápidos com Vite e Tailwind CSS v4.
- **Negativas / Débitos Técnicos**:
  - Dados isolados no navegador do operador atual; não há compartilhamento em tempo real entre aparelhos distintos dos atletas sem uso de pontes manuais (ex: resumo via WhatsApp).
  - Risco de perda de dados caso o usuário limpe o cache/armazenamento do navegador.
