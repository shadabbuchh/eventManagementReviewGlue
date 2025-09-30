/// <reference types="node" />
/**
 * Script: generate-handler-stubs.ts
 * Purpose: Keep the backend handler class in lockstep with the OpenAPI spec by
 * generating missing method stubs for every operationId. This ensures that the
 * Fastify OpenAPI glue can always find a corresponding method on
 * `OpenAPIServiceHandlers` for each documented endpoint.
 *
 * Benefits:
 * - Avoids drift between `openapi/openapi_spec.yaml` and server handlers
 * - Creates compile-safe placeholders (with FastifyRequest typing) so new routes
 *   exist immediately, even before their implementation
 * - Provides a consistent scaffold that nudges implementations toward
 *   `this.services`-based delegation
 *
 * If skipped:
 * - fastify-openapi-glue may route to missing methods, causing runtime 500s
 * - Endpoints can appear in the spec without any server-side handler
 * - Manual stub creation is error-prone and can lead to operationId/name
 *   mismatches that are hard to debug
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

function readSpec(specPath: string): any | null {
  if (!fs.existsSync(specPath)) return null;
  const content = fs.readFileSync(specPath, "utf8");
  if (!content.trim()) return null;
  try {
    if (specPath.toLowerCase().endsWith(".json")) {
      return JSON.parse(content);
    }
  } catch {}
  try {
    return yaml.load(content);
  } catch {
    return null;
  }
}

function collectOperationIds(spec: any): string[] {
  const ids: string[] = [];
  const paths = spec?.paths ?? {};
  for (const [, pathItem] of Object.entries(paths as Record<string, any>)) {
    for (const [method, operation] of Object.entries(pathItem ?? {})) {
      if (
        ["get", "post", "put", "delete", "patch", "options", "head"].includes(
          method
        )
      ) {
        const opId = (operation as any)?.operationId;
        if (typeof opId === "string" && opId.trim().length > 0) ids.push(opId);
      }
    }
  }
  return ids;
}

function ensureFastifyRequestImport(source: string): string {
  const hasRequest =
    /import\s+type\s*\{[^}]*FastifyRequest[^}]*\}\s*from\s*'fastify'/.test(
      source
    );
  const hasReply =
    /import\s+type\s*\{[^}]*FastifyReply[^}]*\}\s*from\s*'fastify'/.test(
      source
    );
  if (hasRequest && hasReply) return source;

  // If there's an existing fastify type import, extend it; otherwise insert a new line
  const importRegex = /(import\s+type\s*\{)([^}]*)\}\s*from\s*'fastify'\s*;?/;
  if (importRegex.test(source)) {
    return source.replace(importRegex, (_m, start, names) => {
      const set = new Set(
        names
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      );
      set.add("FastifyRequest");
      set.add("FastifyReply");
      return `${start} ${Array.from(set).join(", ")} } from 'fastify';`;
    });
  }

  // Insert after first import block
  const lines = source.split(/\r?\n/);
  let insertIdx = 0;
  while (insertIdx < lines.length && lines[insertIdx].startsWith("import")) {
    insertIdx++;
  }
  lines.splice(
    insertIdx,
    0,
    "import type { FastifyRequest, FastifyReply } from 'fastify';"
  );
  return lines.join("\n");
}

function extractExistingHandlerNames(source: string): Set<string> {
  // Best-effort: search within the OpenAPIServiceHandlers class body
  const names = new Set<string>();
  const classStart = source.indexOf("export class OpenAPIServiceHandlers");
  if (classStart === -1) return names;
  const classBody = source.slice(classStart);
  const methodRegex = /\n\s*(?:async\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = methodRegex.exec(classBody))) {
    const name = m[1];
    if (name !== "constructor") names.add(name);
  }
  return names;
}

function insertStubsIntoHandlers(source: string, missing: string[]): string {
  if (missing.length === 0) return source;

  // Ensure FastifyRequest import once
  let updated = ensureFastifyRequestImport(source);

  // Build stub text
  const stubs = missing
    .map(opId => {
      return (
        `\n  async ${opId}(request: FastifyRequest, reply: FastifyReply) {\n` +
        `    // TODO: Implement handler for operationId \"${opId}\"\n` +
        `    // Hint: delegate to an appropriate service on this.services\n` +
        `    // Example: return this.services.someService.someMethod(/* from request */);\n` +
        `    return (reply as any).notImplemented?.('NotImplemented: ${opId}') ?? reply.code(501).send({ error: 'NotImplemented: ${opId}' });\n` +
        `  }\n`
      );
    })
    .join("");

  // Insert before the final closing brace of the class
  const classStart = updated.indexOf("export class OpenAPIServiceHandlers");
  if (classStart === -1) return updated;

  const classEndIdx = updated.lastIndexOf("}");
  if (classEndIdx === -1) return updated;

  const before = updated.slice(0, classEndIdx);
  const after = updated.slice(classEndIdx);
  return before + stubs + after;
}

function ensureHandlerFileExists(handlerPath: string) {
  if (fs.existsSync(handlerPath)) return;
  const dir = path.dirname(handlerPath);
  fs.mkdirSync(dir, { recursive: true });
  const boilerplate =
    "import type { Services } from '../services/index';\n\n" +
    "/**\n" +
    " * OpenAPI operation handlers for fastify-openapi-glue\n" +
    " */\n" +
    "export class OpenAPIServiceHandlers {\n" +
    "  protected services: Services;\n\n" +
    "  constructor(services: Services) {\n" +
    "    this.services = services;\n" +
    "  }\n" +
    "}\n";
  fs.writeFileSync(handlerPath, boilerplate, "utf8");
}

function main() {
  try {
    const projectRoot = process.cwd();
    const specPath = path.resolve(projectRoot, "openapi", "openapi_spec.yaml");
    const handlerPath = path.resolve(
      projectRoot,
      "backend/src/handlers/open-api-service-handlers.ts"
    );

    const spec = readSpec(specPath);
    if (!spec) {
      console.log(
        "[generate-handler-stubs] OpenAPI spec missing or empty, skipping"
      );
      process.exit(0);
    }

    const opIds = collectOperationIds(spec);
    if (opIds.length === 0) {
      console.log("[generate-handler-stubs] No operationIds found, skipping");
      process.exit(0);
    }

    ensureHandlerFileExists(handlerPath);
    const source = fs.readFileSync(handlerPath, "utf8");
    const existing = extractExistingHandlerNames(source);
    const missing = opIds.filter(id => !existing.has(id));

    if (missing.length === 0) {
      console.log(
        "[generate-handler-stubs] All operationIds already implemented"
      );
      process.exit(0);
    }

    const updated = insertStubsIntoHandlers(source, missing);
    fs.writeFileSync(handlerPath, updated, "utf8");
    console.log(
      `[generate-handler-stubs] Added ${missing.length} handler stub(s): ${missing.join(", ")}`
    );
  } catch (error) {
    console.error("[generate-handler-stubs] Failed:", error);
    process.exit(1);
  }
}

main();
