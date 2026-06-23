// Parser leve de TMDL focado em MEDIDAS DAX.
//
// Não é um parser TMDL completo: extrai medidas (nome, tabela e expressão DAX
// multilinha) de forma baseada em indentação, suficiente para alimentar a
// camada de revisão de DAX. Use sempre o TMDL/PBIR como fonte de verdade.

const PROPERTY_RE =
  /^\s*(formatString|displayFolder|lineageTag|annotation|isHidden|dataType|formatStringDefinition|detailRowsDefinition|description|dataCategory|sortByColumn|relatedColumnDetails|changedProperty|summarizeBy|sourceColumn)\b/;

const TABLE_RE = /^(\s*)table\s+(?:'([^']+)'|"([^"]+)"|(\S+))\s*$/;
const MEASURE_RE =
  /^(\s*)measure\s+(?:'([^']+)'|"([^"]+)"|([^\s=]+))\s*=(.*)$/;

/** Largura da indentação (tabs e espaços contam como 1). */
function indentWidth(line) {
  const m = line.match(/^(\s*)/);
  return m ? m[1].length : 0;
}

/**
 * Extrai as medidas de um texto TMDL.
 * @param {string} tmdlText conteúdo do(s) arquivo(s) .tmdl
 * @param {string} [sourceFile] caminho relativo do arquivo (para rastreio)
 * @returns {{name:string, table:string, dax:string, sourceFile:string}[]}
 */
export function parseMeasures(tmdlText, sourceFile = "") {
  const lines = tmdlText.split(/\r?\n/);
  const measures = [];
  let currentTable = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const tableMatch = line.match(TABLE_RE);
    if (tableMatch) {
      currentTable = tableMatch[2] || tableMatch[3] || tableMatch[4] || "";
      continue;
    }

    const measureMatch = line.match(MEASURE_RE);
    if (!measureMatch) continue;

    const measureIndent = measureMatch[1].length;
    const name = (
      measureMatch[2] ||
      measureMatch[3] ||
      measureMatch[4] ||
      ""
    ).trim();
    const inlineRest = measureMatch[5].trim();

    let dax = "";

    if (inlineRest && inlineRest !== "```") {
      // Expressão inline na mesma linha do `measure ... =`.
      dax = inlineRest;
    } else if (inlineRest === "```") {
      // Bloco cercado por ``` ... ```
      const block = [];
      let j = i + 1;
      for (; j < lines.length; j++) {
        if (lines[j].trim() === "```") break;
        block.push(lines[j]);
      }
      i = j; // pula até a cerca de fechamento
      dax = dedent(block).join("\n").trim();
    } else {
      // Expressão multilinha por indentação (linhas mais indentadas que o measure).
      const block = [];
      let j = i + 1;
      for (; j < lines.length; j++) {
        const l = lines[j];
        if (l.trim() === "") {
          block.push(l);
          continue;
        }
        if (indentWidth(l) <= measureIndent) break; // saiu do bloco da medida
        if (PROPERTY_RE.test(l)) break; // começaram as propriedades da medida
        block.push(l);
      }
      i = j - 1;
      dax = dedent(trimBlankEdges(block)).join("\n").trim();
    }

    if (name) {
      measures.push({ name, table: currentTable, dax, sourceFile });
    }
  }

  return measures;
}

/** Remove a indentação comum de um bloco de linhas. */
function dedent(block) {
  const nonEmpty = block.filter((l) => l.trim() !== "");
  if (nonEmpty.length === 0) return block;
  const min = Math.min(...nonEmpty.map(indentWidth));
  return block.map((l) => (l.trim() === "" ? "" : l.slice(min)));
}

/** Remove linhas em branco do início/fim de um bloco. */
function trimBlankEdges(block) {
  const out = [...block];
  while (out.length && out[0].trim() === "") out.shift();
  while (out.length && out[out.length - 1].trim() === "") out.pop();
  return out;
}

/**
 * Detecta funções DAX usadas (identificadores seguidos de "(").
 * Retorna nomes em MAIÚSCULAS, sem duplicatas.
 */
export function detectFunctions(dax) {
  const found = new Set();
  for (const m of dax.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    found.add(m[1].toUpperCase());
  }
  return [...found];
}

/**
 * Detecta dependências de uma medida.
 * @param {string} dax expressão DAX
 * @param {Set<string>|string[]} [knownMeasures] nomes de medidas conhecidas
 * @returns {{measures:string[], tables:string[], columns:string[]}}
 */
export function detectDependencies(dax, knownMeasures = []) {
  const known = new Set(
    [...knownMeasures].map((m) => m.toLowerCase()),
  );

  const tables = new Set();
  const columns = new Set();
  // Referências qualificadas: Tabela[Coluna] ou 'Tabela'[Coluna]
  for (const m of dax.matchAll(/(?:'([^']+)'|([A-Za-z_][\w]*))\s*\[([^\]]+)\]/g)) {
    const table = (m[1] || m[2] || "").trim();
    if (table) tables.add(table);
    columns.add(m[3].trim());
  }

  // Referências não qualificadas: [Nome] — medida ou coluna no contexto de linha.
  const measures = new Set();
  for (const m of dax.matchAll(/(^|[^\w'\]])\[([^\]]+)\]/g)) {
    const ref = m[2].trim();
    if (known.has(ref.toLowerCase())) measures.add(ref);
  }

  return {
    measures: [...measures],
    tables: [...tables],
    columns: [...columns],
  };
}
