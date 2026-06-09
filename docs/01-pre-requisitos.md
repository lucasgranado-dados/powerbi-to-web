# 01 — Pré-requisitos

## Ferramentas

- **Node.js** ≥ 20 (recomendado 20 LTS ou 22).
- **npm** ≥ 10.
- **Git**.
- **Power BI Desktop** (Windows) — para abrir o `.pbix` e exportar PBIP.
- **IDE com IA**: VS Code, Cursor, Windsurf ou Claude Code.
- **Vercel CLI** (deploy): `npm i -g vercel`.
- **Python** ≥ 3.10 (validação de paridade) — opcional até a etapa de validação.

## Acessos e permissões

- Acesso ao **dashboard Power BI original**.
- Permissão para **exportar PBIP** (habilitar TMDL e PBIR).
- Acesso ao **Snowflake**:
  - **role**, **warehouse**, **database** e **schema** corretos;
  - **permissão de leitura na camada ouro** (GOLD);
  - credenciais de **key-pair** (chave privada) para autenticação JWT.

## Verificação rápida

```bash
node --version
npm --version
git --version
python --version   # ou python3
```

## Configuração do projeto

```bash
git clone <repo-template>
cd powerbi-to-web-boilerplate
npm install
cp .env.example .env.local   # preencha as variáveis SNOWFLAKE_* (sem versionar)
```

> Nunca versione `.env.local` nem cole segredos em arquivos `NEXT_PUBLIC_*`.

## Próximo

Leia `02-exportar-pbip.md`.
