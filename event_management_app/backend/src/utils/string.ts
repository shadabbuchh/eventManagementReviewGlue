// ────────────────────────────────────────────────────────────
// src/utils/string.ts
// Reusable string helpers: slugify, capitalize, camelCase → snake_case, etc.
// Pure functions, no side‑effects.
// ────────────────────────────────────────────────────────────

// Turn "  Hello World!  " → "hello-world"
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // collapse non-alphanum to -
    .replace(/^-+|-+$/g, ''); // trim leading/trailing -
}

// Capitalise first letter: "foo bar" → "Foo bar"
export function capitalize(input: string): string {
  return input.length ? input[0].toUpperCase() + input.slice(1) : input;
}

// camelCase → snake_case
export function camelToSnake(input: string): string {
  return input.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

// Convenience: random string of given length (default 16)
export function randomString(len = 16): string {
  return [...crypto.getRandomValues(new Uint8Array(len))]
    .map(n => n.toString(16).padStart(2, '0'))
    .join('');
}
