# 00 — Visão geral

## O que é

Um **boilerplate/framework interno** para migrar dashboards **Power BI** para
páginas **web em Next.js**, consumindo dados já tratados no **Snowflake (camada
ouro)**. Não é apenas um app: é um **kit de migração** com app + docs + scripts +
prompts de IA + componentes + camada Snowflake server-side + validação de paridade.

## Para quem

Analistas de BI e desenvolvedores que precisam recriar dashboards Power BI na web
de forma padronizada, rastreável e segura.

## Problema que resolve

Hoje cada migração é ad-hoc: sem padrão de arquitetura, sem rastreabilidade entre
medida do Power BI, fonte Snowflake e componente web, e com risco de expor
credenciais. Este kit impõe um fluxo repetível e auditável.

## Workflow completo

```text
Dashboard Power BI
→ exportação para PBIP
→ checagem de TMDL/PBIR
→ diagnóstico técnico com IA
→ mapeamento Power BI → Snowflake camada ouro
→ definição de arquitetura Next.js
→ geração da página web
→ conexão server-side com Snowflake
→ validação de paridade contra Power BI
→ revisão humana
→ deploy na Vercel
→ publicação no DataHub
```

## Papéis

- **Power BI** — referência original do dashboard (layout, visuais, medidas).
- **PBIP** — formato de projeto exportável e legível do Power BI.
- **TMDL** — definição textual do modelo semântico (tabelas, medidas, DAX, relações).
- **PBIR** — definição granular do relatório (páginas, visuais, filtros).
  > TMDL e PBIR são a **fonte de verdade técnica** para a IA entender o original.
- **Snowflake (camada ouro)** — **fonte preferencial dos dados reais** da web.
- **IA** — analisa PBIP/TMDL/PBIR, mapeia para Snowflake e gera o código (com
  revisão), sem inventar regra de negócio.
- **Revisão humana** — valida segurança, dados, UI e paridade antes do deploy.
- **DataHub** — destino de publicação/descoberta do dashboard migrado.

## Próximo

Leia `01-pre-requisitos.md`.
