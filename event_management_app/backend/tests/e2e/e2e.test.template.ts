import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { startServer } from '../helpers/start-server'; // helper shown below
import { resetDb } from '../helpers/db-reset';
import type { New__Entity__ } from '@/db/schema';

let server: Awaited<ReturnType<typeof startServer>>;

beforeAll(async () => {
  server = await startServer(); // boots Fastify on a random port
  await resetDb(server.app); // clean DB before the suite
});

afterAll(async () => {
  await server.close(); // shuts down HTTP + Fastify
});

describe('__entity__ E2E', () => {
  it('POST + GET flow works end‑to‑end', async () => {
    const payload: New__Entity__ = {
      /* TODO: fill minimal valid fields for <entity> */
      name: 'Sample',
    };

    /* 1. create via real HTTP */
    const createRes = await fetch(`${server.url}/api/v1/__entityPlural__`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as { id: string };

    /* 2. fetch the just‑created entity */
    const fetchRes = await fetch(
      `${server.url}/api/v1/__entityPlural__/${created.id}`
    );
    expect(fetchRes.status).toBe(200);
    expect(await fetchRes.json()).toEqual(created);
  });
});
