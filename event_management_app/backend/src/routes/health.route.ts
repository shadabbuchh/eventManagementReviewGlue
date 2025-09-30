import type { FastifyInstance } from 'fastify';

export default async function healthRoute(app: FastifyInstance) {
  app.get('/health', async (_req, reply) => {
    const result: {
      app: 'ok';
      db: 'ok' | 'error';
      migrations: 'ok' | 'error' | 'unknown';
      at: number;
      reason?: string;
    } = {
      app: 'ok',
      db: 'error',
      migrations: 'unknown',
      at: Date.now(),
    };

    try {
      // 🔹  Ultra‑light DB probe (Postgres)
      await app.db.execute('SELECT 1');
      result.db = 'ok';
    } catch (err) {
      result.db = 'error';
      reply.code(503); // tell Docker the container is unhealthy
      result.reason = (err as Error).message;
    }

    return result;
  });
}
