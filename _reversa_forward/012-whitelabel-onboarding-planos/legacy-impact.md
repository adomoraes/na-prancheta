# Impacto no Código Legado: Feature 012 - Whitelabel, Planos e Pagamentos

> Identificador: `012-whitelabel-onboarding-planos`  
> Data: `2026-10-06`  

## 1. Escopo de Alterações no Legado

### Backend (Laravel 11)
- **Tabela `times`:** Adicionadas colunas não-destrutivas (`sigla`, `escudo_url`, `cor_primaria`, `cor_secundaria`, `modalidade`, `status`, `trial_ends_at`, `plano_id`).
- **Tabela `users`:** Adicionada coluna `time_id` com chave estrangeira para `times(id)`. Usuários pré-existentes foram associados ao time fundador padrão via migração.
- **Modelos `Time` e `User`:** Métodos auxiliares adicionados (`time()`, `isGestor()`, `diasRestantesTrial()`, `isSuspenso()`), preservando todos os comportamentos e relacionamentos prévios (`atletas`, `partidas`, etc.).
- **Seeder:** `PlanosSeeder` cria o catálogo de planos e garante que o clube legado fundador permaneça com plano ativo e funcionalidade plena.
- **AdminController:** Adicionados endpoints administrativos para listagem de clubes e suporte técnico por personificação (`indexTimes`, `impersonate`, `stopImpersonate`), sem afetar nenhum endpoint de CRUD legado de atletas, partidas, caixa ou scouts.

### Frontend (React 19)
- **`src/types.ts`:** Tipos estendidos com novas interfaces (`TenantBranding`, `PlanoAssinatura`, `OnboardingClubPayload`, etc.) e papel `'gestor'` adicionado a `NivelAcesso`.
- **`src/services/api.ts`:** Exportação dos helpers utilitários (`request`, `getHeaders`, `TOKEN_KEY`, `getApiBaseUrl`) para reutilização no `whitelabelService.ts`.
- **`src/components/Header.tsx`:** Atualizado com suporte a escudo dinâmico, cores da agremiação, badge de trial/suspensão e itens de menu de gestão whitelabel, mantendo comportamento padrão em caso de clube legado ou fallback.
- **`src/App.tsx`:** Hidratação do tenant ativo, injeção dinâmica de CSS variables no `:root`, renderização dos modais de onboarding, branding e planos, e barra fixa de suporte ROOT quando personificando agremiação.

## 2. Preservação de Integridade
- Não houve quebra de compatibilidade em nenhuma rota existente.
- Acesso anônimo às fichas de jogo e links compartilhados pelo WhatsApp continua 100% público.
- A suíte de 82 testes do backend passou com 100% de sucesso (425 asserções).
