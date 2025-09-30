import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
// Accept unknown and validate via Zod to avoid coupling to specific OpenAPI paths

// Example adapter: normalize SQL-like API response for UI consumption
const SqlResultSchema = z.object({
  rows: z.array(z.record(z.string(), z.unknown())).default([]),
  executionTime: z
    .union([z.string(), z.number()])
    .transform(v => Number(v ?? 0)),
  rowCount: z.number().default(0),
});

export type UiSqlResult = z.infer<typeof SqlResultSchema> & { id: string };

function generateId(): string {
  return uuidv4();
}

export function toUiSqlResult(api: unknown): UiSqlResult {
  const parsed = SqlResultSchema.parse(api);
  return { id: generateId(), ...parsed };
}

// Add additional adapters below as endpoints are introduced.
// Pattern: define a Zod schema that coerces/guards the API shape and
// return a UI model with non-optional properties suitable for rendering.
