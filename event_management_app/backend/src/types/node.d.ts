// Node.js type declarations for ES module imports
// This provides TypeScript support for Node.js built-in modules

declare module 'node:fs' {
  export function readFileSync(path: string, encoding: string): string;
  export function readdirSync(path: string): string[];
}

declare module 'node:path' {
  export function join(...paths: string[]): string;
}

// Process types are provided by @types/node
