# Matriz de Permissões e Perfis de Acesso (RBAC) — Na Prancheta

> Gerado pelo **Reversa Detetive** em 18/09/2026  
> Nível de Documentação: **Detalhado**  
> Escopo: Perfis de usuário, papéis operacionais e matriz RBAC/ACL

---

## 1. Descrição dos Perfis de Acesso (`NivelAcesso`)

O sistema define 5 níveis de acesso que orientam a navegação e as ações operacionais no vestiário e no dia de jogo:

1. **Atleta (`atleta`)**: Perfil do jogador convencional. Focado em consultar dados da partida (adversário, horário, local e rota GPS), confirmar própria presença em 1 toque, conferir o cronômetro do vestiário e acompanhar o scout.
2. **Comissão Técnica (`tecnico`)**: Treinador e auxiliares. Responsáveis pela condução do cronograma do vestiário, escalação tática dos 11 titulares no esquema 4-3-3, gestão de reservas e aplicação da regra de corte por atraso (T-35).
3. **Tesoureiro do Dia (`financeiro`)**: Atleta ou membro designado para coordenar as finanças da rodada. Acompanha a meta de arbitragem (R$ 300,00), controla o checklist de pagantes/inadimplentes, divulga a chave PIX e emite o boletim financeiro formatado no WhatsApp.
4. **Almoxarifado (`almoxarifado`)**: Responsável pela custódia física do patrimônio da agremiação (malas de jogo, uniformes, bolsão de bolas e kits de treino). Exerce a governança do checklist de fechamento pós-jogo que condiciona a liberação da resenha social.
5. **Geral (`geral`)**: Perfil administrativo global da agremiação com visão irrestrita de todos os módulos.

---

## 2. Matriz de Permissões (RBAC)

| Módulo / Funcionalidade | Ação Específica | Atleta | Técnico | Tesoureiro | Almoxarifado | Geral | Confiança |
|---|---|:---:|:---:|:---:|:---:|:---:|---|
| **Protocolo de Vestiário** | Visualizar cronômetro regressivo T-X | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |
| **Protocolo de Vestiário** | Consultar regras disciplinares e atraso | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |
| **Ficha da Partida** | Visualizar data, horário, adversário e GPS | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |
| **Ficha da Partida** | Confirmar / alterar própria presença (1 toque) | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |
| **Ficha da Partida** | Visualizar quadro geral de presenças do elenco | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |
| **Prancheta Tática** | Visualizar formação tática 4-3-3 | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |
| **Prancheta Tática** | Alterar titulares e reservas no campo | 🚫 | ✅ | 🚫 | 🚫 | ✅ | 🟢 CONFIRMADO |
| **Prancheta Tática** | Liberar escalação oficial na preleção (T-35) | 🚫 | ✅ | 🚫 | 🚫 | ✅ | 🟢 CONFIRMADO |
| **Prancheta Tática** | Burlar trava de atraso de atleta após T-35 | 🚫 | 🚫 | 🚫 | 🚫 | 🚫 | 🟢 CONFIRMADO (Trava estrita) |
| **Tesoureiro / Vaquinha** | Visualizar métricas e total arrecadado | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |
| **Tesoureiro / Vaquinha** | Alternar status de pagamento (Pago / Cobrar) | 🚫 | 🚫 | ✅ | 🚫 | ✅ | 🟢 CONFIRMADO |
| **Tesoureiro / Vaquinha** | Copiar chave PIX do Tesoureiro | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |
| **Tesoureiro / Vaquinha** | Gerar e copiar resumo formatado para WhatsApp | 🚫 | 🚫 | ✅ | 🚫 | ✅ | 🟢 CONFIRMADO |
| **Scout Pós-Jogo** | Visualizar estatísticas do time e MVP | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |
| **Scout Pós-Jogo** | Incrementar/decrementar gols e assistências | 🚫 | ✅ | 🚫 | 🚫 | ✅ | 🟡 INFERIDO |
| **Scout Pós-Jogo** | Eleger o Craque do Jogo (MVP) | 🚫 | ✅ | 🚫 | 🚫 | ✅ | 🟡 INFERIDO |
| **Almoxarifado** | Consultar acervo de patrimônio e malas | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |
| **Almoxarifado** | Marcar checklist de recolhimento de uniformes | 🚫 | 🚫 | 🚫 | ✅ | ✅ | 🟢 CONFIRMADO |
| **Almoxarifado** | Liberar status da resenha social do elenco | 🚫 | 🚫 | 🚫 | ✅ | ✅ | 🟢 CONFIRMADO |
| **Elenco / Onboarding** | Cadastrar novo atleta (Self-Onboarding) | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 CONFIRMADO |

---

## 3. Segurança e Lacunas de Controle de Acesso (🔴 LACUNAS)

1. **Ausência de Autenticação Segura (Client-Side Trust)**:
   - Atualmente, a alternância de perfil no [`src/components/Header.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/Header.tsx) é puramente visual e acionada por botões na barra superior sem validação de credencial, senha, PIN ou token de sessão.
   - Qualquer usuário com acesso à aplicação pode comutar para o perfil de "Tesoureiro" ou "Comissão Técnica" e manipular dados.
2. **Recomendação de Evolução**:
   - Implementar autenticação via WhatsApp / Link Mágico com tokens temporários (ex: PIN de 4 dígitos para a Comissão Técnica e para o Tesoureiro do Dia).
