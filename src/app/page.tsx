import { readdirSync } from "node:fs";
import path from "node:path";

import Link from "next/link";
import { ArrowRight, Database, FileSearch, LayoutDashboard } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Página inicial do kit. Lista dinamicamente os dashboards já migrados e resume
 * o fluxo. Pastas iniciadas com "_" (ex.: `_template`) são privadas do App
 * Router — servem de modelo para `npm run dashboard:init` e não viram rota.
 */
function listDashboards(): string[] {
  try {
    const dir = path.join(process.cwd(), "src/app/dashboards");
    return readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

export default function Home() {
  const dashboards = listDashboards();
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="space-y-3">
        <Badge variant="secondary">Power BI → Web</Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          {process.env.NEXT_PUBLIC_APP_NAME ?? "Power BI to Web Boilerplate"}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Kit interno para migrar dashboards Power BI para páginas web em
          Next.js, consumindo dados tratados no Snowflake (camada ouro). Use os
          scripts e prompts do repositório para acelerar cada migração.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Feature
          icon={FileSearch}
          title="1. Diagnóstico PBIP"
          text="Checagem de TMDL/PBIR e inventário do dashboard original."
        />
        <Feature
          icon={Database}
          title="2. Mapeamento Snowflake"
          text="Source-map e queries para a camada ouro, server-side."
        />
        <Feature
          icon={LayoutDashboard}
          title="3. Página web"
          text="Componentes reutilizáveis, contracts, adapters e validação."
        />
      </div>

      <h2 className="mt-12 text-xl font-semibold">Dashboards</h2>
      {dashboards.length === 0 ? (
        <Card className="mt-4">
          <CardContent className="space-y-2 p-6">
            <p className="font-medium">Nenhum dashboard migrado ainda.</p>
            <p className="text-sm text-muted-foreground">
              Crie o primeiro a partir do modelo{" "}
              <code className="rounded bg-muted px-1">_template</code>:
            </p>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
              npm run dashboard:init -- --slug vendas-por-hora
            </pre>
            <p className="text-xs text-muted-foreground">
              Depois rode os prompts em <code>prompts/</code> na ordem (ver{" "}
              <code>docs/04-fluxo-de-prompts.md</code>).
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {dashboards.map((slug) => (
            <Link key={slug} href={`/dashboards/${slug}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {slug}
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>
                    Dashboard migrado — clique para abrir.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Database;
  title: string;
  text: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <Icon className="h-5 w-5 text-primary" />
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
