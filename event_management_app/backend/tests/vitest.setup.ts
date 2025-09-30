import { config } from 'dotenv';
import { afterEach, vi } from 'vitest';

/* Load test‑specific env vars (if you have .env.test) */
config({ path: '.env.test', override: true });

/* Auto‑clear mocks between every test to avoid cross‑suite bleed */
afterEach(() => vi.clearAllMocks());
