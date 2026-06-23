// Utilitários de sistema de arquivos compartilhados pelos scripts de automação.

import fs from "node:fs";
import path from "node:path";

/**
 * Lista recursiva de arquivos (com limite defensivo de profundidade).
 * @param {string} dir diretório raiz
 * @param {string[]} acc acumulador (uso interno)
 * @param {number} depth profundidade atual (uso interno)
 * @returns {string[]} caminhos absolutos dos arquivos encontrados
 */
export function walk(dir, acc = [], depth = 0) {
  if (depth > 12 || !fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc, depth + 1);
    else acc.push(full);
  }
  return acc;
}

/** Lê um arquivo como texto; retorna "" se falhar. */
export function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

/** Garante que o diretório do arquivo exista e grava o conteúdo. */
export function writeFileEnsuring(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}
