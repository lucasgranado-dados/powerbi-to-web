#!/usr/bin/env python3
"""Gera o manual em PDF (docs/manual-powerbi-para-web.pdf) com reportlab.

Pure-Python (sem dependencias de sistema). Uso:
    python3 -m venv .venv && source .venv/bin/activate
    pip install reportlab
    python docs/manual/build-pdf.py
"""
from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Frame, NextPageTemplate, PageBreak, PageTemplate,
    Paragraph, Preformatted, Spacer, Table, TableStyle,
)

OUT = Path(__file__).resolve().parents[1] / "manual-powerbi-para-web.pdf"

# ---- paleta -----------------------------------------------------------------
BRAND = HexColor("#4f46e5")
BRAND_D = HexColor("#3730a3")
BG_SOFT = HexColor("#eef2ff")
INK = HexColor("#1f2937")
MUTED = HexColor("#6b7280")
LINE = HexColor("#e5e7eb")
WARN = HexColor("#b45309")
WARN_BG = HexColor("#fffbeb")
DANGER = HexColor("#dc2626")
DANGER_BG = HexColor("#fef2f2")
CODE_BG = HexColor("#0f172a")
CODE_FG = HexColor("#e2e8f0")
ROW_ALT = HexColor("#fafafe")

PAGE_W, PAGE_H = A4
ML = MR = 44
MT = 44
MB = 40
CONTENT_W = PAGE_W - ML - MR

# ---- estilos ----------------------------------------------------------------
ss = getSampleStyleSheet()
body = ParagraphStyle("body", parent=ss["BodyText"], fontName="Helvetica",
                      fontSize=10, leading=14.5, textColor=INK, spaceAfter=4)
lead = ParagraphStyle("lead", parent=body, fontSize=11, leading=16)
muted = ParagraphStyle("muted", parent=body, fontSize=9, textColor=MUTED)
h2 = ParagraphStyle("h2", parent=body, fontName="Helvetica-Bold", fontSize=16,
                    textColor=BRAND_D, spaceBefore=4, spaceAfter=8, leading=19)
h3 = ParagraphStyle("h3", parent=body, fontName="Helvetica-Bold", fontSize=11.5,
                    textColor=INK, spaceBefore=6, spaceAfter=2, leading=14)
li = ParagraphStyle("li", parent=body, leftIndent=12, bulletIndent=2, spaceAfter=2)
code_style = ParagraphStyle("code", fontName="Courier", fontSize=8.6,
                            leading=12.6, textColor=CODE_FG)
th = ParagraphStyle("th", parent=body, fontName="Helvetica-Bold", fontSize=9.5,
                    textColor=white)
td = ParagraphStyle("td", parent=body, fontSize=9.3, leading=12.5, spaceAfter=0)
callout_st = ParagraphStyle("callout", parent=body, fontSize=9.4, leading=13)


def code(text):
    inner = Preformatted(text, code_style)
    t = Table([[inner]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
    ]))
    return t


def callout(text, accent, bg):
    bar = Table([[""]], colWidths=[4], rowHeights=[None])
    bar.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), accent)]))
    p = Paragraph(text, callout_st)
    t = Table([[bar, p]], colWidths=[4, CONTENT_W - 4])
    t.setStyle(TableStyle([
        ("BACKGROUND", (1, 0), (1, 0), bg),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (1, 0), (1, 0), 10),
        ("RIGHTPADDING", (1, 0), (1, 0), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING", (0, 0), (0, 0), 0),
        ("RIGHTPADDING", (0, 0), (0, 0), 0),
    ]))
    return t


def note(text):
    return callout(text, BRAND, BG_SOFT)


def warn(text):
    return callout(text, WARN, WARN_BG)


def danger(text):
    return callout(text, DANGER, DANGER_BG)


def step(n, title, body_flowables):
    num = Table([[Paragraph(str(n), ParagraphStyle(
        "num", fontName="Helvetica-Bold", fontSize=14, textColor=white,
        alignment=1, leading=16))]], colWidths=[26], rowHeights=[26])
    num.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BRAND),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROUNDEDCORNERS", [13, 13, 13, 13]),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    right = [Paragraph(title, h3)] + body_flowables
    t = Table([[num, right]], colWidths=[34, CONTENT_W - 34])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (0, 0), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (1, 0), (1, 0), 0),
    ]))
    return t


def data_table(header, rows, col_w):
    data = [[Paragraph(c, th) for c in header]]
    for r in rows:
        data.append([Paragraph(c, td) for c in r])
    t = Table(data, colWidths=col_w, repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_D),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            style.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    t.setStyle(TableStyle(style))
    return t


def draw_cover(canv, doc):
    canv.saveState()
    canv.setFillColor(BRAND)
    canv.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canv.setFillColor(BRAND_D)
    canv.rect(0, 0, PAGE_W, 150, fill=1, stroke=0)
    x = 48
    canv.setFillColor(HexColor("#c7d2fe"))
    canv.setFont("Helvetica-Bold", 11)
    canv.drawString(x, PAGE_H - 250, "M A N U A L   D O   A M B I E N T E")
    canv.setFillColor(white)
    canv.setFont("Helvetica-Bold", 38)
    canv.drawString(x, PAGE_H - 300, "Power BI  ->  Web")
    canv.setFont("Helvetica", 13.5)
    canv.setFillColor(HexColor("#e0e7ff"))
    for i, line in enumerate([
        "Guia simplificado para migrar um dashboard Power BI até",
        "uma aplicação web em Next.js, com dados do Snowflake (camada ouro).",
    ]):
        canv.drawString(x, PAGE_H - 330 - i * 20, line)
    canv.setFont("Courier", 10)
    canv.setFillColor(white)
    canv.drawString(x, 120, "git clone -> init -> diagnostico -> mapear -> gerar -> validar -> deploy")
    canv.setFont("Helvetica", 10)
    canv.setFillColor(HexColor("#c7d2fe"))
    canv.drawString(x, 92, "Boilerplate powerbi-to-web   |   Versão 1.0   |   Uso interno")
    canv.restoreState()


def draw_body(canv, doc):
    canv.saveState()
    canv.setStrokeColor(LINE)
    canv.setLineWidth(0.5)
    canv.line(ML, MB - 8, PAGE_W - MR, MB - 8)
    canv.setFont("Helvetica", 8)
    canv.setFillColor(MUTED)
    canv.drawString(ML, MB - 20, "Manual Power BI -> Web")
    canv.drawRightString(PAGE_W - MR, MB - 20, str(canv.getPageNumber()))
    canv.restoreState()


def build():
    doc = BaseDocTemplate(
        str(OUT), pagesize=A4,
        leftMargin=ML, rightMargin=MR, topMargin=MT, bottomMargin=MB,
        title="Manual Power BI para Web", author="powerbi-to-web",
    )
    frame = Frame(ML, MB, CONTENT_W, PAGE_H - MT - MB, id="body",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[frame], onPage=draw_cover),
        PageTemplate(id="body", frames=[frame], onPage=draw_body),
    ])

    S = [NextPageTemplate("body"), PageBreak()]

    # 1. Visao geral
    S += [Paragraph("1. O que é este ambiente", h2)]
    S += [Paragraph(
        "Um <b>kit de migração</b>: além do app Next.js, traz scripts de automação, "
        "prompts/skills de IA, componentes prontos, camada segura para o Snowflake e "
        "validação de paridade. O objetivo é recriar dashboards do Power BI na web de "
        "forma <b>padronizada, rastreável e segura</b>.", lead)]
    S += [Paragraph("O caminho, do início ao fim", h3)]
    S += [data_table(
        ["Etapa", "O que acontece"],
        [["1. Exportar PBIP", "O .pbix vira projeto legível (TMDL + PBIR)."],
         ["2. Checar TMDL/PBIR", "Confirmar que os arquivos estão completos."],
         ["3. Diagnóstico (IA)", "Mapear páginas, visuais, medidas, filtros e riscos."],
         ["4. Mapear Snowflake", "Ligar medidas a tabelas/views da camada ouro."],
         ["5. Gerar a página", "Recriar a tela em Next.js com componentes prontos."],
         ["6. Validar paridade", "Comparar números web x Power BI."],
         ["7. Deploy + DataHub", "Publicar na Vercel e catalogar."]],
        [150, CONTENT_W - 150])]
    S += [Spacer(1, 6)]
    S += [data_table(
        ["Conceito", "O que significa"],
        [["Fonte de verdade", "TMDL/PBIR explicam o dashboard original. A IA usa isso "
          "para entender - nunca para adivinhar."],
         ["Dados reais", "Snowflake (camada ouro), conectado SÓ no servidor. Mocks são "
          "apenas fallback de desenvolvimento."]],
        [110, CONTENT_W - 110])]
    S += [Spacer(1, 6)]
    S += [note("<b>Regra de ouro:</b> a IA acelera o trabalho, mas <b>não inventa</b> "
               "regra de negócio nem nome de tabela/coluna/medida. Sem evidência, "
               "marca-se <font face='Courier'>CHANGE_ME</font> e registra-se a pendência.")]

    # 2/3 Pre-requisitos + quickstart
    S += [PageBreak(), Paragraph("2. Antes de começar", h2)]
    S += [Paragraph("Você precisa de", h3)]
    S += [data_table(
        ["Ferramenta", "Para quê"],
        [["Node.js >= 20 e npm", "Rodar a aplicação e os scripts"],
         ["Git", "Versionar a migração"],
         ["Power BI Desktop", "Abrir o .pbix e exportar o PBIP"],
         ["IDE com IA (VS Code / Cursor / Claude Code)", "Rodar as skills e prompts"],
         ["Acesso ao Snowflake (role/warehouse/schema + leitura na camada ouro)", "Dados reais"],
         ["Vercel CLI (npm i -g vercel)", "Deploy (opcional até o fim)"],
         ["Python >= 3.10", "Validação de paridade (opcional)"]],
        [240, CONTENT_W - 240])]
    S += [Spacer(1, 10), Paragraph("3. Quickstart", h2)]
    S += [code("# 1) Clonar e instalar\n"
               "git clone <repo-template>\n"
               "cd powerbi-to-web-boilerplate\n"
               "npm install\n\n"
               "# 2) Conferir o ambiente (diz, em portugues, o que falta)\n"
               "npm run doctor\n\n"
               "# 3) Configurar credenciais do Snowflake (nao versionar)\n"
               "cp .env.example .env.local   # preencha as variaveis SNOWFLAKE_*\n\n"
               "# 4) Rodar localmente\n"
               "npm run dev                  # http://localhost:3000")]
    S += [Spacer(1, 4), Paragraph(
        "Sem o Snowflake configurado, o dashboard de exemplo usa dados <i>mock</i> - "
        "útil para ver a UI antes de conectar.", muted)]
    S += [Spacer(1, 2)]
    S += [note("<b>Pouca experiência com dev?</b> Use <font face='Courier'>npm run "
               "doctor</font> (mostra o que falta) e <font face='Courier'>npm run "
               "migrate</font> (wizard que cria a estrutura e indica o proximo passo).")]

    # 4. Passo a passo 1
    S += [PageBreak(), Paragraph("4. Passo a passo da migração", h2)]
    S += [Paragraph("Substitua <font face='Courier'>&lt;slug&gt;</font> pelo nome do "
                    "dashboard em minúsculas com hífens (ex.: vendas-por-hora).", muted)]
    S += [Spacer(1, 4)]
    S += [step(1, "Exportar o dashboard para PBIP", [Paragraph(
        "No Power BI Desktop, habilite PBIP, TMDL e PBIR (Preview features) e salve "
        "como .pbip. Devem surgir as pastas .Report e .SemanticModel.", body)])]
    S += [step(2, "Iniciar a estrutura do dashboard", [
        code("npm run dashboard:init -- --slug <slug>"),
        Paragraph("Cria pastas e arquivos base a partir do modelo "
                  "<font face='Courier'>_template</font>. Depois, copie o PBIP para "
                  "<font face='Courier'>powerbi-input/&lt;slug&gt;/</font>.", body)])]
    S += [step(3, "Checar TMDL/PBIR", [
        code("npm run pbip:check -- --slug <slug>\n"
             "npm run pbip:inventory -- --slug <slug>"),
        Paragraph("O <font face='Courier'>check</font> valida se o pacote está "
                  "completo. O <font face='Courier'>inventory</font> gera um resumo "
                  "em docs/dashboards/&lt;slug&gt;/inventario-pbip.md.", body),
        warn("<b>Apareceu model.bim ou report.json?</b> É formato legado. Reexporte "
             "com TMDL e PBIR habilitados.")])]
    S += [step(4, "Diagnóstico com IA", [Paragraph(
        "Na IDE, acione a skill <font face='Courier'>pbip-diagnostico</font> (ou cole "
        "prompts/01). A IA lê o TMDL/PBIR e preenche o diagnóstico: páginas, visuais, "
        "medidas, filtros, riscos e complexidade.", body)])]
    S += [step(5, "Configurar o Snowflake", [
        code("npm run snowflake:check   # confere variaveis (sem mostrar valores)\n"
             "npm run snowflake:test    # SELECT CURRENT_VERSION()"),
        Paragraph("As variáveis ficam em .env.local (local) e nas Environment "
                  "Variables da Vercel (deploy).", body)])]

    # 4. Passo a passo 2
    S += [PageBreak(), Paragraph("4. Passo a passo da migração (continuação)", h2)]
    S += [step(6, "Mapear a camada ouro do Snowflake", [
        Paragraph("Acione <font face='Courier'>snowflake-mapeamento</font> (ou "
                  "prompts/03). A IA liga cada medida/visual a uma tabela/view da "
                  "camada ouro e cria o source-map, as queries SQL, os adapters e o "
                  "rastreamento de métricas.", body),
        note("Sem evidência do nome real, usa-se "
             "<font face='Courier'>CHANGE_ME_*</font> e marca-se a pendência.")])]
    S += [step(7, "Gerar a página web", [
        Paragraph("Acione <font face='Courier'>gerar-dashboard-web</font> (ou "
                  "prompts/04 e 05). A IA recria a tela com os componentes prontos "
                  "(header, filtros, KPIs, gráfico Recharts, tabela) e os estados de "
                  "carregamento, erro e vazio.", body),
        code("npm run dev   # http://localhost:3000/dashboards/<slug>")])]
    S += [step(8, "Validar a paridade contra o Power BI", [
        code("npm run validation:init -- --slug <slug>\n"
             "python validation/compare-results.py \\\n"
             "  --expected validation/dashboards/<slug>/powerbi/expected-results/kpis.csv \\\n"
             "  --actual   validation/dashboards/<slug>/web/api-results/kpis.csv \\\n"
             "  --key METRIC_ID --value VALUE --tolerance 0.01"),
        Paragraph("Compara os números (diferença absoluta, %, status). A validação "
                  "final é de <b>negócio</b>: alguém da área assina.", body)])]
    S += [step(9, "Deploy na Vercel", [
        code("npm run lint && npm run typecheck && npm run test && npm run build\n"
             "vercel          # preview\n"
             "vercel --prod   # producao"),
        Paragraph("Configure as variáveis SNOWFLAKE_* no painel da Vercel.", body)])]
    S += [step(10, "Publicar no DataHub", [Paragraph(
        "Abra um PR usando o template do repositório e publique/embuta a URL do "
        "dashboard no DataHub conforme o processo da sua área.", body)])]

    # 5/6 skills + regras
    S += [PageBreak(), Paragraph("5. Skills de IA do ambiente", h2)]
    S += [Paragraph("As skills ficam em <font face='Courier'>.claude/skills/</font> e "
                    "<b>disparam sozinhas</b> quando o pedido casa com a descrição - ou "
                    "você as chama por <font face='Courier'>/&lt;nome&gt;</font>.", body)]
    S += [data_table(
        ["Skill", "Quando usar"],
        [["migrar-dashboard", "Porta de entrada - conduz o fluxo inteiro"],
         ["pbip-diagnostico", "Checar/inventariar o PBIP e gerar o diagnóstico"],
         ["snowflake-mapeamento", "Mapear medidas -> camada ouro, queries, adapters"],
         ["gerar-dashboard-web", "Recriar a página em Next.js"],
         ["validar-paridade", "Comparar números web x Power BI"],
         ["deploy-vercel", "Deploy + variáveis de ambiente"],
         ["recharts", "Padrões de gráfico do projeto"],
         ["snowflake-semanticview", "Criar/validar semantic views via snow CLI"]],
        [150, CONTENT_W - 150])]
    S += [Spacer(1, 10), Paragraph("6. Regras de ouro", h2)]
    S += [danger("<b>Segurança:</b> credenciais nunca vão para o navegador. Não use "
                 "<font face='Courier'>NEXT_PUBLIC_</font> para segredos. A conexão "
                 "Snowflake acontece só no servidor.")]
    S += [Spacer(1, 4)]
    S += [warn("<b>Sem invenção:</b> não crie regra de negócio nem nome de "
               "tabela/coluna sem evidência no TMDL/PBIR. Use CHANGE_ME e documente "
               "em validation-notes.md.")]
    S += [Spacer(1, 4)]
    S += [note("<b>Rastreabilidade:</b> toda métrica deve ser rastreável entre Power "
               "BI, Snowflake e componente web. Mocks só como fallback.")]

    # 7/8/9 checklist + problemas + comandos
    S += [PageBreak(), Paragraph("7. Checklist final", h2)]
    checks_l = ["PBIP copiado para powerbi-input/&lt;slug&gt;/",
                "TMDL e PBIR encontrados (pbip:check)",
                "Diagnóstico criado",
                "Source-map sem CHANGE_ME pendente",
                "Queries apontando para a camada ouro real",
                "Página criada (KPIs, gráfico, tabela, estados)"]
    checks_r = ["Sem segredos no frontend",
                "lint, typecheck, test, build ok",
                "Mocks identificados (se houver)",
                "Paridade validada (ou pendência documentada)",
                "Deploy preview criado",
                "PR aberto + publicado no DataHub"]
    left = [Paragraph(f"[ &nbsp;] {x}", li) for x in checks_l]
    right = [Paragraph(f"[ &nbsp;] {x}", li) for x in checks_r]
    ct = Table([[left, right]], colWidths=[CONTENT_W / 2, CONTENT_W / 2])
    ct.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                            ("LEFTPADDING", (0, 0), (-1, -1), 0)]))
    S += [ct]
    S += [Spacer(1, 8), Paragraph("8. Problemas comuns", h2)]
    S += [data_table(
        ["Sintoma", "O que fazer"],
        [["Dashboard mostra 'Dados: Mock'",
          "Snowflake não configurado. Rode snowflake:check e preencha .env.local."],
         ["pbip:check acusa TMDL ausente",
          "Reexporte o PBIP com TMDL habilitado no Power BI Desktop."],
         ["snowflake:test falha",
          "Verifique role/warehouse/schema e a chave privada (PEM)."],
         ["Página não aparece em /dashboards/_template",
          "Pastas com '_' são privadas (modelo). Crie um slug real com dashboard:init."],
         ["Números não batem com o Power BI",
          "Confira filtros e período iguais; ajuste a query/adapter; registre tolerância."]],
        [175, CONTENT_W - 175])]
    S += [Spacer(1, 8), Paragraph("9. Referência rápida de comandos", h2)]
    S += [code("npm run doctor                            # checa o ambiente\n"
               "npm run migrate                          # wizard guiado (recomendado)\n"
               "npm run dashboard:init -- --slug <slug>   # cria a estrutura\n"
               "npm run pbip:check -- --slug <slug>       # valida o PBIP\n"
               "npm run pbip:inventory -- --slug <slug>   # inventario\n"
               "npm run validation:init -- --slug <slug>  # pastas de validacao\n"
               "npm run snowflake:check | snowflake:test  # conexao\n"
               "npm run dev | lint | typecheck | test | build\n"
               "vercel | vercel --prod                    # deploy")]
    S += [Spacer(1, 8), Paragraph(
        "Documentação completa em docs/00...09  |  Prompts em prompts/  |  "
        "Regras para IA em AGENTS.md / CLAUDE.md", muted)]

    doc.build(S)
    print(f"OK PDF gerado: {OUT}")


if __name__ == "__main__":
    build()
