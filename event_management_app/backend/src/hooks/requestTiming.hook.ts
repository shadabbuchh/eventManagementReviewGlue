import fp from 'fastify-plugin';
import { randomString, log } from '../utils/index'; // shared helpers

// Logs start/finish of every request with a short reqId and duration.
export default fp(async app => {
  app.addHook('onRequest', async req => {
    const reqId = randomString(8); // e.g. "a9f4c3d1"
    const start = process.hrtime.bigint(); // high‑precision timer

    // If you use @fastify/request-context you can store the id:
    // req.requestContext.set('reqId', reqId)

    log.debug({ reqId, method: req.method, url: req.url }, '⇢ request');

    req.raw.on('close', () => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      log.info(
        { reqId, status: req.raw.statusCode, ms: ms.toFixed(1) },
        '⇠ response'
      );
    });
  });
});
