import { afterEach, describe, expect, it } from "vitest";

import {
  DEFAULT_ALLOWED_DOMAINS,
  getAllowedDomains,
  isEmailAllowed,
} from "@/server/auth/allowed-domains";

describe("allowed-domains", () => {
  const originalEnv = process.env.AUTH_ALLOWED_DOMAINS;

  afterEach(() => {
    if (originalEnv === undefined) delete process.env.AUTH_ALLOWED_DOMAINS;
    else process.env.AUTH_ALLOWED_DOMAINS = originalEnv;
  });

  it("usa os domínios corporativos por padrão", () => {
    delete process.env.AUTH_ALLOWED_DOMAINS;
    expect(getAllowedDomains()).toEqual([...DEFAULT_ALLOWED_DOMAINS]);
  });

  it("lê e normaliza AUTH_ALLOWED_DOMAINS", () => {
    process.env.AUTH_ALLOWED_DOMAINS = " Exemplo.com , Outro.COM ";
    expect(getAllowedDomains()).toEqual(["exemplo.com", "outro.com"]);
  });

  it("aceita e-mail corporativo verificado", () => {
    expect(isEmailAllowed("ana@suno.com.br", true)).toBe(true);
    expect(isEmailAllowed("bruno@sunoresearch.com.br", true)).toBe(true);
  });

  it("aceita comparando domínio sem diferenciar maiúsculas", () => {
    expect(isEmailAllowed("Ana@Suno.com.br", true)).toBe(true);
  });

  it("rejeita domínio fora da allowlist", () => {
    expect(isEmailAllowed("alguem@gmail.com", true)).toBe(false);
  });

  it("rejeita e-mail não verificado", () => {
    expect(isEmailAllowed("ana@suno.com.br", false)).toBe(false);
    expect(isEmailAllowed("ana@suno.com.br", undefined)).toBe(false);
  });

  it("rejeita e-mail ausente ou malformado", () => {
    expect(isEmailAllowed(null, true)).toBe(false);
    expect(isEmailAllowed("sem-arroba", true)).toBe(false);
  });

  it("respeita uma allowlist explícita passada por argumento", () => {
    expect(isEmailAllowed("x@empresa.com", true, ["empresa.com"])).toBe(true);
    expect(isEmailAllowed("x@suno.com.br", true, ["empresa.com"])).toBe(false);
  });
});
