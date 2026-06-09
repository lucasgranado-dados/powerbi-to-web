---
name: snowflake-semanticview
description: >-
  Cria, altera e valida semantic views do Snowflake via Snowflake CLI (snow). Use
  ao construir ou depurar definições de semantic view / camada semântica
  (CREATE/ALTER SEMANTIC VIEW), validar o DDL contra o Snowflake pela CLI, ou
  orientar instalação e configuração de conexão do Snowflake CLI.
---

# Snowflake Semantic Views

Use esta skill quando a **camada ouro** do dashboard for (ou dever ser) exposta
como uma **semantic view**. No contexto deste boilerplate:

- A aplicação **lê** os dados apenas server-side (`src/server/snowflake`,
  `server-only`) — a semantic view é a **modelagem da fonte**, consumida pelas
  queries em `snowflake/queries/...` (ver skill **`snowflake-mapeamento`**).
- Consultar uma semantic view usa sintaxe própria (`SELECT ... FROM SEMANTIC_VIEW(...)`).
- **Não invente** dimensões/fatos/métricas/synonyms/comments sem evidência ou
  aprovação — alinhado às regras do repositório.

## Setup (uma vez)

- Verifique a CLI: `snow --help`. Instalação:
  https://docs.snowflake.com/en/developer-guide/snowflake-cli/installation/installation
- Configure a conexão: `snow connection add`
  https://docs.snowflake.com/en/developer-guide/snowflake-cli/connecting/configure-connections#add-a-connection
- Use essa conexão em todas as validações/execuções.

## Fluxo por semantic view

1. Confirme database, schema, role, warehouse e o nome final da view.
2. Confirme o modelo em **star schema** (fatos + dimensões conformadas).
3. Rascunhe o DDL pela sintaxe oficial:
   https://docs.snowflake.com/en/sql-reference/sql/create-semantic-view
4. Preencha synonyms e comments de cada dimensão, fato e métrica:
   - Leia primeiro os comments de tabela/view/coluna no Snowflake (fonte preferida):
     https://docs.snowflake.com/en/sql-reference/sql/comment
   - Se faltarem, **pergunte** se pode criá-los, se o usuário fornece o texto, ou
     se deve sugerir para aprovação. Não invente.
5. Explore relações/tipos com `SELECT DISTINCT ... LIMIT 1000` para enriquecer
   comments/synonyms.
6. Crie um nome temporário de validação (ex.: sufixo `__tmp_validate`), mesmo
   database/schema.
7. **Sempre valide o DDL no Snowflake via CLI antes de finalizar**:
   ```bash
   snow sql -q "<CREATE OR ALTER SEMANTIC VIEW ...>" --connection <connection_name>
   ```
   (Se a flag de conexão variar por versão, veja `snow sql --help`.)
8. Itere até a validação passar.
9. Aplique o DDL final (create/alter) com o nome real.
10. Rode uma consulta de amostra na view final:
    ```sql
    SELECT * FROM SEMANTIC_VIEW(
        my_semview_name
        DIMENSIONS customer.customer_market_segment
        METRICS orders.order_average_value
    )
    ORDER BY customer_market_segment;
    ```
    https://docs.snowflake.com/en/user-guide/views-semantic/querying#querying-a-semantic-view
11. Remova qualquer view temporária criada na validação.

## Synonyms e comments (obrigatórios)

```
WITH SYNONYMS [ = ] ( 'synonym' [ , ... ] )
COMMENT = 'comment_about_dim_fact_or_metric'
```
- Synonyms são informativos; não os use para referenciar dim/fato/métrica.
- Mantenha a definição final idêntica à temporária validada, exceto pelo nome.

## Referências

- Skill **`snowflake-mapeamento`** (como o repo consome a fonte), `docs/09-snowflake-camada-ouro.md`.
