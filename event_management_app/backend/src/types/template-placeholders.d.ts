/**
 * Template Placeholder Type Definitions
 *
 * This file provides type definitions for template tokens during code generation.
 * It prevents TypeScript errors when template files contain placeholder tokens
 * like __entity__, __Entity__, __entityPlural__, etc.
 *
 * IMPORTANT: This file should be excluded from the build output and only used
 * during the template phase. Once real entities are generated, they should have
 * proper types and not rely on these placeholders.
 */

// Declare template tokens as 'unknown' to allow compilation during template phase
declare const __entity__: unknown;
declare const __Entity__: unknown;
declare const __entityPlural__: unknown;
declare const __ENTITY__: unknown;

// Repository template types
declare const __entity__Repo: unknown;

// Service template types
declare const make__Entity__Service: unknown;
declare type __Entity__Service = unknown;

// Schema template types
declare module '@/db/schema' {
  export const __entityPlural__: unknown;
  export type __Entity__ = unknown;
  export type New__Entity__ = unknown;
}

// Plugin template types
declare const __plugin__: unknown;
declare const make__Plugin__: unknown;
