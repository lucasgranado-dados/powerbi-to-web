#!/usr/bin/env python3
"""Compara dois CSVs (Power BI vs camada web/Snowflake) e reporta a paridade.

Uso típico:

    python validation/compare-results.py \
        --expected validation/dashboards/<slug>/powerbi/expected-results/kpis.csv \
        --actual   validation/dashboards/<slug>/web/api-results/kpis.csv \
        --key METRIC_ID --value VALUE --tolerance 0.01

- `--expected`: CSV exportado do Power BI (valores de referência).
- `--actual`:   CSV gerado pela camada web/Snowflake.
- `--key`:      coluna(s) de junção (pode repetir: --key A --key B).
- `--value`:    coluna numérica comparada.
- `--tolerance`: tolerância relativa (0.01 = 1%). Use --abs-tolerance para absoluta.

Calcula diferença absoluta, diferença percentual e status APROVADO/REPROVADO por
linha, além de um resumo. Não integra automaticamente com o Power BI — você
exporta os CSVs e roda este script.

Dependência: pandas (veja validation/requirements.txt). O `--help` funciona sem
pandas instalado.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Compara dois CSVs e valida a paridade de métricas.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--expected", required=True, help="CSV de referência (Power BI).")
    parser.add_argument("--actual", required=True, help="CSV gerado pela web/Snowflake.")
    parser.add_argument(
        "--key",
        action="append",
        required=True,
        help="Coluna de junção (repita para chave composta).",
    )
    parser.add_argument("--value", required=True, help="Coluna numérica a comparar.")
    parser.add_argument(
        "--tolerance",
        type=float,
        default=0.01,
        help="Tolerância RELATIVA (0.01 = 1%%).",
    )
    parser.add_argument(
        "--abs-tolerance",
        type=float,
        default=None,
        help="Tolerância ABSOLUTA (sobrepõe a relativa quando informada).",
    )
    parser.add_argument(
        "--out",
        default=None,
        help="Caminho opcional para salvar o CSV de diffs.",
    )
    return parser


def main(argv: list[str]) -> int:
    args = build_parser().parse_args(argv)

    try:
        import pandas as pd
    except ImportError:
        print(
            "ERRO: pandas não está instalado. Rode:\n"
            "  python -m venv .venv && source .venv/bin/activate\n"
            "  pip install -r validation/requirements.txt",
            file=sys.stderr,
        )
        return 2

    expected_path = Path(args.expected)
    actual_path = Path(args.actual)
    for label, p in (("--expected", expected_path), ("--actual", actual_path)):
        if not p.exists():
            print(f"ERRO: arquivo {label} não encontrado: {p}", file=sys.stderr)
            return 2

    expected = pd.read_csv(expected_path)
    actual = pd.read_csv(actual_path)

    keys = args.key
    value = args.value

    for df_name, df in (("expected", expected), ("actual", actual)):
        missing = [c for c in keys + [value] if c not in df.columns]
        if missing:
            print(
                f"ERRO: colunas ausentes em {df_name}: {missing}. "
                f"Colunas disponíveis: {list(df.columns)}",
                file=sys.stderr,
            )
            return 2

    merged = expected.merge(
        actual,
        on=keys,
        how="outer",
        suffixes=("_expected", "_actual"),
        indicator=True,
    )

    exp_col = f"{value}_expected"
    act_col = f"{value}_actual"
    merged["abs_diff"] = (merged[act_col] - merged[exp_col]).abs()
    denom = merged[exp_col].abs().replace(0, pd.NA)
    merged["pct_diff"] = merged["abs_diff"] / denom

    if args.abs_tolerance is not None:
        within = merged["abs_diff"] <= args.abs_tolerance
    else:
        # Aprovado quando dentro da tolerância relativa OU diferença absoluta nula.
        within = (merged["pct_diff"].fillna(0) <= args.tolerance) | (
            merged["abs_diff"].fillna(0) == 0
        )

    matched = merged["_merge"] == "both"
    merged["status"] = "REPROVADO"
    merged.loc[matched & within, "status"] = "APROVADO"
    merged.loc[~matched, "status"] = "FALTANTE"

    total = len(merged)
    approved = int((merged["status"] == "APROVADO").sum())
    reproved = int((merged["status"] == "REPROVADO").sum())
    missing_rows = int((merged["status"] == "FALTANTE").sum())

    report_cols = keys + [exp_col, act_col, "abs_diff", "pct_diff", "status"]
    print(merged[report_cols].to_string(index=False))
    print("\n" + "=" * 48)
    print(f"Total de linhas:   {total}")
    print(f"✅ Aprovadas:      {approved}")
    print(f"❌ Reprovadas:     {reproved}")
    print(f"➖ Faltantes:      {missing_rows}")
    print(
        "Tolerância: "
        + (
            f"absoluta={args.abs_tolerance}"
            if args.abs_tolerance is not None
            else f"relativa={args.tolerance}"
        )
    )

    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        merged[report_cols].to_csv(out_path, index=False)
        print(f"Diffs salvos em: {out_path}")

    return 0 if (reproved == 0 and missing_rows == 0) else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
