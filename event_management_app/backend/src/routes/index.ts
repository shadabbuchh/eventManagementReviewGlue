import healthRoutes from './health.route';

/**
 * Route exports
 *
 * 🚨 CRITICAL: Only infrastructure routes are exported here.
 *
 * Health route is kept as a traditional route since it's infrastructure/monitoring,
 * not part of the business API that should be in the OpenAPI specification.
 *
 * ⚡ IMPORTANT: Business API routes (events, users, etc.) are NOT defined here!
 * Instead, they are AUTOMATICALLY GENERATED from the OpenAPI specification:
 * 
 * 1. Define your API in: openapi/openapi_spec.yaml
 * 2. The fastify-openapi-glue plugin reads this spec at runtime
 * 3. It automatically creates all routes based on the spec
 * 4. Route handlers are mapped via operationId to methods in:
 *    backend/src/handlers/open-api-service-handlers.ts
 *
 * This means:
 * - No manual route files for business endpoints
 * - Single source of truth (OpenAPI spec)
 * - Type-safe API with auto-generated TypeScript types
 * - Automatic request/response validation
 *
 * ❌ NEVER add business route exports here (dashboard, user, product, events, etc.)
 * ✅ ONLY add infrastructure routes (health, monitoring, metrics, etc.)
 */
export { healthRoutes };
