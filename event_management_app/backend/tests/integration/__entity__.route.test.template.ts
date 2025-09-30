import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { getApp } from '../helpers/build-app';
import { resetDb } from '../helpers/db-reset';
import type { FastifyInstance } from 'fastify';
import type { New__Entity__ } from '@/db/schema';

let app: FastifyInstance;

beforeAll(async () => {
  app = await getApp();
  await resetDb(app); // clean slate for every suite
});

afterAll(async () => {
  await app.close();
});

describe('__entity__ routes (integration)', () => {
  it('GET /api/v1/__entityPlural__ returns [] when table empty', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/__entityPlural__',
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });

  it('POST /api/v1/__entityPlural__ creates a record and returns 201', async () => {
    const payload: New__Entity__ = {
      name: 'Sample',
    };

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/__entityPlural__',
      payload,
    });

    expect(res.statusCode).toBe(201);
    expect(res.json()).toMatchObject(payload);
  });

  it('GET /api/v1/__entityPlural__/:id returns the created entity', async () => {
    // 1. create
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/v1/__entityPlural__',
      payload: { name: 'Test Entity' },
    });
    const created = await createRes.json();

    // 2. fetch
    const fetchRes = await app.inject({
      method: 'GET',
      url: `/api/v1/__entityPlural__/${created.id}`,
    });

    expect(fetchRes.statusCode).toBe(200);
    expect(fetchRes.json()).toEqual(created);
  });
});
