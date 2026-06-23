// Classificação de complexidade de medidas DAX.
//
// Função PURA (sem I/O) para ser testável via Vitest. Decide o nível de
// complexidade e o motivo, priorizando SEGURANÇA: na dúvida, sobe o nível.
//
// Níveis: simple < moderate < complex < critical.

export const SIMPLE_FUNCTIONS = new Set([
  "SUM",
  "COUNT",
  "COUNTA",
  "COUNTROWS",
  "DISTINCTCOUNT",
  "AVERAGE",
  "MIN",
  "MAX",
]);

export const MODERATE_FUNCTIONS = new Set([
  "DIVIDE",
  "IF",
  "IFERROR",
  "SWITCH",
  "COALESCE",
  "BLANK",
]);

export const COMPLEX_FUNCTIONS = new Set([
  "CALCULATE",
  "CALCULATETABLE",
  "FILTER",
  "ALL",
  "ALLSELECTED",
  "ALLEXCEPT",
  "REMOVEFILTERS",
  "SELECTEDVALUE",
  "VALUES",
  "DISTINCT",
  "HASONEVALUE",
  "KEEPFILTERS",
  "SUMX",
  "AVERAGEX",
  "COUNTX",
  "MINX",
  "MAXX",
  "RANKX",
  "EARLIER",
]);

export const CRITICAL_FUNCTIONS = new Set([
  "USERELATIONSHIP",
  "TREATAS",
  "ISINSCOPE",
  "CROSSFILTER",
  "PATH",
  "PATHITEM",
  "USERPRINCIPALNAME",
  "USERNAME",
]);

// Inteligência de tempo (qualquer uma torna a medida crítica).
export const TIME_INTELLIGENCE_FUNCTIONS = new Set([
  "TOTALYTD",
  "TOTALMTD",
  "TOTALQTD",
  "DATESYTD",
  "DATESMTD",
  "DATESQTD",
  "SAMEPERIODLASTYEAR",
  "DATEADD",
  "DATESINPERIOD",
  "DATESBETWEEN",
  "PARALLELPERIOD",
  "PREVIOUSMONTH",
  "PREVIOUSYEAR",
  "PREVIOUSDAY",
  "PREVIOUSQUARTER",
  "NEXTMONTH",
  "NEXTYEAR",
  "NEXTDAY",
  "NEXTQUARTER",
  "FIRSTDATE",
  "LASTDATE",
  "STARTOFYEAR",
  "STARTOFMONTH",
  "STARTOFQUARTER",
  "ENDOFYEAR",
  "ENDOFMONTH",
  "ENDOFQUARTER",
  "OPENINGBALANCEMONTH",
  "OPENINGBALANCEYEAR",
  "OPENINGBALANCEQUARTER",
  "CLOSINGBALANCEMONTH",
  "CLOSINGBALANCEYEAR",
  "CLOSINGBALANCEQUARTER",
]);

const LEVEL_RANK = { simple: 0, moderate: 1, complex: 2, critical: 3 };

/**
 * Classifica uma medida.
 * @param {{name?:string, dax?:string, usedFunctions?:string[]}} measure
 * @returns {{complexity:"simple"|"moderate"|"complex"|"critical", riskReasons:string[], requiresManualReview:boolean}}
 */
export function classify(measure) {
  const dax = measure.dax || "";
  const functions = (
    measure.usedFunctions && measure.usedFunctions.length
      ? measure.usedFunctions
      : detectFunctionsFallback(dax)
  ).map((f) => f.toUpperCase());

  const fnSet = new Set(functions);
  let level = "simple";
  const reasons = [];

  const bump = (target, reason) => {
    if (LEVEL_RANK[target] > LEVEL_RANK[level]) level = target;
    if (reason && !reasons.includes(reason)) reasons.push(reason);
  };

  for (const fn of functions) {
    if (MODERATE_FUNCTIONS.has(fn)) bump("moderate", `uses ${fn}`);
    if (COMPLEX_FUNCTIONS.has(fn)) bump("complex", `uses ${fn}`);
    if (CRITICAL_FUNCTIONS.has(fn)) bump("critical", `uses ${fn}`);
    if (TIME_INTELLIGENCE_FUNCTIONS.has(fn))
      bump("critical", `uses time intelligence (${fn})`);
  }

  // Heurísticas estruturais ----------------------------------------------------
  const calculateCount = countOccurrences(dax, /\bCALCULATE(?:TABLE)?\b/gi);
  if (calculateCount > 1)
    bump("critical", `multiple CALCULATE (${calculateCount})`);

  const varCount = countOccurrences(dax, /^\s*VAR\b/gim);
  if (varCount > 1) bump("critical", `multiple variables (${varCount} VAR)`);
  else if (varCount === 1) bump("complex", "uses VAR/RETURN");

  // Medida apenas com funções simples e aritmética básica.
  if (level === "simple") {
    const onlySimple = functions.every((f) => SIMPLE_FUNCTIONS.has(f));
    if (functions.length && onlySimple) {
      reasons.push("only simple aggregations");
    } else if (functions.length === 0) {
      reasons.push("arithmetic / constant only");
    }
  }

  return {
    complexity: level,
    riskReasons: reasons,
    requiresManualReview: level === "complex" || level === "critical",
  };
}

function countOccurrences(text, regex) {
  const m = text.match(regex);
  return m ? m.length : 0;
}

function detectFunctionsFallback(dax) {
  const out = new Set();
  for (const m of dax.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    out.add(m[1].toUpperCase());
  }
  return [...out];
}
